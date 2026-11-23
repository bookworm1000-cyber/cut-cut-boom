import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

const lin = h => new THREE.Color(h).convertSRGBToLinear();
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function tex(w, h, draw, rep = [1, 1]) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 8; return t;
}
function speckle(x, w, h, n, cols, smin = 1, smax = 3, a = .15) { for (let i = 0; i < n; i++) { x.globalAlpha = a * rnd(); x.fillStyle = cols[Math.floor(rnd() * cols.length)]; const s = smin + rnd() * (smax - smin); x.fillRect(rnd() * w, rnd() * h, s, s); } x.globalAlpha = 1; }
function smudge(x, w, h, n, col, rmin, rmax, a) { for (let i = 0; i < n; i++) { const r = rmin + rnd() * (rmax - rmin), cx = rnd() * w, cy = rnd() * h, g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.globalAlpha = a * rnd(); x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); } x.globalAlpha = 1; }

const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.LinearToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene(); scene.background = lin('#C9B58E');
  const grad = new THREE.DataTexture(new Uint8Array([70, 150, 255]), 3, 1, THREE.LuminanceFormat); grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
  const toon = o => new THREE.MeshToonMaterial({ gradientMap: grad, ...o });
  const std = o => new THREE.MeshStandardMaterial(o);
  const outlineMat = new THREE.MeshBasicMaterial({ color: 0x1b1a20, side: THREE.BackSide });
  const add = (g, mat, x = 0, y = 0, z = 0, par = scene, sh = true) => { const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); if (sh) { m.castShadow = true; m.receiveShadow = true; } par.add(m); return m; };
  const outline = (m, s = 1.06) => { const o = new THREE.Mesh(m.geometry, outlineMat); o.scale.setScalar(s); m.add(o); return o; };

  scene.add(new THREE.HemisphereLight(0xCFEFFF, 0x8a6d4a, .62));
  const sun = new THREE.DirectionalLight(0xFFF2D6, 1.15); sun.position.set(-3, 6, 3.2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: .5, far: 20 }); sun.shadow.bias = -.0006; scene.add(sun);
  scene.add(new THREE.AmbientLight(0xffffff, .1));

  // 床とベルト
  const floorT = tex(512, 512, (x, w, h) => { x.fillStyle = '#D2BC8E'; x.fillRect(0, 0, w, h); smudge(x, w, h, 60, 'rgba(40,30,20,.6)', 20, 110, .2); speckle(x, w, h, 9000, ['#000', '#fff'], 1, 2.5, .12); }, [6, 6]);
  add(new THREE.PlaneGeometry(40, 40), std({ map: floorT, roughness: .9 }), 0, -.62, 0).rotation.x = -Math.PI / 2;
  const beltT = tex(1024, 256, (x, w, h) => {
    x.fillStyle = '#22A85E'; x.fillRect(0, 0, w, h); for (let i = 0; i < 32; i++) { x.fillStyle = 'rgba(0,0,0,.26)'; x.fillRect(i * 32, 0, 5, h); }
    x.strokeStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 160; i++) { x.lineWidth = .5 + rnd() * 1.5; x.beginPath(); const y = rnd() * h, xx = rnd() * w; x.moveTo(xx, y); x.lineTo(xx + 20 + rnd() * 120, y + (rnd() - .5) * 4); x.stroke(); }
    smudge(x, w, h, 40, 'rgba(255,255,255,.4)', 20, 80, .08); speckle(x, w, h, 12000, ['#000', '#888'], 1, 2, .16);
  }, [3, 1]);
  const belt = add(new THREE.BoxGeometry(20, .08, 1.9), std({ map: beltT, roughness: .85 }), 0, -.04, 0);
  const paintT = tex(512, 128, (x, w, h) => {
    x.fillStyle = '#FFC400'; x.fillRect(0, 0, w, h); smudge(x, w, h, 30, 'rgba(255,255,255,.6)', 10, 50, .18);
    for (let i = 0; i < 70; i++) { const cx = rnd() * w, cy = rnd() * h, r = 1 + rnd() * 6; x.fillStyle = rnd() < .5 ? '#5a4a3c' : '#8a8f96'; x.globalAlpha = .55 + rnd() * .4; x.beginPath(); for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2, rr = r * (.5 + rnd()); x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .6); } x.fill(); }
    x.globalAlpha = 1; speckle(x, w, h, 3000, ['#000'], 1, 2, .12);
  }, [6, 1]);
  for (const z of [.98, -.98]) add(new THREE.BoxGeometry(20, .5, .12), std({ map: paintT, roughness: .6, metalness: .15 }), 0, -.29, z);

  // ダイナマイトの共通部品
  const tubeT = tex(256, 512, (x, w, h) => {
    x.fillStyle = '#F03A2A'; x.fillRect(0, 0, w, h); smudge(x, w, h, 20, 'rgba(255,255,255,.5)', 10, 50, .12); smudge(x, w, h, 20, 'rgba(60,10,10,.6)', 10, 40, .2);
    x.save(); x.translate(w * .5, h / 2); x.rotate(Math.PI / 2); x.fillStyle = 'rgba(255,240,215,.85)'; x.font = '900 30px "Zen Kaku Gothic New",sans-serif'; x.textAlign = 'center'; x.fillText('DANGER  EXPLOSIVE', 0, 10); x.restore();
    speckle(x, w, h, 2500, ['#000', '#fff'], 1, 2.5, .16);
  });
  const M = {
    tube: toon({ map: tubeT }), paper: toon({ color: lin('#F6E7C4') }), tape: toon({ color: lin('#222226') }),
    metal: std({ color: 0xC3C8CF, roughness: .3, metalness: .8 }), box: toon({ color: lin('#3A3D45') }),
    grey: new THREE.MeshBasicMaterial({ color: lin('#A9ADB6'), toneMapped: false }),
    edge: new THREE.MeshBasicMaterial({ color: lin('#FFFFFF'), side: THREE.BackSide, toneMapped: false }),
  };
  const r = .17, len = 2.2;
  const G = { tube: new THREE.CylinderGeometry(r, r, len, 40), ring: new THREE.CylinderGeometry(r * 1.006, r * 1.006, .08, 40), tape: new THREE.BoxGeometry(.13, .38, 1.1), cap: new THREE.CylinderGeometry(.045, .045, .12, 16), base: new THREE.BoxGeometry(.7, .08, .5), back: new THREE.BoxGeometry(.86, .36, .08), disp: new THREE.PlaneGeometry(.76, .28) };
  function wireCurve(s) { return new THREE.CatmullRomCurve3([[len / 2 + .1, r, 0], [len / 2 + .34, .12, .06], [len / 2 + .36, .03, .42], [len / 2 + .26, -.02, .72], [len / 2 + .2, -.08, .86]].map(([x, y, z]) => new THREE.Vector3(s * x, y, z))); }
  function seg(cv, t0, t1) { const p = []; for (let i = 0; i <= 30; i++) p.push(cv.getPoint(t0 + (t1 - t0) * i / 30)); return new THREE.CatmullRomCurve3(p); }
  const CUT_T = .47;
  const WG = [-1, 1].map(s => { const cv = wireCurve(s); return { cv, whole: [new THREE.TubeGeometry(cv, 48, .045, 12), new THREE.TubeGeometry(cv, 48, .058, 12)], a: [new THREE.TubeGeometry(seg(cv, 0, CUT_T - .05), 30, .045, 12), new THREE.TubeGeometry(seg(cv, 0, CUT_T - .05), 30, .058, 12)], b: [new THREE.TubeGeometry(seg(cv, CUT_T + .05, 1), 30, .045, 12), new THREE.TubeGeometry(seg(cv, CUT_T + .05, 1), 30, .058, 12)] }; });

  function makeDynamite() {
    const g = new THREE.Group(); scene.add(g);
    [[-.36, .02, .6], [0, -.015, -.4], [.36, .01, .9]].forEach(([z, dx, rot]) => {
      const t = add(G.tube, M.tube, dx, r, z, g); t.rotation.z = Math.PI / 2; t.rotation.x = rot; outline(t, 1.05);
      for (const s of [-1, 1]) add(G.ring, M.paper, dx + s * (len / 2 - .04), r, z, g).rotation.z = Math.PI / 2;
    });
    [[-.62, .03], [.62, -.04]].forEach(([x, ry]) => { const t = add(G.tape, M.tape, x, .19, 0, g); t.rotation.y = ry; outline(t, 1.06); });
    for (const s of [-1, 1]) add(G.cap, M.metal, s * (len / 2 + .05), r, 0, g).rotation.z = Math.PI / 2;
    // 配線（光の影響を受けない塗り）
    const wires = WG.map((w, i) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
      const mk = geo => { const grp = new THREE.Group(); g.add(grp); const ol = add(geo[1], M.edge, 0, 0, 0, grp); ol.receiveShadow = false; const m = add(geo[0], mat, 0, 0, 0, grp); m.receiveShadow = false; return grp; };
      return { mat, whole: mk(w.whole), a: mk(w.a), b: mk(w.b), cv: w.cv };
    });
    add(G.base, M.box, 0, .38, 0, g);
    const holder = new THREE.Group(); holder.position.set(0, .56, .02); g.add(holder);
    const back = add(G.back, M.box, 0, 0, -.045, holder); outline(back, 1.05);
    const tc = document.createElement('canvas'); tc.width = 512; tc.height = 200; const tt = new THREE.CanvasTexture(tc); tt.encoding = THREE.sRGBEncoding;
    add(G.disp, new THREE.MeshBasicMaterial({ map: tt, toneMapped: false }), 0, 0, 0, holder, false);
    const d = { g, wires, holder, tc, tt, last: '' };
    d.setColors = (cL, cR) => { d.wires[0].mat.color.copy(lin(cL)); d.wires[1].mat.color.copy(lin(cR)); };
    d.setCut = side => { d.wires.forEach((w, i) => { const c = side === i; w.whole.visible = !c; w.a.visible = w.b.visible = c; }); };
    d.setTimer = (str, style) => {
      const key = str + style; if (d.last === key) return; d.last = key;
      const c = tc.getContext('2d'), W = 512, H = 200, low = style === 'low', dim = style === 'dim';
      c.fillStyle = low ? '#160606' : '#0c0c0e'; c.fillRect(0, 0, W, H);
      const on = dim ? '#6a2c27' : low ? '#FF2A1C' : '#FF4A3D', off = dim ? '#1e0d0b' : low ? '#3a0e0a' : '#2a110f', glow = dim ? 0 : low ? 40 : 22;
      const dh = 150, dw = 82, gap = 36, t = 16; let x = (W - (3 * dw + 2 * gap)) / 2; const y = 25;
      const sg = (k, rx, ry, rw, rh, ch) => { const lit = SEG[ch].includes(k); c.fillStyle = lit ? on : off; c.shadowColor = on; c.shadowBlur = lit ? glow : 0; c.fillRect(rx, ry, rw, rh); };
      for (const ch of str) {
        if (ch === '.') { c.fillStyle = on; c.shadowBlur = glow; c.fillRect(x - gap * .7, y + dh - t, t, t); continue; }
        const h2 = dh / 2; sg('a', x + t, y, dw - 2 * t, t, ch); sg('b', x + dw - t, y + t, t, h2 - t * 1.5, ch); sg('c', x + dw - t, y + h2 + t * .5, t, h2 - t * 1.5, ch); sg('d', x + t, y + dh - t, dw - 2 * t, t, ch); sg('e', x, y + h2 + t * .5, t, h2 - t * 1.5, ch); sg('f', x, y + t, t, h2 - t * 1.5, ch); sg('g', x + t, y + h2 - t / 2, dw - 2 * t, t, ch); x += dw + gap;
      }
      c.shadowBlur = 0; tt.needsUpdate = true;
    };
    d.cutPoint = i => d.wires[i].cv.getPoint(CUT_T).add(g.position);
    d.labelPoint = i => d.wires[i].cv.getPoint(.62).add(g.position);
    d.setCut(-1);
    return d;
  }

  // はさみ（XY平面、+Y が刃先）
  function makeScissors() {
    const s = new THREE.Group(); const halves = [];
    const blade = std({ color: 0xDDE1E6, roughness: .2, metalness: .9 }), handle = toon({ color: lin('#26262C') });
    for (const k of [-1, 1]) {
      const h = new THREE.Group(); s.add(h); halves.push({ h, k });
      const sh = new THREE.Shape(); sh.moveTo(0, -.02); sh.lineTo(k * .055, .04); sh.lineTo(k * .02, .5); sh.lineTo(0, .53); sh.lineTo(-k * .012, .06); sh.lineTo(0, -.02);
      const b = add(new THREE.ExtrudeGeometry(sh, { depth: .012, bevelEnabled: true, bevelThickness: .004, bevelSize: .004, bevelSegments: 1 }), blade, 0, 0, k * .01, h, false);
      add(new THREE.BoxGeometry(.04, .16, .02), blade, -k * .02, -.09, k * .01, h, false);
      const ring = add(new THREE.TorusGeometry(.065, .022, 12, 32), handle, -k * .07, -.26, k * .01, h, false); ring.scale.set(1, 1.3, 1); outline(ring, 1.12);
      add(new THREE.BoxGeometry(.05, .1, .035), handle, -k * .04, -.15, k * .01, h, false);
    }
    const pin = add(new THREE.CylinderGeometry(.024, .024, .05, 14), M.metal, 0, 0, 0, s, false); pin.rotation.x = Math.PI / 2;
    scene.add(s);
    s.userData.setOpen = o => halves.forEach(({ h, k }) => h.rotation.z = k * (.03 + .19 * o));
    s.userData.setOpen(1);
    return s;
  }

  // 火花
  const sc = document.createElement('canvas'); sc.width = sc.height = 256;
  { const x = sc.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(.25, 'rgba(255,220,120,.9)'); g.addColorStop(1, 'rgba(255,140,40,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    x.strokeStyle = 'rgba(255,250,220,.95)'; x.lineCap = 'round'; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, l = 60 + rnd() * 60; x.lineWidth = 3 + rnd() * 3; x.beginPath(); x.moveTo(128 + Math.cos(a) * 20, 128 + Math.sin(a) * 20); x.lineTo(128 + Math.cos(a) * l, 128 + Math.sin(a) * l); x.stroke(); } }
  const st = new THREE.CanvasTexture(sc); st.encoding = THREE.sRGBEncoding;
  const spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: st, toneMapped: false, depthTest: false, transparent: true })); spark.visible = false; scene.add(spark);

  const camera = new THREE.PerspectiveCamera(42, 16 / 9, .05, 100), target = new THREE.Vector3(0, .3, .2);
  function resize(w, h) {
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const hfov = 68.6 * Math.PI / 180; camera.fov = Math.max(42, Math.min(60, 2 * Math.atan(Math.tan(hfov / 2) / camera.aspect) * 180 / Math.PI)); camera.updateProjectionMatrix();
  }
  const th = 70 * Math.PI / 180, D = 2.7;
  const camBase = new THREE.Vector3(0, target.y + D * Math.sin(th), target.z + D * Math.cos(th));
  camera.position.copy(camBase); camera.lookAt(target); camera.updateMatrixWorld();

  const dyn = [makeDynamite(), makeDynamite()];
  const sciss = [makeScissors(), makeScissors()];

  function placeScissors(d, open) {
    camera.updateMatrixWorld();
    const inv = camera.matrixWorldInverse;
    sciss.forEach((sc, i) => {
      const s = i === 0 ? -1 : 1, e = d.cutPoint(i).sub(d.g.position).applyMatrix4(inv), f = .62, sz = 1.05 * f; e.multiplyScalar(f);
      const ang = s * .45, L = .5 * sz, piv = e.clone().add(new THREE.Vector3(Math.sin(ang) * L, -Math.cos(ang) * L, 0));
      sc.position.copy(piv.applyMatrix4(camera.matrixWorld)); sc.quaternion.copy(camera.quaternion); sc.rotateZ(ang); sc.scale.setScalar(sz);
      sc.userData.setOpen(open[i]);
    });
  }
  function faceTimers() { dyn.forEach(d => d.holder.quaternion.copy(camera.quaternion)); }
  function shake(a) { camera.position.copy(camBase); if (a > 0) camera.position.add(new THREE.Vector3((Math.random() - .5) * a, (Math.random() - .5) * a, 0)); camera.lookAt(target); camera.updateMatrixWorld(); }
  function project(v) { const p = v.clone().project(camera); return [(p.x + 1) / 2, (1 - p.y) / 2]; }

  return { renderer, scene, camera, resize, dyn, sciss, spark, placeScissors, faceTimers, shake, project, lin, belt, beltT };
}
