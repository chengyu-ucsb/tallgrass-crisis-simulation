'use strict';

/* Illustrated case overviews. The narration clock drives every visual pose; playback never changes case progress. */
(() => {
  const symbol = name => {
    const paths = {
      narrator: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v3m-4 0h8"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      sound: '<path d="M3 9h4l5-4v14l-5-4H3zM16 8q4 4 0 8m3-11q7 7 0 14"/>',
      muted: '<path d="M3 9h4l5-4v14l-5-4H3zM16 9l5 6m0-6-5 6"/>',
      play: '<path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
      pause: '<path d="M7 5h3v14H7zm7 0h3v14h-3z" fill="currentColor" stroke="none"/>',
      replay: '<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6"/>',
      expand: '<path d="M8 3H3v5m13-5h5v5m0 8v5h-5M3 16v5h5"/>',
      text: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/>',
      arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
  };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const timecode = value => Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2,'0');
  function filmFor(stageId) {
    const film = window.CrisisFilms?.[stageId];
    if (!film) return null;
    const track = window.CrisisNarrationTracks?.[stageId];
    const recorded = track?.scenes?.length === film.scenes.length &&
      film.scenes.every((scene, n) => track.scenes[n].label === scene.label);
    let length = 0;
    const scenes = film.scenes.map((scene, n) => {
      const spoken = recorded ? track.scenes[n] : null;
      const seconds = spoken?.seconds || scene.seconds;
      const next = {...scene, story:window.CrisisStory?.[stageId]?.[n], seconds, start:length, cue:spoken?.cue || scene.cue, narration:spoken?.text || '', speechStart:spoken?.speechStart ?? 1.7, speechSeconds:spoken?.speechSeconds || 0};
      length += seconds;
      return next;
    });
    return {...film, scenes, length, narrationSrc:recorded ? track.src : ''};
  }
  function visualDetails(scene) {
    return [
      scene.place ? scene.place + (scene.time ? ' · ' + scene.time : '') : '',
      scene.badge || '',
      scene.stat ? scene.stat.value + ' ' + scene.stat.label : '',
      ...(scene.card ? [scene.card.eyebrow, scene.card.heading, ...scene.card.rows.map(row => row[0] + ': ' + row[1])] : []),
      ...(scene.stats || []).map(row => row[0] + ' ' + row[1])
    ].filter(Boolean);
  }
  function sceneMarkup(scene, n, stageId) {
    const story=scene.story || {context:scene.card?.eyebrow || scene.badge || scene.label, beats:[{at:0,heading:scene.title,detail:scene.caption}]};
    const illustration=window.CrisisArtwork?.render(scene,{stageId,index:n}) || '';
    return '<div class="film-scene cinema-scene" data-film-scene="'+n+'"'+(n?' hidden':'')+'>'+
      '<div class="cinema-art-stage">'+illustration+'</div>'+
      '<div class="cinema-evidence">'+
      '<p class="cinema-scene-kind">'+escape(scene.label)+'</p>'+
      '<p class="cinema-context">'+escape(story.context)+'</p>'+
      '<div class="cinema-beats">'+story.beats.map((beat,i)=>
        '<section data-film-beat="'+i+'"'+(i?' hidden':'')+'><h3 class="cinema-beat-heading">'+escape(beat.heading)+'</h3>'+
        '<p class="cinema-beat-detail">'+escape(beat.detail || '')+'</p></section>').join('')+'</div>'+
      '<div class="cinema-beat-progress">'+story.beats.map((_,i)=>'<i data-film-beat-progress="'+i+'"></i>').join('')+'</div>'+
      '</div></div>';
  }
  function markup(stageId) {
    const film=filmFor(stageId);
    if (!film) return '';
    const {scenes,length}=film;
    const duration=Math.floor(length/60)+' min '+(length%60)+' sec';
    return '<section class="case-film" aria-labelledby="film-title" data-case-film data-film-stage="'+escape(stageId)+'">' +
      '<header class="film-header"><div><h2 id="film-title">Watch '+escape(film.label)+'</h2><p>Illustrated overview <span aria-hidden="true">·</span> '+duration+' <span aria-hidden="true">·</span> Narration &amp; sound effects</p></div><button type="button" class="film-expand" data-film-expand aria-label="Expand animation">'+symbol('expand')+'<span>Expand</span></button></header>'+
      '<div class="film-screen cinema-screen" aria-hidden="true">'+scenes.map((scene,n)=>sceneMarkup(scene,n,stageId)).join('')+'</div>'+
      '<div class="film-caption" aria-live="polite" aria-atomic="true"><span class="film-caption-number" aria-hidden="true" data-film-number>1 / '+scenes.length+'</span><div><h3 data-film-heading>'+escape(scenes[0].title)+'</h3><p data-film-caption>'+escape(scenes[0].caption)+'</p></div></div>'+
      '<div class="film-controls"><div class="film-seek"><input type="range" min="0" max="'+length+'" step="0.1" value="0" aria-label="Animation position" aria-valuetext="0 seconds of '+length+'" data-film-seek><span class="film-time" aria-live="off"><span data-film-time>0:00</span> / '+timecode(length)+'</span></div>'+
      '<div class="film-buttons"><div class="film-transport"><button type="button" class="film-play" data-film-play>'+symbol('play')+'<span>Play overview</span></button><button type="button" class="film-replay" data-film-replay>'+symbol('replay')+'<span>Replay</span></button></div>'+
      '<div class="film-audio-options" role="group" aria-label="Audio options"><button type="button" class="film-narration" data-film-narration aria-pressed="true" title="Turn off the narrator">'+symbol('narrator')+'<span>Narration on</span></button><button type="button" class="film-sound" data-film-sound aria-pressed="true" title="Turn off scene sound effects">'+symbol('sound')+'<span>Effects on</span></button></div>'+
      '<button type="button" class="film-read" data-read-update>'+symbol('text')+'<span>Read the full update</span>'+symbol('arrow')+'</button></div>'+
      '<p class="film-audio-notice" role="status" data-film-notice hidden></p></div>'+
      '<nav class="film-chapters" aria-label="Animation scenes">'+scenes.map((scene,n)=>'<button type="button" data-film-chapter="'+n+'" aria-label="Show scene '+(n+1)+': '+escape(scene.label)+'"'+(n===0?' aria-current="step"':'')+'><span class="film-chapter-dot" aria-hidden="true"></span>'+escape(scene.label)+'</button>').join('')+'</nav>'+
      '<div class="film-mobile-scenes"><label for="film-scene-select">Scene</label><select id="film-scene-select" aria-label="Choose animation scene" data-film-select>'+scenes.map((scene,n)=>'<option value="'+n+'">'+escape(scene.label)+'</option>').join('')+'</select></div>'+
      '<div class="film-foot"><p>AI narration and dramatized sound effects. You can turn either off. Read the documents below for the full update. <a href="audio-credits.html" target="_blank" rel="noopener">Sound credits</a>.</p><details class="film-transcript"><summary>Read the animation text</summary><ol>'+scenes.map(scene=>'<li><strong>'+escape(scene.title)+'</strong><p>'+escape(scene.narration || scene.caption)+'</p>'+(scene.narration?'':'<ul class="film-transcript-details">'+visualDetails(scene).map(detail=>'<li>'+escape(detail)+'</li>').join('')+'</ul>')+'</li>').join('')+'</ol></details></div>'+
      (film.narrationSrc?'<audio data-film-audio preload="metadata" src="'+escape(film.narrationSrc)+'" aria-label="Recorded narration" hidden></audio>':'')+
      '<p class="screen-reader-only" role="status" data-film-status>Animation ready. Press Play to start. Narration and sound effects can be turned off separately.</p></section>';
  }
  function mount(container) {
    const root = container.querySelector('[data-case-film]');
    if (!root) return null;
    const film = filmFor(root.dataset.filmStage);
    if (!film) return null;
    const {scenes, length} = film;
    const panels = [...root.querySelectorAll('[data-film-scene]')];
    const chapters = [...root.querySelectorAll('[data-film-chapter]')];
    const playButton = root.querySelector('[data-film-play]');
    const seekInput = root.querySelector('[data-film-seek]');
    const selectInput = root.querySelector('[data-film-select]');
    const soundButton = root.querySelector('[data-film-sound]');
    const narratorButton = root.querySelector('[data-film-narration]');
    const audio = root.querySelector('[data-film-audio]');
    const effectsData = window.CrisisEffects;
    const sound = effectsData && window.CrisisSound?.create({clips:effectsData.clips, events:effectsData.tracks[root.dataset.filmStage] || [], scenes});
    const replayButton = root.querySelector('[data-film-replay]');
    const clock = root.querySelector('[data-film-time]');
    const status = root.querySelector('[data-film-status]');
    const notice = root.querySelector('[data-film-notice]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const director=window.CrisisMotion?.create({panels,scenes,stageId:root.dataset.filmStage});
    const artStages=panels.map(panel=>panel.querySelector('.cinema-art-stage'));
    const expandButton = root.querySelector('[data-film-expand]');
    const home = document.createComment('Illustrated overview position');
    const expandedDialog = document.createElement('dialog');
    expandedDialog.className = 'film-expanded-dialog';
    expandedDialog.setAttribute('aria-label', film.label + ' animated overview');
    root.after(home);
    document.body.append(expandedDialog);

    let position=0, sceneIndex=-1, playing=false, starting=false, request=0, lastFrame=0;
    let destroyed=false, playTicket=0, soundTicket=0, loadTimer=0, buffering=false, outgoingIndex=-1;
    let effectsOn=Boolean(sound?.supported), narratorOn=Boolean(audio), pendingAudioSeek=null;
    let effectsLoading=Boolean(sound?.supported&&!sound?.ready), preparationTicket=0;

    function showNotice(message='') {
      notice.hidden=!message;
      notice.textContent=message;
    }
    function seekAudio(value) {
      if (!audio) return;
      pendingAudioSeek=value;
      try {
        audio.currentTime=value;
        if(audio.readyState>0) pendingAudioSeek=null;
      } catch (_) {}
    }
    function restoreView() {
      if (root.parentElement === expandedDialog) home.before(root);
      root.classList.remove('is-expanded');
      expandButton.setAttribute('aria-label', 'Expand animation');
      expandButton.innerHTML = symbol('expand') + '<span>Expand</span>';
      if (!destroyed) {
        paint();
        expandButton.focus({preventScroll:true});
        status.textContent='Animation returned to the page.';
      }
    }
    function expandView() {
      if(expandedDialog.open) { expandedDialog.close(); return; }
      expandedDialog.append(root);
      root.classList.add('is-expanded');
      expandButton.setAttribute('aria-label','Close expanded animation');
      expandButton.innerHTML=symbol('close')+'<span>Close</span>';
      expandedDialog.showModal();
      paint();
      expandButton.focus({preventScroll:true});
      status.textContent='Animation expanded. Use Close or press Escape to return to the page.';
    }
    function paint() {
      let nextScene=0;
      scenes.forEach((scene,n)=>{if(position>=scene.start) nextScene=n;});
      if(nextScene!==sceneIndex) {
        outgoingIndex=playing && !motion.matches && sceneIndex===nextScene-1 ? sceneIndex : -1;
        sceneIndex=nextScene;
        chapters.forEach((chapter,n)=>{
          if(n===sceneIndex) chapter.setAttribute('aria-current','step');
          else chapter.removeAttribute('aria-current');
        });
        root.querySelector('[data-film-number]').textContent=(sceneIndex+1)+' / '+scenes.length;
        root.querySelector('[data-film-heading]').textContent=scenes[sceneIndex].title;
        root.querySelector('[data-film-caption]').textContent=scenes[sceneIndex].caption;
        selectInput.value=String(sceneIndex);
      }
      const sceneTime=Math.max(0,position-scenes[sceneIndex].start);
      // Only artwork overlaps. Current-source labels and full captions stay unambiguous.
      if(sceneTime>=.6 || motion.matches) outgoingIndex=-1;
      const fade=outgoingIndex<0 ? 1 : Math.min(1,sceneTime/.6);
      const blend=fade*fade*(3-2*fade);
      panels.forEach((panel,n)=>{
        panel.hidden=n!==sceneIndex && n!==outgoingIndex;
        panel.classList.toggle('is-outgoing',n===outgoingIndex);
        if(artStages[n]) artStages[n].style.opacity=String(n===outgoingIndex ? 1-blend : n===sceneIndex ? blend : 1);
      });
      if(outgoingIndex>=0) director?.render({sceneIndex:outgoingIndex,sceneTime:scenes[outgoingIndex].seconds,reducedMotion:motion.matches});
      director?.render({sceneIndex,sceneTime,reducedMotion:motion.matches});
      seekInput.value=String(position);
      seekInput.style.setProperty('--film-fill',(position/length*100)+'%');
      const seconds=Math.floor(position);
      clock.textContent=timecode(seconds);
      seekInput.setAttribute('aria-valuetext',seconds+' seconds of '+length+', '+scenes[sceneIndex].label);
      root.classList.toggle('is-ended',position>=length);
      sound?.update(position,sceneIndex,scenes[sceneIndex].cue,sceneTime,narratorOn);
    }
    function buttonState() {
      const loadingEffects=effectsOn&&effectsLoading&&!playing&&!starting;
      const label=loadingEffects?'Loading effects…':starting?'Cancel loading':playing?'Pause':position>=length?'Play again':position>0?'Resume':'Play overview';
      playButton.disabled=loadingEffects;
      replayButton.disabled=effectsOn&&effectsLoading;
      playButton.innerHTML=symbol(playing||starting?'pause':'play')+'<span>'+label+'</span>';
      root.classList.toggle('is-playing',playing);
      root.classList.toggle('is-loading-audio',starting);
      root.querySelector('.film-caption').setAttribute('aria-live',playing&&narratorOn?'off':'polite');
    }
    function audioButtonState() {
      soundButton.disabled=!sound?.supported;
      soundButton.setAttribute('aria-pressed',String(effectsOn));
      soundButton.innerHTML=symbol(effectsOn?'sound':'muted')+'<span>'+(!sound?.supported?'Effects unavailable':effectsOn?'Effects on':'Effects off')+'</span>';
      soundButton.title=effectsOn?'Turn off scene sound effects':'Turn on scene sound effects';
      narratorButton.disabled=!audio;
      narratorButton.setAttribute('aria-pressed',String(narratorOn));
      narratorButton.innerHTML=symbol('narrator')+'<span>'+(!audio?'Narration unavailable':narratorOn?'Narration on':'Narration off')+'</span>';
      narratorButton.title=narratorOn?'Turn off the narrator':'Turn on the narrator';
    }
    async function prepareEffects(retry=false) {
      if(!sound?.supported) return false;
      const ticket=++preparationTicket;
      effectsLoading=true; buttonState();
      const ready=await sound.prepare({retry});
      if(destroyed||ticket!==preparationTicket) return false;
      effectsLoading=false;
      if(ready&&notice.textContent.startsWith('Sound effects')) showNotice();
      if(!ready&&effectsOn) {
        effectsOn=false; sound.mute();
        showNotice('Sound effects could not load. Narration is ready to use. Turn Effects on to retry.');
      }
      buttonState(); audioButtonState();
      return ready;
    }
    function pause(announce=true) {
      const wasActive=playing||starting;
      ++playTicket; ++soundTicket;
      playing=false; starting=false; buffering=false;
      clearTimeout(loadTimer); loadTimer=0;
      cancelAnimationFrame(request); request=0; lastFrame=0;
      sound?.stop();
      if(audio) audio.pause();
      buttonState();
      if(announce && wasActive) status.textContent='Animation paused.';
    }
    function finish() {
      position=length; paint(); pause(false);
      status.textContent='Overview complete. Read the written evidence and write on your memo handout.';
    }
    function tick(now) {
      if(destroyed||!playing) return;
      if(narratorOn&&audio) {
        if(pendingAudioSeek===null && !audio.seeking) position=Math.min(length,audio.currentTime);
      } else if(lastFrame) position=Math.min(length,position+(now-lastFrame)/1000);
      lastFrame=now;
      paint();
      if(position>=length) finish();
      else request=requestAnimationFrame(tick);
    }
    function effectsCanPlay() {
      return !destroyed && effectsOn && playing && (!narratorOn || !audio ||
        (!buffering && !audio.paused && !audio.seeking && audio.readyState>=3));
    }
    async function startEffects() {
      const ticket=++soundTicket;
      if(!sound?.supported||!effectsCanPlay()) return;
      const ready=await sound.enable();
      if(ticket!==soundTicket||!effectsCanPlay()) return;
      const started=ready && await sound.start(sceneIndex,position);
      if(ticket!==soundTicket||!effectsCanPlay()) {
        if(ticket===soundTicket) sound.stop();
        return;
      }
      if(!started) {
        effectsOn=false; sound.mute(); audioButtonState();
        showNotice('Sound effects could not start. You can turn Effects on to try again.');
      } else {
        if(notice.textContent.startsWith('Sound effects')) showNotice();
        paint();
      }
    }
    function play() {
      if(destroyed||playing||starting||(effectsOn&&effectsLoading)) return;
      if(position>=length) position=0;
      const ticket=++playTicket;
      showNotice();
      paint();
      // Request both audio systems from the same user gesture.
      if(effectsOn&&sound?.supported) void sound.enable();
      if(narratorOn&&audio) {
        starting=true;
        if(audio.error) audio.load();
        seekAudio(position);
        buttonState();
        status.textContent='Loading narration.';
        const attempt=audio.play();
        loadTimer=setTimeout(()=>{
          if(destroyed||ticket!==playTicket||!starting) return;
          pause(false);
          showNotice('Narration is taking longer to load. Try Play again, or turn narration off to watch without it.');
        },15000);
        Promise.resolve(attempt).then(()=>{
          if(destroyed||ticket!==playTicket) return;
          clearTimeout(loadTimer); loadTimer=0;
          starting=false; playing=true; lastFrame=0;
          showNotice(); buttonState();
          status.textContent='Animation playing.';
          request=requestAnimationFrame(tick);
          if(effectsOn) void startEffects();
        }).catch(()=>{
          if(destroyed||ticket!==playTicket) return;
          pause(false);
          showNotice('Narration could not start. Try Play again, or turn narration off to watch without it.');
        });
      } else {
        playing=true; lastFrame=0; buttonState();
        status.textContent='Animation playing.';
        request=requestAnimationFrame(tick);
        if(effectsOn) void startEffects();
      }
    }
    function seek(value) {
      pause(false); showNotice(); outgoingIndex=-1;
      position=Math.max(0,Math.min(length,Number(value)||0));
      seekAudio(position); paint(); buttonState();
      status.textContent=scenes[sceneIndex].label+'. Animation paused.';
    }
    function toggleEffects() {
      if(!sound?.supported) return;
      effectsOn=!effectsOn; ++soundTicket;
      if(!effectsOn) sound.mute();
      else if(!sound.ready) {
        // Unlock from this click; preparation itself never starts playback.
        void sound.enable();
        void prepareEffects(true).then(ready=>{
          if(ready&&!destroyed&&effectsOn&&playing) void startEffects();
        });
      } else if(playing) void startEffects();
      audioButtonState(); buttonState();
      status.textContent=effectsOn?'Scene sound effects on.':'Scene sound effects off.';
    }
    function toggleNarrator() {
      if(!audio) return;
      const continuePlaying=playing||starting;
      pause(false); showNotice();
      narratorOn=!narratorOn;
      audioButtonState();
      if(continuePlaying) play();
      else status.textContent=narratorOn?'Narration on. Press Play to listen.':'Narration off.';
    }
    function click(event) {
      const button=event.target.closest('button');
      if(!button||!root.contains(button)) return;
      if(button.hasAttribute('data-film-play')) {
        if(playing||starting) pause(); else play();
      } else if(button.hasAttribute('data-film-replay')) {
        pause(false); outgoingIndex=-1; position=0; seekAudio(0); play();
      } else if(button.hasAttribute('data-film-chapter')) {
        seek(scenes[Number(button.dataset.filmChapter)].start);
      } else if(button.hasAttribute('data-film-sound')) toggleEffects();
      else if(button.hasAttribute('data-film-narration')) toggleNarrator();
      else if(button.hasAttribute('data-film-expand')) expandView();
    }
    const input=()=>seek(seekInput.value);
    const select=()=>seek(scenes[Number(selectInput.value)].start);
    const hidden=()=>{if(document.hidden) pause(false);};
    const read=event=>{
      if(event.target.closest('[data-read-update], [data-artifact], [data-reference]')) pause(false);
    };
    const changedMotion=()=>{pause(false); paint();};
    const metadata=()=>{
      if(pendingAudioSeek!==null) seekAudio(pendingAudioSeek);
    };
    const audioEnded=()=>{if(audio.ended&&narratorOn&&(playing||starting)) finish();};
    const audioPaused=()=>{if(audio.paused&&narratorOn&&playing&&!audio.ended) pause(false);};
    const audioWaiting=()=>{
      if(narratorOn&&playing&&!audio.paused&&audio.readyState<3) {
        buffering=true; ++soundTicket; sound?.stop();
        showNotice('Loading the next part of the narration…');
        clearTimeout(loadTimer);
        const ticket=playTicket;
        loadTimer=setTimeout(()=>{
          if(destroyed||ticket!==playTicket||!playing||!buffering) return;
          pause(false);
          showNotice('Narration stopped loading. Try Play again, or turn narration off to continue without it.');
        },15000);
      }
    };
    const audioPlaying=()=>{
      if(narratorOn&&playing&&!audio.paused&&!audio.seeking&&audio.readyState>=3) {
        buffering=false; clearTimeout(loadTimer); loadTimer=0;
        showNotice();
        if(effectsOn&&!sound?.active) void startEffects();
      }
    };
    const audioError=()=>{
      if(narratorOn&&(playing||starting)) {
        pause(false);
        showNotice('Narration could not load. Try Play again, or turn narration off to watch without it.');
      }
    };
    root.addEventListener('click',click);
    seekInput.addEventListener('input',input);
    selectInput.addEventListener('change',select);
    document.addEventListener('click',read);
    document.addEventListener('visibilitychange',hidden);
    expandedDialog.addEventListener('close',restoreView);
    motion.addEventListener('change',changedMotion);
    if(audio) {
      audio.volume=.95;
      audio.addEventListener('loadedmetadata',metadata);
      audio.addEventListener('ended',audioEnded);
      audio.addEventListener('pause',audioPaused);
      audio.addEventListener('waiting',audioWaiting);
      audio.addEventListener('playing',audioPlaying);
      audio.addEventListener('error',audioError);
    }
    paint(); buttonState(); audioButtonState();
    if(effectsLoading) void prepareEffects();
    return {pause,destroy() {
      pause(false); destroyed=true; ++preparationTicket; sound?.destroy(); director?.destroy();
      root.removeEventListener('click',click);
      seekInput.removeEventListener('input',input);
      selectInput.removeEventListener('change',select);
      document.removeEventListener('click',read);
      document.removeEventListener('visibilitychange',hidden);
      expandedDialog.removeEventListener('close',restoreView);
      if(expandedDialog.open) expandedDialog.close();
      restoreView(); expandedDialog.remove(); home.remove();
      motion.removeEventListener('change',changedMotion);
      if(audio) {
        audio.removeEventListener('loadedmetadata',metadata);
        audio.removeEventListener('ended',audioEnded);
        audio.removeEventListener('pause',audioPaused);
        audio.removeEventListener('waiting',audioWaiting);
        audio.removeEventListener('playing',audioPlaying);
        audio.removeEventListener('error',audioError);
        audio.removeAttribute('src'); audio.load();
      }
    }};
  }
  window.CrisisAnimation = {markup, mount};
})();
