import { COLORS, STAGE_NAME, MODES, pickPair, timeLimit } from './colors.js';
import { createScene } from './scene.js';

const $ = id => document.getElementById(id);
const canvas = $('gl');
const S = createScene(canvas);
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } } };

// 音（最初の操作のあとに使える）
let ac = null;
function audio() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } return ac; }
function noise(dur, freq, gain) {
  const a = audio(); if (!a) return;
  const b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2;
  const s = a.createBufferSource(); s.buffer = b; const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq; const g = a.createGain(); g.gain.value = gain;
  s.connect(f).connect(g).connect(a.destination); s.start();
}
function beep(freq, dur, gain = .15) {
  const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(); o.type = 'square'; o.frequency.value = freq; g.gain.setValueAtTime(gain, a.currentTime); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + dur);
  o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + dur);
}
const sfx = { snip: () => { noise(.08, 6000, .5); beep(1400, .05, .08); }, boom: () => noise(1.2, 700, 1.2), tick: () => beep(880, .05, .06), go: () => beep(660, .12, .12), count: () => beep(440, .1, .1) };

// 状態
const G = { phase: 'title', mode: 'easy', count: 0, score: 0, limit: 4, rem: 0, pair: null, sub: '', t: 0, cur: 0, snipSide: -1, deathT: 0, lastTick: 0, why: null };
const ease = t => 1 - (1 - t) ** 3;
const OUT_X = 3.7;

function show(id) { for (const s of ['title', 'howto', 'dict', 'pause', 'result']) $(s).hidden = s !== id; }
function fmtScore(n) { return n.toLocaleString('en-US'); }
function best(mode) { return +(store.get('ccb-best-' + mode) || 0); }
function refreshBest() { document.querySelectorAll('[data-best]').forEach(el => { const b = best(el.dataset.best); el.textContent = b ? `BEST ${fmtScore(b)}` : ''; }); }

// 色辞書
$('dictList').innerHTML = COLORS.map(c => `<div><i style="background:${c.hex}"></i><span>${c.n}<small>${c.hex} ・ ${c.m} ・ ${STAGE_NAME[c.st]}</small></span></div>`).join('');

function idleScene() {
  const [a, b] = S.dyn;
  a.g.position.x = 0; b.g.position.x = OUT_X;
  a.setCut(-1); b.setCut(-1);
  a.setColors('#AE3846', '#414FA3'); b.setColors('#A9ADB6', '#A9ADB6');
  a.setTimer('0.00', 'dim'); b.setTimer('0.00', 'dim');
  S.spark.visible = false; G.cur = 0;
}

function toTitle() {
  G.phase = 'title'; $('hud').hidden = true; $('lowFrame').hidden = true; $('flash').hidden = true; $('count').hidden = true;
  idleScene(); refreshBest(); show('title');
}

function startGame(mode, quick = false) {
  audio();
  G.mode = mode; G.count = 0; G.score = 0; G.why = null;
  show(null); $('flash').hidden = true; $('lowFrame').hidden = true;
  $('hud').hidden = false; $('score').textContent = '0'; $('order').style.visibility = 'hidden'; $('stage').textContent = '';
  $('labL').hidden = $('labR').hidden = true;
  const [a, b] = S.dyn; a.g.position.x = OUT_X; b.g.position.x = OUT_X * 2; a.setCut(-1); b.setCut(-1);
  a.setColors('#A9ADB6', '#A9ADB6'); b.setColors('#A9ADB6', '#A9ADB6'); a.setTimer('0.00', 'dim'); b.setTimer('0.00', 'dim');
  G.cur = 0;
  // カウントダウン
  G.phase = 'count'; G.t = 0; G.countSeq = quick ? ['1'] : ['3', '2', '1']; G.countIdx = -1;
}

function nextBomb() {
  G.pair = pickPair(G.mode, G.count);
  G.limit = timeLimit(G.mode, G.count);
  G.sub = 'enter'; G.t = 0;
  G.from = S.dyn[G.cur].g.position.x;
}

function arrive() {
  const d = S.dyn[G.cur];
  d.setColors(G.pair.L.hex, G.pair.R.hex);
  G.rem = G.limit; G.sub = 'wait'; G.lastTick = Math.ceil(G.rem * 4);
  $('order').innerHTML = `<b>${G.pair.target.n}</b>を切れ！`; $('order').style.visibility = 'visible';
  $('stage').textContent = STAGE_NAME[G.pair.target.st];
  if (MODES[G.mode].labels) { $('labL').textContent = G.pair.L.n; $('labR').textContent = G.pair.R.n; $('labL').hidden = $('labR').hidden = false; }
}

function choose(side) {
  if (G.phase !== 'play' || G.sub !== 'wait') return;
  const btn = side === 0 ? $('btnL') : $('btnR'); btn.classList.add('hit'); setTimeout(() => btn.classList.remove('hit'), 120);
  G.snipSide = side; G.sub = 'snip'; G.t = 0; sfx.snip();
  $('labL').hidden = $('labR').hidden = true;
  if (side !== G.pair.side) { G.why = { got: side === 0 ? G.pair.L : G.pair.R }; }
}

function die(reason) {
  G.phase = 'dying'; G.deathT = 0; $('lowFrame').hidden = true; $('labL').hidden = $('labR').hidden = true;
  if (reason === 'time') G.why = { got: null };
  $('flash').hidden = false; $('flash').style.animation = 'none'; void $('flash').offsetWidth; $('flash').style.animation = '';
  sfx.boom();
}

function showResult() {
  G.phase = 'result'; $('hud').hidden = true;
  const key = 'ccb-best-' + G.mode, prev = best(G.mode), isBest = G.score > prev; if (isBest) store.set(key, G.score);
  $('rScore').textContent = fmtScore(G.score);
  $('rMeta').textContent = `${MODES[G.mode].label} ・ ${G.count}本切った ・ ${isBest ? 'ベスト更新' : 'BEST ' + fmtScore(Math.max(prev, G.score))}`;
  const sw = c => `<i style="background:${c.hex}"></i>${c.n}<code>${c.hex}</code>`;
  $('rWant').innerHTML = sw(G.pair.target);
  if (G.why && G.why.got) { $('rGotLab').textContent = '切った色'; $('rGot').innerHTML = sw(G.why.got); }
  else { $('rGotLab').textContent = '切った色'; $('rGot').innerHTML = '時間切れ'; }
  show('result');
}

function pause(on) {
  if (on && G.phase === 'play') { G.phase = 'pause'; show('pause'); }
  else if (!on && G.phase === 'pause') { G.phase = 'play'; show(null); }
}

// 入力
window.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'a' || k === 'arrowleft') choose(0);
  else if (k === 'd' || k === 'arrowright') choose(1);
  else if (k === 'escape' || k === 'p') { if (G.phase === 'play') pause(true); else if (G.phase === 'pause') pause(false); }
  else if ((k === ' ' || k === 'enter') && G.phase === 'result') { e.preventDefault(); startGame(G.mode, true); }
  else if ((k === ' ' || k === 'enter') && G.phase === 'pause') { e.preventDefault(); pause(false); }
});
$('btnL').addEventListener('pointerdown', e => { e.stopPropagation(); choose(0); });
$('btnR').addEventListener('pointerdown', e => { e.stopPropagation(); choose(1); });
canvas.addEventListener('pointerdown', e => { if (e.pointerType === 'touch' || e.pointerType === 'pen') choose(e.clientX < innerWidth / 2 ? 0 : 1); });
$('pauseBtn').addEventListener('click', () => pause(true));
$('resume').addEventListener('click', () => pause(false));
$('quit').addEventListener('click', toTitle);
$('retry').addEventListener('click', () => startGame(G.mode, true));
$('toTitle').addEventListener('click', toTitle);
document.querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => {
  const mode = b.dataset.mode;
  if (!store.get('ccb-howto')) { store.set('ccb-howto', '1'); G.pendingMode = mode; $('howtoBtn').textContent = '始める'; show('howto'); return; }
  startGame(mode);
}));
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.go === 'title' && G.pendingMode) { const m = G.pendingMode; G.pendingMode = null; $('howtoBtn').textContent = 'もどる'; startGame(m); return; }
  if (b.dataset.go === 'title') toTitle(); else show(b.dataset.go);
}));
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(true); });

// 毎フレーム
function resize() { S.resize(innerWidth, innerHeight); }
addEventListener('resize', resize); resize();
let last = performance.now();
const open = [1, 1];

function placeLabel(el, i) {
  const [x, y] = S.project(S.dyn[G.cur].labelPoint(i));
  el.style.left = (x * innerWidth + (i === 0 ? -1 : 1) * 46) + 'px'; el.style.top = (y * innerHeight) + 'px';
}

function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  const cur = S.dyn[G.cur], other = S.dyn[1 - G.cur];
  open[0] = open[1] = 1; let shakeAmt = 0;

  if (G.phase === 'count') {
    G.t += dt; const idx = Math.floor(G.t / .6);
    if (idx !== G.countIdx) {
      G.countIdx = idx;
      if (idx < G.countSeq.length) { $('count').hidden = false; $('count').textContent = G.countSeq[idx]; sfx.count(); }
      else { $('count').hidden = true; sfx.go(); G.phase = 'play'; nextBomb(); }
    }
  }

  if (G.phase === 'play') {
    G.t += dt;
    if (G.sub === 'enter') {
      const k = Math.min(1, G.t / .3), e = ease(k), dx = (G.from - 0) * e;
      cur.g.position.x = G.from - dx;
      if (G.exiting) G.exiting.g.position.x = -OUT_X * e;
      S.beltT.offset.x = (G.beltBase || 0) + dx * 3 / 20;
      if (k >= 1) { if (G.exiting) { const ex = G.exiting; ex.g.position.x = OUT_X; ex.setCut(-1); ex.setColors('#A9ADB6', '#A9ADB6'); ex.setTimer('0.00', 'dim'); G.exiting = null; } G.beltBase = S.beltT.offset.x; arrive(); }
    } else if (G.sub === 'wait') {
      G.rem -= dt;
      const low = G.rem / G.limit < .3;
      $('lowFrame').hidden = !low;
      const tk = Math.ceil(G.rem * 4); if (low && tk !== G.lastTick) sfx.tick(); G.lastTick = tk;
      if (G.rem <= 0) { G.rem = 0; cur.setTimer('0.00', 'low'); die('time'); }
      else cur.setTimer(G.rem.toFixed(2), low ? 'low' : 'red');
      if (MODES[G.mode].labels) { placeLabel($('labL'), 0); placeLabel($('labR'), 1); }
    } else if (G.sub === 'snip') {
      const k = Math.min(1, G.t / .12); open[G.snipSide] = 1 - k;
      if (k >= 1) {
        cur.setCut(G.snipSide); S.spark.position.copy(cur.cutPoint(G.snipSide)); S.spark.visible = true; S.spark.scale.setScalar(.5);
        $('lowFrame').hidden = true; $('order').style.visibility = 'hidden';
        if (G.snipSide !== G.pair.side) { die('wrong'); }
        else {
          const pts = 100 + Math.round(100 * G.rem / G.limit);
          G.score += pts; G.count++; $('score').textContent = fmtScore(G.score);
          const [x, y] = S.project(cur.cutPoint(G.snipSide)); const p = $('pop'); p.hidden = false; p.textContent = '+' + pts; p.style.left = x * innerWidth + 'px'; p.style.top = (y * innerHeight - 40) + 'px'; p.style.animation = 'none'; void p.offsetWidth; p.style.animation = '';
          G.sub = 'after'; G.t = 0;
        }
      }
    } else if (G.sub === 'after') {
      open[G.snipSide] = Math.min(1, G.t / .15);
      S.spark.scale.setScalar(.5 + G.t * 1.2); S.spark.material.opacity = Math.max(0, 1 - G.t / .25);
      if (G.t > .22) {
        S.spark.visible = false; S.spark.material.opacity = 1;
        G.exiting = cur; G.cur = 1 - G.cur; S.dyn[G.cur].g.position.x = OUT_X; nextBomb();
      }
    }
  }

  if (G.phase === 'dying') {
    G.deathT += dt; shakeAmt = Math.max(0, .12 * (1 - G.deathT / .7));
    if (G.snipSide >= 0 && G.sub === 'snip') open[G.snipSide] = 0;
    S.spark.visible = false;
    if (G.deathT > 1.0) showResult();
  }

  S.shake(shakeAmt);
  S.faceTimers();
  S.placeScissors(S.dyn[G.cur], open);
  S.renderer.render(S.scene, S.camera);
  requestAnimationFrame(frame);
}

// 確認用の入口（遊びには使わない）
window.__ccb = { G, choose, startGame, toTitle, pickPair };

toTitle();
requestAnimationFrame(frame);
// 表示確認用: #test-hard などで開くとすぐ始まる
if (location.hash.startsWith('#test-')) { startGame(location.hash.slice(6) === 'hard' ? 'hard' : 'easy', true); G.countSeq = []; }
