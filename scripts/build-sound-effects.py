#!/usr/bin/env python3
"""Build compact, licensed scene effects without changing the approved narration."""
import hashlib
import json
import math
from pathlib import Path
import subprocess
import urllib.request
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SPEC_PATH = ROOT / "scripts/sound-effects.json"
SPEC = json.loads(SPEC_PATH.read_text())
OUT = ROOT / "docs/assets/effects"
SR = 32000
PROTECTED = [
    ROOT / "docs/narration-tracks.js",
    ROOT / "scripts/narration.json",
    *[ROOT / f"docs/assets/audio/update{n}.mp3" for n in (1, 2, 3)],
]
before = {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in PROTECTED}
tracks_text = (ROOT / "docs/narration-tracks.js").read_text()
narration = json.loads(tracks_text.split("window.CrisisNarrationTracks = ", 1)[1].rstrip().removesuffix(";"))
OUT.mkdir(parents=True, exist_ok=True)
clips = {}
checks = {"sampleRate": SR, "narrationPreserved": before, "clips": {}, "stages": {}}
decoded_clips = {}

def run(args, data=None):
    return subprocess.run(args, input=data, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True).stdout

def decode(data, cleanup=False):
    filters = ["-af", "aresample=32000,highpass=f=65,lowpass=f=11500"] if cleanup else []
    raw = run(["ffmpeg", "-v", "error", "-i", "pipe:0", *filters,
               "-ar", str(SR), "-ac", "1", "-f", "f32le", "pipe:1"], data)
    return np.frombuffer(raw, dtype="<f4").copy()

def db(x):
    return round(20 * math.log10(max(float(x), 1e-10)), 2)

def excerpt(samples, cfg):
    mode = cfg["selection"]
    duration = min(float(cfg["seconds"]), len(samples) / SR)
    count = max(1, round(duration * SR))
    if mode == "full":
        start = 0
    else:
        frame = max(1, round(SR * .01))
        padded = np.pad(samples, (0, (-len(samples)) % frame))
        energy = np.sqrt(np.mean(padded.reshape(-1, frame) ** 2, axis=1))
        if mode == "transient":
            anchor = int(np.argmax(energy)) * frame
            start = max(0, anchor - round(float(cfg.get("preRoll", .07)) * SR))
        elif mode == "first-active":
            active = np.flatnonzero(energy > max(.0001, float(energy.max()) * .16))
            if not len(active):
                raise RuntimeError("No audible source segment")
            start = max(0, int(active[0]) * frame - round(float(cfg.get("preRoll", .04)) * SR))
        else:
            raise RuntimeError("Unknown selection mode: " + mode)
    end = min(len(samples), start + count)
    return samples[start:end].copy(), start / SR, end / SR

for cfg in SPEC["sources"]:
    ident = cfg["id"]
    request = urllib.request.Request(cfg["download"], headers={"User-Agent": "TallgrassClassroomAudio/1.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read(12_000_001)
        if len(data) > 12_000_000 or not response.headers.get("Content-Type", "").startswith("audio/"):
            raise RuntimeError("Unexpected audio response for " + ident)
    source_hash = hashlib.sha256(data).hexdigest()
    if source_hash != cfg["sha256"]:
        raise RuntimeError("Source checksum changed: " + ident)
    samples, start, end = excerpt(decode(data, cleanup=True), cfg)
    # A small single reflection gives the dry crack a hallway tail; no collapse layer.
    if ident == "crack":
        delay = round(.065 * SR)
        reflected = np.zeros(len(samples) + delay, dtype=np.float32)
        reflected[:len(samples)] += samples
        reflected[delay:] += samples * .18
        samples = reflected
    samples -= float(samples.mean())
    peak = float(np.max(np.abs(samples)))
    rms = float(np.sqrt(np.mean(samples ** 2)))
    if peak < .0001 or rms < .00001:
        raise RuntimeError("Empty or inaudible source: " + ident)
    scale = min(float(cfg.get("peak", .72)) / peak, float(cfg.get("rms", .18)) / rms)
    samples *= scale
    fade_in = min(len(samples) // 3, round(float(cfg.get("fadeIn", .006)) * SR))
    fade_out = min(len(samples) // 3, round(float(cfg.get("fadeOut", .035)) * SR))
    if fade_in:
        samples[:fade_in] *= np.linspace(0, 1, fade_in)
    if fade_out:
        samples[-fade_out:] *= np.linspace(1, 0, fade_out)
    destination = OUT / (ident + ".mp3")
    run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1",
         "-i", "pipe:0", "-map_metadata", "-1", "-codec:a", "libmp3lame", "-b:a", "96k",
         "-metadata", "title=" + cfg["title"], "-metadata", "artist=" + cfg["creator"],
         "-metadata", "comment=CC0 1.0; source and edits in credits.json", str(destination)],
        samples.astype("<f4").tobytes())
    encoded = destination.read_bytes()
    check_samples = decode(encoded)
    actual_peak = float(np.max(np.abs(check_samples)))
    if actual_peak >= .95:
        raise RuntimeError("Encoded effect peak too high: " + ident)
    digest = hashlib.sha256(encoded).hexdigest()
    duration = len(check_samples) / SR
    clips[ident] = {"src": f"assets/effects/{ident}.mp3?v={digest[:12]}", "duration": round(duration, 5)}
    decoded_clips[ident] = check_samples
    checks["clips"][ident] = {
        "title": cfg["title"], "creator": cfg["creator"], "sourcePage": cfg["page"],
        "download": cfg["download"], "license": "CC0 1.0", "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "sourceSha256": source_hash, "sourceSeconds": [round(start, 5), round(end, 5)],
        "selection": cfg["selection"], "processing": "Mono 32 kHz; high/low-pass cleanup, level balance, short edge fades; MP3 96 kbps" +
          ("; one quiet 65 ms reflection" if ident == "crack" else ""),
        "duration": round(duration, 5), "sha256": digest, "bytes": len(encoded),
        "peakDbFS": db(actual_peak), "rmsDbFS": db(np.sqrt(np.mean(check_samples ** 2))),
    }
    print(f"{ident}: {duration:.3f}s, {len(encoded)} bytes, peak {db(actual_peak)} dBFS, source {start:.3f}–{end:.3f}s", flush=True)

# Validate every cue against the approved narrated timeline, including short prelaps.
for stage, events in SPEC["tracks"].items():
    scene_data = narration[stage]["scenes"]
    starts = np.cumsum([0] + [s["seconds"] for s in scene_data[:-1]])
    length = sum(s["seconds"] for s in scene_data)
    effects = np.zeros(round(length * SR), dtype=np.float32)
    for e in events:
        if e["clip"] not in clips or not 0 <= e["scene"] < len(scene_data):
            raise RuntimeError("Invalid scene effect reference")
        start = float(starts[e["scene"]]) + e["at"]
        rate = e.get("rate", 1)
        source = decoded_clips[e["clip"]]
        natural = len(source) / SR / rate
        duration = min(e.get("duration", natural), natural) if not e.get("bed") else e.get("duration", natural)
        if start < 0 or start + duration > length + .04 or not 0 <= e["gain"] <= 1:
            raise RuntimeError("Effect is outside the narrated timeline")
        count = max(1, round(duration * SR))
        x = np.arange(count) * rate
        if e.get("bed"):
            x %= len(source)
        segment = np.interp(x, np.arange(len(source)), source, right=0).astype(np.float32)
        fade_in = min(duration / 2, e.get("fadeIn", .012))
        fade_out = min(duration / 2, e.get("fadeOut", .08))
        local_t = np.arange(count) / SR
        envelope = np.minimum(np.minimum(local_t / max(.001, fade_in), 1),
                              np.maximum(0, (duration - local_t) / max(.001, fade_out)))
        segment *= envelope * e["gain"]
        # Match the runtime: reduce effects under speech, with short smooth ramps.
        times = start + local_t
        duck = np.ones(count, dtype=np.float32)
        for scene_start, s in zip(starts, scene_data):
            speech_start = float(scene_start) + s.get("speechStart", 1.7)
            speech_end = speech_start + s["speechSeconds"]
            fall = np.clip((times - (speech_start - .18)) / .18, 0, 1)
            rise = np.clip((times - speech_end) / .28, 0, 1)
            factor = 1 - .72 * fall * (1 - rise)
            duck = np.minimum(duck, factor)
        segment *= duck
        index = round(start * SR)
        effects[index:index + count] += segment[:len(effects[index:index + count])]
    voice = decode((ROOT / "docs/assets/audio" / (stage + ".mp3")).read_bytes())
    voice = np.pad(voice[:len(effects)], (0, max(0, len(effects)-len(voice))))
    mix_peak = float(np.max(np.abs(voice * .95 + effects)))
    effects_peak = float(np.max(np.abs(effects)))
    if effects_peak > .9 or mix_peak > .99:
        raise RuntimeError(f"Insufficient mix headroom in {stage}: effects={effects_peak}, mix={mix_peak}")
    checks["stages"][stage] = {
        "seconds": length, "events": len(events), "scenesCovered": len(set(e["scene"] for e in events)),
        "effectsPeakDbFS": db(effects_peak), "estimatedCombinedPeakDbFS": db(mix_peak),
    }
    print(f"{stage}: {len(events)} cues across {len(scene_data)} scenes; estimated mix peak {db(mix_peak)} dBFS", flush=True)

after = {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in PROTECTED}
if before != after:
    raise RuntimeError("Approved narration changed")
checks["specSha256"] = hashlib.sha256(SPEC_PATH.read_bytes()).hexdigest()
checks["totalBytes"] = sum(c["bytes"] for c in checks["clips"].values())
(OUT / "credits.json").write_text(json.dumps(checks, indent=2) + "\n")
(ROOT / "docs/effects-tracks.js").write_text(
    "'use strict';\n/* Recorded CC0 scene effects; see assets/effects/credits.json. */\nwindow.CrisisEffects = " +
    json.dumps({"clips": clips, "tracks": SPEC["tracks"]}, indent=2) + ";\n")
lines = [
    "# Scene sound effects", "",
    "Edited CC0 recordings and device sounds for all three Tallgrass overviews. No music.",
    "The approved narration MP3s and narration timing manifest are unchanged.", "",
    "Sources are downloaded once by the build, edited, and hosted here. Student playback does not contact Freesound.", "",
    "## Credits", "",
    "| File | Source | Creator | License |",
    "| --- | --- | --- | --- |",
]
for ident, c in checks["clips"].items():
    lines.append(f'| {ident}.mp3 | [{c["title"]}]({c["sourcePage"]}) | {c["creator"]} | [CC0 1.0]({c["licenseUrl"]}) |')
lines += ["", "## Editing and timing", "",
          "Source SHA-256 hashes, selected time ranges, output hashes, levels and byte sizes are in credits.json.",
          "The source manifest and cue schedule are in scripts/sound-effects.json; scripts/build-sound-effects.py builds the clips.",
          "The browser uses the existing narration clock. Cues may begin just before a scene changes and continue across the cut.",
          "Effects fade to 28% during narrated speech and recover smoothly after it. Narration off restores the intended effects level.",
          "Pause, buffering, seeking, reading the source documents and changing stages stop effects. Elapsed cues are not replayed on resume.",
          "", "## Content choices", "",
          "The crack is dramatized with a dry wood snap and one quiet reflection. The alarm is a brief evacuation cue.",
          "There are no collapse, injury, ambulance, or present-day protest sounds. Notifications identify a circulating claim, not proof of it.",
          "Quiet intervals preserve space for source attribution, uncertain findings and student instructions.",
          "", "## Verification", "",
          "The build checks every source hash, all 24 scene assignments, cue bounds, encoded peaks and an estimated voice/effects mix.",
          "It verifies the narration checksums before and after processing. These checks do not replace an audible review on classroom speakers.",
          ""]
(OUT / "README.md").write_text("\n".join(lines))
print(f"Verified {len(clips)} effects, {checks['totalBytes']} total bytes; approved narration unchanged.", flush=True)
