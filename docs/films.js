'use strict';
/*
 * The three cold opens: what is on screen, when, and what is heard.
 * Every statement comes from the documents of that update in content.js.
 * Quoted words keep the documents' wording. Times are seconds from the start.
 * film.js draws the street and runs the clock; this file holds no logic.
 */
(() => {
  const n = value => (Math.round(value * 100) / 100).toString();
  // Clip lengths come from voice-tracks.js, written by scripts/build-voices.py.
  const seconds = (id, fallback) => (window.CrisisVoices && window.CrisisVoices[id] ? window.CrisisVoices[id].seconds : fallback);
  const glyphs = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16v11H10l-5 4v-4H4z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 3h3.2l1.5 4.6-2 1.6a12 12 0 0 0 5.5 5.5l1.6-2L21 14.2v3.2c0 1.4-1.2 2.6-2.6 2.6C10.4 20 4 13.6 4 5.6 4 4.2 5.2 3 6.6 3z"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M9 6h9v9"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="m4 7 8 6 8-6"/></svg>',
    post: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h14v10H9l-4 4z"/><path d="M9 9h6M9 12h4"/></svg>',
    bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18V7m0 7h18v4M3 11h9a4 4 0 0 1 4 4"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.400 5.600 17 7M7 17l-1.400 1.400"/></svg>'
  };
  const note = (at, tile, glyph, title, meta, body) =>
    `<article class="note" data-at="${n(at)}" style="--tile:${tile}"><span class="glyph">${glyphs[glyph]}</span><div><header><h3>${title}</h3>${meta ? `<span class="meta">${meta}</span>` : ''}</header>${body}</div></article>`;
  // Spoken text is split into phrases; each lights up while its voice reads it.
  const spoken = (voice, phrases, cls = 'read') => `<p class="${cls}" data-speak="${voice}">${phrases.map(p => `<span>${p}</span>`).join(' ')}</p>`;
  const ledger = (at, left, right, stakes, handoff) =>
    `<div class="endcard" data-in="${n(at)}" data-rise="none"><div class="ledger"><section><h3>${left[0]}</h3><ul>${left.slice(1).map(x => `<li>${x}</li>`).join('')}</ul></section><section class="open"><h3>${right[0]}</h3><ul>${right.slice(1).map(x => `<li>${x}</li>`).join('')}</ul></section></div><p class="stakes" data-in="${n(at + 2.0)}">${stakes}</p><p class="handoff" data-in="${n(at + 3.7)}">${handoff}</p></div>`;
  const rainBed = (length, duckAt) => ({ id: 'rain', at: 0, until: length, gain: 0.62, loop: true, fade: 0.9, bus: 'bed', duck: [duckAt, 0.5] });

  /* ------------------------------------------------------------ Update 1 */
  const one = (() => {
    const lock = 27, mail = 37.0, voice = mail + 1.5, end = voice + seconds('u1-priya', 16) + 1.0, length = end + 7.6;
    return {
      label: 'Update 1', length, poster: 13.2,
      shots: { video: 1.6, night: 8, lapse: 20, lock, end },
      overlay: `
<div class="cap cap-side">
  <p class="hour" data-in="0.15" data-out="7.9" data-rise="none">6:10 a.m.</p>
  <p class="say" data-in="2.1" data-out="7.9">A resident on the third floor hears a loud crack and finds this near the east stairwell.</p>
  <p class="say" data-in="5.3" data-out="7.9">Overnight security calls 911.</p>
</div>
<p class="credit" data-in="2.6" data-out="7.9">A resident's video of the crack, posted at 6:50 a.m.</p>
<div class="cap cap-sky">
  <p class="hour" data-in="8.5" data-out="19.8" data-rise="none">6:40 a.m.</p>
  <div class="swap">
    <p class="say" data-in="9.1" data-out="13.9">The Cincinnati Fire Department orders a precautionary evacuation.</p>
    <p class="say" data-in="14.3" data-out="19.8">All 236 residents are out. Nobody is hurt.</p>
  </div>
  <p class="aside" data-in="15.9" data-out="19.8">It is 38 degrees and raining. Most residents shelter in the building next door.</p>
</div>
<div class="cap cap-sky">
  <p class="hour" data-in="21.7" data-out="${n(lock - 0.1)}" data-rise="none">8:05 a.m.</p>
  <p class="say" data-in="22.3" data-out="${n(lock - 0.1)}">A city structural inspector arrives at 9:00. Nobody may go back in until the inspector permits it.</p>
</div>
<div class="lock" data-in="${n(lock + 0.2)}" data-out="${n(end - 0.2)}" data-rise="none"><p class="big">8:05</p><p class="day">Monday morning</p><p class="wx">38° and raining</p></div>
<div class="stack-wrap" data-in="${n(lock + 0.2)}" data-out="${n(end - 0.2)}" data-rise="none"><div class="stack">
  ${note(lock + 1.0, '#d6452f', 'play', "A resident's video of the crack", 'Posted 6:50 a.m.', '<p class="count">40,000<small>views</small></p>')}
  ${note(lock + 3.3, '#d18a2c', 'chat', "Residents' group chat", '190 members', '<p><span class="typing"><i></i><i></i><i></i></span>The chat is moving quickly.</p>')}
  ${note(lock + 5.5, '#1d5a47', 'phone', 'Leasing office line', 'Opens at 9:00 a.m.', '<p>Two parents have already called.</p>')}
  ${note(lock + 7.7, '#566270', 'out', 'Calls placed this morning', '', '<div class="rows"><div><span>Kessler-Brandt Construction</span><span>No call back</span></div><div><span>Larkin &amp; Pell Structural Engineers</span><span>No call back</span></div></div>')}
  ${note(mail, '#3a68a0', 'mail', 'Priya Natarajan, Channel 7 News', '7:52 a.m.', '<p class="subject">Evacuation at The Halden: request for comment by 9:00 a.m.</p>' + spoken('u1-priya', ['Can you confirm what caused the evacuation,', 'whether anyone was hurt,', 'when residents will be allowed back in,', 'and what the company is doing for the students who are outside right now?', 'We would like a statement by 9:00 a.m.', 'and would welcome someone on camera at 11:00.']))}
</div></div>
${ledger(end, ['Confirmed at 8:05', 'All 236 residents are out.', 'Nobody is hurt.', 'A city inspector arrives at 9:00.'], ['Not known yet', 'What caused the crack.', 'When residents can go back in.'], 'Tallgrass has said nothing publicly. Channel 7 wants a statement by 9:00.', 'Read the three documents, then start your memo.')}`,
      cues: [
        { id: 'crack', at: 0.55, gain: 0.9, bus: 'fx' },
        { id: 'tone', at: 1.5, until: 8.2, gain: 0.14, loop: true, fade: 0.5, bus: 'bed' },
        { id: 'rain', at: 7.6, until: length, gain: 0.66, loop: true, fade: 1.2, bus: 'bed', duck: [lock, 0.5] },
        { id: 'alarm', at: 8.05, until: 10.6, gain: 0.2, fade: 0.5, bus: 'fx' },
        { id: 'steps', at: 8.9, until: 19.4, gain: 0.34, loop: true, fade: 1.4, bus: 'bed' },
        { id: 'steps', at: 10.1, until: 18.2, gain: 0.22, loop: true, fade: 1.4, rate: 1.12, bus: 'bed' }
      ],
      voices: [{ id: 'u1-priya', at: voice }],
      transcript: [
        '6:10 a.m. A resident on the third floor hears a loud crack and finds a new crack near the east stairwell. Overnight security calls 911. The picture is a resident\'s video of the crack, posted at 6:50 a.m.',
        '6:40 a.m. The Cincinnati Fire Department orders a precautionary evacuation. All 236 residents are out. Nobody is hurt. It is 38 degrees and raining. Most residents shelter in the building next door.',
        '8:05 a.m. A city structural inspector arrives at 9:00. Nobody may go back in until the inspector permits it.',
        'On the team\'s phone: the video has 40,000 views; the residents\' group chat has 190 members and is moving quickly; two parents have called the leasing office line, which opens at 9:00 a.m.; Kessler-Brandt Construction and Larkin & Pell Structural Engineers have not called back.',
        'Priya Natarajan of Channel 7 News, read aloud: "Can you confirm what caused the evacuation, whether anyone was hurt, when residents will be allowed back in, and what the company is doing for the students who are outside right now? We would like a statement by 9:00 a.m. and would welcome someone on camera at 11:00."',
        'Confirmed at 8:05: all 236 residents are out, nobody is hurt, a city inspector arrives at 9:00. Not known yet: what caused the crack, and when residents can go back in. Tallgrass has said nothing publicly.'
      ]
    };
  })();

  /* ------------------------------------------------------------ Update 2 */
  const two = (() => {
    const B = 10.4, C = B + 14.6, D = C + 25.4, E = D + 20.0, length = E + 7.6;
    const ticket = (at, number, unit, submitted, voice, phrases, closed, stampAt) =>
      `<article class="ticket" data-in="${n(at)}"><header><b>${number}</b><span>${unit}</span><span>Submitted ${submitted}</span></header>${spoken(voice, phrases, 'ticket-text')}<div class="stamp" data-in="${n(stampAt)}" data-rise="stamp"><b>Closed ${closed}</b><span>Cosmetic. No action required. (M. Reyes)</span></div></article>`;
    return {
      label: 'Update 2', length, poster: 2.4,
      shots: { post: B, tickets: C, lock: D, end: E },
      overlay: `
<div class="cap cap-sky">
  <p class="hour" data-in="0.3" data-out="${n(B - 0.3)}" data-rise="none">9:10 a.m.</p>
  <div class="swap">
    <p class="say" data-in="0.9" data-out="4.3">The inspector is inside the building.</p>
    <p class="say" data-in="4.7" data-out="${n(B - 0.3)}">Unofficially, the fire department has told Marcus Reyes it will stay closed at least through tonight.</p>
  </div>
  <p class="aside" data-in="6.9" data-out="${n(B - 0.3)}">Someone needs a plan for where 236 students sleep.</p>
</div>

<div class="scene post-scene" data-in="${n(B)}" data-out="${n(C - 0.2)}" data-rise="none">
  <article class="post">
    <header><span class="avatar"></span><div><h3>An account with 300 followers</h3><p>Posted 8:41 a.m. on X and TikTok</p></div></header>
    ${spoken('u2-post', ['The Halden on campus has been CONDEMNED and is collapsing.', 'Two students hospitalized.', 'Tallgrass Student Living knew.', 'Share this.'], 'post-text')}
    <footer><b>12,000</b> shares</footer>
  </article>
  <aside class="beside">
    <h3 data-in="${n(B + 9.0)}">Your team's information</h3>
    <p data-in="${n(B + 9.5)}">The building has been evacuated, not condemned.</p>
    <p data-in="${n(B + 10.3)}">Nobody has been hospitalized.</p>
    <p class="quiet" data-in="${n(B + 11.2)}">The account has no connection to the building that your team can find.</p>
  </aside>
</div>

<div class="scene ticket-scene" data-in="${n(C)}" data-out="${n(D - 0.2)}" data-rise="none">
  <p class="scene-title">Three maintenance requests, from a screenshot in the residents' group chat</p>
  <div class="ticket-row">
    ${ticket(C + 0.3, '#4471', 'Unit 312', 'October 28', 'u2-request-4471', ['Cracks in the hallway wall on 3 by the east stairs,', 'new since last week.'], 'October 29', C + 5.75)}
    ${ticket(C + 8.1, '#4502', 'Unit 318', 'November 3', 'u2-request-4502', ['The crack is longer now', 'and my door won\'t close unless I slam it.'], 'November 3', C + 12.3)}
    ${ticket(C + 14.6, '#4539', 'Unit 312', 'November 10', 'u2-request-4539', ['Third time.', 'The crack goes into the ceiling now.', 'Can someone please look at it.'], 'November 11', C + 19.55)}
  </div>
  <p class="scene-foot" data-in="${n(C + 22.0)}">The screenshot is circulating on TikTok and X.</p>
</div>

<div class="lock" data-in="${n(D + 0.2)}" data-out="${n(E - 0.2)}" data-rise="none"><p class="big">9:10</p><p class="day">Monday morning</p><p class="wx">The inspector is inside the building</p></div>
<div class="stack-wrap" data-in="${n(D + 0.2)}" data-out="${n(E - 0.2)}" data-rise="none"><div class="stack">
  ${note(D + 0.9, '#1d5a47', 'phone', 'Leasing office line', 'Since 9:00 a.m.', '<p class="count">44<small>calls from parents</small></p><p>Several ask about rent refunds and ending the lease.</p>')}
  ${note(D + 3.4, '#566270', 'post', 'A mother in Dayton, on Facebook', '', '<p>She is driving down to get her daughter.</p>' + spoken('u2-mother', ['“nobody from the company will answer.”'], 'read quote'))}
  ${note(D + 6.9, '#566270', 'phone', 'Kessler-Brandt Construction called back', '', '<p class="quote">It “will be reviewing the matter with counsel.”</p><div class="rows"><div><span>Larkin &amp; Pell Structural Engineers</span><span>No call back</span></div></div>')}
  ${note(D + 9.4, '#3a68a0', 'mail', 'Priya Natarajan, Channel 7 News', 'By 9:10 a.m.', spoken('u2-priya', ['We have the maintenance ticket screenshots.', 'Did Tallgrass Student Living ignore warnings about this wall for three weeks?', 'Will someone go on camera at 11:00?']))}
</div></div>
${ledger(E, ["Your team's information at 9:10", 'The building is evacuated, not condemned.', 'Nobody has been hospitalized.', 'Unofficially, it stays closed at least through tonight.'], ['Not known yet', 'What the inspector will find.', 'Where 236 students sleep tonight.'], 'Three requests about the third-floor cracks were each closed within a day as cosmetic.', 'Read the eight documents, then revisit your memo.')}`,
      cues: [
        rainBed(length, B),
        { id: 'notify', at: B + 0.1, gain: 0.3, bus: 'fx' },
        ...[C + 0.3, C + 8.1, C + 14.6].map(at => ({ id: 'page', at, gain: 0.5, bus: 'fx' })),
        ...[C + 5.75, C + 12.3, C + 19.55].map(at => ({ id: 'thud', at, gain: 0.8, bus: 'fx' })),
        { id: 'phone', at: D + 0.9, gain: 0.26, bus: 'fx' },
        { id: 'pickup', at: D + 6.9, gain: 0.4, bus: 'fx' }
      ],
      voices: [
        { id: 'u2-post', at: B + 1.0 },
        { id: 'u2-request-4471', at: C + 0.9 }, { id: 'u2-closed', at: C + 5.85 },
        { id: 'u2-request-4502', at: C + 8.6 }, { id: 'u2-closed', at: C + 12.4 },
        { id: 'u2-request-4539', at: C + 15.1 }, { id: 'u2-closed', at: C + 19.65 },
        { id: 'u2-mother', at: D + 4.1 },
        { id: 'u2-priya', at: D + 10.1 }
      ],
      transcript: [
        '9:10 a.m. The inspector is inside the building. Unofficially, the fire department has told Marcus Reyes it will stay closed at least through tonight. Someone needs a plan for where 236 students sleep.',
        'A post from an account with 300 followers, posted at 8:41 a.m. and shared 12,000 times, read aloud: "The Halden on campus has been CONDEMNED and is collapsing. Two students hospitalized. Tallgrass Student Living knew. Share this." Your team\'s information: the building has been evacuated, not condemned, and nobody has been hospitalized. The account has no connection to the building that your team can find.',
        'Three maintenance requests from a screenshot in the residents\' group chat, each read aloud. Request #4471, Unit 312, October 28: "Cracks in the hallway wall on 3 by the east stairs, new since last week." Request #4502, Unit 318, November 3: "The crack is longer now and my door won\'t close unless I slam it." Request #4539, Unit 312, November 10: "Third time. The crack goes into the ceiling now. Can someone please look at it." Each closing note reads: "Cosmetic. No action required. (M. Reyes)". The screenshot is circulating on TikTok and X.',
        'On the team\'s phone: 44 calls from parents since 9:00 a.m., several about rent refunds and ending the lease. A mother in Dayton posts on Facebook that she is driving down to get her daughter and "nobody from the company will answer." Kessler-Brandt Construction called back and said only that it "will be reviewing the matter with counsel." Larkin & Pell Structural Engineers has not called back.',
        'Priya Natarajan of Channel 7 News, read aloud: "We have the maintenance ticket screenshots. Did Tallgrass Student Living ignore warnings about this wall for three weeks? Will someone go on camera at 11:00?"',
        'Your team\'s information at 9:10: the building is evacuated, not condemned; nobody has been hospitalized; unofficially, it stays closed at least through tonight. Not known yet: what the inspector will find, and where 236 students sleep tonight.'
      ]
    };
  })();

  /* ------------------------------------------------------------ Update 3 */
  const three = (() => {
    const B = 15.0, C = B + 27.0, D = C + 10.0, E = D + 10.2, F = E + 10.6, length = F + 7.6;
    const statement = (at, org, time, voice, phrases, cls = '') =>
      `<article class="statement ${cls}" data-in="${n(at)}"><header><h3>${org}</h3><p>Statement issued to Channel 7 News, ${time}</p></header>${spoken(voice, phrases, 'statement-text')}</article>`;
    return {
      label: 'Update 3', length, poster: 3.0,
      shots: { statements: B, account: C, dana: D, lock: E, end: F },
      overlay: `
<div class="cap cap-sky">
  <p class="hour" data-in="0.3" data-out="${n(B - 0.3)}" data-rise="none">11:15 a.m.</p>
  <div class="swap">
    <p class="say" data-in="0.9" data-out="5.3">The inspector issues a preliminary finding: a failed steel connection at a transfer beam on the third floor.</p>
    <p class="say" data-in="5.7" data-out="10.3">The building is unsafe to occupy until temporary shoring is installed and a full structural review is complete, “a minimum of ten to fourteen days.”</p>
    <p class="say" data-in="10.7" data-out="${n(B - 0.3)}">Residents may collect essential belongings in escorted fifteen-minute windows starting Wednesday.</p>
  </div>
</div>

<div class="scene statement-scene" data-in="${n(B)}" data-out="${n(C - 0.2)}" data-rise="none">
  <div class="statement-pair">
    ${statement(B + 0.3, 'Kessler-Brandt Construction', '11:05 a.m.', 'u3-contractor', ['Kessler-Brandt Construction built The Halden to the engineer\'s drawings', 'and passed every city inspection.', 'We are confident in our work.'])}
    ${statement(B + 9.8, 'Larkin &amp; Pell Structural Engineers', '11:20 a.m.', 'u3-engineer', ['Our design was sound.', 'We are reviewing whether construction matched the design.'])}
  </div>
  ${statement(B + 15.2, 'University of Cincinnati', '10:50 a.m., within this fictional scenario', 'u3-university', ['The Halden is a privately owned and operated property', 'and is not affiliated with the University.', 'Student Affairs is assisting affected students', 'with information about temporary housing.'], 'wide')}
</div>

<div class="scene account-scene" data-in="${n(C)}" data-out="${n(D - 0.2)}" data-rise="none">
  <div class="onair">
    <p class="oncam">On camera</p>
    <svg class="silhouette" viewBox="0 0 200 150" aria-hidden="true"><ellipse cx="100" cy="46" rx="27" ry="33"/><path d="M100 88c-11 0-19-4-24-8-1 12-9 18-30 24-26 8-40 22-42 46h192c-2-24-16-38-42-46-21-6-29-12-30-24-5 4-13 8-24 8z"/></svg>
    <p class="lower"><b>Tom Delgado</b><span>Former Tallgrass maintenance technician, speaking to Priya Natarajan on camera</span></p>
  </div>
  <div class="account-lines">
    <p data-in="${n(C + 0.9)}">In August he flagged <q>door frames out of square on 3.</q></p>
    <p data-in="${n(C + 3.9)}">He says he was told it was <q>normal settling.</q></p>
    <p class="quiet" data-in="${n(C + 6.6)}">He left Tallgrass Student Living in September.</p>
  </div>
</div>

<div class="scene dana-scene" data-in="${n(D)}" data-out="${n(E - 0.2)}" data-rise="none">
  <div class="dana-copy">
    <p class="hour">11:30 a.m.</p>
    <p class="say">Dana Whitlock has arrived. She wants to issue a statement within the hour.</p>
    <p class="say strong" data-in="${n(D + 6.6)}">She wants your recommendation in writing.</p>
  </div>
  <article class="draft" data-in="${n(D + 0.9)}">
    <header><span class="mark"></span><div><h3>Tallgrass Student Living</h3><p>Proposed statement. Not issued.</p></div></header>
    <p class="draft-line">It would say that the contractor is at fault, and that</p>
    ${spoken('u3-dana', ['“we were as surprised as anyone.”'], 'draft-quote')}
  </article>
</div>

<div class="lock" data-in="${n(E + 0.2)}" data-out="${n(F - 0.2)}" data-rise="none"><p class="big">11:30</p><p class="day">Monday morning</p><p class="wx">Dana Whitlock has arrived</p></div>
<div class="stack-wrap" data-in="${n(E + 0.2)}" data-out="${n(F - 0.2)}" data-rise="none"><div class="stack">
  ${note(E + 0.9, '#566270', 'bed', 'A local hotel group', 'Offer', '<p class="count">120<small>rooms at a reduced rate for two weeks</small></p><p>The case does not specify the nightly rate.</p>')}
  ${note(E + 3.6, '#566270', 'sun', "UC's Campus Recreation Center", '', '<p>Open as a daytime warming space for residents.</p>')}
  ${note(E + 6.2, '#d18a2c', 'chat', "Residents' group chat", '', '<p>Organizing a protest outside the leasing office at 5:00 p.m.</p>')}
</div></div>
${ledger(F, ['On the record at 11:30', 'Preliminary finding: a failed steel connection.', 'Unsafe to occupy for a minimum of ten to fourteen days.', 'Escorted visits for belongings start Wednesday.'], ['Not known yet', 'Whether construction matched the design.', 'The nightly rate for the hotel rooms.'], 'Dana Whitlock wants to issue her statement within the hour.', 'Read the eight documents, then finish all seven memo sections.')}`,
      cues: [
        rainBed(length, B),
        ...[B + 0.3, B + 9.8, B + 15.2, D + 0.9].map(at => ({ id: 'page', at, gain: 0.5, bus: 'fx' })),
        { id: 'click', at: C + 0.1, gain: 0.5, bus: 'fx' }
      ],
      voices: [
        { id: 'u3-contractor', at: B + 0.9 },
        { id: 'u3-engineer', at: B + 10.3 },
        { id: 'u3-university', at: B + 15.8 },
        { id: 'u3-dana', at: D + 4.0 }
      ],
      transcript: [
        '11:15 a.m. The inspector issues a preliminary finding: a failed steel connection at a transfer beam on the third floor. The building is unsafe to occupy until temporary shoring is installed and a full structural review is complete, "a minimum of ten to fourteen days." Residents may collect essential belongings in escorted fifteen-minute windows starting Wednesday.',
        'Kessler-Brandt Construction, statement issued to Channel 7 News at 11:05 a.m., read aloud: "Kessler-Brandt Construction built The Halden to the engineer\'s drawings and passed every city inspection. We are confident in our work."',
        'Larkin & Pell Structural Engineers, statement issued at 11:20 a.m., read aloud: "Our design was sound. We are reviewing whether construction matched the design."',
        'University of Cincinnati, statement issued at 10:50 a.m. within this fictional scenario, read aloud: "The Halden is a privately owned and operated property and is not affiliated with the University. Student Affairs is assisting affected students with information about temporary housing."',
        'Tom Delgado, a maintenance technician who left Tallgrass Student Living in September, has told Priya Natarajan on camera that he flagged "door frames out of square on 3" in August and was told it was "normal settling."',
        '11:30 a.m. Dana Whitlock has arrived. She wants to issue a statement within the hour saying that the contractor is at fault and that "we were as surprised as anyone." She wants your recommendation in writing.',
        'On the team\'s phone: a local hotel group offers 120 rooms at a reduced rate for two weeks, and the case does not specify the nightly rate; UC\'s Campus Recreation Center is open as a daytime warming space; the residents\' group chat is organizing a protest outside the leasing office at 5:00 p.m.',
        'On the record at 11:30: a preliminary finding of a failed steel connection; unsafe to occupy for a minimum of ten to fourteen days; escorted visits for belongings start Wednesday. Not known yet: whether construction matched the design, and the nightly rate for the hotel rooms.'
      ]
    };
  })();

  // Lock-screen notifications buzz when they arrive.
  [one, two, three].forEach(film => {
    const times = [...film.overlay.matchAll(/class="note" data-at="([\d.]+)"/g)].map(m => Number(m[1]));
    times.forEach(at => film.cues.push({ id: 'vibrate', at, gain: 0.55, bus: 'fx' }, { id: 'notify', at: at + 0.05, gain: 0.3, bus: 'fx' }));
  });

  window.TallgrassFilms = { update1: one, update2: two, update3: three };
})();
