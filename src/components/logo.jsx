// The mark: "MI" in chunky pixel strokes on a coral tile, like a player-one
// button. Same drawing as public/favicon.svg and the PNG app icons; keep them in step.
const MARK_PIXELS =
  "M2 4h2v8h-2zM4 5h1v2h-1zM5 6h1v2h-1zM6 5h1v2h-1zM7 4h2v8h-2zM10 4h4v1h-4zM11 5h2v6h-2zM10 11h4v1h-4z";

export function Mark({ size = 30 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <rect className="mark-tile" width="16" height="16" rx="3.5" />
      <path className="mark-px" d={MARK_PIXELS} />
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
