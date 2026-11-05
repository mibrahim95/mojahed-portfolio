// "mi": an M drawn as one stroke, like a line on a chart, and an i whose dot is
// the last data point. Same drawing as public/favicon.svg; keep the two in step.
export function Mark({ size = 30 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect className="mark-tile" width="32" height="32" rx="9" />
      <path className="mark-m" d="M7.5 22.5V11l5.75 7.25L19 11v11.5" />
      <path className="mark-i" d="M24.5 16.5v6" />
      <circle className="mark-dot" cx="24.5" cy="11.25" r="2.1" />
    </svg>
  );
}

// Generic marks for core skills that have no free brand logo.
const GLYPHS = {
  SQL: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  Excel: "M4 4h16v16H4zM4 9.5h16M4 15h16M10 4v16",
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
