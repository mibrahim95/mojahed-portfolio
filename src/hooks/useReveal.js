import { useEffect } from "react";

// Fades elements marked with data-reveal into view the first time they
// scroll on screen. CSS only hides them when motion is allowed and JS runs.
export default function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return undefined;
    }
    root.classList.add("js");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
