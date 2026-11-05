// The mark: a lowercase "Mi" cut from a signal-yellow tile. The dot of the i is a lit
// window, the same square that lights up across the skyline. Same drawing as
// public/favicon.svg and the PNG app icons; keep them in step.
const MARK_M = "M6 23V9h3.8l3.6 7.2L17 9h3.8v14h-3.4v-7.8l-2.8 5.4h-2.4l-2.8-5.4V23z";
const MARK_I = "M23.2 13.4h3.4V23h-3.4z";
const MARK_DOT = "M23.2 9h3.4v3.2h-3.4z";

export function Mark({ size = 30 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect className="mark-tile" width="32" height="32" rx="7" />
      <path className="mark-px" d={MARK_M + MARK_I} />
      <path className="mark-px mark-dot" d={MARK_DOT} />
    </svg>
  );
}

// Generic marks for core skills that have no free brand logo.
const GLYPHS = {
  SQL: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  Excel: "M4 4h16v16H4zM4 9.5h16M4 15h16M10 4v16",
  "REST APIs": "M9 4C7 4 6 5 6 7v2.5C6 11 5.2 12 3.5 12 5.2 12 6 13 6 14.5V17c0 2 1 3 3 3M15 4c2 0 3 1 3 3v2.5c0 1.5.8 2.5 2.5 2.5-1.7 0-2.5 1-2.5 2.5V17c0 2-1 3-3 3",
};

// A skill's logo from Simple Icons, a generic mark, or nothing.
export function SkillLogo({ logo, name, size = 18 }) {
  if (!logo) {
    if (!GLYPHS[name]) return null;
    return (
      <svg className="slogo slogo-glyph" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={GLYPHS[name]} />
      </svg>
    );
  }
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(logo.hex.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Near-black brands vanish on the dark theme, near-yellow ones on the light theme.
  const tone = lum < 0.18 ? " is-darkbrand" : lum > 0.7 ? " is-lightbrand" : "";
  return (
    <svg className={`slogo${tone}`} style={{ "--brand": logo.hex }} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={logo.d} />
    </svg>
  );
}
