'use strict';

/*
 * Deterministic scene choreography. The player owns time, playback and audio.
 * This director only samples the requested panel; it never advances a clock.
 */
(() => {
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
  const out = value => 1 - Math.pow(1 - clamp(value), 3);
  const number = (value, fallback = 0) => {
    if (value === null || value === undefined || String(value).trim() === '') return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const pair = (value, fallback = [0, 0]) => {
    const values = String(value || '').trim().split(/[\s,]+/).map(Number);
    return values.length >= 2 && values.slice(0, 2).every(Number.isFinite) ? values.slice(0, 2) : fallback;
  };
  const rounded = value => String(Math.round(value * 1000) / 1000);
  const memoTails = {
    update1: { at: 22.465, duration: 0.375 },
    update2: { at: 22.815, duration: 0.8 },
    update3: { at: 27.09, duration: 0.75 }
  };
  const selector = [
    'camera', 'enter', 'reveal', 'draw', 'walk', 'limb',
    'rain', 'gesture', 'write', 'focus'
  ].map(name => '[data-film-' + name + ']').join(',');
  const managedAttributes = ['transform', 'opacity', 'pathLength', 'stroke-dasharray', 'stroke-dashoffset'];

  function create({ panels, scenes, stageId }) {
    let destroyed = false;
    const panelList = Array.from(panels || []);
    const sceneList = Array.from(scenes || []);
    const states = panelList.map((panel, index) => compile(panel, sceneList[index] || {}, index));

    function compile(panel, scene, index) {
      const duration = Math.max(0.01, number(scene.seconds, 1));
      const beats = Array.isArray(scene.story?.beats) && scene.story.beats.length
        ? scene.story.beats
        : [{ at: 0, focus: '' }];
      const beatTimes = beats.map(beat => Math.max(0, number(beat.at)));
      const ids = new Map(Array.from(panel.querySelectorAll('[id]')).map(node => [node.id, node]));
      const pathSamples = new Map();
      const records = Array.from(panel.querySelectorAll(selector)).map(node => {
        const attrs = {};
        ['camera', 'enter', 'reveal', 'draw', 'walk', 'limb', 'rain', 'gesture', 'write', 'focus',
          'at', 'duration', 'origin', 'distance', 'angle', 'path', 'start'].forEach(name => {
          attrs[name] = node.getAttribute('data-film-' + name);
        });
        const record = {
          node, attrs,
          saved: new Map(managedAttributes.map(name => [name, node.getAttribute(name)])),
          last: new Map(),
          baseTransform: node.getAttribute('transform') || '',
          baseOpacity: number(node.getAttribute('opacity'), 1),
          origin: pair(attrs.origin),
          focusKeys: String(attrs.focus || '').trim().split(/\s+/).filter(Boolean),
          originalFocus: node.classList.contains('is-film-focused'),
          lastFocus: undefined
        };
        if (attrs.enter !== null) record.enterAt = beatTimes[Math.max(0, Math.trunc(number(attrs.enter)))] ?? 0;
        if (attrs.reveal !== null) record.revealAt = beatTimes[Math.max(0, Math.trunc(number(attrs.reveal)))] ?? 0;
        if (attrs.walk !== null) {
          record.walk = {
            at: number(attrs.at, 0.3 + number(attrs.walk) * 0.17),
            duration: Math.max(0.1, number(attrs.duration, 4.2)),
            distance: number(attrs.distance, 82),
            phase: number(attrs.walk) * 0.26
          };
        }
        if (attrs.write !== null) {
          const path = ids.get(attrs.path);
          if (path && !pathSamples.has(path)) {
            try {
              const length = path.getTotalLength();
              const samples = Array.from({ length: 97 }, (_, step) => {
                const point = path.getPointAtLength(length * step / 96);
                return [point.x, point.y];
              });
              pathSamples.set(path, samples);
            } catch (_) {
              pathSamples.set(path, null);
            }
          }
          record.samples = pathSamples.get(path) || null;
          record.penStart = pair(attrs.start, record.samples?.[0] || [0, 0]);
        }
        return record;
      });
      const byNode = new Map(records.map(record => [record.node, record]));
      records.filter(record => record.attrs.limb !== null).forEach(record => {
        let parent = record.node.parentElement;
        while (parent && parent !== panel) {
          const candidate = byNode.get(parent);
          if (candidate?.walk) { record.walk = candidate.walk; break; }
          parent = parent.parentElement;
        }
      });
      const beatNodes = Array.from(panel.querySelectorAll('[data-film-beat]')).map(node => {
        const heading = node.querySelector('.cinema-beat-heading');
        return {
          node,
          index: Math.trunc(number(node.getAttribute('data-film-beat'))),
          hidden: node.hidden,
          heading,
          transform: heading?.style.transform || '',
          opacity: heading?.style.opacity || ''
        };
      });
      const progress = Array.from(panel.querySelectorAll('[data-film-beat-progress]')).map(node => ({
        node,
        index: Math.trunc(number(node.getAttribute('data-film-beat-progress'))),
        progress: node.style.getPropertyValue('--beat-progress'),
        state: node.getAttribute('data-progress-state')
      }));
      return {
        panel, scene, index, duration, beats, beatTimes, records, beatNodes, progress,
        savedBeat: panel.getAttribute('data-active-beat'),
        savedFocus: panel.getAttribute('data-active-focus'),
        lastTime: null, lastReduced: null, lastBeat: null
      };
    }

    function set(record, name, value) {
      if (record.last.get(name) === value) return;
      record.node.setAttribute(name, value);
      record.last.set(name, value);
    }

    function writing(time, state, reduced) {
      if (reduced) return { progress: 1, lift: 0, moving: false };
      const first = clamp((time - 0.65) / 1.8);
      const tail = memoTails[stageId] || { at: Math.max(3, state.duration - 0.9), duration: 0.65 };
      const last = clamp((time - tail.at) / tail.duration);
      const progress = 0.86 * first + 0.14 * last;
      const lift = ease((time - 2.45) / 0.3) * (1 - ease((time - (tail.at - 0.24)) / 0.24));
      return {
        progress: clamp(progress),
        lift,
        moving: (time >= 0.65 && time <= 2.45) || (time >= tail.at && time <= tail.at + tail.duration)
      };
    }

    function walkPose(time, walk, reduced) {
      if (reduced) return { x: walk.distance, y: 0, swing: 0 };
      const p = clamp((time - walk.at) / walk.duration);
      const envelope = ease((time - walk.at) / 0.24) *
        ease((walk.at + walk.duration - time) / 0.38);
      const cycle = (time - walk.at) / 0.68 + walk.phase;
      return {
        x: walk.distance * ease(p),
        y: -Math.abs(Math.sin(cycle * Math.PI * 2)) * 2.2 * envelope,
        swing: Math.sin(cycle * Math.PI * 2) * envelope
      };
    }

    function render({ sceneIndex, sceneTime, reducedMotion = false }) {
      if (destroyed) return;
      const index = Math.trunc(number(sceneIndex, -1));
      const state = states[index];
      if (!state) return;
      const reduced = Boolean(reducedMotion);
      const time = Math.max(0, Math.min(state.duration, number(sceneTime)));
      if (state.lastTime === time && state.lastReduced === reduced) return;
      state.lastTime = time;
      state.lastReduced = reduced;
      let currentBeat = 0;
      state.beatTimes.forEach((at, index) => { if (time >= at) currentBeat = index; });
      const active = state.beats[currentBeat] || state.beats[0];
      const focus = String(active.focus || '');
      const pen = writing(time, state, reduced);

      if (state.lastBeat !== currentBeat) {
        state.panel.setAttribute('data-active-beat', String(currentBeat));
        state.panel.setAttribute('data-active-focus', focus);
        state.beatNodes.forEach(beat => { beat.node.hidden = beat.index !== currentBeat; });
        state.lastBeat = currentBeat;
      }
      state.beatNodes.forEach(beat => {
        if (beat.index !== currentBeat || !beat.heading) return;
        const p = reduced ? 1 : out((time - state.beatTimes[currentBeat]) / 0.48);
        beat.heading.style.transform = p === 1 ? 'none' : 'translateY(' + rounded((1 - p) * 5) + 'px)';
        beat.heading.style.opacity = rounded(0.86 + 0.14 * p);
      });
      state.progress.forEach(item => {
        const at = state.beatTimes[item.index] ?? state.duration;
        const next = state.beatTimes[item.index + 1] ?? state.duration;
        const p = reduced
          ? (item.index < currentBeat ? 1 : item.index === currentBeat ? 0.35 : 0)
          : clamp((time - at) / Math.max(0.01, next - at));
        item.node.style.setProperty('--beat-progress', rounded(p));
        const status = item.index < currentBeat ? 'done' : item.index === currentBeat ? 'current' : 'upcoming';
        if (item.node.getAttribute('data-progress-state') !== status) item.node.setAttribute('data-progress-state', status);
      });

      state.records.forEach(record => {
        const a = record.attrs;
        const transforms = record.baseTransform ? [record.baseTransform] : [];
        let opacity = record.baseOpacity;
        let x = 0;
        let y = 0;
        let rotation = 0;
        if ((a.camera === 'push' || a.camera === 'pan') && !reduced) {
          const p = ease(time / state.duration);
          const origin = a.origin === null ? [380, 250] : record.origin;
          const scale = a.camera === 'pan' ? 1.018 : 1 + p * 0.024;
          const shift = a.camera === 'pan' ? (p - 0.5) * 10 : 0;
          transforms.push('translate(' + rounded(origin[0] + shift) + ' ' + rounded(origin[1]) + ')');
          transforms.push('scale(' + scale.toFixed(6) + ')');
          transforms.push('translate(' + rounded(-origin[0]) + ' ' + rounded(-origin[1]) + ')');
        }
        if (a.enter !== null && !reduced) {
          const at = number(a.at, record.enterAt);
          const p = out((time - at) / Math.max(0.1, number(a.duration, 0.85)));
          opacity *= at === 0 ? 0.9 + 0.1 * p : p;
          y += (1 - p) * 14;
        }
        if (a.reveal !== null && !reduced) {
          const at = number(a.at, record.revealAt);
          opacity *= ease((time - at) / Math.max(0.1, number(a.duration, 0.55)));
        }
        if (a.draw !== null) {
          const p = reduced ? 1 : a.draw === 'ink'
            ? pen.progress
            : clamp((time - number(a.at, a.draw === 'crack' ? 0.28 : 0.3)) /
                Math.max(0.01, number(a.duration, a.draw === 'crack' ? 0.32 : 0.8)));
          set(record, 'pathLength', '1');
          set(record, 'stroke-dasharray', '1');
          set(record, 'stroke-dashoffset', rounded(1 - p));
          if (p === 0) opacity = 0;
        }
        if (a.walk !== null && record.walk) {
          const pose = walkPose(time, record.walk, reduced);
          x += pose.x;
          y += pose.y;
        }
        if (a.limb !== null && record.walk && !reduced) {
          const swing = walkPose(time, record.walk, false).swing;
          const isLeg = a.limb.includes('leg');
          const direction = a.limb.startsWith('left') ? 1 : -1;
          rotation += swing * (isLeg ? 12 : 8) * direction * (isLeg ? 1 : -1);
        }
        if (a.rain !== null && !reduced) {
          const p = ((time / 0.85 + number(a.rain) * 0.41) % 1 + 1) % 1;
          x -= p * 7;
          y += p * 24;
        }
        if (a.gesture !== null && !reduced) {
          const kind = a.gesture;
          const at = number(a.at, kind === 'receiver' ? 0.73 : kind === 'look' ? 0.4 : 0.15);
          const duration = Math.max(0.1, number(a.duration, kind === 'receiver' ? 0.7 : 1.15));
          const p = ease((time - at) / duration);
          if (kind === 'receiver') {
            const lowerAt = Math.max(at + duration, state.duration - 0.63);
            const held = p * (1 - ease((time - lowerAt) / 0.28));
            rotation += number(a.angle, -18) * held;
            x += 4 * held;
            y -= number(a.distance, 7) * held;
          } else if (kind === 'phone') {
            const u = clamp((time - at) / duration);
            const vibration = Math.sin(u * Math.PI * 8) * Math.sin(u * Math.PI);
            rotation += 2.2 * vibration;
            x += 1.5 * vibration;
          } else if (kind === 'look') {
            rotation += number(a.angle, -5) * p;
          } else {
            rotation += number(a.angle, -2) * Math.sin(p * Math.PI);
          }
        }
        if (a.write !== null) {
          let point;
          if (record.samples) {
            const step = pen.progress * (record.samples.length - 1);
            const left = Math.floor(step);
            const right = Math.min(record.samples.length - 1, left + 1);
            const fraction = step - left;
            point = [
              record.samples[left][0] + (record.samples[right][0] - record.samples[left][0]) * fraction,
              record.samples[left][1] + (record.samples[right][1] - record.samples[left][1]) * fraction
            ];
          } else {
            point = [record.penStart[0] + 164 * pen.progress, record.penStart[1] - 2 * pen.progress];
          }
          x += point[0] - record.penStart[0];
          y += point[1] - record.penStart[1] - 7 * pen.lift;
          rotation -= 4 * pen.lift;
          if (pen.moving && !reduced) rotation += Math.sin(pen.progress * Math.PI * 7) * 0.7;
        }
        if (record.focusKeys.length) {
          const selected = record.focusKeys.includes(focus);
          // Keep objects opaque so people, paper and devices do not ghost through their backgrounds.
          if (record.lastFocus !== selected) {
            record.node.classList.toggle('is-film-focused', selected);
            record.lastFocus = selected;
          }
        }
        if (x || y) transforms.push('translate(' + rounded(x) + ' ' + rounded(y) + ')');
        if (rotation) transforms.push('rotate(' + rounded(rotation) + ' ' + rounded(record.origin[0]) + ' ' + rounded(record.origin[1]) + ')');
        set(record, 'transform', transforms.join(' '));
        set(record, 'opacity', rounded(opacity));
      });
    }

    function restore(node, name, value) {
      if (value === null) node.removeAttribute(name);
      else node.setAttribute(name, value);
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      states.forEach(state => {
        state.records.forEach(record => {
          record.saved.forEach((value, name) => restore(record.node, name, value));
          record.node.classList.toggle('is-film-focused', record.originalFocus);
        });
        state.beatNodes.forEach(beat => {
          beat.node.hidden = beat.hidden;
          if (beat.heading) {
            beat.heading.style.transform = beat.transform;
            beat.heading.style.opacity = beat.opacity;
          }
        });
        state.progress.forEach(item => {
          if (item.progress) item.node.style.setProperty('--beat-progress', item.progress);
          else item.node.style.removeProperty('--beat-progress');
          restore(item.node, 'data-progress-state', item.state);
        });
        restore(state.panel, 'data-active-beat', state.savedBeat);
        restore(state.panel, 'data-active-focus', state.savedFocus);
      });
    }

    return Object.freeze({ render, destroy });
  }

  window.CrisisMotion = Object.freeze({ create });
})();
