"""Generate the quoted-source voice clips for the three cold opens.

The website serves the finished MP3s from docs/assets/voices/; nothing is
generated in the browser. To change a voice, edit "voice" for that line in
scripts/voices.json and run this script again.

    pip install kokoro-onnx soundfile numpy
    python scripts/build-voices.py --model-dir /path/to/model-files

The model directory must hold kokoro-v1.0.onnx and voices-v1.0.bin (links
are in scripts/voices.json). ffmpeg must be on the PATH.
"""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess
import tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parents[1]
SPEC = json.loads((ROOT / "scripts/voices.json").read_text())
OUT = ROOT / "docs/assets/voices"


def trim(samples, rate, floor_db=-45.0, pad=0.06):
    """Drop leading and trailing silence, keeping a short pad on each side."""
    level = np.abs(samples)
    loud = np.where(level > 10 ** (floor_db / 20))[0]
    if loud.size == 0:
        raise RuntimeError("Silent clip")
    start = max(0, loud[0] - int(pad * rate))
    end = min(samples.size, loud[-1] + int(pad * rate))
    return samples[start:end]


def pauses(samples, rate, floor_db=-42.0, least=0.2):
    """Silences inside a clip as (start, length) in seconds, from 10 ms frames."""
    frame = int(rate * 0.01)
    count = samples.size // frame
    quiet = np.array([np.sqrt(np.mean(samples[i * frame:(i + 1) * frame] ** 2)) for i in range(count)]) < 10 ** (floor_db / 20)
    found, i = [], 0
    while i < count:
        if quiet[i]:
            j = i
            while j < count and quiet[j]:
                j += 1
            if i > 0 and j < count and (j - i) * 0.01 >= least:
                found.append((i * frame, (j - i) * frame))
            i = j
        else:
            i += 1
    return found


def tighten(samples, rate, longest):
    """Shorten any silence longer than `longest` seconds; the model sometimes over-holds a sentence break."""
    keep, cursor, limit = [], 0, int(longest * rate)
    for start, length in pauses(samples, rate):
        if length > limit:
            cut = length - limit
            keep.append(samples[cursor:start + limit // 2])
            cursor = start + limit // 2 + cut
    keep.append(samples[cursor:])
    return np.concatenate(keep)


def speech_rms(samples, rate, floor_db=-42.0):
    """RMS over the frames that carry speech, so clips with more pauses are not levelled louder."""
    frame = int(rate * 0.01)
    count = samples.size // frame
    power = np.array([np.mean(samples[i * frame:(i + 1) * frame] ** 2) for i in range(count)])
    active = power[power > (10 ** (floor_db / 20)) ** 2]
    return float(np.sqrt(np.mean(active if active.size else power)))


def level(samples, rate, target_rms_db, peak_db):
    """Bring speech to the target RMS, then round off only the peaks above the ceiling."""
    samples = samples * (10 ** (target_rms_db / 20) / max(speech_rms(samples, rate), 1e-9))
    ceiling = 10 ** (peak_db / 20)
    knee = 0.6 * ceiling
    size = np.abs(samples)
    over = size > knee
    # Below the knee nothing changes, so every clip keeps the same loudness.
    samples[over] = np.sign(samples[over]) * (knee + (ceiling - knee) * np.tanh((size[over] - knee) / (ceiling - knee)))
    fade = int(0.012 * rate)
    ramp = np.linspace(0.0, 1.0, fade, dtype=np.float32)
    samples[:fade] *= ramp
    samples[-fade:] *= ramp[::-1]
    return samples.astype(np.float32)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-dir")
    parser.add_argument("--only", nargs="*", help="line ids to rebuild")
    parser.add_argument("--tracks-only", action="store_true", help="rewrite docs/voice-tracks.js from the manifest without generating audio")
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    manifest_path = OUT / "voices-manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    kokoro = None
    if not args.tracks_only:
        if not args.model_dir:
            parser.error("--model-dir is required unless --tracks-only is given")
        model_dir = Path(args.model_dir)
        kokoro = Kokoro(str(model_dir / "kokoro-v1.0.onnx"), str(model_dir / "voices-v1.0.bin"))

    for line in SPEC["lines"]:
        if kokoro is None or (args.only and line["id"] not in args.only):
            continue
        samples, rate = kokoro.create(line["say"], voice=line["voice"], speed=line["speed"], lang="en-us")
        samples = tighten(trim(np.asarray(samples, dtype=np.float32), rate), rate, SPEC.get("max_pause_seconds", 0.5))
        held = [[round(a / rate, 2), round(b / rate, 2)] for a, b in pauses(samples, rate)]
        samples = level(samples, rate, SPEC["target_rms_dbfs"], SPEC["peak_dbfs"])
        target = OUT / (line["id"] + ".mp3")
        with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
            sf.write(wav.name, samples, rate, subtype="PCM_16")
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav.name, "-ac", "1", "-ar", "44100",
                            "-codec:a", "libmp3lame", "-b:a", "96k", str(target)], check=True)
        manifest[line["id"]] = {
            "speaker": line["speaker"], "source": line["source"], "voice": line["voice"], "speed": line["speed"],
            "text": line["text"], "seconds": round(samples.size / rate, 2),
            "speech_rms_dbfs": round(20 * float(np.log10(speech_rms(samples, rate))), 1),
            "peak_dbfs": round(20 * float(np.log10(np.max(np.abs(samples)))), 1),
            "pauses": held,
            "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        }
        print(line["id"], line["voice"], manifest[line["id"]]["seconds"], "s", "pauses [start, length]:", held)

    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    # The version changes whenever any clip changes, so browsers fetch new audio instead of a cached copy.
    version = hashlib.sha256("".join(manifest[k]["sha256"] for k in sorted(manifest)).encode()).hexdigest()[:8]
    tracks = {k: {"seconds": v["seconds"], "speaker": v["speaker"], "text": v["text"]} for k, v in manifest.items()}
    (ROOT / "docs/voice-tracks.js").write_text(
        "/* Generated by scripts/build-voices.py. */\n"
        "window.CrisisVoices = " + json.dumps(tracks, indent=2) + ";\n"
        "window.CrisisVoicesVersion = " + json.dumps(version) + ";\n")
    print("voice-tracks.js version", version)

if __name__ == "__main__":
    main()
