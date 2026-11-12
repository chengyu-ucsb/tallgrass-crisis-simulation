'use strict';

/* Update 1 overview. Facts come from initial-incident, resident-situation,
 * and reporter-email-0752 in content.js. Playback never changes case progress. */
(() => {
  const length = 32;
  const scenes = [
    {start: 0, label: 'Evacuation', title: 'A precautionary evacuation',
      caption: 'All 236 residents are out, and nobody is hurt. The cause is not yet known.'},
    {start: 7, label: 'Residents', title: 'Residents need help now',
      caption: 'Most residents are sheltering in the building next door. Many left essential belongings behind and cannot yet go back in.'},
    {start: 16, label: 'Reporter', title: 'A statement by 9:00 a.m.',
      caption: 'Priya Natarajan at Channel 7 News wants a statement by 9:00 a.m. Tallgrass has said nothing publicly yet.'},
    {start: 24, label: 'Your response', title: 'What will your team say first?',
      caption: 'Read the full update below. Start your situation summary and holding statement on the memo handout.'}
  ];
  const symbol = name => {
    const paths = {
      play: '<path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
      pause: '<path d="M7 5h3v14H7zm7 0h3v14h-3z" fill="currentColor" stroke="none"/>',
      replay: '<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6"/>',
      expand: '<path d="M8 3H3v5m13-5h5v5m0 8v5h-5M3 16v5h5"/>',
      text: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/>',
      arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
  };
  const person = (x, y, scale, shirt, skin, extra = '') =>
    '<g transform="translate(' + x + ' ' + y + ') scale(' + scale + ')"><g class="' + extra + '">' +
    '<ellipse cx="0" cy="75" rx="22" ry="5" fill="#163e3320"/>' +
    '<path d="M-10 40-12 69m22-29 8 29" fill="none" stroke="#25483f" stroke-width="10" stroke-linecap="round"/>' +
    '<path d="M-12 4Q-25 10-27 35M12 4q18 8 16 28" fill="none" stroke="' + shirt + '" stroke-width="9" stroke-linecap="round"/>' +
    '<path d="M-12 2Q0-4 12 2l5 37h-35Z" fill="' + shirt + '"/>' +
    '<rect x="-4" y="-7" width="8" height="12" rx="4" fill="' + skin + '"/>' +
    '<circle cy="-16" r="12" fill="' + skin + '"/><path d="M-12-17q-1-17 13-13 14 1 11 14l-7-7q-10 8-17 6" fill="#24483e"/>' +
    '</g></g>';
  const rain = (x, y, width, height) =>
    '<g transform="translate(' + x + ' ' + y + ')" opacity=".42"><g class="film-rain">' +
    Array.from({length: 24}, (_, n) => {
      const px = (n * 73) % width, py = (n * 47) % height;
      return '<path d="m' + px + ' ' + py + ' -5 16" stroke="#71918b" stroke-width="2" stroke-linecap="round"/>';
    }).join('') + '</g></g>';
  const svg = body => '<svg class="film-art" viewBox="0 0 1000 400" fill="none" aria-hidden="true" focusable="false">' + body + '</svg>';

  function evacuation() {
    const windows = Array.from({length: 20}, (_, n) => {
      const x = 385 + (n % 4) * 48, y = 91 + Math.floor(n / 4) * 39;
      return '<rect x="' + x + '" y="' + y + '" width="28" height="25" rx="2" fill="' + (n % 5 === 0 ? '#c3d2a7' : '#628d7a') + '"/><path d="M' + (x + 14) + ' ' + y + 'v25" stroke="#d2ddbd" stroke-opacity=".35" stroke-width="2"/>';
    }).join('');
    return svg(
      '<defs><linearGradient id="film-sky" x2="0" y2="1"><stop stop-color="#dce7df"/><stop offset="1" stop-color="#edf0df"/></linearGradient></defs>' +
      '<path fill="url(#film-sky)" d="M0 0h1000v400H0z"/><circle cx="165" cy="115" r="155" fill="#e7eddf"/>' +
      '<path d="M0 285h110V140h76v145h49V188h62v97h406V145h60v140h72V112h95v173h70v115H0Z" fill="#c9d9cd"/>' +
      '<path d="M0 345h1000v55H0z" fill="#d2d9c6"/><path d="M0 358h1000M0 387h1000" stroke="#bac9b5"/>' +
      '<g class="film-building"><path d="m342 331 304-1 122 39H455Z" fill="#52796119"/>' +
      '<path d="M350 65h258v280H350z" fill="#eeeacb"/><path d="M608 65h42v280h-42z" fill="#b6c5a5"/>' +
      '<path d="M340 59h317v11H340z" fill="#244d3d"/><path d="M350 303h258v42H350z" fill="#3e6a54"/>' +
      windows + '<rect x="446" y="299" width="64" height="46" rx="2" fill="#b8d2bf"/>' +
      '<path d="M478 299v46" stroke="#477461" stroke-width="3"/><path d="M426 295h105v8H426z" fill="#244d3d"/>' +
      '<rect x="440" y="275" width="76" height="14" rx="3" fill="#315d47"/>' +
      '<path d="M455 281h46" stroke="#dce6bd" stroke-width="2"/>' +
      '<path d="M355 130h247M355 169h247M355 208h247M355 247h247" stroke="#d6dabb" stroke-width="2"/></g>' +
      '<g><path d="M730 253h152v92H730z" fill="#a4bea7"/><path d="M720 245h172v14H720z" fill="#577e64"/>' +
      '<rect x="759" y="268" width="93" height="77" fill="#dce7c8"/><path d="M805 268v77" stroke="#729780" stroke-width="4"/></g>' +
      '<g class="film-walk film-walk-one">' + person(523, 307, .68, '#b97155', '#d5a784') + '</g>' +
      '<g class="film-walk film-walk-two">' + person(582, 301, .72, '#8c9dbe', '#8b5d43') + '</g>' +
      '<g class="film-walk film-walk-three">' + person(667, 310, .65, '#839f62', '#e0b998') + '</g>' +
      '<g transform="translate(277 290)"><path d="M0 51V-17" stroke="#4e7155" stroke-width="4"/><ellipse cy="-21" rx="22" ry="38" fill="#93ad74"/></g>' +
      '<g transform="translate(908 292)"><path d="M0 53V-8" stroke="#4e7155" stroke-width="4"/><ellipse cy="-21" rx="18" ry="34" fill="#a3b988"/></g>'
    );
  }

  function shelter() {
    return svg(
      '<path fill="#e9e8d6" d="M0 0h1000v400H0z"/><path d="M0 312h1000v88H0z" fill="#c9d4ba"/>' +
      '<path d="m0 400 210-88m120 88 63-88m280 88-62-88m389 88-210-88" stroke="#b4c3a5" stroke-width="2"/>' +
      '<rect x="112" y="64" width="340" height="248" rx="8" fill="#5f7d6b"/>' +
      '<rect x="125" y="77" width="314" height="220" rx="3" fill="#d0dfe0"/>' +
      '<path d="M125 258h314V176h-43v-49h-76v93h-41V111h-60v147h-44v-74h-50Z" fill="#a9c3bd"/>' +
      '<defs><clipPath id="film-lobby-rain"><rect x="125" y="77" width="314" height="220"/></clipPath></defs><g clip-path="url(#film-lobby-rain)">' + rain(130, 77, 300, 200) + '</g>' +
      '<path d="M282 77v220M125 207h314" stroke="#6b8b79" stroke-width="10"/>' +
      '<path d="m140 83 120 205h28L168 83Z" fill="#fff" opacity=".16"/>' +
      '<rect x="510" y="123" width="244" height="12" rx="5" fill="#d6d1b8"/>' +
      '<rect x="527" y="63" width="80" height="58" rx="5" fill="#f7f4e8"/>' +
      '<path d="M540 80h54m-54 11h42m-42 11h35" stroke="#9dad91" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="692" cy="91" r="26" fill="#f6f4e5" stroke="#bfccb0" stroke-width="5"/><path d="M692 75v17l11 7" stroke="#57775d" stroke-width="3" stroke-linecap="round"/>' +
      '<g><rect x="492" y="251" width="235" height="42" rx="11" fill="#89a779"/><rect x="480" y="278" width="258" height="21" rx="8" fill="#587b54"/><path d="M501 299v35m218-35v35" stroke="#36583f" stroke-width="9" stroke-linecap="round"/></g>' +
      '<g class="film-waiting"><path d="m541 270 0 27 16 24m29-51 1 26 15 25" stroke="#355449" stroke-width="13" stroke-linecap="round"/><path d="M539 214q20-14 40 0l15 62h-63Z" fill="#b97155"/><circle cx="558" cy="196" r="18" fill="#d5a784"/><path d="M540 196q-1-26 20-24 20 3 15 24l-10-11-12 9Z" fill="#304c40"/><path d="m539 225-17 31 30 4m31-35 17 29-27 5" stroke="#b97155" stroke-width="12" stroke-linecap="round"/></g>' +
      '<g transform="translate(651 215)"><g class="film-phone-check"><path d="m-10 51-9 28 21 23m15-49 9 26 8 22" stroke="#3f5d59" stroke-width="12" stroke-linecap="round"/><path d="M-17-2q17-13 34 0l11 59h-53Z" fill="#8c9dbe"/><circle cy="-23" r="17" fill="#8b5d43"/><path d="M-17-22q-1-25 19-23 22 3 14 25l-8-11-15 10Z" fill="#24483e"/><path d="m-19 11-10 30 30-5m19-26 8 20-18 3" stroke="#8c9dbe" stroke-width="11" stroke-linecap="round"/><rect x="-2" y="23" width="16" height="25" rx="3" transform="rotate(-12)" fill="#2d5043"/><path d="m2 30 7-2" stroke="#d2e6b8" stroke-width="3"/></g></g>' +
      person(439, 224, 1.25, '#839f62', '#e0b998', 'film-standing') +
      '<path d="M815 296h49l-8 40h-33Z" fill="#b88166"/><path d="M840 299V188" stroke="#567654" stroke-width="4"/><path d="M838 254q-59-19-41-51 38 8 43 51m2-33q51-22 59 5-21 27-59 26m-3-40q-28-49 3-60 27 24-3 60" fill="#89a56e"/>'
    );
  }

  function reporter() {
    return svg(
      '<path fill="#dce7db" d="M0 0h1000v400H0z"/><circle cx="867" cy="120" r="144" fill="#ccdccc"/><circle cx="159" cy="322" r="173" fill="#e9ecdc"/>' +
      '<ellipse cx="500" cy="346" rx="360" ry="24" fill="#52796120"/>' +
      '<rect x="221" y="42" width="558" height="291" rx="18" fill="#355949"/><rect x="236" y="57" width="528" height="258" rx="8" fill="#f1f3e8"/>' +
      '<path d="M221 323h558l72 40q7 11-12 14H160q-17-3-10-14Z" fill="#afc5a7"/><path d="M150 364h700q-2 17-25 17H175q-23-1-25-17" fill="#6c8c72"/><path d="M437 332h126l24 22H413Z" fill="#d4e0c9"/>' +
      '<path d="M125 330h51v32h-51z" fill="#b97f60"/><path d="M176 337q26-3 15 16h-15" stroke="#b97f60" stroke-width="7"/>' +
      '<path d="M865 266v77" stroke="#52714f" stroke-width="3"/><path d="M865 310q-40-28-26-46 29 7 26 46m0-16q32-39 48-17-7 26-48 17" fill="#8ca676"/><path d="M841 329h47l-9 37h-29Z" fill="#b6c4a3"/>'
    );
  }

  function memo() {
    return svg(
      '<path fill="#e9e1ce" d="M0 0h1000v400H0z"/><path d="M0 81h1000M0 321h1000" stroke="#dad1bb" stroke-width="3"/>' +
      '<g transform="translate(672 37) rotate(12)"><rect width="165" height="107" rx="7" fill="#9ab29c"/><rect x="8" y="8" width="149" height="91" rx="4" fill="#e6eddd"/><path d="M0 107h165l20 19H-20Z" fill="#c2cfb5"/><path d="M20 29h124m-124 16h92m-92 16h108" stroke="#a3b798" stroke-width="5" stroke-linecap="round"/></g>' +
      '<g class="film-memo-sheet"><path d="m340 41 293-4 20 341H326Z" fill="#375b4720"/><rect x="337" y="29" width="294" height="337" rx="6" fill="#fffdf1"/><rect x="357" y="52" width="254" height="39" rx="5" fill="#e3ebd3"/><path d="M376 71h117" stroke="#42684b" stroke-width="8" stroke-linecap="round"/><path d="M358 109h178" stroke="#c5d1b7" stroke-width="4" stroke-linecap="round"/><path d="M359 139h94m-94 80h108m-108 74h86" stroke="#748e6c" stroke-width="6" stroke-linecap="round"/><path d="M359 162h248m-248 16h248m-248 64h248m-248 16h248m-248 57h248m-248 16h248" stroke="#d8dfcb" stroke-width="2"/><path class="film-written-line" d="M359 178h85" stroke="#355d43" stroke-width="3" stroke-linecap="round" stroke-dasharray="85" stroke-dashoffset="85"/></g>' +
      '<g class="film-pen"><g transform="translate(599 250) rotate(28)"><rect x="-5" y="-85" width="10" height="106" rx="4" fill="#3c6451"/><path d="m-5 21 5 18 5-18" fill="#c4a778"/><path d="m-1 34 1 5 1-5" fill="#244b3b"/><path d="M-5-70h10" stroke="#b9cc91" stroke-width="4"/></g></g>' +
      '<g transform="translate(202 182) rotate(-8)"><rect width="93" height="135" rx="12" fill="#517a69"/><rect x="8" y="12" width="77" height="109" rx="6" fill="#dce7d5"/><circle cx="47" cy="127" r="3" fill="#c5d4b8"/><path d="M22 37h49m-49 15h40m-40 15h45" stroke="#9bb58d" stroke-width="5" stroke-linecap="round"/></g>' +
      '<g transform="translate(741 249)"><circle r="44" fill="#c1ceb0"/><circle r="32" fill="#fff9e8"/><circle r="23" fill="#8c6649"/><path d="M30-12q34-2 21 21L34 16" stroke="#fff9e8" stroke-width="10" fill="none"/></g>' +
      '<path d="M0 355h185q31-36 67-31l35 9q16 12-1 22l-49-1q-29 43-61 46H0Z" fill="#d0a17e"/><path d="M0 339h133l-14 61H0Z" fill="#839f62"/>' +
      '<path d="M1000 348H849q-32-28-56-18l-29 15q-8 15 10 20l39-6q20 31 54 41h133Z" fill="#8b5d43"/><path d="M1000 335H903l14 65h83Z" fill="#8c9dbe"/>'
    );
  }

  function markup(stageId) {
    if (stageId !== 'update1') return '';
    return '<section class="case-film" aria-labelledby="film-title" data-case-film>' +
      '<header class="film-header"><div><h2 id="film-title">Watch Update 1</h2><p>Illustrated overview <span aria-hidden="true">·</span> 32 seconds <span aria-hidden="true">·</span> No audio</p></div><button type="button" class="film-expand" data-film-expand aria-label="Expand animation">' + symbol('expand') + '<span>Expand</span></button></header>' +
      '<div class="film-screen" aria-hidden="true">' +
        '<div class="film-scene" data-film-scene="0">' + evacuation() + '<span class="film-place">The Halden <span>6:40 a.m.</span></span><div class="film-fact"><strong>236</strong><span>residents evacuated</span></div><span class="film-uncertain">Cause not yet known</span></div>' +
        '<div class="film-scene" data-film-scene="1" hidden>' + shelter() + '<span class="film-place">The lobby next door</span><span class="film-weather"><strong>38°F</strong> and raining</span></div>' +
        '<div class="film-scene" data-film-scene="2" hidden>' + reporter() + '<div class="film-email"><div class="film-email-top"><span>INBOX</span><span>Received 7:52 a.m.</span></div><p class="film-email-from"><strong>Priya Natarajan</strong><span>Channel 7 News</span></p><h3>Request for comment</h3><p class="film-email-questions">What caused the evacuation?<br>When can residents return?<br>What is Tallgrass doing for students?</p><span class="film-email-deadline">Statement requested by <strong>9:00 a.m.</strong></span></div></div>' +
        '<div class="film-scene" data-film-scene="3" hidden>' + memo() + '<span class="film-place">Your team’s memo handout</span><span class="film-paper-label">Write on your handout</span></div>' +
      '</div>' +
      '<div class="film-caption" aria-live="polite" aria-atomic="true"><span class="film-caption-number" aria-hidden="true" data-film-number>1 / 4</span><div><h3 data-film-heading>' + scenes[0].title + '</h3><p data-film-caption>' + scenes[0].caption + '</p></div></div>' +
      '<div class="film-controls"><div class="film-seek"><input type="range" min="0" max="32" step="0.1" value="0" aria-label="Animation position" aria-valuetext="0 seconds of 32" data-film-seek><span class="film-time" aria-live="off"><span data-film-time>0:00</span> / 0:32</span></div><div class="film-buttons"><button type="button" class="film-play" data-film-play>' + symbol('play') + '<span>Play overview</span></button><button type="button" class="film-replay" data-film-replay>' + symbol('replay') + '<span>Replay</span></button><button type="button" class="film-read" data-read-update>' + symbol('text') + '<span>Read the full update</span>' + symbol('arrow') + '</button></div></div>' +
      '<nav class="film-chapters" aria-label="Animation scenes">' + scenes.map((scene, n) => '<button type="button" data-film-chapter="' + n + '" aria-label="Show scene ' + (n + 1) + ': ' + scene.label + '"' + (n === 0 ? ' aria-current="step"' : '') + '><span class="film-chapter-dot" aria-hidden="true"></span>' + scene.label + '</button>').join('') + '</nav>' +
      '<div class="film-foot"><p>Watch the overview, then use the documents below for the full details.</p><details class="film-transcript"><summary>Read the animation text</summary><ol>' + scenes.map(scene => '<li><strong>' + scene.title + '</strong><p>' + scene.caption + '</p></li>').join('') + '</ol></details></div>' +
      '<p class="screen-reader-only" role="status" data-film-status>Animation ready. Playback has no audio.</p></section>';
  }

  function mount(container) {
    const root = container.querySelector('[data-case-film]');
    if (!root) return null;
    const panels = [...root.querySelectorAll('[data-film-scene]')];
    const chapters = [...root.querySelectorAll('[data-film-chapter]')];
    const playButton = root.querySelector('[data-film-play]');
    const seekInput = root.querySelector('[data-film-seek]');
    const clock = root.querySelector('[data-film-time]');
    const status = root.querySelector('[data-film-status]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let position = 0, sceneIndex = -1, playing = false, request = 0, lastFrame = 0, effects = [], destroyed = false;

    function collectEffects() {
      effects = motion.matches || !panels[sceneIndex]?.getAnimations ? [] : panels[sceneIndex].getAnimations({subtree: true});
      effects.forEach(effect => effect.pause());
    }

    function paint() {
      let nextScene = 0;
      scenes.forEach((scene, n) => { if (position >= scene.start) nextScene = n; });
      if (nextScene !== sceneIndex) {
        sceneIndex = nextScene;
        panels.forEach((panel, n) => { panel.hidden = n !== sceneIndex; });
        chapters.forEach((chapter, n) => {
          if (n === sceneIndex) chapter.setAttribute('aria-current', 'step');
          else chapter.removeAttribute('aria-current');
        });
        root.querySelector('[data-film-number]').textContent = (sceneIndex + 1) + ' / ' + scenes.length;
        root.querySelector('[data-film-heading]').textContent = scenes[sceneIndex].title;
        root.querySelector('[data-film-caption]').textContent = scenes[sceneIndex].caption;
        collectEffects();
      }
      const sceneTime = Math.max(0, (position - scenes[sceneIndex].start) * 1000);
      effects.forEach(effect => { effect.currentTime = sceneTime; });
      seekInput.value = String(position);
      seekInput.style.setProperty('--film-fill', (position / length * 100) + '%');
      const seconds = Math.floor(position);
      clock.textContent = '0:' + String(seconds).padStart(2, '0');
      seekInput.setAttribute('aria-valuetext', seconds + ' seconds of ' + length + ', ' + scenes[sceneIndex].label);
      root.classList.toggle('is-ended', position >= length);
    }

    function buttonState() {
      const label = playing ? 'Pause' : position >= length ? 'Play again' : position > 0 ? 'Resume' : 'Play overview';
      playButton.innerHTML = symbol(playing ? 'pause' : 'play') + '<span>' + label + '</span>';
      root.classList.toggle('is-playing', playing);
    }

    function pause(announce = true) {
      if (!playing) return;
      playing = false;
      cancelAnimationFrame(request);
      request = 0;
      lastFrame = 0;
      buttonState();
      if (announce) status.textContent = 'Animation paused.';
    }

    function tick(now) {
      if (destroyed || !playing) return;
      if (lastFrame) position = Math.min(length, position + (now - lastFrame) / 1000);
      lastFrame = now;
      paint();
      if (position >= length) {
        pause(false);
        status.textContent = 'Overview complete. The full written evidence is below.';
      } else request = requestAnimationFrame(tick);
    }

    function play() {
      if (destroyed || playing) return;
      if (position >= length) position = 0;
      playing = true;
      lastFrame = 0;
      paint();
      buttonState();
      status.textContent = 'Animation playing. Use Pause to stop or choose a scene.';
      request = requestAnimationFrame(tick);
    }

    function seek(value) {
      pause(false);
      position = Math.max(0, Math.min(length, Number(value) || 0));
      paint();
      buttonState();
      status.textContent = scenes[sceneIndex].label + '. Animation paused.';
    }

    async function click(event) {
      const button = event.target.closest('button');
      if (!button || !root.contains(button)) return;
      if (button.hasAttribute('data-film-play')) {
        if (playing) pause(); else play();
      } else if (button.hasAttribute('data-film-replay')) {
        pause(false); position = 0; play();
      } else if (button.hasAttribute('data-film-chapter')) {
        seek(scenes[Number(button.dataset.filmChapter)].start);
      } else if (button.hasAttribute('data-film-expand')) {
        try {
          if (document.fullscreenElement === root) await document.exitFullscreen();
          else if (root.requestFullscreen) await root.requestFullscreen();
          else status.textContent = 'Full screen is unavailable here. You can watch the overview in the page.';
        } catch (_) { status.textContent = 'Full screen is unavailable here. You can watch the overview in the page.'; }
      }
    }

    const input = () => seek(seekInput.value);
    const hidden = () => { if (document.hidden) pause(false); };
    const read = event => {
      if (event.target.closest('[data-read-update], [data-artifact], [data-reference]')) pause(false);
    };
    const changedMotion = () => { pause(false); collectEffects(); paint(); };
    const fullScreenChanged = () => {
      const expanded = document.fullscreenElement === root, button = root.querySelector('[data-film-expand]');
      button.setAttribute('aria-label', expanded ? 'Exit animation full screen' : 'Expand animation');
      button.querySelector('span').textContent = expanded ? 'Exit' : 'Expand';
    };
    root.addEventListener('click', click);
    seekInput.addEventListener('input', input);
    document.addEventListener('click', read);
    document.addEventListener('visibilitychange', hidden);
    document.addEventListener('fullscreenchange', fullScreenChanged);
    motion.addEventListener('change', changedMotion);
    paint();
    buttonState();

    return {pause, destroy() {
      pause(false); destroyed = true;
      root.removeEventListener('click', click);
      seekInput.removeEventListener('input', input);
      document.removeEventListener('click', read);
      document.removeEventListener('visibilitychange', hidden);
      document.removeEventListener('fullscreenchange', fullScreenChanged);
      motion.removeEventListener('change', changedMotion);
      effects.forEach(effect => effect.cancel());
    }};
  }
  window.CrisisAnimation = {markup, mount};
})();
