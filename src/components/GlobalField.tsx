import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import CartographicGrid from "@/components/primitives/CartographicGrid";

/**
 * The shared cartographic layer that sits behind the whole experience. As the
 * visitor travels deeper, a second (magenta) reference grid fades in and drifts
 * out of agreement with the first — the page itself loses confidence in its
 * coordinates.
 */
export default function GlobalField() {
  const root = useRef<HTMLDivElement>(null);
  const stableGrid = useRef<HTMLDivElement>(null);
  const errantGrid = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const scroll = {
        trigger: document.body,
        start: 0,
        end: "max",
        scrub: 1,
      };
      gsap.to(stableGrid.current, {
        x: -70,
        y: -46,
        ease: "none",
        scrollTrigger: scroll,
      });
      gsap.fromTo(
        errantGrid.current,
        { opacity: 0, x: 0, y: 0, rotate: 0 },
        {
          opacity: 0.55,
          x: 46,
          y: 34,
          rotate: 0.7,
          ease: "none",
          scrollTrigger: scroll,
        },
      );
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-graphite via-ink to-graphite" />

      {/* stable reference grid (spectral cyan) */}
      <div ref={stableGrid} className="absolute -inset-[12%]">
        <CartographicGrid
          step={52}
          major={4}
          color="rgba(58,219,224,0.05)"
          majorColor="rgba(58,219,224,0.11)"
        />
      </div>

      {/* errant reference grid (magenta) — disagrees as you descend */}
      <div ref={errantGrid} className="absolute -inset-[12%] opacity-0">
        <CartographicGrid
          step={64}
          major={3}
          color="rgba(232,64,154,0.07)"
          majorColor="rgba(232,64,154,0.14)"
          crosses={false}
        />
      </div>

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(5,8,14,0.55) 78%, rgba(5,8,14,0.9) 100%)",
        }}
      />
    </div>
  );
}
