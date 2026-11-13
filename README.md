# Tallgrass Crisis Simulation

A classroom crisis communication simulation for COMM 5009. Teams respond to an unfolding incident at a fictional student housing company and prepare a briefing memo for its chief executive.

## In class

Each team chooses one person to open the website's updates and complete its checkpoints. The recorder writes the team's responses on one printed memo handout. The instructor projects the same website and sets the pace with verbal cues and the classroom timer. Other teammates may read on their own devices, but their progress is independent: the team's main screen does not unlock anyone else's page. At the end of class, each team hands its completed paper memo directly to the instructor.

1. Get ready: review the company background, choose roles, and get the printed memo handout ready.
2. Update 1, 8:05 a.m.: the building has been evacuated.
3. Update 2, 9:10 a.m.: maintenance records and new public claims arrive.
4. Update 3, 11:30 a.m.: an inspection finding and the chief executive's request arrive.
5. Team briefings: finish the paper memo and give a two-minute briefing.
6. Debrief: discuss the decisions, hand in the paper memo, and prepare for the individual evaluation.

Each of the three updates includes an eight-scene illustrated overview with a recorded stock male narrator, scene sound effects, play, pause, replay, scene selection, a transcript, and an expanded view for projection. Nothing plays until the user presses Play. Narration and effects start enabled and can be turned off separately. There is no music. The first update includes a dry crack, a brief evacuation alarm and footsteps, rain, and communication cues. Later updates use calls, messages, paper, and pen sounds. These are dramatized effects, not recordings of an actual incident.

Narration uses static MP3 files hosted with the website, so every device receives the same voice without a speech API or subscription. Scene timing allows the narration to finish, and the animation follows the recording's playback position. Pausing, seeking, opening the evidence, changing stages, or leaving the page stops both audio and motion. Each animation uses only information available in its round; all written evidence remains available below it. Watching does not mark documents as read or complete a checkpoint.

Each update includes individual document cards and a full reading view. Students mark the reading complete, confirm the required work on their memo handout, and complete the checkpoint to unlock the next stage. Search includes only evidence from the current and earlier updates. The countdown has start, pause, reset, and add-minute controls.

## Paper and submissions

- Print the one-page **Tallgrass Quick Reference** for the tables or individual students.
- Print one **Briefing Memo Print Version** per team. This is the handout students write on and hand in.
- Case updates, round instructions, and the debrief are on the website. The old phase worksheets are not required.
- Each team gives one completed seven-section paper memo directly to the instructor at the end of class. Students may take photos first for their individual evaluations.
- Each student separately submits the approximately two-page evaluation on Canvas by November 20, 2026, at 11:59 p.m.

The PDF reference and original Word templates are in `docs/downloads/` and linked from the website.

## Facilitation

This is a shared reading interface, not a live classroom control system. Each browser follows the instructor's verbal cue. The projected timer is the classroom reference. Timers run on the current device, reset on refresh, and do not advance the case automatically.

The next stage stays disabled until the current checkpoint is complete. Setup requires reading the company background and preparing the team. Each case update requires marking all of its documents as read and confirming the memo tasks. Briefings require the team to confirm that its paper memo is complete and it has presented. The final debrief checkpoint confirms that the paper memo has been handed to the instructor. Timers never unlock or advance a stage. Navigation, direct links, refresh, and search use the same prerequisites. Completed stages remain available to revisit.

Read flags and task checks are retained in the current browser tab for refresh recovery; they do not synchronize between browsers or devices. They are navigation state, not a saved student submission. One teammate can manage the website while the recorder writes on the memo handout. The instructor collects the written team response on paper.

These are completion checks reported by students, not automated grading or verification of the paper hand-in. This static site controls normal navigation; it does not keep future evidence confidential from someone inspecting the source or changing browser state. Preventing that would require server-side release rules and keeping unreleased content out of the public repository.

## Files

- `docs/index.html`: page structure and dialogs.
- `docs/content.js`: scenario facts, source artifacts, tasks, roles, and assessment instructions.
- `docs/app.js`: navigation, reading controls, completion checkpoints, search, and timers.
- `docs/progress.js`: shared prerequisite and progress-restoration rules.
- `docs/animation-scenes.js`: Scene text, visual facts, and timing, drawn from the case documents.
- `docs/animation.js` and `docs/animation.css`: Illustrations, captions, playback controls, and responsive layout. Motion follows the player position and respects reduced-motion preferences.
- `docs/animation-sound.js`: Recorded scene effects scheduled with Web Audio against the narration clock, including transitions across scene cuts and automatic volume reduction under speech.
- `docs/effects-tracks.js` and `docs/assets/effects/`: Twelve edited CC0 clips, all 57 scene cues, source credits, hashes and measured levels. `docs/audio-credits.html` provides credits and individual sound previews.
- `scripts/sound-effects.json`, `scripts/build-sound-effects.py` and `.github/workflows/build-sound-effects.yml`: Reproducible effect processing and cue validation; the build checks that the approved narration is unchanged.
- `docs/narration-tracks.js` and `docs/assets/audio/`: Recorded narration, complete spoken transcripts, scene durations, and generation details.
- `scripts/narration.json` and `scripts/build-narration.py`: Narration scripts and reproducible audio generation with the stock Kokoro `am_michael` voice.
- `.github/workflows/generate-narration.yml`: Generates and commits the recordings when their scripts change, using a standard public-repository runner. The generation does not use a paid speech API. Publish the generated files through the normal Pages workflow after generation completes.
- `scripts/test-progress.cjs`: focused checks for sequential access, partial completion, refresh, and invalid saved state.
- `docs/styles.css`: desktop, phone, and print layouts.
- `docs/downloads/`: printable reference and original assignment templates.
- `scripts/build-quick-reference.py`: regenerates the reference PDF from the scenario data.

### Scene sound design

The three overviews use recorded Foley and ambience: a dry crack, a brief building alarm, walking footsteps, rain, desk-phone ringing, vibration, keyboard/mouse clicks, paper, pen and receiver handling. Short device tones identify outgoing calls and messages. There is no music.

A few sounds begin just before the next scene, so rain introduces the shelter, a ring leads into incoming calls, and paper leads into the memo. All scenes retain their original narration and duration. Effects reduce to 28% around speech and recover afterward; disabling Narration restores the intended effect level. Pause, buffering, reading, seeking and changing stages stop sound immediately. Resuming uses the matching clip offset and never replays a completed cue.

The player preloads only the clips needed by the current update. Play briefly reads “Loading effects…” until they are ready; turning Effects off allows narration or visuals to play without waiting. Failed effect loading leaves narration available and provides an explicit retry through the Effects button.

Source files were verified as CC0 and are served from this repository. The build records source and output SHA-256 hashes, exact excerpt ranges, encoded peaks and an estimated combined mix peak. The approval of the existing narration is preserved by before/after hash checks. Those measurements verify technical bounds, not an audible review on classroom speakers.

The site has no external runtime dependencies, tracking, or application database.

## GitHub Pages

Publish the `main` branch's `/docs` directory in the repository's Pages settings. Keep all asset links relative so the site works at its full project URL. No custom domain or CNAME is needed.

For a local check, serve `docs/` through an HTTP server. `npm run check` checks JavaScript syntax and the progression tests. `npm run build` copies the same website into `dist/` for a separate preview host; `docs/` remains the source.

## Course sources

Case facts and quotations follow **COMM5009 CrisisInABox Student Packet.docx**, especially pages 1–2, 6, and 8. Current tasks and assessment follow **COMM5009 CrisisInABox Assignment Description.docx**, **COMM5009 CrisisInABox Facilitator Guide(1).docx**, **COMM5009 CrisisInABox Briefing Memo Template.docx**, and **COMM5009 CrisisInABox Post-Crisis Evaluation Template.docx**.

The newer assignment's single memo, fifteen-minute rounds, and two-minute briefings replace the older packet's worksheets and pacing. The inspector's minimum closure estimate retains the original packet's wording. The instructor's current directions to write on paper and hand the team memo directly to the instructor supersede the earlier team Canvas submission instructions. The individual evaluation still goes through Canvas. The downloadable Word templates are unchanged. The quick reference is a new companion sheet based on the course materials.

This is a fictional classroom scenario. Statements attributed to the University of Cincinnati and other organizations are part of the exercise, not reports of a real incident.
