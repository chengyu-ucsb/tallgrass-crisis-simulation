'use strict';
/*
 * Cold-open player for the three case updates.
 *
 * Every frame is a pure function of the playback clock, so pause and scrub
 * always land on the same picture. The street is painted on a canvas; captions,
 * notifications and documents are ordinary page text. Nothing plays until the
 * user presses Play, and watching never marks a document as read.
 *
 * films.js holds what each film shows and says. app.js mounts the player
 * through window.CrisisAnimation.
 */
(() => {
  const FILMS = window.TallgrassFilms || {};
  const VOICES = window.CrisisVoices || {};
  const W = 1600, H = 900;
  const calm = matchMedia('(prefers-reduced-motion: reduce)');

  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const smooth = (a, b, x) => { const p = clamp((x - a) / (b - a)); return p * p * (3 - 2 * p); };
  const out3 = p => 1 - Math.pow(1 - clamp(p), 3);
  const frac = x => x - Math.floor(x);
  const hash = n => frac(Math.sin(n * 127.1 + 311.7) * 43758.5453);
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, k, alpha = 1) => { const x = hex(a), y = hex(b); return 'rgba(' + Math.round(lerp(x[0], y[0], k)) + ',' + Math.round(lerp(x[1], y[1], k)) + ',' + Math.round(lerp(x[2], y[2], k)) + ',' + alpha + ')'; };
  const rgba = (h, a) => { const x = hex(h); return 'rgba(' + x[0] + ',' + x[1] + ',' + x[2] + ',' + a + ')'; };
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stamp = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const spokenLength = s => { const m = Math.floor(s / 60), r = Math.round(s % 60); return (m ? m + ' min ' : '') + r + ' sec'; };

  /* ================================================================ people */
  // One procedural figure with a real gait: thigh, shin, foot, upper arm, forearm.
  const KINDS = ['plain', 'hood', 'pack', 'coat', 'blanket', 'tail', 'beanie'];
  function figure(g, o) {
    const { x, y, s, kind, dir = 1, moving = true, phone = false, arms = 'swing', lean = 0.06 } = o;
    const ph = o.phase;
    g.save(); g.translate(x, y); g.scale(s * dir, s);
    const bob = moving ? 1.6 * Math.cos(ph * Math.PI * 4) : 0.5 * Math.sin(o.t * 1.3 + o.seed * 9);
    const hipY = -49 + bob, sh = -80 + bob;
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = g.fillStyle;
    const leg = p => {
      const a = moving ? 0.46 * Math.sin(p * Math.PI * 2) : 0.03;
      const k = moving ? 0.12 + 0.85 * Math.pow(Math.max(0, Math.cos(p * Math.PI * 2 + 0.35)), 1.4) : 0.04;
      const kx = Math.sin(a) * 25, ky = hipY + Math.cos(a) * 25;
      const ax = kx + Math.sin(a - k) * 24, ay = ky + Math.cos(a - k) * 24;
      g.lineWidth = 8.2; g.beginPath(); g.moveTo(0, hipY); g.lineTo(kx, ky); g.stroke();
      g.lineWidth = 6.8; g.beginPath(); g.moveTo(kx, ky); g.lineTo(ax, ay); g.stroke();
      g.lineWidth = 5.5; g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax + 7.5 * Math.cos(k * 0.5), ay + 1 - 3 * Math.sin(k * 0.4)); g.stroke();
    };
    // Angles are measured from straight down; positive swings forward.
    const arm = (p, mode) => {
      let a, b;
      if (mode === 'phone') { a = 0.35; b = 2.2; }
      else if (mode === 'hug') { a = 0.15; b = 2.5; }
      else { a = moving ? -0.4 * Math.sin(p * Math.PI * 2) : 0.04; b = a + (moving ? 0.38 : 0.1); }
      const sx = 1.5, sy = sh + 3, ex = sx + Math.sin(a) * 15, ey = sy + Math.cos(a) * 15;
      const hx = ex + Math.sin(b) * 14, hy = ey + Math.cos(b) * 14;
      g.lineWidth = 6; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.lineTo(hx, hy); g.stroke();
      return [hx, hy];
    };
    leg(ph + 0.5);
    arm(ph, arms === 'hug' ? 'hug' : 'swing');
    g.save(); g.translate(0, hipY); g.rotate(moving ? lean : 0.015); g.translate(0, -hipY);
    const coat = kind === 'coat', blanket = kind === 'blanket';
    g.beginPath();
    const top = blanket ? 12 : 9.5, bottomW = coat ? 11.5 : blanket ? 15 : 8.5, bottom = coat ? hipY + 24 : blanket ? hipY + 10 : hipY + 3;
    g.moveTo(-top, sh + 1); g.quadraticCurveTo(0, sh - 5, top, sh + 1); g.lineTo(bottomW, bottom); g.lineTo(-bottomW, bottom); g.closePath(); g.fill();
    if (kind === 'pack') { g.beginPath(); g.roundRect(-18, sh + 4, 11, 26, 5); g.fill(); }
    g.beginPath(); g.ellipse(1.5, sh - 13, 8, 9.2, 0, 0, Math.PI * 2); g.fill();
    g.lineWidth = 5; g.beginPath(); g.moveTo(0.5, sh - 2); g.lineTo(1, sh - 6); g.stroke();
    if (kind === 'hood') { g.beginPath(); g.ellipse(-0.5, sh - 12, 10.5, 11.5, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(-10, sh - 9); g.quadraticCurveTo(-13, sh + 4, -6, sh + 7); g.lineTo(4, sh + 2); g.fill(); }
    if (kind === 'tail') { g.lineWidth = 4.5; g.beginPath(); g.moveTo(-5, sh - 17); g.quadraticCurveTo(-15, sh - 14, -12, sh - 2 + (moving ? 2 * Math.sin(ph * Math.PI * 4) : 0)); g.stroke(); }
    if (kind === 'beanie') { g.beginPath(); g.ellipse(1, sh - 18, 8.6, 6.4, 0, Math.PI, 0); g.fill(); g.beginPath(); g.arc(1, sh - 25, 2.6, 0, Math.PI * 2); g.fill(); }
    g.restore();
    leg(ph);
    const hand = arm(ph + 0.5, phone ? 'phone' : arms === 'hug' ? 'hug' : 'swing');
    g.restore();
    return phone ? [x + hand[0] * s * dir, y + hand[1] * s] : null;
  }

  const walkers = (() => {
    const r = rng(77), list = [];
    for (let i = 0; i < 17; i++) {
      const depth = r();
      list.push({ start: -5.5 + i * 0.66 + r() * 0.5, speed: 64 + r() * 26, lane: 708 + depth * 86, s: 0.92 + depth * 0.62, kind: KINDS[Math.floor(r() * KINDS.length)], phase: r(), phone: r() < 0.3, seed: r(), cadence: 0.92 + r() * 0.22 });
    }
    return list.sort((a, b) => a.lane - b.lane);
  })();
  const standers = [
    { x: 1012, y: 742, s: 1.2, kind: 'hood', dir: -1, arms: 'hug', seed: .11 },
    { x: 1058, y: 750, s: 1.28, kind: 'blanket', dir: -1, arms: 'hug', seed: .52 },
    { x: 1106, y: 739, s: 1.16, kind: 'tail', dir: -1, phone: true, seed: .83 },
    { x: 322, y: 730, s: 1.08, kind: 'beanie', dir: 1, phone: true, seed: .37 },
    { x: 365, y: 736, s: 1.13, kind: 'coat', dir: 1, arms: 'hug', seed: .68 },
    { x: 1296, y: 800, s: 1.62, kind: 'pack', dir: -1, phone: true, seed: .23 }
  ];
  const lobbyPeople = (() => { const r = rng(5), centres = [1275, 1345, 1392, 1470, 1548]; return Array.from({ length: 13 }, (_, i) => ({ x: centres[i % 5] + (r() - 0.5) * 46, y: 684 + r() * 6, h: 0.53 + r() * 0.09, kind: KINDS[Math.floor(r() * 7)], at: 9 + i * 0.8 + r() * 0.6, dir: r() < .5 ? 1 : -1, phone: r() < .3 })).sort((a, b) => a.h - b.h); })();

  /* ============================================================ the street */
  const skyline = (() => { const r = rng(12), b = []; let x = -40; while (x < W + 40) { const w = 60 + r() * 110; b.push({ x, w, h: 120 + r() * 260, lit: Array.from({ length: 5 }, () => [r(), r(), r()]) }); x += w + 6 + r() * 26; } return b; })();
  const windows = (() => { const r = rng(31), a = []; for (let row = 0; row < 5; row++) for (let col = 0; col < 8; col++) a.push({ row, col, lit: r() < 0.36, warm: r(), off: 20.4 + r() * 2.0 }); return a; })();
  const rain = (() => { const r = rng(404), a = []; for (let i = 0; i < 300; i++) { const near = i % 3 === 0; a.push({ x: r() * (W + 300), y: r() * (H + 120), v: near ? 1500 + r() * 300 : 880 + r() * 220, len: near ? 30 + r() * 16 : 13 + r() * 8, near }); } return a; })();
  // SHIFT centres the building and leaves open sky on the left for captions.
  const BX = 430, BW = 580, BTOP = 150, GROUND = 690, DOORX = 720, SHIFT = 80;

  const strobe = t => { if (calm.matches) return 0.45; const a = Math.max(0, Math.sin(t * Math.PI * 2 * 1.15)); return 0.18 + 0.82 * a * a; };

  /*
   * o.k         0 before dawn, 1 grey morning
   * o.push      0..1 slow move toward the entrance
   * o.walk      seconds since the evacuation shot began, or null for an empty street
   * o.engine    fire engine and its light, 0..1
   * o.lights    how lit each window is, given the window record
   * o.lobby     how visible each person next door is, given the person record
   * o.tape, o.van, o.placard, o.floor3   0..1
   */
  function exterior(ctx, t, o) {
    const k = o.k, push = calm.matches ? 0 : o.push || 0;
    const cam = depth => { const s = 1 + 0.055 * push * depth; ctx.translate(SHIFT * depth, 0); ctx.translate(DOORX, 600); ctx.scale(s, s); ctx.translate(-DOORX, -600); };
    const engine = o.engine || 0, st = strobe(t) * lerp(1, 0.35, k) * engine;
    const reflection = (x, w, color, alpha, seed, depth = 150) => {
      if (alpha <= 0.004) return;
      const count = 11;
      for (let i = 0; i < count; i++) {
        const p = i / count, y = 718 + p * depth, ww = w * (1 - p * 0.35);
        const j = calm.matches ? 0 : Math.sin(t * 2.3 + i * 1.9 + seed) * (2 + p * 6);
        ctx.fillStyle = rgba(color, alpha * Math.pow(1 - p, 1.6));
        ctx.fillRect(x - ww / 2 + j, y, ww, depth / count * 0.52);
      }
    };

    let g = ctx.createLinearGradient(0, 0, 0, GROUND);
    g.addColorStop(0, mix('#111a26', '#7d8996', k)); g.addColorStop(0.62, mix('#263242', '#a2abb4', k)); g.addColorStop(1, mix('#4b4a4f', '#bcc2c6', k));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    ctx.save(); cam(0.25);
    skyline.forEach(b => {
      ctx.fillStyle = mix('#1a2431', '#8f9aa5', k); ctx.fillRect(b.x, GROUND - b.h, b.w, b.h);
      if (k < 1) b.lit.forEach(l => { ctx.fillStyle = rgba('#f2b866', (0.25 + l[2] * 0.4) * (1 - k)); ctx.fillRect(b.x + 8 + l[0] * (b.w - 20), GROUND - b.h + 14 + l[1] * (b.h - 60), 5, 7); });
    });
    ctx.restore();

    ctx.save(); cam(1);
    // the building next door, with a lit lobby
    ctx.fillStyle = mix('#202a37', '#8d949b', k); ctx.fillRect(1180, 250, 520, 440);
    ctx.fillStyle = mix('#18212c', '#7b838b', k); for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) ctx.fillRect(1210 + j * 68, 280 + i * 66, 40, 42);
    g = ctx.createLinearGradient(0, 560, 0, 690); g.addColorStop(0, mix('#ffd9a0', '#e9dcc0', k)); g.addColorStop(1, mix('#e7a857', '#cfc3a8', k));
    ctx.fillStyle = g; ctx.fillRect(1232, 566, 368, 124);
    lobbyPeople.forEach(p => { const a = o.lobby ? o.lobby(p) : 1; if (a <= 0) return; ctx.fillStyle = rgba('#3a2a1c', 0.82 * a); figure(ctx, { x: p.x, y: p.y, s: p.h, kind: p.kind, dir: p.dir, moving: false, phase: 0, t, seed: p.x, arms: p.phone ? 'swing' : 'hug', phone: p.phone }); });
    ctx.fillStyle = mix('#141c26', '#5f676f', k); for (let x = 1232; x <= 1600; x += 92) ctx.fillRect(x - 3, 560, 6, 130); ctx.fillRect(1226, 556, 380, 10);

    // The Halden: six storeys
    ctx.fillStyle = mix('#161e29', '#9ea493', k); ctx.beginPath(); ctx.moveTo(BX + BW, BTOP); ctx.lineTo(BX + BW + 52, BTOP + 20); ctx.lineTo(BX + BW + 52, GROUND); ctx.lineTo(BX + BW, GROUND); ctx.fill();
    g = ctx.createLinearGradient(BX, 0, BX + BW, 0); g.addColorStop(0, mix('#2b3542', '#d9d3bd', k)); g.addColorStop(1, mix('#232c38', '#cfc9b2', k));
    ctx.fillStyle = g; ctx.fillRect(BX, BTOP, BW, GROUND - BTOP);
    ctx.fillStyle = mix('#1a232e', '#173e33', k); ctx.fillRect(BX - 10, BTOP - 14, BW + 72, 16);
    ctx.fillStyle = mix('#19222c', '#1d4a3c', k); ctx.fillRect(BX, 600, BW, 90);
    ctx.strokeStyle = mix('#323d4b', '#bdb8a2', k); ctx.lineWidth = 2; for (let r = 1; r < 5; r++) { ctx.beginPath(); ctx.moveTo(BX, BTOP + r * 90); ctx.lineTo(BX + BW, BTOP + r * 90); ctx.stroke(); }
    windows.forEach(w => {
      const x = BX + 16 + w.col * 71, y = BTOP + 18 + w.row * 90, on = w.lit && o.lights ? o.lights(w) : 0;
      ctx.fillStyle = mix('#111923', '#56707a', k); ctx.fillRect(x, y, 46, 58);
      if (on > 0) { ctx.fillStyle = rgba(w.warm > 0.5 ? '#f6c377' : '#ffe2ae', 0.92 * on); ctx.fillRect(x + 2, y + 2, 42, 54); ctx.fillStyle = rgba('#7a5a2c', 0.45 * on); ctx.fillRect(x + 2, y + 30, 42, 26 * w.warm); }
      ctx.fillStyle = mix('#2c3643', '#e4dfcc', k); ctx.fillRect(x + 22, y, 2, 58); ctx.fillRect(x - 3, y + 58, 52, 4);
    });
    // third floor, where the preliminary finding points
    if (o.floor3 > 0) {
      const pulse = calm.matches ? 0.8 : 0.62 + 0.38 * Math.sin(t * 2.4);
      ctx.fillStyle = rgba('#f2a84b', 0.2 * o.floor3 * pulse); ctx.fillRect(BX + 4, BTOP + 3 * 90 - 2 + 6, BW - 8, 84);
      ctx.strokeStyle = rgba('#e08a1c', 0.95 * o.floor3); ctx.lineWidth = 4; ctx.setLineDash([14, 9]); ctx.strokeRect(BX + 4, BTOP + 3 * 90 + 4, BW - 8, 84); ctx.setLineDash([]);
    }
    // entrance, awning and sign
    g = ctx.createLinearGradient(0, 606, 0, 690); g.addColorStop(0, mix('#fff1cf', '#cfdccb', k)); g.addColorStop(1, mix('#f0c27a', '#a9c0ae', k));
    ctx.fillStyle = g; ctx.fillRect(DOORX - 78, 608, 156, 82);
    ctx.fillStyle = mix('#1b242f', '#173e33', k); ctx.fillRect(DOORX - 2, 608, 4, 82); ctx.fillRect(DOORX - 80, 608, 4, 82); ctx.fillRect(DOORX + 76, 608, 4, 82);
    ctx.fillStyle = '#173e33'; ctx.fillRect(DOORX - 104, 588, 208, 20);
    ctx.fillStyle = mix('#d9ec77', '#eef4d2', k); ctx.font = '700 15px Archivo, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    try { ctx.letterSpacing = '3px'; } catch (_) { /* older browsers */ }
    ctx.fillText('THE HALDEN', DOORX + 1.5, 599);
    try { ctx.letterSpacing = '0px'; } catch (_) { /* older browsers */ }
    if (k < 1) { g = ctx.createRadialGradient(DOORX, 660, 10, DOORX, 660, 230); g.addColorStop(0, rgba('#ffd592', 0.34 * (1 - k))); g.addColorStop(1, 'rgba(255,213,146,0)'); ctx.fillStyle = g; ctx.fillRect(DOORX - 240, 430, 480, 300); }
    if (o.placard > 0) { // the inspector's notice on the door
      ctx.fillStyle = rgba('#ffffff', o.placard); ctx.fillRect(DOORX - 60, 622, 44, 54);
      ctx.fillStyle = rgba('#c2362b', o.placard); ctx.fillRect(DOORX - 60, 622, 44, 15); ctx.fillRect(DOORX - 54, 646, 32, 3); ctx.fillRect(DOORX - 54, 654, 32, 3); ctx.fillRect(DOORX - 54, 662, 22, 3);
    }
    const tape = o.tape === undefined ? smooth(0.35, 0.8, k) : o.tape;
    if (tape > 0) { ctx.fillStyle = rgba('#20262c', tape); ctx.fillRect(DOORX - 122, 628, 7, 64); ctx.fillRect(DOORX + 115, 628, 7, 64); ctx.fillStyle = rgba('#f0c040', tape); ctx.fillRect(DOORX - 122, 640, 244, 13); ctx.fillStyle = rgba('#20262c', tape); for (let x = -112; x < 118; x += 26) { ctx.beginPath(); ctx.moveTo(DOORX + x, 653); ctx.lineTo(DOORX + x + 9, 640); ctx.lineTo(DOORX + x + 17, 640); ctx.lineTo(DOORX + x + 8, 653); ctx.fill(); } }

    if (st > 0) { g = ctx.createLinearGradient(BX, 0, BX + BW, 0); g.addColorStop(0, rgba('#ff3324', 0.34 * st)); g.addColorStop(1, 'rgba(255,51,36,0)'); ctx.fillStyle = g; ctx.fillRect(BX, BTOP, BW, GROUND - BTOP); }

    // pavement
    g = ctx.createLinearGradient(0, GROUND, 0, H); g.addColorStop(0, mix('#27303b', '#8b949b', k)); g.addColorStop(0.12, mix('#141b24', '#6d767e', k)); g.addColorStop(1, mix('#090d13', '#454d55', k));
    ctx.fillStyle = g; ctx.fillRect(-300, GROUND, W + 500, 260);
    ctx.fillStyle = mix('#3a4553', '#a7afb5', k); ctx.fillRect(-300, GROUND, W + 500, 3); ctx.fillStyle = mix('#0b1016', '#59626a', k); ctx.fillRect(-300, 714, W + 500, 3);
    reflection(DOORX, 150, '#ffd592', 0.5 * (1 - k), 1);
    reflection(1416, 360, '#f2b866', 0.3 * (1 - k * 0.7), 2, 130);
    if (o.lights) windows.filter(w => w.lit && w.row > 2).forEach((w, i) => reflection(BX + 39 + w.col * 71, 40, '#f2b866', 0.1 * o.lights(w), 5 + i, 90));
    reflection(150, 250, '#ff3324', 0.42 * st, 3, 170);
    reflection(800, 1500, '#aeb8c2', 0.16 * k, 9, 170);

    if (engine > 0) { // fire engine, partly out of frame
      ctx.globalAlpha = engine;
      const red = mix('#5c1410', '#b8271f', k), redDark = mix('#3f0e0b', '#8f1d17', k), steel = mix('#7d807e', '#e6e6e0', k), dark = mix('#0a0d11', '#232a31', k);
      ctx.strokeStyle = steel; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-160, 572); ctx.lineTo(138, 572); ctx.moveTo(-160, 583); ctx.lineTo(138, 583); for (let x = -148; x < 138; x += 18) { ctx.moveTo(x, 572); ctx.lineTo(x, 583); } ctx.stroke();
      ctx.fillStyle = red; ctx.beginPath(); ctx.roundRect(-160, 588, 312, 86, [0, 6, 4, 0]); ctx.fill();
      ctx.beginPath(); ctx.moveTo(150, 674); ctx.lineTo(150, 598); ctx.quadraticCurveTo(150, 594, 156, 594); ctx.lineTo(228, 594); ctx.quadraticCurveTo(236, 594, 241, 601); ctx.lineTo(262, 632); ctx.lineTo(262, 674); ctx.fill();
      ctx.fillStyle = redDark; [-70, -12, 46, 104].forEach(x => ctx.fillRect(x, 596, 3, 70)); ctx.fillRect(170, 640, 3, 34);
      ctx.fillStyle = steel; ctx.fillRect(-160, 642, 422, 6);
      ctx.fillStyle = mix('#101821', '#2c3944', k); ctx.beginPath(); ctx.moveTo(178, 604); ctx.lineTo(226, 604); ctx.lineTo(249, 634); ctx.lineTo(178, 634); ctx.fill();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(254, 656, 18, 16, 3); ctx.fill();
      ctx.fillStyle = rgba('#fff0c8', 0.95 - 0.5 * k); ctx.beginPath(); ctx.roundRect(256, 644, 7, 9, 2); ctx.fill();
      [-40, 206].forEach(x => { ctx.fillStyle = '#07090c'; ctx.beginPath(); ctx.arc(x, 676, 22, 0, 7); ctx.fill(); ctx.fillStyle = mix('#2a323c', '#8a9197', k); ctx.beginPath(); ctx.arc(x, 676, 9, 0, 7); ctx.fill(); });
      ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(182, 584, 54, 5, 2); ctx.fill();
      ctx.fillStyle = rgba('#ff4636', 0.35 + 0.65 * st); ctx.beginPath(); ctx.roundRect(184, 574, 50, 11, 4); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'lighter';
      g = ctx.createRadialGradient(209, 580, 4, 209, 580, 430); g.addColorStop(0, rgba('#ff4030', 0.62 * st)); g.addColorStop(0.3, rgba('#ff3324', 0.2 * st)); g.addColorStop(1, 'rgba(255,51,36,0)');
      ctx.fillStyle = g; ctx.fillRect(-230, 160, 870, 740);
      ctx.globalCompositeOperation = 'source-over';
    }

    if (o.van > 0) { // the city inspector's van, parked by the entrance
      ctx.globalAlpha = o.van;
      const vx = 118;
      ctx.fillStyle = '#e9ecee'; ctx.beginPath(); ctx.roundRect(vx, 604, 210, 70, [10, 6, 4, 4]); ctx.fill();
      ctx.beginPath(); ctx.moveTo(vx + 208, 674); ctx.lineTo(vx + 208, 628); ctx.lineTo(vx + 236, 634); ctx.quadraticCurveTo(vx + 252, 640, 252 + vx, 656); ctx.lineTo(vx + 252, 674); ctx.fill();
      ctx.fillStyle = '#31404e'; ctx.beginPath(); ctx.moveTo(vx + 168, 614); ctx.lineTo(vx + 204, 614); ctx.lineTo(vx + 204, 640); ctx.lineTo(vx + 168, 640); ctx.fill();
      ctx.fillStyle = '#2d4f7a'; ctx.fillRect(vx, 648, 252, 7);
      ctx.fillStyle = '#31404e'; ctx.font = '700 11px Archivo, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      try { ctx.letterSpacing = '1.5px'; } catch (_) { /* older browsers */ }
      ctx.fillText('CITY INSPECTOR', vx + 16, 630);
      try { ctx.letterSpacing = '0px'; } catch (_) { /* older browsers */ }
      [vx + 46, vx + 206].forEach(x => { ctx.fillStyle = '#12161b'; ctx.beginPath(); ctx.arc(x, 678, 17, 0, 7); ctx.fill(); ctx.fillStyle = '#8a9197'; ctx.beginPath(); ctx.arc(x, 678, 7, 0, 7); ctx.fill(); });
      const beacon = calm.matches ? 0.6 : 0.25 + 0.75 * Math.pow(Math.max(0, Math.sin(t * Math.PI * 1.6)), 2);
      ctx.fillStyle = rgba('#f2a84b', 0.5 + 0.5 * beacon); ctx.beginPath(); ctx.roundRect(vx + 96, 596, 26, 9, 4); ctx.fill();
      ctx.globalCompositeOperation = 'lighter'; g = ctx.createRadialGradient(vx + 109, 600, 2, vx + 109, 600, 90); g.addColorStop(0, rgba('#f2a84b', 0.35 * beacon)); g.addColorStop(1, 'rgba(242,168,75,0)'); ctx.fillStyle = g; ctx.fillRect(vx + 10, 505, 200, 190); ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    // streetlamp and its cone
    const lampOn = 1 - smooth(0.15, 0.55, k);
    if (lampOn > 0) { ctx.globalCompositeOperation = 'lighter'; g = ctx.createLinearGradient(0, 340, 0, 760); g.addColorStop(0, rgba('#f2a84b', 0.34 * lampOn)); g.addColorStop(1, 'rgba(242,168,75,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(1066, 340); ctx.lineTo(1086, 340); ctx.lineTo(1250, 770); ctx.lineTo(905, 770); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; reflection(1078, 210, '#f2a84b', 0.34 * lampOn, 4, 110); }
    ctx.strokeStyle = mix('#0b1016', '#39424a', k); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1148, 692); ctx.lineTo(1148, 352); ctx.quadraticCurveTo(1148, 326, 1118, 326); ctx.lineTo(1072, 330); ctx.stroke();
    ctx.fillStyle = lampOn > 0 ? rgba('#ffd28a', 0.4 + 0.6 * lampOn) : mix('#0b1016', '#39424a', k); ctx.beginPath(); ctx.roundRect(1056, 326, 40, 11, 5); ctx.fill();

    // people leaving
    const crowd = o.walk === null || o.walk === undefined ? 0 : 1 - smooth(0.02, 0.5, k);
    if (crowd > 0) {
      const all = [];
      standers.forEach(p => all.push({ ...p, y0: p.y, moving: false, phase: 0 }));
      walkers.forEach(wk => {
        const dt = o.walk - wk.start; if (dt < 0) return;
        const x = DOORX + (wk.lane - 708) * 0.55 + dt * wk.speed * wk.s * 0.78; if (x > W + 80) return;
        const emerge = smooth(0, 0.9, dt);
        all.push({ x, y: lerp(694, wk.lane, emerge), y0: lerp(694, wk.lane, emerge), s: wk.s * lerp(0.8, 1, emerge), kind: wk.kind, dir: 1, moving: true, phase: frac(wk.phase + dt * wk.cadence * (calm.matches ? 0 : 1) * 0.98), phone: wk.phone, seed: wk.seed });
      });
      all.sort((a, b) => a.y0 - b.y0).forEach(p => {
        const q = { ...p, t };
        ctx.save(); ctx.globalAlpha = 0.2 * crowd; ctx.fillStyle = '#05080c'; ctx.translate(0, p.y); ctx.scale(1, -0.55); ctx.translate(0, -p.y); figure(ctx, q); ctx.restore();
        ctx.globalAlpha = crowd;
        ctx.fillStyle = rgba('#ff4a38', 0.75 * st * clamp(1.25 - p.x / 900)); figure(ctx, { ...q, x: p.x - 2.2 * p.s });
        ctx.fillStyle = '#070b10'; const hand = figure(ctx, q);
        if (p.phone && hand) {
          ctx.fillStyle = '#dfeaf5'; ctx.fillRect(hand[0] - 2 * p.s, hand[1] - 6 * p.s, 4.5 * p.s, 8 * p.s);
          ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(hand[0], hand[1] - 6 * p.s, 1, hand[0], hand[1] - 6 * p.s, 34 * p.s); gg.addColorStop(0, 'rgba(200,222,245,.42)'); gg.addColorStop(1, 'rgba(200,222,245,0)'); ctx.fillStyle = gg; ctx.fillRect(hand[0] - 40 * p.s, hand[1] - 46 * p.s, 80 * p.s, 80 * p.s); ctx.globalCompositeOperation = 'source-over';
        }
        if (!p.moving && !calm.matches) { // breath in cold air
          const c = frac(t / 3.4 + p.seed), a = Math.sin(clamp(c * 2.4) * Math.PI) * 0.2;
          if (a > 0.01) { ctx.fillStyle = rgba('#c7d2de', a); ctx.beginPath(); ctx.arc(p.x + p.dir * (9 + c * 26) * p.s, p.y - (91 + c * 12) * p.s, (2.5 + c * 12) * p.s, 0, 7); ctx.fill(); }
        }
        ctx.globalAlpha = 1;
      });
    }
    ctx.restore();

    // rain and splashes sit closest to the lens
    const move = calm.matches ? 0 : t;
    rain.forEach(d => {
      const span = W + 300, y = ((d.y + d.v * move) % (H + 120)) - 60, x = (((d.x - 0.2 * d.v * move) % span) + span) % span - 150;
      const inCone = lampOn > 0 && y > 340 && y < 770 && Math.abs(x - SHIFT - (1076 + (y - 340) * 0.004)) < 12 + (y - 340) * 0.39;
      ctx.strokeStyle = inCone ? rgba('#ffd9a0', (d.near ? 0.7 : 0.45) * lampOn) : rgba('#c4d2e2', d.near ? lerp(0.3, 0.42, k) : lerp(0.15, 0.25, k));
      ctx.lineWidth = d.near ? 1.7 : 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 0.2 * d.len, y + d.len); ctx.stroke();
    });
    for (let i = 0; i < 46; i++) {
      const period = 0.55 + hash(i) * 0.7, c = move / period + hash(i + 50), p = frac(c), n = Math.floor(c);
      const x = hash(i * 13 + n * 7.7) * W, y = 722 + hash(i * 3 + n * 1.3) * 168, sc = 0.6 + (y - 722) / 168;
      ctx.strokeStyle = rgba('#c4d2e2', (1 - p) * 0.3); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(x, y, (2 + p * 11) * sc, (0.8 + p * 3.2) * sc, 0, 0, 7); ctx.stroke();
    }
    // lens: darker corners, and a darker patch of sky behind the captions
    g = ctx.createRadialGradient(W / 2, H * 0.52, H * 0.35, W / 2, H * 0.52, H * 1.05); g.addColorStop(0, 'rgba(4,7,11,0)'); g.addColorStop(1, rgba('#04070b', lerp(0.62, 0.3, k)));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    g = ctx.createRadialGradient(250, 150, 40, 250, 150, 640); g.addColorStop(0, rgba('#06090e', lerp(0.3, 0.5, k))); g.addColorStop(1, 'rgba(6,9,14,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 900, 800);
  }

  /* ======================================================= resident video */
  const VW = 450, VH = 800, WORLD = 1320;
  const crackPts = (() => {
    const r = rng(9), pts = []; const a = [72, 1010], b = [262, 320], c = [322, 96];
    const seg = (p, q, count, amp) => { for (let i = 0; i <= count; i++) { const u = i / count, nx = -(q[1] - p[1]), ny = q[0] - p[0], L = Math.hypot(nx, ny), off = (r() - 0.5) * amp * (i % 2 ? 1 : -0.7); pts.push([lerp(p[0], q[0], u) + nx / L * off, lerp(p[1], q[1], u) + ny / L * off]); } };
    seg(a, b, 26, 16); seg(b, c, 9, 7);
    const twigs = [5, 9, 14, 19, 23, 30].map(i => { const p = pts[i], ang = r() * 6.28, len = 18 + r() * 34; return [p, [p[0] + Math.cos(ang) * len * 0.5 + (r() - .5) * 8, p[1] + Math.sin(ang) * len * 0.5], [p[0] + Math.cos(ang) * len, p[1] + Math.sin(ang) * len + (r() - .5) * 10]]; });
    return { pts, twigs };
  })();
  function makeVideo() {
    const vid = document.createElement('canvas'); vid.width = VW; vid.height = VH; const v = vid.getContext('2d');
    const steps = [225, 112, 56, 28].map(w => { const c = document.createElement('canvas'); c.width = w; c.height = Math.round(w * VH / VW); return c; });
    function frame(t, start) {
      const u = t - start, tilt = smooth(0.2, 5.6, u), zoom = 1 + 0.16 * smooth(1.5, 6.4, u), shake = calm.matches ? 0 : 1;
      const dx = shake * (5 * Math.sin(t * 2.1) + 2.4 * Math.sin(t * 5.3 + 1)), dy = shake * (4 * Math.sin(t * 1.7 + 2) + 2 * Math.sin(t * 6.1)), rot = shake * 0.011 * Math.sin(t * 1.3);
      const oy = lerp(WORLD - VH - 30, 20, tilt);
      v.setTransform(1, 0, 0, 1, 0, 0); v.fillStyle = '#0d0f10'; v.fillRect(0, 0, VW, VH);
      v.translate(VW / 2, VH / 2); v.rotate(rot); v.scale(zoom, zoom); v.translate(-VW / 2 + dx, -VH / 2 - oy + dy);
      let g = v.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, '#8f8d82'); g.addColorStop(1, '#b6b2a4'); v.fillStyle = g; v.fillRect(-80, -80, VW + 160, 380);
      v.strokeStyle = 'rgba(70,68,60,.35)'; v.lineWidth = 2; [[-80, 140, 560, 60], [-80, 215, 560, 165]].forEach(l => { v.beginPath(); v.moveTo(l[0], l[1]); v.lineTo(l[2], l[3]); v.stroke(); });
      g = v.createLinearGradient(0, 300, 0, WORLD); g.addColorStop(0, '#d9d3c1'); g.addColorStop(0.5, '#c2bcaa'); g.addColorStop(1, '#9d9889'); v.fillStyle = g; v.fillRect(-80, 300, VW + 160, WORLD);
      v.fillStyle = 'rgba(60,58,50,.5)'; v.fillRect(-80, 297, VW + 160, 5);
      v.fillStyle = '#f7f6ea'; v.fillRect(70, 150, 130, 22); g = v.createRadialGradient(135, 170, 10, 135, 300, 420); g.addColorStop(0, 'rgba(244,250,236,.5)'); g.addColorStop(1, 'rgba(244,250,236,0)'); v.fillStyle = g; v.fillRect(-80, -80, VW + 160, 760);
      // east stairwell door and exit sign
      v.fillStyle = '#6f7468'; v.fillRect(296, 506, 240, 900); v.fillStyle = '#2f5546'; v.fillRect(310, 520, 220, 900);
      v.fillStyle = '#d4e6dc'; v.fillRect(346, 600, 44, 170); v.strokeStyle = 'rgba(40,60,52,.5)'; v.lineWidth = 1; for (let i = 0; i < 9; i++) { v.beginPath(); v.moveTo(346, 600 + i * 20); v.lineTo(390, 620 + i * 20); v.stroke(); v.beginPath(); v.moveTo(390, 600 + i * 20); v.lineTo(346, 620 + i * 20); v.stroke(); }
      v.fillStyle = '#3d1512'; v.fillRect(330, 432, 104, 46); v.fillStyle = '#ff5a48'; v.font = '700 30px Archivo, sans-serif'; v.textAlign = 'center'; v.textBaseline = 'middle'; v.fillText('EXIT', 382, 456);
      g = v.createRadialGradient(382, 456, 6, 382, 456, 150); g.addColorStop(0, 'rgba(255,80,60,.3)'); g.addColorStop(1, 'rgba(255,80,60,0)'); v.fillStyle = g; v.fillRect(230, 300, 300, 310);
      v.fillStyle = '#ece8da'; v.fillRect(214, 640, 62, 40); v.fillStyle = '#3b4036'; v.font = '700 13px Archivo, sans-serif'; v.fillText('STAIR E', 245, 654); v.font = '600 12px Archivo, sans-serif'; v.fillText('Floor 3', 245, 670);
      // the crack: chipped paint edge, then the dark gap
      const P = crackPts.pts; v.lineJoin = 'round'; v.lineCap = 'round';
      const run = (off, style, widthFn) => { for (let i = 0; i < P.length - 1; i++) { const mid = 1 - Math.abs(i / (P.length - 1) - 0.52) * 1.7; v.strokeStyle = style; v.lineWidth = Math.max(0.6, widthFn(clamp(mid, 0.12, 1))); v.beginPath(); v.moveTo(P[i][0] + off, P[i][1] + off); v.lineTo(P[i + 1][0] + off, P[i + 1][1] + off); v.stroke(); } };
      run(1.6, 'rgba(250,247,236,.75)', m => 2.2 + m * 2.6); run(-0.8, 'rgba(120,112,96,.45)', m => 3 + m * 4.4); run(0, '#231f1a', m => 0.9 + m * 3.3);
      crackPts.twigs.forEach(tw => { v.strokeStyle = '#2b2620'; v.lineWidth = 1.1; v.beginPath(); v.moveTo(tw[0][0], tw[0][1]); v.lineTo(tw[1][0], tw[1][1]); v.lineTo(tw[2][0], tw[2][1]); v.stroke(); });
      // low-light phone camera: cool cast, grain, dark corners
      v.setTransform(1, 0, 0, 1, 0, 0);
      v.fillStyle = 'rgba(30,70,74,.16)'; v.fillRect(0, 0, VW, VH);
      const f = Math.floor(t * 24); for (let i = 0; i < 260; i++) { v.fillStyle = hash(i + f * 3.1) > 0.5 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.07)'; v.fillRect(hash(i * 2.3 + f) * VW, hash(i * 5.1 + f * 1.7) * VH, 2, 2); }
      g = v.createRadialGradient(VW / 2, VH / 2, VH * 0.3, VW / 2, VH / 2, VH * 0.72); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.5)'); v.fillStyle = g; v.fillRect(0, 0, VW, VH);
    }
    // Broadcast treatment for vertical phone video: a blurred copy fills the frame behind it.
    return function shot(ctx, t, start) {
      frame(t, start);
      let from = vid; steps.forEach(c => { const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(from, 0, 0, c.width, c.height); from = c; });
      const sh = from.width * 9 / 16; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(from, 0, (from.height - sh) / 2, from.width, sh, 0, 0, W, H);
      ctx.fillStyle = 'rgba(8,12,18,.74)'; ctx.fillRect(0, 0, W, H);
      const w = H * VW / VH, x = W * 0.64 - w / 2;
      ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(x - 10, 0, w + 20, H);
      ctx.drawImage(vid, x, 0, w, H);
    };
  }

  /* ======================================================= what each film paints */
  // Each painter draws the street for time t and returns how soft the picture
  // should go (0 sharp, 1 blurred and dimmed behind cards).
  const PAINT = {
    update1(ctx, t, film, kit) {
      const s = film.shots, fadeIn = from => { const a = 1 - smooth(from, from + 0.4, t); if (a > 0) { ctx.fillStyle = 'rgba(5,7,10,' + a + ')'; ctx.fillRect(0, 0, W, H); } };
      if (t < s.video) { ctx.fillStyle = '#05070a'; ctx.fillRect(0, 0, W, H); }
      else if (t < s.night) { kit.video(ctx, t, s.video); fadeIn(s.video); }
      else {
        exterior(ctx, t, { k: smooth(s.lapse + 0.3, s.lapse + 2.6, t), push: smooth(0, 14, t - s.night), walk: t - s.night, engine: 1, lights: w => 1 - smooth(w.off, w.off + 0.25, t), lobby: p => smooth(p.at, p.at + 1.2, t) });
        fadeIn(s.night);
      }
      return smooth(s.lock - 0.2, s.lock + 0.7, t);
    },
    update2(ctx, t, film) {
      exterior(ctx, t, { k: 1, push: smooth(0, 12, t), walk: null, engine: 0, tape: 1, van: 1 });
      return smooth(film.shots.post - 0.2, film.shots.post + 0.7, t);
    },
    update3(ctx, t, film) {
      exterior(ctx, t, { k: 1, push: smooth(0, 16, t), walk: null, engine: 0, tape: 1, placard: 1, floor3: smooth(1.2, 2.4, t) });
      return smooth(film.shots.statements - 0.2, film.shots.statements + 0.7, t);
    }
  };
  const POSTER = {
    update1: (ctx, kit) => exterior(ctx, 13.2, { k: 0, push: 0.4, walk: 5.2, engine: 1, lights: () => 1, lobby: () => 1 }),
    update2: ctx => exterior(ctx, 2.4, { k: 1, push: 0.2, walk: null, engine: 0, tape: 1, van: 1 }),
    update3: ctx => exterior(ctx, 3, { k: 1, push: 0.2, walk: null, engine: 0, tape: 1, placard: 1, floor3: 1 }),
    // before anything has happened: lights on, nobody outside
    setup: ctx => exterior(ctx, 4.2, { k: 0, push: 0.5, walk: null, engine: 0, tape: 0, lights: () => 1, lobby: () => 0 })
  };

  /* ================================================================= sound */
  const EFFECTS = ['crack', 'rain', 'alarm', 'steps', 'vibrate', 'notify', 'page', 'phone', 'pickup', 'click'];
  const bytes = new Map();   // clip id -> Promise<ArrayBuffer | null>
  const voiceVersion = window.CrisisVoicesVersion ? '?v=' + window.CrisisVoicesVersion : ''; // new clips replace cached ones
  const load = id => { if (!bytes.has(id)) bytes.set(id, fetch(EFFECTS.includes(id) ? 'assets/effects/' + id + '.mp3' : 'assets/voices/' + id + '.mp3' + voiceVersion).then(r => r.ok ? r.arrayBuffer() : null).catch(() => null)); return bytes.get(id); };
  const clipIds = film => [...new Set([...film.cues.map(c => c.id), ...film.voices.map(v => v.id)])].filter(id => id !== 'tone' && id !== 'thud');
  function synth(context, id) {
    const rate = context.sampleRate;
    if (id === 'tone') { // quiet hallway air
      const count = rate * 3, buf = context.createBuffer(1, count, rate), d = buf.getChannelData(0), r = rng(2026); let last = 0;
      for (let i = 0; i < count; i++) { last = (last + 0.02 * (r() * 2 - 1)) / 1.02; d[i] = last * 0.9 + 0.004 * Math.sin(i / rate * Math.PI * 2 * 120); }
      for (let i = 0; i < 2000; i++) { const k = i / 2000; d[i] *= k; d[count - 1 - i] *= k; }
      return buf;
    }
    const count = Math.round(rate * 0.4), buf = context.createBuffer(1, count, rate), d = buf.getChannelData(0), r = rng(88); // a rubber stamp
    for (let i = 0; i < count; i++) { const s = i / rate; d[i] = Math.sin(2 * Math.PI * (58 * s + 60 * (1 - Math.exp(-s * 22)) / 22)) * Math.exp(-s * 15) * 0.9 + (r() * 2 - 1) * Math.exp(-s * 70) * 0.3; }
    return buf;
  }
  const decode = (context, data) => new Promise(done => { try { context.decodeAudioData(data.slice(0), done, () => done(null)); } catch (_) { done(null); } });
  async function buffersFor(context, film) {
    const clips = { tone: synth(context, 'tone'), thud: synth(context, 'thud') };
    await Promise.all(clipIds(film).map(async id => { const data = await load(id); if (data) { const buf = await decode(context, data); if (buf) clips[id] = buf; } }));
    return clips;
  }
  // Schedules every cue from time t onto any audio context, live or offline.
  function schedule(context, buses, clips, film, t) {
    const started = [], now = context.currentTime + 0.03;
    const start = (c, bus, gainValue) => {
      const buf = clips[c.id]; if (!buf) return;
      const end = c.until ?? c.at + buf.duration; if (t >= end) return;
      const src = context.createBufferSource(), g = context.createGain(); src.buffer = buf; src.loop = !!c.loop; src.playbackRate.value = c.rate || 1;
      const begin = Math.max(c.at, t), when = now + (begin - t), offset = (begin - c.at) % buf.duration, fade = c.fade || 0.02;
      const ducked = !!c.duck && begin >= c.duck[0];
      let level = gainValue * (ducked ? c.duck[1] : 1);
      g.gain.setValueAtTime(begin > c.at ? level : 0, when); g.gain.linearRampToValueAtTime(level, when + (begin > c.at ? 0.05 : fade));
      if (c.duck && !ducked) { const at = now + (c.duck[0] - t); g.gain.setValueAtTime(level, at); level = gainValue * c.duck[1]; g.gain.linearRampToValueAtTime(level, at + 1); }
      src.connect(g); g.connect(bus);
      try {
        src.start(when, offset); started.push(src);
        if (c.until) { const off = now + (c.until - t); g.gain.setValueAtTime(level, Math.max(when + 0.06, off - fade)); g.gain.linearRampToValueAtTime(0, off); src.stop(off + 0.05); }
      } catch (_) { /* a clip that cannot start is skipped; the picture carries on */ }
    };
    film.cues.forEach(c => start(c, buses[c.bus] || buses.fx, c.gain));
    // The street quietens while a quoted voice is read.
    const under = buses.under.gain; under.cancelScheduledValues(now); let speaking = false;
    film.voices.forEach(v => {
      const buf = clips[v.id]; if (!buf) return;
      start(v, buses.voice, v.gain || 1);
      const a = v.at, b = v.at + buf.duration;
      if (t >= b) return;
      if (t >= a) { speaking = true; under.setValueAtTime(0.42, now); }
      else { under.setValueAtTime(1, now + Math.max(0, a - t - 0.35)); under.linearRampToValueAtTime(0.42, now + (a - t)); }
      under.setValueAtTime(0.42, now + (b - t)); under.linearRampToValueAtTime(1, now + (b - t) + 0.5);
    });
    if (!speaking) under.setValueAtTime(under.value || 1, now);
    return started;
  }
  function wire(context) {
    const master = context.createGain(), under = context.createGain(), bed = context.createGain(), fx = context.createGain(), voice = context.createGain();
    master.gain.value = 0.92; bed.connect(under); under.connect(master); fx.connect(master); voice.connect(master); master.connect(context.destination);
    return { master, under, bed, fx, voice };
  }
  // Renders a film's whole mix offline and reports level per second. Used by the checks in scripts/.
  async function measureMix(stageId) {
    const film = FILMS[stageId], rate = 44100, off = new OfflineAudioContext(1, Math.ceil(rate * film.length), rate);
    const clips = await buffersFor(off, film); schedule(off, wire(off), clips, film, 0);
    const data = (await off.startRendering()).getChannelData(0), secs = [];
    for (let sec = 0; sec < Math.floor(film.length); sec++) { let sum = 0, peak = 0; for (let i = sec * rate; i < (sec + 1) * rate; i++) { const x = Math.abs(data[i]); sum += x * x; if (x > peak) peak = x; } secs.push([+(10 * Math.log10(sum / rate + 1e-12)).toFixed(1), +(20 * Math.log10(peak + 1e-9)).toFixed(1)]); }
    return { missing: clipIds(film).filter(id => !clips[id]), secs };
  }

  /* ================================================================ markup */
  function markup(stageId) {
    const film = FILMS[stageId]; if (!film) return '';
    const total = stamp(film.length);
    return '<section class="film" data-film="' + escapeHtml(stageId) + '" aria-label="' + escapeHtml(film.label) + ' overview">' +
      '<div class="film-stage" data-film-stage aria-hidden="true"><canvas></canvas>' + film.overlay +
      '<button class="film-bigplay" type="button" tabindex="-1" data-film-bigplay>Watch ' + escapeHtml(film.label) + '<small>' + spokenLength(film.length) + ', with voices and sound</small></button></div>' +
      '<div class="film-controls"><button type="button" class="film-play" data-film-play>Play</button>' +
      '<input type="range" min="0" max="' + film.length.toFixed(2) + '" step="0.05" value="0" aria-label="Position in the overview" data-film-seek>' +
      '<output data-film-clock>0:00 / ' + total + '</output>' +
      '<button type="button" aria-pressed="true" data-film-voices>Voices on</button>' +
      '<button type="button" aria-pressed="true" data-film-sound>Sound on</button>' +
      '<button type="button" data-film-full>Full screen</button></div>' +
      '<div class="film-foot"><p>AI voices read words quoted in the documents, and the sound is dramatized. Read the documents below for the full update. <a href="audio-credits.html" target="_blank" rel="noopener">Sound and voice credits</a></p>' +
      '<details><summary>Read the text of this overview</summary><ol>' + film.transcript.map(line => '<li>' + escapeHtml(line) + '</li>').join('') + '</ol></details></div>' +
      '<p class="screen-reader-only" role="status" data-film-status>Overview ready. Press Play to start. Voices and sound can be turned off separately.</p></section>';
  }

  /* ================================================================= mount */
  function mount(container) {
    const root = container && container.querySelector('[data-film]'); if (!root) return null;
    const id = root.dataset.film, film = FILMS[id], paintFilm = PAINT[id];
    const stage = root.querySelector('[data-film-stage]'), cv = stage.querySelector('canvas'), ctx = cv.getContext('2d');
    const playBtn = root.querySelector('[data-film-play]'), seek = root.querySelector('[data-film-seek]'), clock = root.querySelector('[data-film-clock]');
    const voicesBtn = root.querySelector('[data-film-voices]'), soundBtn = root.querySelector('[data-film-sound]'), fullBtn = root.querySelector('[data-film-full]'), status = root.querySelector('[data-film-status]');
    const kit = { video: makeVideo() };
    let t = 0, playing = false, started = false, anchor = 0, raf = 0, destroyed = false, gap = 0;

    // ---- timed page elements
    const timed = [...stage.querySelectorAll('[data-in]')].map(el => ({ el, at: +el.dataset.in, until: +(el.dataset.out || 1e9), rise: el.dataset.rise || 'rise' }));
    const stacks = [...stage.querySelectorAll('.stack')].map(el => ({ el, cards: [...el.querySelectorAll('.note')].map(card => ({ el: card, at: +card.dataset.at, h: 0 })) }));
    const dots = [...stage.querySelectorAll('.typing i')];
    // Phrases light up while their voice reads them; time is shared out by length.
    const hot = [];
    stage.querySelectorAll('[data-speak]').forEach(el => {
      const spans = [...el.querySelectorAll('span')], voiceId = el.dataset.speak;
      const cues = film.voices.filter(v => v.id === voiceId); if (!cues.length) return;
      // A line read more than once (the repeated closing note) uses the cue nearest to it on screen.
      const shown = +(el.closest('[data-in]')?.dataset.in || el.closest('[data-at]')?.dataset.at || 0);
      const cue = cues.reduce((best, c) => Math.abs(c.at - shown) < Math.abs(best.at - shown) ? c : best);
      const seconds = (VOICES[voiceId] || {}).seconds || 3, weights = spans.map(s => s.textContent.length + 6), sum = weights.reduce((a, b) => a + b, 0);
      let at = cue.at; spans.forEach((span, i) => { const d = seconds * weights[i] / sum; hot.push({ el: span, a: at, b: at + d }); at += d; });
    });
    function measure() { gap = stage.clientWidth * 0.0085; stacks.forEach(s => s.cards.forEach(c => { c.h = c.el.offsetHeight; })); }
    function overlays() {
      timed.forEach(o => {
        const p = out3((t - o.at) / (o.rise === 'stamp' ? 0.28 : 0.55)), a = clamp((t - o.at) / (o.rise === 'stamp' ? 0.1 : 0.4)) * (1 - smooth(o.until - 0.4, o.until, t));
        o.el.style.opacity = a.toFixed(3);
        o.el.style.visibility = a <= 0.001 ? 'hidden' : 'visible';
        if (o.rise === 'rise') o.el.style.transform = calm.matches ? 'none' : 'translateY(' + ((1 - p) * 0.7).toFixed(3) + 'cqw)';
        else if (o.rise === 'stamp') o.el.style.transform = 'rotate(-5deg) scale(' + (calm.matches ? 1 : lerp(1.9, 1, p)).toFixed(4) + ')';
      });
      stacks.forEach(s => {
        let buzz = 0;
        s.cards.forEach((c, i) => {
          const p = out3((t - c.at) / 0.5);
          let y = 0; for (let j = i + 1; j < s.cards.length; j++) y += (s.cards[j].h + gap) * out3((t - s.cards[j].at) / 0.5);
          c.el.style.opacity = clamp((t - c.at) / 0.22).toFixed(3);
          c.el.style.visibility = t < c.at ? 'hidden' : 'visible';
          c.el.style.transform = 'translateY(' + (y - (1 - p) * c.h * 0.5).toFixed(2) + 'px) scale(' + lerp(0.94, 1, p).toFixed(4) + ')';
          const d = t - c.at; if (d > 0 && d < 0.5 && !calm.matches) buzz += Math.sin(d * Math.PI * 2 * 17) * Math.exp(-d * 8);
        });
        s.el.style.transform = 'translateX(' + (buzz * 0.2).toFixed(3) + 'cqw)';
      });
      hot.forEach(h => { const now = t >= h.a && t < h.b, done = t >= h.b; if (h.now !== now) { h.el.classList.toggle('is-hot', now); h.now = now; } if (h.done !== done) { h.el.classList.toggle('is-said', done); h.done = done; } });
      dots.forEach((d, i) => { d.style.opacity = (0.3 + 0.7 * Math.max(0, Math.sin(t * 5.2 - i * 0.9))).toFixed(2); });
    }

    // ---- picture
    function draw() {
      const sx = cv.width / W; ctx.setTransform(sx, 0, 0, sx, 0, 0);
      let soft = 0;
      if (t === 0 && !started) { POSTER[id](ctx, kit); ctx.setTransform(sx, 0, 0, sx, 0, 0); ctx.fillStyle = 'rgba(5,7,10,.5)'; ctx.fillRect(0, 0, W, H); }
      else soft = paintFilm(ctx, t, film, kit);
      cv.style.filter = soft > 0 ? 'blur(' + (soft * 1.15).toFixed(3) + 'cqw) brightness(' + lerp(1, 0.5, soft).toFixed(3) + ') saturate(' + lerp(1, 0.8, soft).toFixed(3) + ')' : 'none';
      cv.style.transform = soft > 0 ? 'scale(' + (1 + soft * 0.05).toFixed(4) + ')' : 'none';
      overlays();
    }
    function paint() { draw(); seek.value = String(t); seek.setAttribute('aria-valuetext', stamp(t) + ' of ' + stamp(film.length)); clock.textContent = stamp(t) + ' / ' + stamp(film.length); }

    // ---- sound
    let ac = null, buses = null, clips = null, live = [], ready = false, voicesOn = true, soundOn = true;
    clipIds(film).forEach(load); // fetch the small audio files ahead of the first Play
    function levels() { if (!buses) return; buses.voice.gain.value = voicesOn ? 1 : 0; buses.bed.gain.value = soundOn ? 1 : 0; buses.fx.gain.value = soundOn ? 1 : 0; }
    function stopSound() { live.forEach(node => { try { node.stop(); } catch (_) { /* already stopped */ } }); live = []; }
    function startSound() { if (!ac || !ready) return; stopSound(); live = schedule(ac, buses, clips, film, t); }
    // Called from the Play click. Pictures never wait for sound: clips join in once decoded.
    function wakeSound() {
      if (ac) { if (ac.state === 'suspended') ac.resume().catch(() => {}); return; }
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      try { ac = new AC(); } catch (_) { ac = null; return; }
      buses = wire(ac); levels();
      if (ac.state === 'suspended') ac.resume().catch(() => {});
      buffersFor(ac, film).then(result => { if (destroyed) return; clips = result; ready = true; if (playing) startSound(); });
    }

    // ---- transport
    function setPlaying(value) {
      playing = value; if (value) started = true;
      playBtn.textContent = value ? 'Pause' : t >= film.length ? 'Play again' : t > 0 ? 'Resume' : 'Play';
      root.classList.toggle('is-playing', value); root.classList.toggle('has-started', started);
    }
    function tick(now) { t = Math.min(film.length, (now - anchor) / 1000); paint(); if (t >= film.length) { pause(); status.textContent = 'The overview has finished.'; return; } raf = requestAnimationFrame(tick); }
    function play() {
      if (playing || destroyed) return; if (t >= film.length) t = 0;
      wakeSound(); setPlaying(true);
      anchor = performance.now() - t * 1000; startSound(); raf = requestAnimationFrame(tick);
      status.textContent = 'Playing.';
    }
    function pause() { cancelAnimationFrame(raf); stopSound(); if (playing) status.textContent = 'Paused at ' + stamp(t) + '.'; setPlaying(false); }

    const onClick = event => {
      const button = event.target.closest('button');
      if (button === playBtn) return playing ? pause() : play();
      if (button && button.hasAttribute('data-film-bigplay')) return play();
      if (button === voicesBtn) { voicesOn = !voicesOn; voicesBtn.textContent = voicesOn ? 'Voices on' : 'Voices off'; voicesBtn.setAttribute('aria-pressed', String(voicesOn)); return levels(); }
      if (button === soundBtn) { soundOn = !soundOn; soundBtn.textContent = soundOn ? 'Sound on' : 'Sound off'; soundBtn.setAttribute('aria-pressed', String(soundOn)); return levels(); }
      if (button === fullBtn) { try { (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen()).catch(() => { fullBtn.hidden = true; }); } catch (_) { fullBtn.hidden = true; } return; }
      if (!button && event.target.closest('[data-film-stage]')) playing ? pause() : play();
    };
    const onSeek = () => { t = clamp(+seek.value, 0, film.length); started = true; if (playing) { anchor = performance.now() - t * 1000; startSound(); } else setPlaying(false); paint(); };
    // Opening a document, a reference or another stage stops the film.
    const onPageClick = event => { if (playing && !root.contains(event.target) && event.target.closest('[data-read-update],[data-artifact],[data-reference],[data-stage]')) pause(); };
    const onHidden = () => { if (document.hidden && playing) pause(); };
    const onFull = () => { fullBtn.textContent = document.fullscreenElement === root ? 'Exit full screen' : 'Full screen'; };
    const onMotion = () => paint();
    function resize() { if (destroyed) return; const w = stage.clientWidth; if (!w) return; const dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = Math.min(1920, Math.round(w * dpr)); cv.height = Math.round(cv.width * 9 / 16); measure(); paint(); }
    const observer = new ResizeObserver(resize); observer.observe(stage);
    root.addEventListener('click', onClick); seek.addEventListener('input', onSeek);
    document.addEventListener('click', onPageClick, true); document.addEventListener('visibilitychange', onHidden); document.addEventListener('fullscreenchange', onFull);
    calm.addEventListener('change', onMotion);
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(resize);
    resize();

    return {
      // For checks: show any moment without playing.
      show(time) { pause(); t = clamp(Number(time) || 0, 0, film.length); started = true; setPlaying(false); paint(); },
      destroy() {
        if (destroyed) return; destroyed = true;
        cancelAnimationFrame(raf); stopSound(); observer.disconnect();
        root.removeEventListener('click', onClick); seek.removeEventListener('input', onSeek);
        document.removeEventListener('click', onPageClick, true); document.removeEventListener('visibilitychange', onHidden); document.removeEventListener('fullscreenchange', onFull);
        calm.removeEventListener('change', onMotion);
        if (document.fullscreenElement === root) document.exitFullscreen().catch(() => {});
        if (ac) ac.close().catch(() => {});
      }
    };
  }

  // A still of the street for the opening page.
  function still(canvas, stageId = 'update1') {
    const ctx = canvas.getContext('2d'), sx = canvas.width / W; ctx.setTransform(sx, 0, 0, sx, 0, 0); (POSTER[stageId] || POSTER.update1)(ctx, {});
  }

  window.CrisisAnimation = Object.freeze({ markup, mount, still, measureMix });
})();
