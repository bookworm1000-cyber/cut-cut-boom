// JIS Z 8102:2001 慣用色名。HEX は Wikipedia「JIS慣用色名」oldid=111583927 の参考値に固定。
// st: 1 基本色 / 2 派生色 / 3 伝統色 / 4 珍しい色
export const COLORS = [
  { n: '赤', hex: '#BF1E33', m: '5R 4/14', st: 1 },
  { n: '黄色', hex: '#FFBE00', m: '5Y 8/14', st: 1 },
  { n: '緑', hex: '#4DB56A', m: '2.5G 6.5/10', st: 1 },
  { n: '青', hex: '#0067C0', m: '10B 4/14', st: 1 },
  { n: '紫', hex: '#A260BF', m: '7.5P 5/12', st: 1 },
  { n: '橙色', hex: '#FD7E00', m: '5YR 6.5/13', st: 1 },
  { n: '桃色', hex: '#E38698', m: '2.5R 6.5/8', st: 1 },
  { n: '茶色', hex: '#734E30', m: '5YR 3.5/4', st: 1 },
  { n: '水色', hex: '#A9CEEC', m: '6B 8/4', st: 2 },
  { n: '黄緑', hex: '#B9C42F', m: '2.5GY 7.5/11', st: 2 },
  { n: '紺色', hex: '#333C5E', m: '6PB 2.5/4', st: 2 },
  { n: '空色', hex: '#95C0EC', m: '9B 7.5/5.5', st: 2 },
  { n: '朱色', hex: '#ED514E', m: '6R 5.5/14', st: 2 },
  { n: '山吹色', hex: '#FFA500', m: '10YR 7.5/13', st: 2 },
  { n: '藤色', hex: '#A09BD8', m: '10PB 6.5/6.5', st: 2 },
  { n: '黄土色', hex: '#C18A39', m: '10YR 6/7.5', st: 2 },
  { n: 'えんじ', hex: '#AE3846', m: '4R 4/11', st: 3 },
  { n: '萌黄', hex: '#96AA3D', m: '4GY 6.5/9', st: 3 },
  { n: '浅葱色', hex: '#0087AA', m: '2.5B 5/8', st: 3 },
  { n: 'とき色', hex: '#F9A1D0', m: '7RP 7.5/8', st: 3 },
  { n: '群青色', hex: '#414FA3', m: '7.5PB 3.5/11', st: 3 },
  { n: '茜色', hex: '#A0283A', m: '4R 3.5/11', st: 3 },
  { n: '鶯色', hex: '#71714A', m: '1GY 4.5/3.5', st: 3 },
  { n: '牡丹色', hex: '#C24DAE', m: '3RP 5/14', st: 3 },
  { n: 'とび色', hex: '#7D483E', m: '7.5R 3.5/5', st: 4 },
  { n: '利休鼠', hex: '#787C7A', m: '2.5G 5/1', st: 4 },
  { n: '海老茶', hex: '#6D3D33', m: '8R 3/4.5', st: 4 },
  { n: 'はなだ色', hex: '#3C639B', m: '3PB 4/7.5', st: 4 },
  { n: '刈安色', hex: '#EED67E', m: '7Y 8.5/7', st: 4 },
  { n: '青磁色', hex: '#80AA9F', m: '7.5G 6.5/4', st: 4 },
  // JIS慣用色名のうちカタカナの色名（同じ表・同じ版から）。朱色と同じ値のバーミリオン、紺色と同じ値のネービーブルーは除く
  { n: 'ローズピンク', hex: '#EF93B6', m: '10RP 7/8', st: 2 },
  { n: 'サーモンピンク', hex: '#FFA594', m: '8R 7.5/7.5', st: 2 },
  { n: 'ワインレッド', hex: '#83274E', m: '10RP 3/9', st: 2 },
  { n: 'スカーレット', hex: '#DE4335', m: '7R 5/14', st: 2 },
  { n: 'レモンイエロー', hex: '#E8C800', m: '8Y 8/12', st: 2 },
  { n: 'ミントグリーン', hex: '#81CC91', m: '2.5G 7.5/8', st: 2 },
  { n: 'エメラルドグリーン', hex: '#4DA573', m: '4G 6/8', st: 2 },
  { n: 'ターコイズブルー', hex: '#399ECC', m: '5B 6/8', st: 2 },
  { n: 'マリンブルー', hex: '#005175', m: '5B 3/7', st: 2 },
  { n: 'コバルトブルー', hex: '#2863AB', m: '3PB 4/10', st: 2 },
  { n: 'ラベンダー', hex: '#9E8EAE', m: '5P 6/3', st: 2 },
  { n: 'ベージュ', hex: '#C1AB96', m: '10YR 7/2.5', st: 2 },
  { n: 'ベビーピンク', hex: '#FFC9D2', m: '4R 8.5/4', st: 4 },
  { n: 'コーラルレッド', hex: '#FF87A0', m: '2.5R 7/11', st: 4 },
  { n: 'ボルドー', hex: '#55353B', m: '2.5R 2.5/3', st: 4 },
  { n: 'マゼンタ', hex: '#C949A2', m: '5RP 5/14', st: 4 },
  { n: 'ライラック', hex: '#C2A2DA', m: '6P 7/6', st: 4 },
  { n: 'モーブ', hex: '#835FA8', m: '5P 4.5/9', st: 4 },
  { n: 'シアン', hex: '#219DDD', m: '7.5B 6/10', st: 4 },
  { n: 'セルリアンブルー', hex: '#0B74AF', m: '9B 4.5/9', st: 4 },
  { n: 'ピーコックブルー', hex: '#00708B', m: '10BG 4/8.5', st: 4 },
  { n: 'ミッドナイトブルー', hex: '#00152D', m: '5PB 1.5/2', st: 4 },
  { n: 'オリーブ', hex: '#605627', m: '7.5Y 3.5/4', st: 4 },
  { n: 'オリーブグリーン', hex: '#565838', m: '2.5GY 3.5/3', st: 4 },
];
export const STAGE_NAME = ['', '基本色', '派生色', '伝統色', '珍しい色'];

function lab(hex) {
  const c = [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const X = 0.4124 * c[0] + 0.3576 * c[1] + 0.1805 * c[2], Y = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2], Z = 0.0193 * c[0] + 0.1192 * c[1] + 0.9505 * c[2];
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const x = f(X / 0.95047), y = f(Y), z = f(Z / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
// CIEDE2000
export function deltaE(h1, h2) {
  const r = Math.PI / 180, [L1, a1, b1] = lab(h1), [L2, a2, b2] = lab(h2);
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7))), A1 = (1 + G) * a1, A2 = (1 + G) * a2;
  const c1 = Math.hypot(A1, b1), c2 = Math.hypot(A2, b2);
  let h1d = (Math.atan2(b1, A1) / r + 360) % 360, h2d = (Math.atan2(b2, A2) / r + 360) % 360, dh = h2d - h1d;
  if (c1 * c2 === 0) dh = 0; else if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
  const dL = L2 - L1, dC = c2 - c1, dH = 2 * Math.sqrt(c1 * c2) * Math.sin(dh * r / 2), Lb = (L1 + L2) / 2, Cp = (c1 + c2) / 2;
  let hb = h1d + h2d; if (c1 * c2 !== 0) hb = Math.abs(h1d - h2d) > 180 ? (h1d + h2d + 360) / 2 : (h1d + h2d) / 2;
  const T = 1 - 0.17 * Math.cos((hb - 30) * r) + 0.24 * Math.cos(2 * hb * r) + 0.32 * Math.cos((3 * hb + 6) * r) - 0.2 * Math.cos((4 * hb - 63) * r);
  const th = 30 * Math.exp(-(((hb - 275) / 25) ** 2)), Rc = 2 * Math.sqrt(Cp ** 7 / (Cp ** 7 + 25 ** 7));
  const Sl = 1 + 0.015 * (Lb - 50) ** 2 / Math.sqrt(20 + (Lb - 50) ** 2), Sc = 1 + 0.045 * Cp, Sh = 1 + 0.015 * Cp * T, Rt = -Math.sin(2 * th * r) * Rc;
  return Math.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh));
}

// near: もう一方の線を、全色のうち指示の色に近い順で上位何色から選ぶか。切るほど狭くなる
export const MODES = {
  easy: { label: 'EASY', start: 4.0, min: 1.6, step: 0.06, near: [3, 1], labels: true },
  hard: { label: 'HARD', start: 3.2, min: 1.1, step: 0.05, near: [2, 1], labels: false },
};
const RED = COLORS.find(c => c.n === '赤'), BLUE = COLORS.find(c => c.n === '青');
// 何本切ったかで出てくる色の段階が増える
export function maxStage(count) { return count < 10 ? 1 : count < 20 ? 2 : count < 35 ? 3 : 4; }
export function timeLimit(mode, count) { const m = MODES[mode]; return Math.max(m.min, m.start - m.step * count); }

export function pickPair(mode, count, rand = Math.random) {
  const side = rand() < 0.5 ? 0 : 1; // 0 = 左が正解
  const make = (target, other) => ({ target, other, side, L: side === 0 ? target : other, R: side === 0 ? other : target });
  const ms = maxStage(count), pool = COLORS.filter(c => c.st <= ms);
  // 赤と青は指示に出やすくし、新しく増えた段階の色も出しやすくする
  const weight = c => (c === RED || c === BLUE ? 2 : c.st === ms && ms > 1 ? 3 : 1);
  const total = pool.reduce((s, c) => s + weight(c), 0);
  let x = rand() * total, target = pool[0];
  for (const c of pool) { x -= weight(c); if (x <= 0) { target = c; break; } }
  const [k0, k1] = MODES[mode].near, k = Math.max(1, Math.round(k0 - (k0 - k1) * Math.min(1, count / 40)));
  const others = COLORS.filter(c => c !== target).map(c => [deltaE(c.hex, target.hex), c]).sort((a, b) => a[0] - b[0]).slice(0, k);
  return make(target, others[Math.floor(rand() * others.length)][1]);
}
