import { useCallback, useEffect, useRef, useState } from "react";
import { CHEAT, SKIP_KEYS, reducedMotion } from "../motion";

// Up, up, down, down, left, right, left, right, B, A. Works from the keyboard
// anywhere on the page, or from the cabinet's own D-pad and buttons.
const CODE = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];
const KEYS = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", b: "b", a: "a", B: "b", A: "a" };

// The pad's up and down walk the whole page, one section at a time.
const SECTIONS = ["top", "skills", "projects", "experience", "contact"];
function jump(dir) {
  const line = window.innerHeight * 0.35;
  let at = 0;
  SECTIONS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) at = i;
  });
  const next = SECTIONS[Math.min(SECTIONS.length - 1, Math.max(0, at + dir))];
  document.getElementById(next)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
}

// True when the latest presses could still be the start of the code, so the pad waits before scrolling away.
const midCode = (seq) => seq.some((_, i) => seq.slice(i).every((k, j) => k === CODE[j]));

// 8x8 pixel sprites for the two projects without a screenshot.
const SPRITES = {
  "Telegram contact API": "M0 1h8v6h-8zM1 2h1v1h-1zM2 3h1v1h-1zM3 4h2v1h-2zM5 3h1v1h-1zM6 2h1v1h-1z",
  Homelab: "M0 0h8v2h-8zM0 3h8v2h-8zM0 6h8v2h-8z",
};
const LEDS = { Homelab: "M1 1h1v-1h-1zM1 4h1v-1h-1zM1 7h1v-1h-1z" };

// Draws the project's screenshot at 96x60 and lets CSS blow it up with hard pixels.
function PixelShot({ src }) {
  const canvas = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const c = canvas.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      const r = Math.max(c.width / img.width, c.height / img.height);
      const w = img.width * r;
      const h = img.height * r;
      ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
    };
    img.src = src;
  }, [src]);
  return <canvas ref={canvas} className="cab-canvas" width="96" height="60" aria-hidden="true" />;
}

function Dpad({ press }) {
  const dirs = [
    ["up", "Up: previous section", "M3 0h1v1h1v1h1v1h-5v-1h1v-1h1z"],
    ["left", "Left: previous project", "M0 3v1h1v1h1v1h1v-5h-1v1h-1v1z"],
    ["right", "Right: next project", "M6 3v1h-1v1h-1v1h-1v-5h1v1h1v1z"],
    ["down", "Down: next section", "M3 6h1v-1h1v-1h1v-1h-5v1h1v1h1z"],
  ];
  return (
    <div className="dpad" role="group" aria-label="D-pad">
      {dirs.map(([id, label, d]) => (
        <button key={id} type="button" className={`dpad-${id}`} onClick={() => press(id)} aria-label={label}>
          <svg viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
            <path d={d} />
          </svg>
        </button>
      ))}
      <span className="dpad-hub" aria-hidden="true" />
    </div>
  );
}

function Cabinet({ list, index, onMove, onOpen }) {
  const [cheat, setCheat] = useState(false);
  const [info, setInfo] = useState(false);
  const [blip, setBlip] = useState(0);
  const seq = useRef([]);
  const pending = useRef(0);
  const root = useRef(null);
  const move = useRef(onMove);
  const p = list[index];

  useEffect(() => {
    move.current = onMove;
  });

  // Returns true when this press completed the code.
  const feed = useCallback((key) => {
    seq.current = [...seq.current, key].slice(-CODE.length);
    if (seq.current.join() === CODE.join()) {
      seq.current = [];
      clearTimeout(pending.current);
      setCheat(true);
      window.dispatchEvent(new Event(CHEAT));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea, select, dialog, [contenteditable]")) return;
      if (KEYS[e.key]) feed(KEYS[e.key]);
      // Left and right page through the cabinet while Projects holds the middle of the screen.
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest?.(SKIP_KEYS)) return;
      const r = root.current?.closest("section")?.getBoundingClientRect();
      const midY = window.innerHeight / 2;
      if (!r || r.top > midY || r.bottom < midY) return;
      e.preventDefault();
      move.current(e.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(pending.current);
    };
  }, [feed]);

  useEffect(() => {
    if (!cheat) return undefined;
    const t = setTimeout(() => setCheat(false), reducedMotion() ? 4000 : 6000);
    return () => clearTimeout(t);
  }, [cheat]);

  const press = (key) => {
    if (feed(key)) return;
    setBlip((b) => b + 1);
    clearTimeout(pending.current);
    if (key === "a") onOpen();
    else if (key === "b") setInfo((v) => !v);
    else if (key === "left" || key === "right") onMove(key === "left" ? -1 : 1);
    else {
      const dir = key === "up" ? -1 : 1;
      if (midCode(seq.current)) pending.current = setTimeout(() => jump(dir), 700);
      else jump(dir);
    }
  };

  return (
    <aside className={`cabinet${cheat ? " is-cheat" : ""}`} aria-labelledby="cab-title" data-reveal ref={root}>
      <div className="cab-marquee">
        <h3 id="cab-title" className="px">
          Play mode
        </h3>
      </div>
      <div className="cab-bezel">
        <div className="cab-screen" key={`${p.key}-${blip}`}>
          {p.imgPath ? (
            <PixelShot src={p.imgPath} />
          ) : (
            <svg className="cab-sprite" viewBox="-2 -2 12 12" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
              <path d={SPRITES[p.header]} />
              {LEDS[p.header] && <path className="cab-led" d={LEDS[p.header]} />}
            </svg>
          )}
          <div className="cab-hud px" aria-live="polite">
            <span>{p.header}</span>
            <span className="cab-num">
              {String(index + 1).padStart(2, "0")}/{String(list.length).padStart(2, "0")}
            </span>
          </div>
          {info && (
            <div className="cab-info px">
              <span>{p.kind}</span>
              <span>{p.year}</span>
              <span>{p.languages.slice(0, 3).join(" · ")}</span>
            </div>
          )}
          {cheat && (
            <div className="cab-cheat px" role="status">
              <span>Cheat on</span>
              <b>30 lives</b>
              <span className="cab-hearts" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <i key={i} style={{ "--i": i }} />
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="cab-deck">
        <Dpad press={press} />
        <div className="cab-ab">
          <button type="button" className="cab-btn cab-b" onClick={() => press("b")} aria-label="B: show details on screen">
            B
          </button>
          <button type="button" className="cab-btn cab-a" onClick={() => press("a")} aria-label={`A: open ${p.header}`}>
            A
          </button>
        </div>
      </div>
      <p className="cab-help">
        Left and right browse, up and down move through the page, <b>A</b> opens, <b>B</b> shows details. Your arrow
        keys work too, and so do old cheat codes.
      </p>
    </aside>
  );
}

export default Cabinet;
