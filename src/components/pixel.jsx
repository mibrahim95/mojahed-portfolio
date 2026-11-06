// Pixel sprites drawn from text grids: one character per pixel, "." is clear.
// Rendered as SVG runs with crispEdges and shown only at whole-number scales
// (CSS sets width = grid width x scale), so every pixel stays square and sharp.

function runs(rows) {
  const byColor = {};
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === c) end++;
      if (c !== ".") (byColor[c] ||= []).push(`M${x} ${y}h${end - x}v1h-${end - x}z`);
      x = end;
    }
  });
  return Object.entries(byColor).map(([c, d]) => [c, d.join("")]);
}

const cache = new WeakMap();
function paths(rows) {
  if (!cache.has(rows)) cache.set(rows, runs(rows));
  return cache.get(rows);
}

// `palette` maps grid characters to CSS classes (colors live in styles.css so both themes work).
export function Pix({ rows, scale = 3, className = "", label }) {
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg
      className={`pix ${className}`.trim()}
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {paths(rows).map(([c, d]) => (
        <path key={c} className={`px-${c}`} d={d} />
      ))}
    </svg>
  );
}
