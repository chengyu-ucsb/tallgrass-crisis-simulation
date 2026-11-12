'use strict';
/* Original procedural music and abstract scene cues. No recordings or network requests. */
(() => {
  function create() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let context=null, master=null, enabled=false, active=false, destroyed=false;
    let runTicket=0, settingTicket=0, lastBeat=-1, lastScene=-1;
    const voices=new Set();
    const melody=[196,293.66,392,329.63,246.94,293.66,440,392];
    function clean(voice) {
      voice.oscillator.disconnect(); voice.envelope.disconnect(); voices.delete(voice);
    }
    function silence() {
      if (!context) return;
      const now=context.currentTime;
      for (const voice of voices) {
        try {
          voice.envelope.gain.cancelScheduledValues(now);
          voice.envelope.gain.setValueAtTime(voice.envelope.gain.value,now);
          voice.envelope.gain.linearRampToValueAtTime(0,now+.012);
          voice.oscillator.stop(now+.016);
        } catch (_) { clean(voice); }
      }
    }
    function stop() { ++runTicket; active=false; lastBeat=-1; silence(); }
    async function wake() {
      if (!context || destroyed) return false;
      if (context.state==='running') return true;
      let timeout;
      try {
        return await Promise.race([
          context.resume().then(()=>context?.state==='running'),
          new Promise(resolve=>{timeout=setTimeout(()=>resolve(false),2500);})
        ]);
      } catch (_) { return false; } finally { clearTimeout(timeout); }
    }
    async function enable() {
      if (!AudioContextClass || destroyed) return false;
      const ticket=++settingTicket; enabled=true;
      try {
        if (!context) {
          context=new AudioContextClass(); master=context.createGain();
          master.gain.value=.3; master.connect(context.destination);
        }
        const ready=await wake();
        if (destroyed || ticket!==settingTicket || !enabled) return false;
        if (!ready) enabled=false;
        return ready;
      } catch (_) { if(ticket===settingTicket) enabled=false; return false; }
    }
    async function start(sceneIndex) {
      stop();
      if (!enabled || destroyed || !context) return false;
      const ticket=++runTicket, ready=await wake();
      if (destroyed || ticket!==runTicket || !enabled) return false;
      active=ready; lastScene=sceneIndex; lastBeat=-1;
      return ready;
    }
    function tone(frequency,delay,duration,gain,attack=.15) {
      if (!active || !context || context.state!=='running') return;
      const oscillator=context.createOscillator(), envelope=context.createGain();
      const voice={oscillator,envelope}, at=context.currentTime+delay;
      oscillator.type='sine'; oscillator.frequency.value=frequency;
      envelope.gain.setValueAtTime(0,at);
      envelope.gain.linearRampToValueAtTime(gain,at+attack);
      envelope.gain.exponentialRampToValueAtTime(.0001,at+duration);
      oscillator.connect(envelope); envelope.connect(master); voices.add(voice);
      oscillator.onended=()=>clean(voice);
      oscillator.start(at); oscillator.stop(at+duration+.04);
    }
    function cue(kind) {
      if (kind==='message') {
        tone(587.33,0,.7,.075,.025); tone(783.99,.15,.9,.055,.025);
      } else if (kind==='paper') {
        tone(220,0,.35,.055,.02); tone(293.66,.08,.45,.04,.02);
      } else if (kind==='finish') {
        tone(293.66,0,1.4,.04,.25); tone(392,.15,1.5,.035,.25);
      } else { tone(392,0,1.2,.045,.2); }
    }
    function update(position,sceneIndex,cueKind='transition') {
      if (!active || !enabled || destroyed) return;
      if (sceneIndex!==lastScene) { lastScene=sceneIndex; cue(cueKind); }
      const beat=Math.floor(Math.max(0,position)/3);
      if (beat===lastBeat) return;
      lastBeat=beat;
      tone(melody[beat%melody.length],0,3.8,.075,.4);
      if(beat%4===0) tone(98,0,8.5,.035,1);
    }
    function mute() { enabled=false; ++settingTicket; stop(); }
    function destroy() {
      destroyed=true; mute();
      if(context) void context.close().catch(()=>{});
      context=null; master=null;
    }
    return {supported:Boolean(AudioContextClass),get enabled(){return enabled;},get active(){return active;},enable,start,update,stop,mute,destroy};
  }
  window.CrisisSound={create};
})();
