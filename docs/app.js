'use strict';

(() => {
  const data = window.CRISIS_CONTENT;
  const stages = data.stages;
  const stageLabels = ['Get ready', 'Update 1', 'Update 2', 'Update 3', 'Team briefings', 'Debrief'];
  const stageCaptions = ['Meet your team', '8:05 a.m.', '9:10 a.m.', '11:30 a.m.', 'Share your response', 'Look back together'];
  const files = {quickReference: 'downloads/Tallgrass_Quick_Reference.pdf', memo: 'downloads/Crisis_Response_Briefing_Memo.docx', printMemo: 'downloads/Crisis_Response_Briefing_Memo_Print.docx', evaluation: 'downloads/Post_Crisis_Evaluation.docx'};
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stageIndex = id => stages.findIndex(stage => stage.id === id);
  const storageKey = 'tallgrass-navigation-v2';
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}'); } catch (_) { /* A new session starts at setup. */ }
  const progress = window.CrisisProgress.create(stages, saved);
  const requestedStage = stageIndex(location.hash.slice(1));
  let current = progress.canEnter(requestedStage) ? requestedStage : progress.firstIncomplete();
  let toastTimeout;
  let readingIds = [];
  const timers = stages.map(stage => ({remaining: stage.duration, end: null, announced: false}));
  const allArtifacts = stages.flatMap((stage, index) => stage.artifacts.map(artifact => ({...artifact, stageIndex: index})));

  const iconPaths = {
    check: '<path d="m5 12 4 4L19 6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    social: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
    record: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    report: '<path d="M9 5H5v16h14V5h-4"/><rect x="9" y="2" width="6" height="5" rx="1"/><path d="m8 13 2 2 5-5M8 18h8"/>',
    account: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',
    internal: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 7h4M10 11h4M11 17h2"/>',
    statement: '<path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 8h8M8 12h5"/>',
    briefing: '<path d="M4 3h16v18H4zM8 7h8M8 11h8M8 15h5"/>'
  };
  const icon = (type, className = '') => `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[type] || iconPaths.briefing}</svg>`;
  const list = items => `<ol class="task-list">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ol>`;
  const roleCards = () => `<div class="role-grid">${data.roles.map((role, index) => `<div class="role-card"><span class="role-index">0${index + 1}</span><h3>${esc(role.name)}</h3><p>${esc(role.description)}</p></div>`).join('')}</div>`;
  const downloadLinks = () => `<div class="resource-links"><a class="primary-button" href="${files.memo}" download>Get the team memo</a><a class="secondary-button" href="${files.evaluation}" download>Get the evaluation template</a></div>`;
  const sectionList = () => `<ol class="memo-section-list">${data.submission.sections.map(section => `<li><h3>${esc(section.title)}</h3><p>${esc(section.prompt)}</p></li>`).join('')}</ol>`;

  function persist() {
    try { sessionStorage.setItem(storageKey, JSON.stringify(progress.snapshot())); } catch (_) { /* The page remains usable when storage is unavailable. */ }
  }

  function announce(message) {
    clearTimeout(toastTimeout);
    $('#status-message').textContent = message;
    toastTimeout = setTimeout(() => { $('#status-message').textContent = ''; }, 6000);
  }

  function renderNav() {
    $('#stage-navigation').innerHTML = stages.map((stage, index) => {
      const complete = progress.isComplete(index);
      const locked = !progress.canEnter(index);
      const state = complete ? 'Complete' : locked ? 'Locked' : index === current ? 'In progress' : 'Ready';
      return `<button type="button" class="stage-link ${index === current ? 'active' : ''} ${complete ? 'complete' : locked ? 'locked' : 'available'}" data-stage="${stage.id}" ${locked ? 'disabled' : ''} ${index === current ? 'aria-current="step"' : ''} aria-label="${stageLabels[index]}: ${state}"><span class="step-number">${complete ? icon('check') : locked ? icon('lock', 'stage-lock-icon') : String(index + 1).padStart(2, '0')}</span><span class="step-text">${stageLabels[index]}<span class="step-caption">${stageCaptions[index]}</span><span class="step-state">${state}</span></span></button>`;
    }).join('');
    const count = progress.completedCount();
    $('#journey-progress').innerHTML = `<div class="progress-caption"><span>Your progress</span><strong>${count} / ${stages.length}</strong></div><div class="journey-track" role="progressbar" aria-label="Completed stages" aria-valuemin="0" aria-valuemax="${stages.length}" aria-valuenow="${count}"><span class="journey-fill" style="width:${count / stages.length * 100}%"></span></div>`;
  }

  function timerMarkup() {
    const isBriefing = current === 4;
    return `<section class="round-bar" aria-label="Classroom countdown"><div class="round-clock"><span class="clock-time" id="clock-time">${formatTime(timers[current].remaining)}</span><div class="clock-label"><strong>${isBriefing ? 'Your time to share' : 'Time to work together'}</strong><br>Follow the timer on the classroom screen.</div></div><div class="timer-controls"><button id="timer-toggle" type="button">Start timer</button><button id="timer-add" type="button" aria-label="Add one minute">+1 min</button><button id="timer-reset" type="button">${isBriefing ? 'Next team' : 'Reset'}</button></div></section>`;
  }

  function heading(stage) {
    return `<header class="page-heading"><div><p class="eyebrow"><span class="round-step">${String(current + 1).padStart(2, '0')} / 06</span> ${esc(stage.eyebrow)}</p><h1 tabindex="-1">${esc(stage.title)}</h1><p class="page-description">${esc(stage.description)}</p></div><div class="scenario-time"><span>In the case</span>${esc(stage.scenarioTime)}</div></header>`;
  }

  function footer() {
    const next = current + 1;
    return `<footer class="page-footer"><div>${current > 0 ? `<button class="secondary-button" data-stage="${stages[current - 1].id}">← Back to ${stageLabels[current - 1]}</button>` : '<span class="progress-note">Use the case materials and your course concepts.</span>'}</div><div>${next < stages.length ? `<button class="primary-button" data-stage="${stages[next].id}" ${progress.canEnter(next) ? '' : 'disabled'}>${progress.canEnter(next) ? '' : icon('lock')}${current === 0 ? 'Open Update 1' : `Next: ${stageLabels[next]}`} <span aria-hidden="true">→</span></button>` : '<button class="secondary-button" data-reference="submission">Evaluation details →</button>'}</div></footer>`;
  }

  function completionMarkup() {
    const stage = stages[current];
    const counts = progress.counts(current);
    const complete = progress.isComplete(current);
    const ready = progress.canComplete(current);
    const nextLabel = current < stages.length - 1 ? stageLabels[current + 1] : null;
    return `<section class="completion-panel ${complete ? 'is-complete' : ''}" id="completion-panel" aria-labelledby="completion-title"><div class="completion-heading"><div><p class="completion-eyebrow">${complete ? 'Checkpoint complete' : 'Your checkpoint'}</p><h2 id="completion-title">${complete ? `${stageLabels[current]} complete` : esc(stage.completion.title)}</h2></div><span class="completion-count">${complete ? icon('check') : `${counts.read + counts.checked} / ${counts.documents + counts.tasks}`}</span></div><p>${complete ? (nextLabel ? `Wait for your instructor's cue, then open ${nextLabel}. You can revisit everything you've read.` : "You've finished the classroom simulation. Keep your team's memo for your individual evaluation.") : esc(stage.completion.description)}</p><div class="ready-summary">${counts.documents ? `<div class="ready-item ${counts.read === counts.documents ? 'done' : ''}">${counts.read === counts.documents ? icon('check') : icon('record')}<span>${current === 0 ? (counts.read === counts.documents ? 'Company background read' : 'Read the company background') : `${counts.read} of ${counts.documents} documents marked as read`}</span>${current === 0 && counts.read < counts.documents ? '<button class="text-button" data-reference="company">Open background →</button>' : ''}</div>` : ''}</div><fieldset class="completion-checklist" ${complete ? 'disabled' : ''}><legend class="screen-reader-only">Confirm your team's work</legend>${stage.completion.checks.map(check => `<label><input type="checkbox" data-completion-check="${esc(check.id)}" ${progress.isChecked(check.id) ? 'checked' : ''}><span>${esc(check.label)}</span></label>`).join('')}</fieldset>${complete ? `<div class="completion-success">${icon('check')}<span>${nextLabel ? `${nextLabel} is now available.` : 'Classroom work complete. Your individual evaluation is next.'}</span></div>` : `<div class="completion-actions"><button class="primary-button gate-button" data-complete-stage ${ready ? '' : 'disabled'} aria-describedby="gate-hint">${ready ? icon('check') : icon('lock')}${current === 0 ? 'Ready to begin' : current === stages.length - 1 ? 'Finish the simulation' : 'Complete this round'}</button><p class="gate-hint" id="gate-hint">${ready ? (nextLabel ? `This unlocks ${nextLabel}. Move on when your instructor gives the cue.` : 'All set? Mark the classroom simulation complete.') : `${counts.documents - counts.read ? 'Finish the reading and check' : 'Check'} each task above to ${nextLabel ? `unlock ${nextLabel}` : 'finish'}.`}</p></div>`}</section>`;
  }

  function buildingScene() {
    const windows = Array.from({length: 6}, (_, row) => Array.from({length: 4}, (_, col) => `<rect x="${140 + col * 32}" y="${86 + row * 29}" width="13" height="15" rx="1" fill="${(row + col) % 3 === 0 ? '#dce89d' : '#75978a'}" opacity="${(row + col) % 3 === 0 ? '1' : '.65'}"/>`).join('')).join('');
    return `<div class="hero-scene" aria-hidden="true"><svg viewBox="0 0 400 340" fill="none"><circle cx="245" cy="140" r="125" fill="#32584c"/><circle cx="310" cy="62" r="28" fill="#c8dc8c" opacity=".9"/><path d="M25 292H380M54 310H350" stroke="#678679" stroke-width="1"/><path d="M65 288V174l46-22v136" fill="#315348"/><path d="M108 288V73l27-18 143 13 33 34v186" fill="#456e5c"/><path d="M126 288V68h143v220" fill="#e6e4cb"/><path d="M269 68l34 30v190h-34" fill="#adbca3"/><path d="M120 68h156M125 277h144" stroke="#163e31" stroke-width="6"/>${windows}<rect x="173" y="260" width="46" height="28" fill="#254d3d"/><path d="M196 260v28" stroke="#b3c7a8"/><rect x="142" y="241" width="108" height="13" fill="#1e4737"/><text x="196" y="250" fill="#e5ebd4" font-size="7" font-family="Arial,sans-serif" text-anchor="middle" letter-spacing="2">THE HALDEN</text><path d="M295 123h7M295 154h7M295 185h7M295 216h7M295 247h7" stroke="#557968" stroke-width="10"/><path d="M77 285v-58M334 287v-48" stroke="#c4cfaa" stroke-width="3"/><ellipse cx="77" cy="219" rx="23" ry="35" fill="#789969"/><ellipse cx="334" cy="232" rx="22" ry="30" fill="#a3bc77"/><path d="M53 288h47M312 288h43" stroke="#c4cfaa" stroke-width="3"/><path d="m49 85 12-4 12 4m-34 33 9-3 9 3" stroke="#b7c8a1" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="286" r="4" fill="#efaa8e"/><path d="M50 292v14m-5-8h10m-5 8-4 7m4-7 4 7" stroke="#efaa8e" stroke-width="2" stroke-linecap="round"/></svg><div class="scene-caption"><span>The Halden</span><span>Cincinnati, Ohio</span></div></div>`;
  }

  function setupMarkup() {
    return `<section class="setup-hero"><div class="hero-copy"><span class="hero-badge">COMM 5009 · Crisis-in-a-Box</span><h1 tabindex="-1">Your team<br>is on call.</h1><p>${esc(data.company.overview)}</p><button class="primary-button" data-reference="company">Meet Tallgrass <span aria-hidden="true">→</span></button><p class="hero-footnote">A fictional case. Decisions that deserve a closer look.</p></div>${buildingScene()}</section><section class="stat-row" aria-label="How the simulation works"><div class="stat-item"><h2>Case updates</h2><p>Three rounds, 15 minutes each</p></div><div class="stat-item"><h2>Team memo</h2><p>One shared document for your decisions</p></div><div class="stat-item"><h2>Class briefing</h2><p>Two minutes per team</p></div></section><section class="setup-grid"><div class="info-card"><span class="info-step">01 / Set up</span><h2>Open your team memo</h2><p>Use one shared document that everyone can access. Choose a recorder to type while you discuss.</p><a href="${files.memo}" download>Get the memo template →</a></div><div class="info-card"><span class="info-step">02 / Work together</span><h2>Take one update at a time</h2><p>Read the new information, talk through your options, and write down your decisions. Finish the checkpoint to unlock the next round.</p></div><div class="info-card"><span class="info-step">03 / Turn it in</span><h2>Submit through Canvas</h2><p>Turn in one memo for your team by the end of class. You'll each write an individual evaluation afterward.</p><button class="text-button" data-reference="submission">What goes in the memo? →</button></div></section><section><div class="section-heading"><h2>Find your role</h2><span>Different responsibilities. Shared decisions.</span></div>${roleCards()}<details class="role-notes"><summary>Working in a smaller team?</summary>${data.roleNotes.map(note => `<p>${esc(note)}</p>`).join('')}</details></section><section class="briefing-card materials-card"><div><p class="eyebrow">Keep it close</p><h2>A quick reference for your table</h2><p>Roles, discussion questions, and submission reminders on one printable page.</p></div><div class="resource-links"><a class="secondary-button" href="${files.quickReference}" download>Get the quick reference (PDF)</a><a class="text-button" href="${files.printMemo}" download>Paper memo backup →</a></div></section><div class="notice">Stay with the case materials during the exercise. Open each new update when your instructor gives the cue.</div>${completionMarkup()}${footer()}`;
  }

  function artifactCard(artifact) {
    const read = progress.isRead(artifact.id);
    const trackReading = artifact.stageIndex === undefined ? current <= 3 : artifact.stageIndex <= 3;
    return `<button class="artifact-card ${read ? 'is-read' : ''}" data-artifact="${esc(artifact.id)}" data-type="${esc(artifact.type)}" aria-label="Read ${esc(artifact.title)}${read ? ', marked as read' : ''}"><span class="artifact-icon">${icon(artifact.type)}</span>${trackReading ? `<span class="artifact-status ${read ? 'done' : ''}">${read ? `${icon('check')} Read` : 'To read'}</span>` : ''}<span class="artifact-type">${esc(artifact.label || artifact.type)}</span><span class="artifact-title">${esc(artifact.title)}</span><span class="artifact-summary">${esc(artifact.summary)}</span><span class="artifact-meta">${esc(artifact.time)} · ${esc(artifact.source)}</span><span class="artifact-open" aria-hidden="true">→</span></button>`;
  }

  function taskPanel(stage) {
    return `<aside class="task-panel"><p class="eyebrow">Talk it through</p><h2>What should your team do?</h2>${list(stage.tasks)}<div class="submission-note"><p><strong>Keep using the same memo.</strong> These questions guide your discussion. Your team turns in one final document.</p><button class="text-button" data-reference="submission">Memo details →</button></div></aside>`;
  }

  function evidenceMarkup(stage) {
    const earlier = allArtifacts.filter(artifact => artifact.stageIndex > 0 && artifact.stageIndex < current && artifact.stageIndex <= 3);
    return `${heading(stage)}${timerMarkup()}<div class="content-layout"><section class="evidence-column" aria-label="Available case evidence"><div class="section-heading"><h2 id="evidence-heading">Just in</h2><div class="section-actions"><span>${stage.artifacts.length} documents</span><button class="text-button" data-read-update>Read the full update →</button></div></div><label class="evidence-search-label" for="evidence-search"><span class="screen-reader-only">Search the evidence so far</span><input id="evidence-search" class="evidence-search" type="search" placeholder="Search the evidence so far…" autocomplete="off"></label><div class="artifact-grid" id="artifact-grid">${stage.artifacts.map(artifactCard).join('')}</div>${earlier.length ? `<details class="previous-evidence" id="previous-evidence"><summary>Earlier evidence (${earlier.length} documents)</summary><div class="artifact-grid">${earlier.map(artifactCard).join('')}</div></details>` : ''}</section>${taskPanel(stage)}</div>${completionMarkup()}${footer()}`;
  }

  function briefingMarkup(stage) {
    return `${heading(stage)}${timerMarkup()}<div class="content-layout"><section><div class="briefing-card"><p class="eyebrow">One last check</p><h2>Finish and submit your memo</h2><p>Review all seven sections, including what changed after each update. Have one person submit your team's memo in the Canvas group assignment.</p><p>Keep a shared copy so everyone can use it for the individual evaluation.</p><button class="secondary-button" data-reference="submission">Review the seven sections</button></div><div class="briefing-card"><p class="eyebrow">Two minutes per team</p><h2>Tell us what you decided</h2><ol><li><strong>Spokesperson:</strong> Read your final public statement.</li><li><strong>Crisis lead:</strong> Explain one decision you changed and the information that changed it.</li></ol><p class="muted">Your instructor will set the order. Reset the timer for each team.</p></div><details class="previous-evidence"><summary>Look back at the case evidence</summary><div class="artifact-grid">${allArtifacts.filter(artifact => artifact.stageIndex >= 1 && artifact.stageIndex <= 3).map(artifactCard).join('')}</div></details></section><aside class="task-panel"><p class="eyebrow">Before you submit</p><h2>Is everything here?</h2>${list(['Your team name, members, and roles.','All seven memo sections.','A final response that reflects the latest evidence.','A decision recorded for each of the three updates.'])}<div class="submission-note">Your memo is submitted when you turn it in through Canvas.</div></aside></div>${completionMarkup()}${footer()}`;
  }

  function debriefMarkup(stage) {
    return `${heading(stage)}${timerMarkup()}<section class="briefing-card"><p class="eyebrow">Let's compare notes</p><h2>Talk about the decisions</h2>${list(stage.tasks)}</section><div class="section-heading"><h2>Look back at the case</h2><span>Connect the evidence to your decisions</span></div><div class="artifact-grid">${stage.artifacts.map(artifactCard).join('')}</div><section class="briefing-card evaluation-card"><p class="eyebrow">Your individual follow-up</p><h2>${esc(data.submission.individual.title)}</h2><p><strong>${esc(data.submission.individual.due)}</strong></p><p>${esc(data.submission.individual.description)}</p><a class="secondary-button" href="${files.evaluation}" download>Get the evaluation template</a></section>${completionMarkup()}${footer()}`;
  }

  function render({focus = false} = {}) {
    const stage = stages[current];
    renderNav();
    $('#workspace').innerHTML = current === 0 ? setupMarkup() : current <= 3 ? evidenceMarkup(stage) : current === 4 ? briefingMarkup(stage) : debriefMarkup(stage);
    document.title = `${stageLabels[current]} | Tallgrass Crisis Simulation`;
    updateClock();
    if (focus) {
      $('#workspace h1')?.focus({preventScroll: true});
      window.scrollTo({top: 0, behavior: 'instant'});
    }
  }

  function refreshProgress() {
    renderNav();
    $('#completion-panel').outerHTML = completionMarkup();
    $('.page-footer').outerHTML = footer();
    document.querySelectorAll('[data-artifact]').forEach(card => {
      const read = progress.isRead(card.dataset.artifact);
      card.classList.toggle('is-read', read);
      const artifact = allArtifacts.find(item => item.id === card.dataset.artifact);
      if (artifact) card.setAttribute('aria-label', `Read ${artifact.title}${read ? ', marked as read' : ''}`);
      const status = card.querySelector('.artifact-status');
      if (status) { status.classList.toggle('done', read); status.innerHTML = read ? `${icon('check')} Read` : 'To read'; }
    });
  }

  function pauseTimer(index) {
    const timer = timers[index];
    if (timer.end !== null) timer.remaining = Math.max(0, Math.ceil((timer.end - Date.now()) / 1000));
    timer.end = null;
  }

  function navigate(index) {
    if (!progress.canEnter(index)) {
      history.replaceState(null, '', `#${stages[current].id}`);
      announce(`Finish ${stageLabels[progress.firstIncomplete()]} before moving ahead.`);
      return;
    }
    if (index === current) { history.replaceState(null, '', `#${stages[current].id}`); return; }
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    pauseTimer(current);
    current = index;
    history.replaceState(null, '', `#${stages[current].id}`);
    render({focus: true});
  }

  function readingAction(ids, label) {
    readingIds = ids;
    const done = ids.every(id => progress.isRead(id));
    return `<div class="document-reading-action"><p>${done ? "You've marked this reading as complete. You can come back to it any time." : "Read this with your team, then mark it as read when you're ready."}</p><button class="${done ? 'secondary-button' : 'primary-button'}" data-mark-read ${done ? 'disabled' : ''}>${icon('check')}${done ? 'Marked as read' : label}</button></div>`;
  }

  function openArtifact(id) {
    const artifact = allArtifacts.find(item => item.id === id && item.stageIndex <= current && progress.canEnter(item.stageIndex));
    if (!artifact) return;
    readingIds = [];
    $('#document-label').textContent = artifact.label || artifact.type;
    $('#document-content').innerHTML = `<p class="eyebrow">${esc(artifact.time)}</p><h2 id="document-title">${esc(artifact.title)}</h2><p class="document-source">${esc(artifact.source)}</p>${artifact.body}${artifact.stageIndex <= 3 ? readingAction([id], "I've read this") : ''}`;
    $('#document-dialog').showModal();
    $('#document-dialog').scrollTop = 0;
  }

  function openFullUpdate() {
    const stage = stages[current];
    if (current < 1 || current > 3 || !progress.canEnter(current)) return;
    $('#document-label').textContent = `${stage.eyebrow} · Full update`;
    $('#document-content').innerHTML = `<p class="eyebrow">${esc(stage.scenarioTime)}</p><h2 id="document-title">${esc(stage.title)}</h2><p class="document-intro">All ${stage.artifacts.length} documents for this round, together. Mark them as read at the end.</p>${stage.artifacts.map(artifact => `<section class="full-update-section"><p class="eyebrow">${esc(artifact.label)}</p><h3>${esc(artifact.title)}</h3><p class="document-source">${esc(artifact.source)} · ${esc(artifact.time)}</p>${artifact.body}</section>`).join('')}${readingAction(stage.artifacts.map(artifact => artifact.id), "I've read this update")}`;
    $('#document-dialog').showModal();
    $('#document-dialog').scrollTop = 0;
  }

  function openReference(kind) {
    readingIds = [];
    let title = '';
    let html = '';
    if (kind === 'company') {
      title = 'Meet Tallgrass';
      html = `<p class="eyebrow">Your company for the morning</p>${data.company.backgroundHtml}${data.company.resourcesHtml}${readingAction(stages[0].artifacts.map(artifact => artifact.id), "I've read the background")}`;
    } else if (kind === 'guide') {
      title = 'Questions to keep close';
      html = `<p>Keep these questions in mind as the case develops.</p><div class="guide-concepts">${data.guide.concepts.map(item => `<section><h3>${esc(item.title)}</h3><p>${esc(item.prompt)}</p></section>`).join('')}</div>${data.guide.html}<a class="secondary-button" href="${files.quickReference}" download>Get the quick reference (PDF)</a>`;
    } else {
      title = 'Your memo & evaluation';
      html = `<p><strong>${esc(data.submission.due)}</strong></p><p>Address your memo to ${esc(data.submission.addressedTo)}. Include your team name, members, and roles.</p>${downloadLinks()}${sectionList()}<div class="notice">Keep your original holding statement in the shared document's version history or a short appendix. Use section 7 to explain what changed and why.</div><h3>Your individual evaluation</h3><p><strong>${esc(data.submission.individual.due)}</strong></p><p>${esc(data.submission.individual.description)}</p><ul>${data.submission.individual.sections.map(section => `<li><strong>${esc(section.title)}.</strong> ${esc(section.prompt)}</li>`).join('')}</ul><p class="muted">Write in your shared document and submit through Canvas. The website keeps the case materials together for you.</p>`;
    }
    $('#reference-content').innerHTML = `<h2 id="reference-title">${title}</h2>${html}`;
    $('#reference-dialog').showModal();
    $('#reference-dialog').scrollTop = 0;
  }

  function formatTime(seconds) { return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }
  function updateClock() {
    const clock = $('#clock-time');
    if (!clock) return;
    const timer = timers[current];
    const left = timer.end === null ? timer.remaining : Math.max(0, Math.ceil((timer.end - Date.now()) / 1000));
    clock.textContent = formatTime(left);
    clock.classList.toggle('warning', left > 0 && left <= 120);
    clock.classList.toggle('expired', left === 0);
    $('#timer-toggle').textContent = timer.end === null ? (left === 0 ? 'Restart timer' : 'Start timer') : 'Pause timer';
    if (timer.end !== null && left === 0) {
      timer.remaining = 0;
      timer.end = null;
      if (!timer.announced) { announce('Time is up. Finish your checkpoint and wait for your instructor.'); timer.announced = true; }
      $('#timer-toggle').textContent = 'Restart timer';
    }
  }

  function buildPrintGuide() {
    $('#print-guide').innerHTML = `<p class="eyebrow">COMM 5009 · Crisis-in-a-Box</p><h1>Tallgrass quick reference</h1><p>One team memo. Three updates. Use the information available at each point.</p><h2>Team roles</h2><div class="print-roles">${data.roles.map(role => `<p><strong>${esc(role.name)}.</strong> ${esc(role.description)}</p>`).join('')}</div><h2>Questions for each update</h2><div class="print-concepts">${data.guide.concepts.map(concept => `<p><strong>${esc(concept.title)}.</strong> ${esc(concept.prompt)}</p>`).join('')}</div><h2>Keep a record</h2><p>Before the next update, write what you decided and what changed your thinking in section 7. Keep your original statement and record later revisions.</p><h2>Turn in</h2><p><strong>Team:</strong> One complete briefing memo on Canvas by the end of class. Read your public statement and explain one changed decision in a two-minute briefing.</p><p><strong>Individual:</strong> An approximately two-page Post-Crisis Evaluation on Canvas by Friday, November 20, 2026, at 11:59 p.m.</p><p class="print-footer">Fictional classroom scenario · Chengyu Fang · COMM 5009</p>`;
  }

  document.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.dataset.stage) navigate(stageIndex(button.dataset.stage));
    if (button.dataset.artifact) openArtifact(button.dataset.artifact);
    if (button.hasAttribute('data-read-update')) openFullUpdate();
    if (button.dataset.reference) openReference(button.dataset.reference);
    if (button.hasAttribute('data-close-dialog')) button.closest('dialog').close();
    if (button.hasAttribute('data-mark-read')) {
      progress.markRead(readingIds);
      persist();
      button.closest('dialog').close();
      readingIds = [];
      refreshProgress();
      announce('Reading marked complete. Your checkpoint has been updated.');
    }
    if (button.hasAttribute('data-complete-stage') && progress.complete(current)) {
      persist();
      refreshProgress();
      $('#completion-title').setAttribute('tabindex', '-1');
      $('#completion-title').focus({preventScroll: true});
      announce(current < stages.length - 1 ? `${stageLabels[current]} complete. ${stageLabels[current + 1]} is now available.` : 'Classroom simulation complete.');
    }
    const timer = timers[current];
    if (button.id === 'timer-toggle') {
      if (timer.end !== null) pauseTimer(current);
      else { if (timer.remaining <= 0) timer.remaining = stages[current].duration; timer.end = Date.now() + timer.remaining * 1000; timer.announced = false; }
      updateClock();
    }
    if (button.id === 'timer-add') { if (timer.end !== null) timer.end += 60000; else timer.remaining += 60; timer.announced = false; updateClock(); }
    if (button.id === 'timer-reset') { timer.end = null; timer.remaining = stages[current].duration; timer.announced = false; updateClock(); }
    if (button.id === 'fullscreen-button') {
      try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
      catch (_) { announce('Full screen is unavailable here. You can keep using the page normally.'); }
    }
  });

  document.addEventListener('change', event => {
    const id = event.target.dataset.completionCheck;
    if (!id) return;
    if (!progress.setCheck(current, id, event.target.checked)) return;
    persist();
    refreshProgress();
    document.querySelector(`[data-completion-check="${id}"]`)?.focus({preventScroll: true});
  });

  document.addEventListener('input', event => {
    if (event.target.id !== 'evidence-search') return;
    const query = event.target.value.trim().toLowerCase();
    const pool = query ? allArtifacts.filter(artifact => artifact.stageIndex > 0 && artifact.stageIndex <= Math.min(current, 3) && progress.canEnter(artifact.stageIndex)) : stages[current].artifacts;
    const matches = pool.filter(artifact => !query || `${artifact.title} ${artifact.summary} ${artifact.source} ${artifact.body.replace(/<[^>]*>/g, ' ')}`.toLowerCase().includes(query));
    $('#artifact-grid').innerHTML = matches.length ? matches.map(artifactCard).join('') : '<p class="notice">No matches in the evidence so far. Try a different word.</p>';
    $('#evidence-heading').textContent = query ? `Search results (${matches.length})` : 'Just in';
    const previous = $('#previous-evidence');
    if (previous) previous.hidden = Boolean(query);
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { readingIds = []; });
  });
  document.addEventListener('fullscreenchange', () => $('#fullscreen-button').setAttribute('aria-label', document.fullscreenElement ? 'Exit full screen' : 'Enter full screen'));
  window.addEventListener('hashchange', () => {
    if (location.hash === '#main-content') {
      history.replaceState(null, '', `#${stages[current].id}`);
      $('#main-content').focus();
      return;
    }
    navigate(stageIndex(location.hash.slice(1)));
  });
  history.replaceState(null, '', `#${stages[current].id}`);
  persist();
  buildPrintGuide();
  render();
  if (requestedStage > current) announce(`Start with ${stageLabels[current]}. Finish each checkpoint to unlock the next stage.`);
  setInterval(updateClock, 250);
})();
