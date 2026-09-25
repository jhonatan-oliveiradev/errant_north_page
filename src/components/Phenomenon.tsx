import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import CartographicGrid from "@/components/primitives/CartographicGrid";
import SectionLabel from "@/components/primitives/SectionLabel";
import TetherLine from "@/components/primitives/TetherLine";

export default function Phenomenon() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(
          [
            ".ph-grid-stable",
            ".ph-grid-errant",
            ".ph-tick",
            ".ph-word",
            ".ph-copy",
            ".ph-conflict",
            ".ph-axis",
          ],
          { opacity: 1, clearProps: "transform" },
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      tl.fromTo(
        ".ph-grid-stable",
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1 },
        0,
      )
        .fromTo(
          ".ph-axis",
          { opacity: 0, scaleX: 0 },
          { opacity: 1, scaleX: 1, duration: 0.6, stagger: 0.1 },
          0.2,
        )
        .fromTo(
          ".ph-tick",
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.05 },
          0.5,
        )
        // the errant reference system emerges and disagrees
        .fromTo(
          ".ph-grid-errant",
          { opacity: 0, rotate: 0, x: 0, y: 0 },
          { opacity: 0.85, rotate: 2.4, x: 26, y: -18, duration: 1.2 },
          1.4,
        )
        .to(".ph-word-dup", { x: 60, opacity: 1, duration: 1 }, 1.6)
        .fromTo(
          ".ph-conflict",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          1.9,
        )
        .fromTo(".ph-copy", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 2.1)
        .to(".ph-word-3", { x: 22, duration: 0.8 }, 2.2);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="phenomenon"
      ref={root}
      className="relative h-[230vh]"
    >
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        {/* stable reference grid */}
        <div className="ph-grid-stable pointer-events-none absolute inset-0">
          <CartographicGrid
            step={56}
            major={4}
            color="rgba(58,219,224,0.06)"
            majorColor="rgba(58,219,224,0.12)"
          />
        </div>
        {/* errant reference grid */}
        <div className="ph-grid-errant pointer-events-none absolute -inset-[10%] opacity-0">
          <CartographicGrid
            step={70}
            major={3}
            color="rgba(232,64,154,0.08)"
            majorColor="rgba(232,64,154,0.16)"
            crosses={false}
          />
        </div>

        {/* axes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="ph-axis absolute left-1/2 top-0 h-full w-px origin-top bg-spectral/20" />
          <div className="ph-axis absolute left-0 top-1/2 h-px w-full origin-left bg-spectral/20" />
          <div className="ph-axis absolute left-1/2 top-0 h-full w-px origin-top translate-x-8 bg-anomaly/20" />
        </div>

        {/* measurement ticks */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[8%]">
          {["000", "025", "050", "075", "100"].map((t) => (
            <span key={t} className="ph-tick font-mono text-[9px] tracking-[0.2em] text-pale/50">
              {t}
            </span>
          ))}
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-8">
          <SectionLabel index="02" name="The Phenomenon" ref="OBS-2088" tone="anomaly" />

          <h2 className="mt-6 font-display uppercase leading-[0.84] text-ivory">
            <span className="ph-word block text-[clamp(2.8rem,10vw,9rem)]">Space stopped</span>
            <span className="relative block text-[clamp(2.8rem,10vw,9rem)] text-spectral">
              <span className="ph-word ph-word-2">Agreeing</span>
              <span className="ph-word ph-word-dup absolute left-0 top-0 text-anomaly opacity-0">
                Agreeing
              </span>
            </span>
            <span className="ph-word ph-word-3 block text-[clamp(2.8rem,10vw,9rem)]">
              With itself.
            </span>
          </h2>

          {/* measurement conflict */}
          <div className="ph-conflict mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-xs tracking-[0.14em]">
            <span className="text-spectral">θ = 000.00° · VALID</span>
            <span className="text-pale/40">vs</span>
            <span className="text-anomaly">θ = 180.00° · VALID</span>
          </div>

          <div className="ph-copy mt-8 max-w-xl">
            <p className="text-lg leading-relaxed text-ivory/80 sm:text-xl">
              Two measurements of the same region. Both correct. Neither negotiable.
            </p>
            <p className="mt-4 font-mono text-sm leading-relaxed text-pale/70">
              Errant North is a region where spatial references stopped converging. The map
              stopped describing the territory. The territory began obeying the map.
            </p>
          </div>
        </div>

        {/* a single drifting tether across the frame */}
        <TetherLine
          ax={6}
          ay={78}
          bx={94}
          by={22}
          bow={6}
          state="tension"
          dashed
          showAnchors={false}
          width={0.8}
          className="opacity-50"
        />
      </div>
    </section>
  );
}
