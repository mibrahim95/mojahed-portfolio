import { useEffect } from "react";

// Section parts and pictures enter once, as they scroll into view.
// Content is only hidden when this runs (the `js` class gates the CSS).
export default function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window)) return undefined;
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
