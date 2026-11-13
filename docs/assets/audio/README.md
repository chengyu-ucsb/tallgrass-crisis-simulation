# Narration audio

These three static MP3 files narrate the fictional Tallgrass classroom case. The voice is a stock synthetic male voice, not a recording or clone of the instructor or any person named in the case.

- Voice: Kokoro `am_michael`, American English, speed 0.95.
- Model: [hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), Apache 2.0. The model card includes the upstream training-data credits.
- Inference: [hexgrad/kokoro](https://github.com/hexgrad/kokoro).
- Script: `scripts/narration.json`; generation: `scripts/build-narration.py`.
- Exact model revision, package versions, output hashes and durations: `generation.json`.

The website plays these files directly. It makes no speech API requests and does not need API keys. Scene durations include a short lead for effects and enough time for every narrated sentence. Sound effects now use separately hosted CC0 recordings and device sounds; there is no music. See [scene effects](../effects/README.md) for the current sources, edits and timing. This change leaves the narration files and their timing unchanged.

Regenerate after changing the narration script. The generation workflow commits only its five generated audio/metadata files and the track script. A later ordinary repository commit or manual Pages deployment publishes them with the player.
