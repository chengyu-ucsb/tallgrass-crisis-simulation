"""Generate the simulation's stock male narration once; the website serves static MP3s."""
from pathlib import Path
import hashlib
import importlib.metadata
import json
import math
import subprocess
import tempfile
import numpy as np
import soundfile as sf
import torch
from huggingface_hub import hf_hub_download
from kokoro import KModel, KPipeline

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "scripts/narration.json"
spec = json.loads(MANIFEST_PATH.read_text())
SR = spec["sample_rate"]
torch.set_num_threads(2)
torch.manual_seed(11)

def download(name, expected=None):
    path = hf_hub_download(repo_id=spec["model"]["repository"], filename=name,
                           revision=spec["model"]["revision"])
    if expected and hashlib.sha256(Path(path).read_bytes()).hexdigest() != expected:
        raise RuntimeError("Model checksum mismatch: " + name)
    return path

config = download("config.json")
weights = download("kokoro-v1_0.pth", spec["model"]["weights_sha256"])
voice_path = download("voices/" + spec["voice"] + ".pt", spec["model"]["voice_sha256"])
model = KModel(repo_id=spec["model"]["repository"], config=config, model=weights).to("cpu").eval()
pipeline = KPipeline(lang_code="a", model=model, device="cpu", repo_id=spec["model"]["repository"])
voice = torch.load(voice_path, map_location="cpu", weights_only=True)
output = ROOT / "docs/assets/audio"
output.mkdir(parents=True, exist_ok=True)
tracks = {}
checks = {}
lead = int(spec["lead_seconds"] * SR)

for stage_id, stage in spec["stages"].items():
    timeline, scene_metadata = [], []
    for index, scene in enumerate(stage["scenes"]):
        pieces = []
        spoken_chunks = []
        with torch.inference_mode():
            for result in pipeline(scene["text"], voice=voice, speed=spec["speed"], split_pattern=r"\n+"):
                graphemes, phonemes, wave = result
                if wave is None:
                    raise RuntimeError("Empty narration: " + stage_id + "/" + str(index + 1))
                samples = wave.detach().cpu().numpy().astype(np.float32)
                if samples.size:
                    if pieces:
                        pieces.append(np.zeros(int(0.15 * SR), dtype=np.float32))
                    pieces.append(samples)
                    spoken_chunks.append(graphemes)
        if not pieces:
            raise RuntimeError("Missing narration")
        speech = np.concatenate(pieces)
        if not np.isfinite(speech).all() or np.max(np.abs(speech)) < 0.001:
            raise RuntimeError("Invalid or silent narration")
        spoken_seconds = len(speech) / SR
        seconds = max(scene["minimum_seconds"], math.ceil(spoken_seconds + spec["lead_seconds"] + spec["tail_seconds"]))
        clip = np.zeros(int(seconds * SR), dtype=np.float32)
        clip[lead:lead + len(speech)] = speech
        timeline.append(clip)
        scene_metadata.append({"label": scene["label"], "seconds": seconds, "text": scene["text"],
                               "cue": scene["cue"], "speechStart": spec["lead_seconds"],
                               "speechSeconds": round(spoken_seconds, 3)})
        print(f"{stage_id} scene {index + 1}: {spoken_seconds:.2f}s speech / {seconds}s scene", flush=True)
    audio = np.concatenate(timeline)
    peak = float(np.max(np.abs(audio)))
    voiced = audio[np.abs(audio) > 0.008]
    rms = float(np.sqrt(np.mean(voiced ** 2))) if voiced.size else 0.001
    audio *= min(0.84 / peak, 0.12 / rms)
    with tempfile.TemporaryDirectory() as scratch:
        wav_path = Path(scratch) / "narration.wav"
        sf.write(wav_path, audio, SR, subtype="PCM_16")
        mp3_path = output / (stage_id + ".mp3")
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav_path),
                        "-codec:a", "libmp3lame", "-b:a", "96k", "-ar", str(SR), "-ac", "1",
                        "-metadata", "title=" + stage["label"] + " narration",
                        "-metadata", "artist=Kokoro stock male voice", str(mp3_path)], check=True)
    total = sum(s["seconds"] for s in scene_metadata)
    measured = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                              "-of", "default=nw=1:nk=1", str(mp3_path)], text=True))
    if abs(measured - total) > 0.25:
        raise RuntimeError("Encoded timing mismatch")
    digest = hashlib.sha256(mp3_path.read_bytes()).hexdigest()
    tracks[stage_id] = {"src": "assets/audio/" + stage_id + ".mp3?v=" + digest[:12],
                        "seconds": total, "voice": spec["voice"], "scenes": scene_metadata}
    checks[stage_id] = {"seconds": total, "encodedSeconds": measured, "sha256": digest,
                        "bytes": mp3_path.stat().st_size, "sceneCount": len(scene_metadata)}
    print(f"{stage_id}: {total}s / {mp3_path.stat().st_size} bytes", flush=True)

(ROOT / "docs/narration-tracks.js").write_text(
    "'use strict';\n/* Generated from scripts/narration.json; stock AI voice, not a voice clone. */\n"
    + "window.CrisisNarrationTracks = " + json.dumps(tracks, indent=2, ensure_ascii=False) + ";\n")
checks["manifestSha256"] = hashlib.sha256(MANIFEST_PATH.read_bytes()).hexdigest()
checks["model"] = spec["model"]
checks["voice"] = spec["voice"]
checks["packages"] = {name: importlib.metadata.version(name) for name in
                     ["kokoro", "misaki", "torch", "transformers", "spacy", "soundfile"]}
(output / "generation.json").write_text(json.dumps(checks, indent=2) + "\n")
(output / "README.md").write_text("""# Narration audio

These three static MP3 files narrate the fictional Tallgrass classroom case. The voice is a stock synthetic male voice, not a recording or clone of the instructor or any person named in the case.

- Voice: Kokoro `am_michael`, American English, speed 0.95.
- Model: [hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), Apache 2.0. The model card includes the upstream training-data credits.
- Inference: [hexgrad/kokoro](https://github.com/hexgrad/kokoro).
- Script: `scripts/narration.json`; generation: `scripts/build-narration.py`.
- Exact model revision, package versions, output hashes and durations: `generation.json`.

The website plays these files directly. It makes no speech API requests and does not need API keys. Scene durations include a short lead for effects and enough time for every narrated sentence. Sound effects are synthesized separately by the website; there is no music.

Regenerate after changing the narration script. The generation workflow commits only its five generated audio/metadata files and the track script. A later ordinary repository commit or manual Pages deployment publishes them with the player.
""")
print("All 24 scene recordings and three complete narration tracks verified.", flush=True)
