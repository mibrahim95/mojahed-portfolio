import { useEffect } from "react";

// Section parts and pictures enter once, as they scroll into view.
// Content is only hidden when this runs (the `js` class gates the CSS).
//
// The "seen" flag is a data attribute, not a class: React rewrites `className` whenever a
// component re-renders with a new one (a job folding under a skill filter, say), which
// used to wipe an added class and leave whole revealed sections invisible, a tall empty
// gap above the footer. React never touches attributes it did not render.
export default function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );
    const watch = () => document.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
    watch();
    // Parts mounted later (results, filtered lists) get watched too.
    const mo = new MutationObserver(watch);
    mo.observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
