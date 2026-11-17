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

Each of the three updates opens with a short overview of about a minute (1:03, 1:18 and 1:20). The overview shows the street outside The Halden, the team's phone, and the documents themselves. AI voices read only the words that a document quotes, each source in its own voice, and there is no narrator. Play, pause, a scrub bar, separate switches for voices and sound, full screen, and a text version are provided. Nothing plays until the user presses Play.

Voices and effects are static MP3 files hosted with the website, so every device hears the same thing without a speech service or subscription. The picture follows the playback clock, so pausing or scrubbing always lands on the same frame. Opening a document, changing stages, or leaving the page stops sound and motion. Each overview uses only information available in its round; all written evidence remains available below it. Watching does not mark documents as read or complete a checkpoint.

Each update includes individual document cards and a full reading view. A document that has been marked as read folds into a compact green row, so the ones still to read stand out; it still opens when clicked. Students mark the reading complete, confirm the required work on their memo handout, and complete the checkpoint to unlock the next stage. Search includes only evidence from the current and earlier updates. The countdown has start, pause, reset, and add-minute controls.

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
- `docs/films.js`: What each overview shows and says, with timings. Every statement comes from that update's documents in `content.js`.
- `docs/film.js` and `docs/film.css`: The player. It paints the street on a canvas, times the captions, notifications and documents, and schedules sound with Web Audio.
- `docs/voice-tracks.js` and `docs/assets/voices/`: Twelve voice clips with their lengths and a manifest of voices, levels and hashes.
- `scripts/voices.json` and `scripts/build-voices.py`: The quoted lines, the stock Kokoro voice chosen for each, and the script that generates and levels the clips. To change a voice, edit its `voice` value and run the script.
- `docs/assets/effects/`: The CC0 sound effects. `docs/audio-credits.html` lists credits and lets you preview every voice and effect.
- `docs/assets/fonts/`: Archivo, the one typeface the site uses, hosted with the site (SIL Open Font License).
- `scripts/test-progress.cjs`: focused checks for sequential access, partial completion, refresh, and invalid saved state.
- `docs/styles.css`: desktop, phone, and print layouts.
- `docs/downloads/`: printable reference and original assignment templates.
- `scripts/build-quick-reference.py`: regenerates the reference PDF from the scenario data.

### How the overviews are made

The street, the rain, the people and the light are drawn in code on a canvas. Captions, notifications, maintenance requests and statements are ordinary page text laid over it, so they stay sharp on a projector. There are no video files.

People appear only as silhouettes. The time of day follows the case: dark at 6:40 a.m., grey daylight from 8:05. The story keeps unofficial reports, unverified posts, preliminary findings, attributed accounts, offers and proposed statements visibly qualified. It never shows a collapse, a hotel booking, a published statement from the chief executive, or a protest already taking place. Counts appear as complete case values.

Reduced-motion mode holds the rain, the walking, the camera move and the flashing light still, and keeps every caption and document readable.

### Voices and sound

Twelve clips read words quoted in the documents: the reporter's two emails, the circulating post, the three maintenance requests and their closing note, a parent's post, the contractor's, engineer's and university's statements, and the chief executive's proposed line. The voices are stock voices from the open Kokoro model. None is a recording or clone of a real person. Each clip is levelled to the same loudness, and the rain drops under a voice while it reads.

The voices were checked by transcribing each clip with a speech-recognition model and comparing it with its script, and each film's mix was rendered offline to confirm that nothing clips. Those are technical checks. They do not replace listening once on the classroom speakers.

### Colour and type

Colour means one of three things: a status (green for done or confirmed, amber for waiting or not known, red for a deadline), Tallgrass's own material (forest green and lime), or the press (blue). Everything else is neutral. Reading pages are light, and the film and the header of each update are dark. The tokens are at the top of `docs/styles.css`.

### Retired files

The earlier narrated overviews are no longer loaded. Their build inputs are still in the repository because two GitHub workflows depend on them: `scripts/narration.json`, `scripts/build-narration.py`, `scripts/sound-effects.json`, `scripts/build-sound-effects.py`, `docs/narration-tracks.js`, `docs/effects-tracks.js`, `docs/assets/audio/` and the three `*-preview` images in `docs/assets/`. They can be deleted together with `.github/workflows/generate-narration.yml` and `.github/workflows/build-sound-effects.yml`.

The site has no external runtime dependencies, tracking, or application database.

## GitHub Pages

Publish the `main` branch's `/docs` directory in the repository's Pages settings. Keep all asset links relative so the site works at its full project URL. No custom domain or CNAME is needed.

For a local check, serve `docs/` through an HTTP server. `npm run check` checks JavaScript syntax and the progression tests. The overviews fetch their audio, so they need the HTTP server and will not play from a file opened directly. `npm run build` copies the same website into `dist/` for a separate preview host; `docs/` remains the source.

## Course sources

Case facts and quotations follow **COMM5009 CrisisInABox Student Packet.docx**, especially pages 1–2, 6, and 8. Current tasks and assessment follow **COMM5009 CrisisInABox Assignment Description.docx**, **COMM5009 CrisisInABox Facilitator Guide(1).docx**, **COMM5009 CrisisInABox Briefing Memo Template.docx**, and **COMM5009 CrisisInABox Post-Crisis Evaluation Template.docx**.

The newer assignment's single memo, fifteen-minute rounds, and two-minute briefings replace the older packet's worksheets and pacing. The inspector's minimum closure estimate retains the original packet's wording. The instructor's current directions to write on paper and hand the team memo directly to the instructor supersede the earlier team Canvas submission instructions. The individual evaluation still goes through Canvas. The downloadable Word templates are unchanged. The quick reference is a new companion sheet based on the course materials.

This is a fictional classroom scenario. Statements attributed to the University of Cincinnati and other organizations are part of the exercise, not reports of a real incident.
