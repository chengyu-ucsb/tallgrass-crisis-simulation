'use strict';
/* Short original sound effects. No music, recordings, network calls, or looping tracks. */
(() => {
  function create() {
    const AC=window.AudioContext||window.webkitAudioContext;
    let context=null,master=null,noiseBuffer=null;
    let enabled=false,active=false,destroyed=false;
    let runTicket=0,settingTicket=0,lastScene=-1,lastPosition=-1;
    const voices=new Set();
    function clean(v) {
      if(!voices.delete(v)) return;
      v.source.onended=null;
      v.nodes.forEach(node=>{try{node.disconnect();}catch(_){}});
    }
    function silence() {
      if(!context) return;
      const now=context.currentTime;
      for(const v of [...voices]) {
        try{
          v.gate.gain.cancelScheduledValues(now);
          v.gate.gain.setValueAtTime(v.gate.gain.value,now);
          v.gate.gain.linearRampToValueAtTime(0,now+.018);
          v.source.stop(now+.022);
        }catch(_){clean(v);}
      }
    }
    function stop(){++runTicket;active=false;silence();}
    async function wake(){
      if(!context||destroyed||context.state==='closed') return false;
      if(context.state==='running') return true;
      let timer;
      try{
        return await Promise.race([
          context.resume().then(()=>context?.state==='running'),
          new Promise(resolve=>{timer=setTimeout(()=>resolve(false),2500);})
        ]);
      }catch(_){return false;}finally{clearTimeout(timer);}
    }
    async function enable(){
      if(!AC||destroyed) return false;
      const ticket=++settingTicket;enabled=true;
      try{
        if(!context){
          context=new AC();master=context.createGain();master.gain.value=.4;master.connect(context.destination);
          noiseBuffer=context.createBuffer(1,Math.ceil(context.sampleRate*4),context.sampleRate);
          const data=noiseBuffer.getChannelData(0);
          for(let n=0;n<data.length;n++) data[n]=Math.random()*2-1;
        }
        const ready=await wake();
        if(destroyed||ticket!==settingTicket||!enabled) return false;
        if(!ready) enabled=false;
        return ready;
      }catch(_){if(ticket===settingTicket)enabled=false;return false;}
    }
    async function start(_sceneIndex){
      stop();
      if(!enabled||destroyed||!context)return false;
      const ticket=++runTicket,ready=await wake();
      if(destroyed||ticket!==runTicket||!enabled)return false;
      active=ready;return ready;
    }
    function attach(source,filter,delay,duration,level,attack=.008,hold=false){
      if(!active||!enabled||destroyed||context?.state!=='running')return null;
      const at=context.currentTime+delay,envelope=context.createGain(),gate=context.createGain();
      gate.gain.value=1;
      const peak=Math.min(attack,duration*.3);
      envelope.gain.setValueAtTime(0,at);
      envelope.gain.linearRampToValueAtTime(level,at+peak);
      if(hold){
        envelope.gain.setValueAtTime(level,at+Math.max(peak,duration-Math.min(.18,duration*.25)));
        envelope.gain.linearRampToValueAtTime(0,at+duration);
      }else envelope.gain.exponentialRampToValueAtTime(.00001,at+duration);
      source.connect(filter||envelope);if(filter)filter.connect(envelope);
      envelope.connect(gate);gate.connect(master);
      const v={source,gate,nodes:[source,...(filter?[filter]:[]),envelope,gate]};
      voices.add(v);source.onended=()=>clean(v);return at;
    }
    function noise(delay,duration,level,frequency,type='bandpass',q=.7,attack=.006,hold=false){
      if(!active||!noiseBuffer)return;
      const source=context.createBufferSource(),filter=context.createBiquadFilter();
      source.buffer=noiseBuffer;
      filter.type=type;filter.frequency.value=frequency;filter.Q.value=q;
      const at=attach(source,filter,delay,duration,level,attack,hold);
      if(at===null){source.disconnect();filter.disconnect();return;}
      const offset=Math.random()*Math.max(0,noiseBuffer.duration-duration-.05);
      source.start(at,offset,duration+.025);source.stop(at+duration+.03);
    }
    function tone(frequency,delay,duration,level,type='sine',hold=false,end=frequency){
      if(!active||!context)return;
      const source=context.createOscillator();source.type=type;source.frequency.value=frequency;
      const at=attach(source,null,delay,duration,level,.008,hold);
      if(at===null){source.disconnect();return;}
      if(end!==frequency){source.frequency.setValueAtTime(frequency,at);source.frequency.exponentialRampToValueAtTime(end,at+duration);}
      source.start(at);source.stop(at+duration+.03);
    }
    function alarm(delay=0){
      [0,.52,1.04].forEach(t=>tone(830,delay+t,.32,.13,'triangle',true));
    }
    function footsteps(delay=0){
      [0,.43,.87,1.32,1.78].forEach((t,n)=>{
        const level=.24-n*.018;
        noise(delay+t,.12,level,520,'lowpass');
        tone(145,delay+t,.075,.045,'sine',false,95);
        noise(delay+t+.055,.065,level*.24,1700,'bandpass',.6);
      });
    }
    function message(delay=0){
      tone(980,delay,.095,.09);
      noise(delay,.04,.055,1900,'bandpass',.7);
    }
    function paper(delay=0){
      noise(delay,.28,.16,2300,'bandpass',.55,.025);
      noise(delay+.17,.22,.10,3900,'highpass',.7,.02);
    }
    function cue(kind){
      switch(kind){
        case 'crack':
          noise(0,.09,.42,1050,'bandpass',.55,.002);
          noise(.035,.055,.22,2300,'highpass',.7,.002);
          noise(.095,.11,.12,750,'bandpass',.8,.003);
          break;
        case 'alarm':alarm();break;
        case 'evacuation':alarm();footsteps(1.65);break;
        case 'footsteps':footsteps();break;
        case 'rain':
          noise(0,2.6,.11,1900,'bandpass',.35,.3,true);
          [.45,.92,1.57].forEach(t=>noise(t,.055,.035,3200,'bandpass',1.2,.003));
          break;
        case 'dial':
          noise(0,.07,.12,850,'lowpass');
          [0.2,.4].forEach(t=>{tone(697,t,.09,.045,'sine',true);tone(1209,t,.09,.045,'sine',true);});
          break;
        case 'phone':
        case 'telephone':
          [0,.9].forEach(burst=>{
            for(let n=0;n<7;n++){
              tone(1100,burst+n*.065,.05,.075,'sine',true);
              tone(1450,burst+n*.065,.05,.05,'sine',true);
            }
          });break;
        case 'message':
        case 'messages':
        case 'group':
        case 'group-message':[0,.34,.78].forEach(message);break;
        case 'email':
          noise(0,.16,.09,1800,'bandpass',.5,.025);
          tone(1180,.11,.18,.09);break;
        case 'record':
          noise(0,.045,.08,1200,'bandpass',.8,.002);
          noise(.11,.05,.055,1800,'bandpass',.7,.002);break;
        case 'paper':paper();break;
        case 'papers':paper();paper(.6);break;
        case 'finish':
        case 'pen':
          [0,.14,.32,.55,.77].forEach((t,n)=>noise(t,n%2?.075:.12,.10,2600,'bandpass',.65,.012));break;
      }
    }
    function update(position,sceneIndex,cueKind,sceneTime=Infinity){
      if(destroyed)return;
      const p=Number(position);if(!Number.isFinite(p))return;
      if(lastPosition>=0&&p<lastPosition-.04)lastScene=-1;
      lastPosition=p;
      if(!active||!enabled||context?.state!=='running')return;
      if(sceneIndex===lastScene)return;
      lastScene=sceneIndex;
      const nearStart=Number.isFinite(sceneTime)?sceneTime>=0&&sceneTime<=.8:p<=.8;
      if(nearStart&&cueKind)cue(cueKind);
    }
    function mute(){enabled=false;++settingTicket;stop();}
    function destroy(){
      destroyed=true;mute();
      for(const v of [...voices])clean(v);
      const closing=context;context=null;master=null;noiseBuffer=null;
      if(closing)void closing.close().catch(()=>{});
    }
    return{supported:Boolean(AC),get enabled(){return enabled;},get active(){return active;},enable,start,update,stop,mute,destroy};
  }
  window.CrisisSound={create};
})();
