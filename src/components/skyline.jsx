import { useEffect, useRef, useState } from "react";
import { CHEAT, reducedMotion } from "../motion";

// Philadelphia at night, in five parallax layers on one 1600 x 420 grid. It sits
// as a band between the dashboard and the skill finder:
// sky (stars, moon, a plane), far haze, mid towers, the landmark skyline
// (FMC Tower, Cira Centre, One and Two Liberty Place, BNY Mellon Center, City Hall
// with William Penn, Comcast Center, Comcast Technology Center) and the
// foreground: Boathouse Row's outline lights on the left, the Ben Franklin Bridge
// on the right, and the river reflecting all of it. Heights follow the real
// buildings' ratios, the Comcast Technology Center being the tallest.
const W = 1600;
const H = 420;
const G = 380; // ground / waterline

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rect = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}z`;
const poly = (pts) => `M${pts.map((p) => p.join(" ")).join("L")}z`;

// Window grid inside a box. Returns { lit: [4 twinkle groups], dark }.
function windows(win, x, y, w, h, p, rand, style = "grid") {
  const stepX = style === "band" ? 4 : 6;
  const stepY = style === "band" ? 5 : 8;
  const ww = style === "band" ? 3 : 3;
  const wh = style === "band" ? 1 : 4;
  for (let wy = y + 6; wy + wh < y + h - 3; wy += stepY) {
    for (let wx = x + 4; wx + ww <= x + w - 3; wx += stepX) {
      const d = rect(wx, wy, ww, wh);
      const r = rand();
      if (r < p) win.lit[Math.floor(rand() * 4)].push(d);
      else win.dark.push(d);
    }
  }
}

function emptyWin() {
  return { lit: [[], [], [], []], dark: [] };
}

function build() {
  const rand = rng(1682);

  // Sky
  const stars = [[], [], []];
  for (let i = 0; i < 140; i++) {
    const s = rand() < 0.15 ? 2 : 1;
    stars[i % 3].push(rect(Math.round(rand() * W), Math.round(8 + rand() * 300), s, s));
  }

  // Far haze: a low, continuous band of blocks.
  let far = "";
  for (let x = -10; x < W + 10; ) {
    const w = 26 + Math.round(rand() * 50);
    const h = 40 + Math.round(rand() * 95);
    far += rect(x, G - h, w, h + 40); // runs under the water so parallax never shows a gap
    if (rand() < 0.25) far += rect(x + w / 2 - 3, G - h - 14, 6, 14);
    x += w - 4;
  }

  // Mid towers
  let mid = "";
  const midWin = emptyWin();
  for (let x = -20; x < W + 20; ) {
    const w = 24 + Math.round(rand() * 34);
    const h = 70 + Math.round(rand() * 150);
    mid += rect(x, G - h, w, h + 40);
    if (rand() < 0.3) mid += rect(x + 4, G - h - 8, w - 8, 8);
    windows(midWin, x, G - h, w, h, 0.1, rand);
    x += w + Math.round(rand() * 22) - 6;
  }

  // Landmark layer: fillers first, landmarks over them, City Hall in front.
  let near = "";
  const nearWin = emptyWin();
  const glass = emptyWin();
  for (let x = 420; x < 1180; ) {
    const w = 30 + Math.round(rand() * 34);
    // keep the blocks around City Hall low so the tower and William Penn read
    const h = x > 690 && x < 860 ? 34 + Math.round(rand() * 24) : 60 + Math.round(rand() * 100);
    near += rect(x, G - h, w, h);
    windows(nearWin, x, G - h, w, h, 0.24, rand);
    x += w + 2 + Math.round(rand() * 10);
  }
  for (let x = 0; x < 420; ) {
    const w = 30 + Math.round(rand() * 30);
    const h = 40 + Math.round(rand() * 70);
    near += rect(x, G - h, w, h);
    windows(nearWin, x, G - h, w, h, 0.18, rand);
    x += w + 6 + Math.round(rand() * 26);
  }

  const beacons = [];
  let marks = "";
  const markWin = emptyWin();

  // FMC Tower: lower shaft, upper block offset to one side.
  {
    const cx = 300;
    marks += rect(cx - 17, 220, 34, G - 220) + rect(cx - 13, 159, 30, 62) + rect(cx - 9, 153, 22, 6);
    windows(glass, cx - 17, 222, 34, G - 222, 0.3, rand, "band");
    windows(glass, cx - 13, 162, 30, 56, 0.3, rand, "band");
  }
  // Cira Centre: faceted glass, slanted top.
  {
    const cx = 378;
    marks += poly([[cx - 24, G], [cx + 24, G], [cx + 24, 262], [cx + 4, 248], [cx - 24, 272]]);
    windows(glass, cx - 22, 276, 44, G - 276, 0.26, rand, "band");
  }
  // Two and One Liberty Place: setbacks, a gabled crown and a needle.
  for (const [cx, top, wid] of [
    [560, 200, 40],
    [622, 175, 46],
  ]) {
    const s1 = wid - 6;
    const s2 = wid - 12;
    marks += rect(cx - wid / 2, top, wid, G - top);
    marks += rect(cx - s1 / 2, top - 10, s1, 10) + rect(cx - s2 / 2, top - 18, s2, 8);
    const gable = wid === 46 ? 36 : 32;
    marks += poly([[cx - s2 / 2, top - 18], [cx + s2 / 2, top - 18], [cx, top - 18 - gable]]);
    const needle = wid === 46 ? 24 : 27;
    marks += rect(cx - 1, top - 18 - gable - needle, 2, needle + 2);
    beacons.push([cx, top - 18 - gable - needle]);
    windows(markWin, cx - wid / 2, top, wid, G - top, 0.3, rand);
  }
  // BNY Mellon Center: stepped pyramid roof and a mast.
  {
    const cx = 690;
    const top = 178;
    marks += rect(cx - 20, top, 40, G - top);
    [34, 26, 18, 10].forEach((w, i) => (marks += rect(cx - w / 2, top - 8 * (i + 1), w, 8)));
    marks += rect(cx - 1, top - 46, 2, 14);
    beacons.push([cx, top - 46]);
    windows(markWin, cx - 20, top, 40, G - top, 0.3, rand);
  }
  // Comcast Center: a tapered glass obelisk with chamfered shoulders.
  {
    const cx = 900;
    marks += poly([[cx - 28, G], [cx - 22, 98], [cx - 15, 86], [cx + 15, 86], [cx + 22, 98], [cx + 28, G]]);
    windows(glass, cx - 21, 104, 42, G - 104, 0.28, rand, "band");
    beacons.push([cx, 86]);
  }
  // Comcast Technology Center: the tallest, with an open lantern at the crown.
  let lantern;
  {
    const cx = 982;
    marks += rect(cx - 24, 72, 48, G - 72);
    marks += rect(cx - 24, 40, 48, 32);
    lantern = [-15, -7, 1, 9].map((dx) => rect(cx + dx, 46, 5, 21)).join(""); // glass fins of the lit crown
    marks += rect(cx - 1, 30, 2, 10);
    beacons.push([cx, 30]);
    windows(glass, cx - 24, 78, 48, G - 78, 0.3, rand, "band");
  }

  // City Hall, drawn last so it sits in front.
  let hall = "";
  const hallWin = emptyWin();
  {
    const cx = 790;
    hall += rect(cx - 66, G - 46, 132, 46);
    hall += rect(cx - 66, G - 54, 16, 8) + rect(cx + 50, G - 54, 16, 8) + rect(cx - 8, G - 54, 16, 8);
    hall += rect(cx - 12, G - 118, 24, 72);
    hall += rect(cx - 15, G - 134, 30, 16);
    [
      [24, 10],
      [18, 8],
      [12, 6],
      [6, 4],
    ].reduce((y, [w, h]) => {
      hall += rect(cx - w / 2, y - h, w, h);
      return y - h;
    }, G - 134);
    hall += rect(cx - 1.5, G - 168 - 6, 3, 6); // William Penn
    windows(hallWin, cx - 64, G - 44, 128, 42, 0.45, rand);
    windows(hallWin, cx - 12, G - 116, 24, 68, 0.2, rand);
  }
  const clock = [790, G - 126];

  // Ben Franklin Bridge: two lattice towers, catenary cables, lights along them.
  const deckY = 338;
  let bridge = rect(1150, deckY, W - 1150 + 20, 5);
  const towers = [1300, 1500];
  for (const tx of towers) {
    bridge += rect(tx - 8, 232, 4, deckY - 232 + 42) + rect(tx + 4, 232, 4, deckY - 232 + 42);
    for (let y = 240; y < deckY; y += 18) bridge += rect(tx - 8, y, 16, 2);
    bridge += rect(tx - 10, 228, 20, 4);
  }
  const quad = (p0, p1, p2, t) => [
    (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
    (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
  ];
  const spans = [
    [[1150, deckY], [1250, 318], [1300, 230]],
    [[1300, 230], [1400, 392], [1500, 230]],
    [[1500, 230], [1560, 300], [W + 20, deckY - 10]],
  ];
  const cable = spans.map(([a, b, c], i) => `${i ? "" : `M${a[0]} ${a[1]}`}Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`).join("");
  const lights = [];
  spans.forEach(([a, b, c]) => {
    for (let t = 0.08; t < 1; t += 0.085) lights.push(quad(a, b, c, t).map((v) => Math.round(v * 10) / 10));
  });

  // Boathouse Row: small gabled houses traced in light.
  const houses = [];
  for (let x = 140, i = 0; i < 8; i++) {
    const w = 24 + Math.round(rand() * 12);
    const h = 14 + Math.round(rand() * 8);
    const roof = 8 + Math.round(rand() * 6);
    houses.push(`M${x} ${G}V${G - h}L${x + w / 2} ${G - h - roof}L${x + w} ${G - h}V${G}`);
    x += w + 4;
  }

  // Reflections under the brightest things.
  const reflect = [];
  for (const [x] of beacons) reflect.push(x);
  [300, 378, 560, 622, 690, 790, 900, 982].forEach((x) => reflect.push(x + 6, x - 8));

  const join = (win) => ({ lit: win.lit.map((g) => g.join("")), dark: win.dark.join("") });
  return {
    stars: stars.map((s) => s.join("")),
    far,
    mid,
    midWin: join(midWin),
    near,
    nearWin: join(nearWin),
    marks,
    markWin: join(markWin),
    lantern,
    glass: join(glass),
    hall,
    hallWin: join(hallWin),
    clock,
    beacons,
    bridge,
    cable,
    lights,
    houses,
    reflect,
  };
}

const S = build();

function Win({ win, kind }) {
  return (
    <>
      <path className={`sk-win-dark sk-${kind}-dark`} d={win.dark} />
      {win.lit.map((d, i) => (
        <path key={i} className={`sk-win sk-${kind}-lit`} style={{ "--g": i }} d={d} />
      ))}
    </>
  );
}

const svgProps = {
  viewBox: `0 0 ${W} ${H}`,
  preserveAspectRatio: "xMidYMax slice",
  "aria-hidden": true,
  focusable: "false",
};



function Skyline() {
  const root = useRef(null);
  const [lit, setLit] = useState(false);

  // Scroll parallax is measured against the band itself, so it works wherever the band sits.
  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return undefined;
    let raf = 0;
    let px = 0;
    let visible = false;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      el.style.setProperty("--sy", ((p - 0.5) * 100).toFixed(1));
      el.style.setProperty("--px", px.toFixed(3));
    };
    const queue = () => {
      if (visible && !raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e) => {
      px = e.clientX / window.innerWidth - 0.5;
      queue();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      queue();
    });
    io.observe(el);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // The Konami code: bring the city on screen, switch every window on, set off fireworks.
  useEffect(() => {
    let t1 = 0;
    let t2 = 0;
    const onCheat = () => {
      clearTimeout(t1);
      clearTimeout(t2);
      const r = root.current.getBoundingClientRect();
      const away = r.bottom < 0 || r.top > window.innerHeight;
      t1 = setTimeout(
        () => {
          if (away) root.current.scrollIntoView({ block: "center", behavior: reducedMotion() ? "auto" : "smooth" });
          setLit(true);
          t2 = setTimeout(() => setLit(false), 6500);
        },
        away ? 900 : 0
      );
    };
    window.addEventListener(CHEAT, onCheat);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener(CHEAT, onCheat);
    };
  }, []);

  return (
    <div className={`skyline${lit ? " is-cheat" : ""}`} ref={root} aria-hidden="true">
      <svg className="sk-layer sk-sky" {...svgProps} style={{ "--depth": 0.55, "--drift": 4 }}>
        {S.stars.map((d, i) => (
          <path key={i} className="sk-star" style={{ "--g": i }} d={d} />
        ))}
        <g className="sk-plane">
          <rect x="0" y="0" width="9" height="2" />
          <rect x="3" y="-2" width="2" height="6" />
          <circle className="sk-plane-light" cx="9" cy="1" r="1.3" />
        </g>
      </svg>
      <span className="sk-moon" />
      <svg className="sk-layer sk-far" {...svgProps} style={{ "--depth": 0.38, "--drift": 8 }}>
        <path d={S.far} />
      </svg>
      <svg className="sk-layer sk-mid" {...svgProps} style={{ "--depth": 0.24, "--drift": 14 }}>
        <path className="sk-mid-body" d={S.mid} />
        <Win win={S.midWin} kind="mid" />
      </svg>
      <svg className="sk-layer sk-near" {...svgProps} style={{ "--depth": 0.12, "--drift": 22 }}>
        <path className="sk-near-body" d={S.near} />
        <Win win={S.nearWin} kind="near" />
        <path className="sk-mark" d={S.marks} />
        <Win win={S.markWin} kind="near" />
        <path className="sk-lantern" d={S.lantern} />
        <Win win={S.glass} kind="glass" />
        <path className="sk-hall" d={S.hall} />
        <Win win={S.hallWin} kind="hall" />
        <circle className="sk-clock" cx={S.clock[0]} cy={S.clock[1]} r="4" />
        {S.beacons.map(([x, y], i) => (
          <circle key={i} className="sk-beacon" cx={x} cy={y} r="2.4" style={{ "--i": i }} />
        ))}
      </svg>
      <svg className="sk-layer sk-fore" {...svgProps} style={{ "--depth": 0, "--drift": 30 }}>
        <rect className="sk-water" x="-20" y={G} width={W + 40} height={H - G + 12} />
        <g className="sk-reflect">
          {S.reflect.flatMap((x, i) =>
            [0, 1, 2, 3].map((k) => (
              <rect key={`${i}-${k}`} x={x - (8 - k * 2) + ((i + k) % 3)} y={G + 5 + k * 7} width={16 - k * 4} height="1.5" style={{ "--i": i + k }} />
            ))
          )}
        </g>
        <path className="sk-bridge" d={S.bridge} />
        <path className="sk-cable" d={S.cable} />
        {S.lights.map(([x, y], i) => (
          <circle key={i} className="sk-bulb" cx={x} cy={y} r="1.6" style={{ "--i": i }} />
        ))}
        {S.houses.map((d, i) => (
          <path key={i} className="sk-house" d={d} />
        ))}
      </svg>
      <div className="sk-fireworks">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>
    </div>
  );
}

export default Skyline;
