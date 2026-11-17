"use client";

import { useEffect, useRef } from "react";
import { mascotPaths } from "@/lib/mascot";
import { createMascotMotion } from "@/lib/mascot-motion";

type Mood = "awake" | "drowsy" | "sleeping";

export function Mascot({ label }: { label: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const eyes = root.querySelectorAll<SVGGElement>(".mascot-blink");
    const motion = createMascotMotion(root);
    const animations = new Set<Animation>();
    let visible = false;
    let active = false;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let glanceTimer: ReturnType<typeof setTimeout>;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let mood: Mood = "awake";
    let frame = 0;
    let lastActivity = performance.now();

    function animate(element: Element, frames: Keyframe[], duration: number) {
      element.getAnimations().forEach((animation) => animation.cancel());
      const animation = element.animate(frames, {
        duration,
        easing: "cubic-bezier(.22, 1, .36, 1)",
      });
      animations.add(animation);
      animation.onfinish = animation.oncancel = () =>
        animations.delete(animation);
    }

    function look(x = 0, y = 0) {
      root!.style.setProperty("--mascot-look-x", `${x}px`);
      root!.style.setProperty("--mascot-look-y", `${y}px`);
      motion.look(x / 6, y / 4);
    }

    function blink(wink = false) {
      if (!active || mood !== "awake") return;
      eyes.forEach((eye, i) => {
        if (wink && i === 1) {
          eye.getAnimations().forEach((animation) => animation.cancel());
          return;
        }
        animate(
          eye,
          [
            { transform: "scaleY(1)", offset: 0 },
            { transform: "scaleY(.07)", offset: 0.4 },
            { transform: "scaleY(1)", offset: 1 },
          ],
          wink ? 310 : 190,
        );
      });
    }

    function scheduleBlink(first = false) {
      clearTimeout(blinkTimer);
      if (!active || mood !== "awake") return;
      blinkTimer = setTimeout(
        () => {
          blink();
          if (
            performance.now() - lastActivity > 1800 &&
            !root!.matches(":hover, :focus-visible")
          ) {
            look(Math.random() > 0.5 ? 4 : -4, -1);
            glanceTimer = setTimeout(() => look(), 850);
          }
          scheduleBlink();
        },
        first ? 1800 : 3000 + Math.random() * 2600,
      );
    }

    function setMood(next: Mood) {
      root!.dataset.state = next;
      if (mood === next) return;
      mood = next;
      motion.sleep(next === "sleeping" ? 1 : next === "drowsy" ? 0.35 : 0);
      if (next !== "awake") {
        clearTimeout(blinkTimer);
        clearTimeout(glanceTimer);
        animations.forEach((animation) => animation.cancel());
        look();
      }
    }

    function checkIdle() {
      idleTimer = undefined;
      if (!active) return;
      const elapsed = performance.now() - lastActivity;
      if (elapsed >= 12000) {
        setMood("sleeping");
      } else {
        if (elapsed >= 8000) setMood("drowsy");
        idleTimer = setTimeout(
          checkIdle,
          (elapsed < 8000 ? 8000 : 12000) - elapsed,
        );
      }
    }

    function activity() {
      if (!active) return;
      lastActivity = performance.now();
      if (mood !== "awake") {
        setMood("awake");
        scheduleBlink(true);
        motion.perk();
      }
      if (idleTimer === undefined) idleTimer = setTimeout(checkIdle, 8000);
    }

    function sync() {
      active = visible && !document.hidden && !preference.matches;
      root!.dataset.awake = String(active);
      motion.setActive(active);
      setMood("awake");
      clearTimeout(blinkTimer);
      clearTimeout(glanceTimer);
      clearTimeout(idleTimer);
      idleTimer = undefined;
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      look();
      scheduleBlink(true);
      activity();
    }

    function follow(event: PointerEvent) {
      activity();
      if (!active || event.pointerType !== "mouse") return;
      clearTimeout(glanceTimer);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = root!.getBoundingClientRect();
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));
        look(
          clamp(
            (event.clientX - box.left - box.width * 0.51) / (box.width * 0.6),
          ) * 6,
          clamp(
            (event.clientY - box.top - box.height * 0.54) / (box.height * 0.6),
          ) * 4,
        );
      });
    }

    function resetLook() {
      cancelAnimationFrame(frame);
      clearTimeout(glanceTimer);
      look();
    }

    function acknowledge() {
      activity();
      blink();
      motion.perk();
    }

    function greet() {
      activity();
      if (!active) return;
      blink(true);
      motion.perk();
      scheduleBlink();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(root);
    window.addEventListener("pointermove", follow, { passive: true });
    window.addEventListener("pointerdown", activity, { passive: true });
    window.addEventListener("keydown", activity);
    window.addEventListener("scroll", activity, { passive: true });
    window.addEventListener("blur", resetLook);
    document.documentElement.addEventListener("pointerleave", resetLook);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    root.addEventListener("pointerenter", acknowledge);
    root.addEventListener("focus", acknowledge);
    root.addEventListener("click", greet);

    return () => {
      observer.disconnect();
      motion.setActive(false);
      clearTimeout(blinkTimer);
      clearTimeout(glanceTimer);
      clearTimeout(idleTimer);
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      root.removeAttribute("data-awake");
      root.removeAttribute("data-state");
      look();
      window.removeEventListener("pointermove", follow);
      window.removeEventListener("pointerdown", activity);
      window.removeEventListener("keydown", activity);
      window.removeEventListener("scroll", activity);
      window.removeEventListener("blur", resetLook);
      document.documentElement.removeEventListener("pointerleave", resetLook);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      root.removeEventListener("pointerenter", acknowledge);
      root.removeEventListener("focus", acknowledge);
      root.removeEventListener("click", greet);
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className="mascot-art"
      aria-label={label}
      data-reveal
      data-reveal-delay="120"
      data-state="awake"
    >
      <svg
        viewBox="0 0 520 440"
        fill="none"
        className="mascot-illustration"
        aria-hidden="true"
      >
        <ellipse
          className="mascot-shadow"
          cx="260"
          cy="343"
          rx="103"
          ry="5"
          fill="currentColor"
        />
        <g className="mascot-body">
          <g className="mascot-perk">
            <g>
              <g transform="translate(40 0) scale(1.7)">
                <g
                  transform="translate(-324.399033 -518.11261)"
                  fill="currentColor"
                >
                  <path className="mascot-outline" d={mascotPaths.outline} />
                  <g className="mascot-gaze">
                    {[mascotPaths.leftEye, mascotPaths.rightEye].map(
                      (path, i) => (
                        <g className="mascot-blink" key={i}>
                          <path className="mascot-eye" d={path} />
                        </g>
                      ),
                    )}
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
        <g className="mascot-sleep-cloud">
          <text className="mascot-sleep-letter" x="438" y="106">
            z
          </text>
          <text className="mascot-sleep-letter" x="438" y="106">
            z
          </text>
          <text className="mascot-sleep-letter" x="438" y="106">
            z
          </text>
        </g>
        <g
          className="mascot-hello"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M438 102l8-13M449 116l15-5M425 95l1-15" />
        </g>
        <path
          className="mascot-arrow"
          d="M131 377C163 393 204 394 233 384M223 380l12 3-6 11"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="252" y="391" transform="rotate(-5 252 391)">
          one package at a time.
        </text>
      </svg>
    </button>
  );
}
