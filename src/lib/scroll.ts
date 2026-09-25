import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let lenis: Lenis | null = null;

/** Initialise inertial smooth scrolling and wire it into GSAP/ScrollTrigger. */
export function initSmoothScroll() {
  if (typeof window === "undefined") return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return () => {};

  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => {
    if (lenis) lenis.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

/** Smoothly scroll to an in-page anchor id (Lenis-aware, reduced-motion safe). */
export function scrollToId(id: string) {
  const el = document.querySelector(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function getLenis() {
  return lenis;
}
