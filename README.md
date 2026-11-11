# Tallgrass Crisis Simulation

A classroom crisis communication simulation for COMM 5009. Teams respond to an unfolding incident at a fictional student housing company and prepare a briefing memo for its chief executive.

## In class

Each team chooses one person to open the website's updates and complete its checkpoints while the recorder types in a shared document. The instructor projects the same website and sets the pace with verbal cues and the classroom timer. Other teammates may read on their own devices, but their progress is independent: the team's main screen does not unlock anyone else's page. Teams submit their completed memo through Canvas.

1. Get ready: review the company background, choose roles, and open the memo template.
2. Update 1, 8:05 a.m.: the building has been evacuated.
3. Update 2, 9:10 a.m.: maintenance records and new public claims arrive.
4. Update 3, 11:30 a.m.: an inspection finding and the chief executive's request arrive.
5. Team briefings: submit the memo and give a two-minute briefing.
6. Debrief: discuss the decisions and prepare the individual evaluation.

Each update includes individual document cards and a full reading view. Students mark the reading complete, confirm the required work in their shared memo, and complete the checkpoint to unlock the next stage. Search includes only evidence from the current and earlier updates. The countdown has start, pause, reset, and add-minute controls.

## Paper and submissions

- Print the one-page **Tallgrass Quick Reference** for the tables or individual students.
- Keep the **Briefing Memo Print Version** as a backup for teams that cannot type.
- Case updates, round instructions, and the debrief are on the website. The old phase worksheets are not required.
- One team submits the seven-section briefing memo on Canvas by the end of class.
- Each student separately submits the approximately two-page evaluation on Canvas by November 20, 2026, at 11:59 p.m.

The PDF reference and original Word templates are in `docs/downloads/` and linked from the website.

## Facilitation

This is a shared reading interface, not a live classroom control system. Each browser follows the instructor's verbal cue. The projected timer is the classroom reference. Timers run on the current device, reset on refresh, and do not advance the case automatically.

The next stage stays disabled until the current checkpoint is complete. Setup requires reading the company background and preparing the team. Each case update requires marking all of its documents as read and confirming the memo tasks. Briefings require the team to confirm its Canvas submission and presentation. Timers never unlock or advance a stage. Navigation, direct links, refresh, and search use the same prerequisites. Completed stages remain available to revisit.

Read flags and task checks are retained in the current browser tab for refresh recovery; they do not synchronize between browsers or devices. They are navigation state, not a saved student submission. One teammate can manage the website while the recorder updates the shared memo. Written work stays in the team's cloud document and Canvas.

These are completion checks reported by students, not automated grading or Canvas verification. This static site controls normal navigation; it does not keep future evidence confidential from someone inspecting the source or changing browser state. Preventing that would require server-side release rules and keeping unreleased content out of the public repository.

## Files

- `docs/index.html`: page structure and dialogs.
- `docs/content.js`: scenario facts, source artifacts, tasks, roles, and assessment instructions.
- `docs/app.js`: navigation, reading controls, completion checkpoints, search, and timers.
- `docs/progress.js`: shared prerequisite and progress-restoration rules.
- `scripts/test-progress.cjs`: focused checks for sequential access, partial completion, refresh, and invalid saved state.
- `docs/styles.css`: desktop, phone, and print layouts.
- `docs/downloads/`: printable reference and original assignment templates.
- `scripts/build-quick-reference.py`: regenerates the reference PDF from the scenario data.

The site has no external runtime dependencies, tracking, or application database.

## GitHub Pages

Publish the `main` branch's `/docs` directory in the repository's Pages settings. Keep all asset links relative so the site works at its full project URL. No custom domain or CNAME is needed.

For a local check, serve `docs/` through an HTTP server. `npm run check` checks JavaScript syntax and the progression tests. `npm run build` copies the same website into `dist/` for a separate preview host; `docs/` remains the source.

## Course sources

Case facts and quotations follow **COMM5009 CrisisInABox Student Packet.docx**, especially pages 1–2, 6, and 8. Current tasks and assessment follow **COMM5009 CrisisInABox Assignment Description.docx**, **COMM5009 CrisisInABox Facilitator Guide(1).docx**, **COMM5009 CrisisInABox Briefing Memo Template.docx**, and **COMM5009 CrisisInABox Post-Crisis Evaluation Template.docx**.

The newer assignment's single memo, fifteen-minute rounds, and two-minute briefings replace the older packet's worksheets and pacing. The inspector's minimum closure estimate retains the original packet's wording. The downloadable Word templates are unchanged. The quick reference is a new companion sheet based on the course materials.

This is a fictional classroom scenario. Statements attributed to the University of Cincinnati and other organizations are part of the exercise, not reports of a real incident.
