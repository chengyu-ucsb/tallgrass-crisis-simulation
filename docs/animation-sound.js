'use strict';
/* Recorded effects only. The player owns time; narration files are never modified. */
(() => {
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function create({clips = {}, events = [], scenes = []} = {}) {
    const AC = window.AudioContext || window.webkitAudioContext;
    let context = null, master = null, duck = null, initialSuspendPending = false;
    let destroyed = false, enabled = false, active = false;
    let runTicket = 0, settingTicket = 0, position = 0, narratorOn = true;
    let anchorTime = 0, anchorPosition = 0, needsSchedule = true;
    let configurationError = '', runtimeError = '';
    const voices = new Set(), records = new Map();
    const sceneList = [], timeline = [], speech = [];
    let length = 0;

    try {
      if (!Array.isArray(scenes) || !scenes.length || !Array.isArray(events) || !events.length) {
        throw new Error('No recorded effects are available for this update.');
      }
      for (const scene of scenes) {
        const seconds = scene.seconds ?? scene.length;
        const start = finite(scene.start) ? scene.start : length;
        if (!finite(seconds) || seconds <= 0 || start < 0) throw new Error('Invalid effects timing.');
        const end = start + seconds;
        sceneList.push({start, end});
        length = Math.max(length, end);
        if (finite(scene.speechStart) && finite(scene.speechSeconds) && scene.speechSeconds > 0) {
          const from = Math.max(start, start + scene.speechStart);
          const to = Math.min(end, from + scene.speechSeconds);
          if (to > from) speech.push({from, to});
        }
      }
      events.forEach((event, id) => {
        const scene = sceneList[event.scene];
        const clip = clips[event.clip];
        if (!Number.isInteger(event.scene) || !scene || !clip || typeof clip.src !== 'string' || !clip.src) {
          throw new Error('A recorded effect is missing from this update.');
        }
        const at = event.at ?? 0, rate = event.rate ?? 1, gain = event.gain ?? 1;
        const duration = event.duration ?? null;
        const fadeIn = event.fadeIn ?? .012, fadeOut = event.fadeOut ?? .08;
        if (!finite(at) || !finite(rate) || rate <= 0 || rate > 4 ||
            !finite(gain) || gain < 0 || gain > 2 ||
            (duration !== null && (!finite(duration) || duration <= 0)) ||
            !finite(fadeIn) || fadeIn < 0 || !finite(fadeOut) || fadeOut < 0) {
          throw new Error('Invalid recorded-effect settings.');
        }
        timeline.push({
          id, clip: event.clip, from: scene.start + at, sceneEnd: scene.end,
          rate, gain, duration, fadeIn, fadeOut, bed: event.bed === true
        });
        if (!records.has(event.clip)) {
          records.set(event.clip, {
            src: clip.src, buffer: null, attempts: 0, ticket: 0,
            promise: null, cancel: null, failed: false
          });
        }
      });
      timeline.sort((a, b) => a.from - b.from || a.id - b.id);
      speech.sort((a, b) => a.from - b.from);
      // Merge nearby speech windows so automation never creates conflicting ramps.
      for (let n = 1; n < speech.length;) {
        if (speech[n].from - .18 <= speech[n - 1].to + .28) {
          speech[n - 1].to = Math.max(speech[n - 1].to, speech[n].to);
          speech.splice(n, 1);
        } else n++;
      }
    } catch (error) {
      configurationError = error.message || 'Recorded effects are unavailable.';
    }

    const ready = () => !destroyed && !configurationError && records.size > 0 &&
      [...records.values()].every(record => Boolean(record.buffer));

    function clean(voice) {
      if (!voices.delete(voice)) return;
      voice.source.onended = null;
      for (const node of [voice.source, voice.envelope, voice.gate]) {
        try { node.disconnect(); } catch (_) {}
      }
    }
    function silence(immediate = false) {
      const now = context?.currentTime || 0;
      for (const voice of [...voices]) {
        if (voice.stopping && !immediate) continue;
        voice.stopping = true;
        try {
          if (immediate || voice.when > now) {
            voice.source.stop(now);
            clean(voice);
          } else {
            voice.gate.gain.cancelScheduledValues(now);
            voice.gate.gain.setValueAtTime(1, now);
            voice.gate.gain.linearRampToValueAtTime(0, now + .012);
            voice.source.stop(now + .016);
          }
        } catch (_) { clean(voice); }
      }
    }
    function stop() {
      ++runTicket;
      active = false;
      needsSchedule = true;
      silence();
    }
    function stateChanged() {
      if (context?.state !== 'running' && active) {
        silence(true);
        needsSchedule = true;
      }
    }
    function ensureContext() {
      if (context) return context.state !== 'closed';
      if (!AC || destroyed || configurationError) return false;
      try {
        context = new AC();
        master = context.createGain();
        duck = context.createGain();
        master.gain.value = 1;
        duck.gain.value = 1;
        duck.connect(master);
        master.connect(context.destination);
        context.addEventListener('statechange', stateChanged);
        // Decode while suspended. No source is created before explicit enable/start.
        if (context.state === 'running') {
          initialSuspendPending = true;
          void context.suspend().catch(() => {}).finally(() => { initialSuspendPending = false; });
        }
        return true;
      } catch (_) {
        runtimeError = 'Recorded sound effects are unavailable in this browser.';
        if (context) void context.close().catch(() => {});
        context = null; master = null; duck = null;
        return false;
      }
    }

    function loadClip(record) {
      const ticket = ++record.ticket;
      const decodingContext = context;
      const abort = new AbortController();
      record.attempts++;
      record.failed = false;
      let timer, rejectCancelled;
      const cancelled = new Promise((_, reject) => { rejectCancelled = reject; });
      record.cancel = () => {
        abort.abort();
        rejectCancelled(new Error('Effects preparation cancelled.'));
      };
      timer = setTimeout(() => {
        abort.abort();
        rejectCancelled(new Error('Effects preparation timed out.'));
      }, 15000);
      const task = (async () => {
        const response = await fetch(record.src, {
          signal: abort.signal,
          cache: record.attempts > 1 ? 'reload' : 'force-cache',
          credentials: 'same-origin'
        });
        if (!response.ok) throw new Error('Effect download failed.');
        const bytes = await response.arrayBuffer();
        if (!bytes.byteLength) throw new Error('Empty effect recording.');
        if (destroyed || ticket !== record.ticket) throw new Error('Effects preparation cancelled.');
        const buffer = await decodingContext.decodeAudioData(bytes);
        if (!buffer || !finite(buffer.duration) || buffer.duration <= 0) {
          throw new Error('Invalid effect recording.');
        }
        return buffer;
      })();
      record.promise = Promise.race([task, cancelled]).then(buffer => {
        if (destroyed || ticket !== record.ticket) return false;
        record.buffer = buffer;
        record.failed = false;
        return true;
      }).catch(() => {
        if (!destroyed && ticket === record.ticket) record.failed = true;
        return false;
      }).finally(() => {
        clearTimeout(timer);
        if (ticket === record.ticket) {
          record.promise = null;
          record.cancel = null;
        }
      });
      return record.promise;
    }

    async function prepare({retry = false} = {}) {
      try {
        if (destroyed || configurationError || !ensureContext()) return false;
        const results = await Promise.all([...records.values()].map(record => {
          if (record.buffer) return true;
          if (record.promise) return record.promise;
          if (record.attempts && !retry) return false;
          return loadClip(record);
        }));
        const complete = !destroyed && results.every(Boolean) && ready();
        if (complete) runtimeError = '';
        return complete;
      } catch (_) {
        if (!destroyed) runtimeError = 'Recorded sound effects could not be prepared.';
        return false;
      }
    }

    async function wake() {
      if (!context || destroyed || context.state === 'closed') return false;
      if (context.state === 'running' && !initialSuspendPending) return true;
      let timer;
      try {
        // resume() is invoked before awaiting, retaining the explicit user gesture.
        const waking = context.resume();
        return await Promise.race([
          waking.then(() => context?.state === 'running'),
          new Promise(resolve => { timer = setTimeout(() => resolve(false), 2500); })
        ]);
      } catch (_) { return false; }
      finally { clearTimeout(timer); }
    }
    async function enable() {
      if (destroyed || !ensureContext()) return false;
      const ticket = ++settingTicket;
      enabled = true;
      const awake = await wake();
      if (destroyed || ticket !== settingTicket || !enabled) return false;
      if (!awake) {
        enabled = false;
        runtimeError = 'Sound effects could not start. Try Effects on again.';
      }
      return awake;
    }

    function duckLevel(at) {
      if (!narratorOn) return 1;
      for (const window of speech) {
        if (at < window.from - .18) break;
        if (at < window.from) return 1 - .72 * (at - (window.from - .18)) / .18;
        if (at <= window.to) return .28;
        if (at < window.to + .28) return .28 + .72 * (at - window.to) / .28;
      }
      return 1;
    }
    function scheduleDucking(at, now, smooth = false) {
      const gain = duck.gain;
      const begin = smooth ? at + .025 : at;
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(smooth ? gain.value : duckLevel(at), now);
      if (smooth) gain.linearRampToValueAtTime(duckLevel(begin), now + .025);
      if (!narratorOn) return;
      for (const window of speech) {
        for (const [time, value, ramp] of [
          [window.from - .18, 1, false],
          [window.from, .28, true],
          [window.to, .28, false],
          [window.to + .28, 1, true]
        ]) {
          if (time <= begin) continue;
          const when = now + time - at;
          if (ramp) gain.linearRampToValueAtTime(value, when);
          else gain.setValueAtTime(value, when);
        }
      }
    }

    function scheduleEvent(event, at, now) {
      const buffer = records.get(event.clip).buffer;
      let duration = event.duration;
      if (duration === null) {
        duration = event.bed ? event.sceneEnd - event.from : buffer.duration / event.rate;
      }
      if (!event.bed) duration = Math.min(duration, buffer.duration / event.rate);
      duration = Math.min(duration, length - event.from);
      const end = event.from + duration;
      if (duration <= 0 || end <= at + .001 || event.gain === 0) return;
      const elapsed = Math.max(0, at - event.from);
      const remaining = duration - elapsed;
      const when = now + Math.max(0, event.from - at);
      const fadeIn = Math.min(event.fadeIn, duration / 2);
      const fadeOut = Math.min(event.fadeOut, duration - fadeIn);
      const level = event.gain * Math.min(
        1,
        fadeIn ? elapsed / fadeIn : 1,
        fadeOut ? (duration - elapsed) / fadeOut : 1
      );
      const source = context.createBufferSource();
      const envelope = context.createGain();
      const gate = context.createGain();
      const voice = {source, envelope, gate, when};
      voices.add(voice);
      source.onended = () => clean(voice);
      try {
        source.buffer = buffer;
        source.loop = event.bed;
        source.playbackRate.setValueAtTime(event.rate, when);
        gate.gain.value = 1;
        if (elapsed > .001) {
          gate.gain.setValueAtTime(0, when);
          gate.gain.linearRampToValueAtTime(1, when + Math.min(.008, remaining / 2));
        }
        envelope.gain.setValueAtTime(Math.max(0, level), when);
        if (elapsed < fadeIn) {
          envelope.gain.linearRampToValueAtTime(event.gain, when + fadeIn - elapsed);
        }
        if (elapsed < duration - fadeOut) {
          envelope.gain.setValueAtTime(event.gain, when + duration - fadeOut - elapsed);
        }
        if (fadeOut) envelope.gain.linearRampToValueAtTime(0, when + remaining);
        source.connect(envelope);
        envelope.connect(gate);
        gate.connect(duck);
        const offset = event.bed
          ? (elapsed * event.rate) % buffer.duration
          : elapsed * event.rate;
        // duration is buffer time; stop is the independent timeline-time boundary.
        source.start(when, offset, remaining * event.rate);
        source.stop(when + remaining);
      } catch (error) {
        try { source.stop(); } catch (_) {}
        clean(voice);
        throw error;
      }
    }
    function schedule(at) {
      if (!active || !enabled || destroyed || context?.state !== 'running') return false;
      silence();
      const now = context.currentTime;
      try {
        scheduleDucking(at, now);
        for (const event of timeline) scheduleEvent(event, at, now);
        anchorPosition = at;
        anchorTime = now;
        needsSchedule = false;
        return true;
      } catch (_) {
        runtimeError = 'Recorded sound effects could not play.';
        stop();
        return false;
      }
    }

    async function start(_sceneIndex, latestPosition) {
      stop();
      if (finite(latestPosition)) position = clamp(latestPosition, 0, length);
      if (destroyed || !enabled || !context) return false;
      const ticket = ++runTicket;
      const awake = await wake();
      if (destroyed || ticket !== runTicket || !enabled) return false;
      const prepared = awake && await prepare();
      if (destroyed || ticket !== runTicket || !enabled || !prepared) return false;
      active = true;
      return schedule(position);
    }
    function update(value, _sceneIndex, _cue, _sceneTime, voiceOn = true) {
      if (destroyed || !finite(value)) return;
      position = clamp(value, 0, length);
      const changedVoice = narratorOn !== Boolean(voiceOn);
      narratorOn = Boolean(voiceOn);
      if (!active || !enabled || context?.state !== 'running') return;
      const now = context.currentTime;
      // One stage timeline: crossing a scene boundary never repeats an event.
      const expected = anchorPosition + now - anchorTime;
      if (needsSchedule || Math.abs(position - expected) > .24) {
        schedule(position);
      } else if (changedVoice) {
        scheduleDucking(position, now, true);
      }
    }
    function mute() {
      enabled = false;
      ++settingTicket;
      stop();
    }
    function destroy() {
      if (destroyed) return;
      destroyed = true;
      mute();
      silence(true);
      for (const record of records.values()) {
        ++record.ticket;
        record.cancel?.();
        record.cancel = null;
        record.buffer = null;
      }
      const closing = context;
      if (closing) {
        closing.removeEventListener('statechange', stateChanged);
        void closing.close().catch(() => {});
      }
      context = null; master = null; duck = null;
    }

    const api = {
      supported: Boolean(AC),
      get enabled() { return enabled; },
      get active() { return active; },
      get ready() { return ready(); },
      get error() {
        if (!AC) return 'Recorded sound effects are unavailable in this browser.';
        if (configurationError) return configurationError;
        if ([...records.values()].some(record => record.failed)) {
          return 'Some sound effects could not load. Retry, or turn Effects off to continue.';
        }
        return runtimeError;
      },
      get failedClips() {
        return [...records].filter(([, record]) => record.failed).map(([id]) => id);
      },
      prepare, enable, start, update, stop, mute, destroy
    };
    if (AC && !configurationError) void prepare();
    return api;
  }
  window.CrisisSound = {create};
})();
