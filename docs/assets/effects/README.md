# Scene sound effects

Edited CC0 recordings and device sounds for all three Tallgrass overviews. No music.
The approved narration MP3s and narration timing manifest are unchanged.

Sources are downloaded once by the build, edited, and hosted here. Student playback does not contact Freesound.

## Credits

| File | Source | Creator | License |
| --- | --- | --- | --- |
| crack.mp3 | [wood break small 1.mp3](https://freesound.org/people/TheHiraHira/sounds/460247/) | TheHiraHira | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| alarm.mp3 | [Fire alarm](https://freesound.org/people/pushkin/sounds/319413/) | pushkin | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| steps.mp3 | [Footsteps on wooden flooring.wav](https://freesound.org/people/Rickmk2/sounds/164315/) | Rickmk2 | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| rain.mp3 | [rainfall](https://freesound.org/people/seth-m/sounds/323427/) | seth-m | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| phone.mp3 | [AT&T model #210 desk phone](https://freesound.org/people/knufds/sounds/345807/) | knufds | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| vibrate.mp3 | [phone vibrate.wav](https://freesound.org/people/lartti/sounds/529979/) | lartti | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| click.mp3 | [In the Zone](https://freesound.org/people/derrick.d/sounds/529317/) | derrick.d | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| page.mp3 | [Paper page turn 1](https://freesound.org/people/HenKonen/sounds/757221/) | HenKonen | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| pen.mp3 | [writing - pen 01.wav](https://freesound.org/people/Anthousai/sounds/337086/) | Anthousai | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| pickup.mp3 | [Phone Pick Up.wav](https://freesound.org/people/MootMcnoodles/sounds/444399/) | MootMcnoodles | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| ringback.mp3 | [Current US/Can. Ringback tone](https://freesound.org/people/tt_runscript/sounds/337655/) | tt_runscript | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| notify.mp3 | [friendly.mp3](https://freesound.org/people/stwime/sounds/545363/) | stwime | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

## Editing and timing

Source SHA-256 hashes, selected time ranges, output hashes, levels and byte sizes are in credits.json.
The source manifest and cue schedule are in scripts/sound-effects.json; scripts/build-sound-effects.py builds the clips.
The browser uses the existing narration clock. Cues may begin just before a scene changes and continue across the cut.
Effects fade to 28% during narrated speech and recover smoothly after it. Narration off restores the intended effects level.
Pause, buffering, seeking, reading the source documents and changing stages stop effects. Elapsed cues are not replayed on resume.

## Content choices

The crack is dramatized with a dry wood snap and one quiet reflection. The alarm is a brief evacuation cue.
There are no collapse, injury, ambulance, or present-day protest sounds. Notifications identify a circulating claim, not proof of it.
Quiet intervals preserve space for source attribution, uncertain findings and student instructions.

## Verification

The build checks every source hash, all 24 scene assignments, cue bounds, encoded peaks and an estimated voice/effects mix.
It verifies the narration checksums before and after processing. These checks do not replace an audible review on classroom speakers.
