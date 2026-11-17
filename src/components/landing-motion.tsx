"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function LandingMotion({
  children,
  lang,
}: {
  children: ReactNode;
  lang: "zh-CN" | "en";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let entrances: IntersectionObserver | undefined;

    function stop() {
      entrances?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      root?.removeAttribute("data-motion");
    }

    function start() {
      if (!root || preference.matches) return;
      root.dataset.motion = "ready";

      entrances = new IntersectionObserver(
        (entries, observer) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer.unobserve(entry.target);
            const delay = Number(
              entry.target.getAttribute("data-reveal-delay") ?? 0,
            );
            const animation = entry.target.animate(
              [
                { opacity: 0, transform: "translateY(14px)" },
                { opacity: 1, transform: "none" },
              ],
              {
                duration: 620,
                delay: Math.min(delay, 240),
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "backwards",
              },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
      );
      root
        .querySelectorAll("[data-reveal]")
        .forEach((element) => entrances?.observe(element));
    }

    function update() {
      stop();
      start();
    }

    start();
    preference.addEventListener("change", update);
    return () => {
      stop();
      preference.removeEventListener("change", update);
    };
  }, [lang]);

  return (
    <main ref={ref} className="landing" lang={lang}>
      {children}
    </main>
  );
}
