const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export const ArrowRight = (p) => (
  <svg className="arrow" {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronLeft = (p) => (
  <svg {...base} strokeWidth={3} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ChevronRight = (p) => (
  <svg {...base} strokeWidth={3} {...p}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);
