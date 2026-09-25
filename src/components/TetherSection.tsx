import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { assets } from "@/lib/assets";
import MediaFrame from "@/components/primitives/MediaFrame";
import SectionLabel from "@/components/primitives/SectionLabel";
import { Anchor } from "@/components/primitives/TetherLine";

const VERBS = [
  { key: "anchor", label: "Anchor", cls: "v-anchor" },
  { key: "tension", label: "Tension", cls: "v-tension" },
  { key: "cross", label: "Cross", cls: "v-cross" },
  { key: "mark", label: "Mark", cls: "v-mark" },
  { key: "rupture", label: "Rupture", cls: "v-rupture" },
];

const MARK_X = [26, 40, 54, 68, 80];

export default function TetherSection() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const get = <T extends Element>(sel: string): T =>
        root.current!.querySelector<T>(sel)!;
      const path = get<SVGPathElement>(".tether-path");
      const anchorA = get<Element>(".anchor-a");
      const anchorB = get<Element>(".anchor-b");

      if (reduced) {
        gsap.set(path, { strokeDashoffset: 0, stroke: "#f2a93b" });
        gsap.set([anchorA, anchorB], { opacity: 1, scale: 1 });
        gsap.set(".v-chip", { color: "#eae5d7", borderColor: "rgba(234,229,215,0.3)" });
        gsap.set(".enemy-node", { opacity: 1 });
        gsap.set(".enemy-mark", { fill: "#e8409a" });
        gsap.set(".cross-band", { opacity: 1 });
        gsap.set(".rupture-note", { opacity: 1 });
        return;
      }

      gsap.set(path, { strokeDasharray: "1 1", strokeDashoffset: 1, stroke: "#3adbe0", strokeWidth: 2 });
      gsap.set([anchorA, anchorB], { opacity: 0, scale: 0, transformOrigin: "center" });
      gsap.set(".enemy-node", { opacity: 0.28 });
      gsap.set(".enemy-mark", { fill: "#96a2b2" });
      gsap.set(".rupture-burst", { opacity: 0, scale: 0.4 });
      gsap.set(".cross-band", { opacity: 0 });

      const chip = (c: string) => get<Element>(c);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // 1. Anchor A locks
      tl.to(anchorA, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.4)" }, 0)
        .to(chip(".v-anchor"), { color: "#3adbe0", borderColor: "rgba(58,219,224,0.6)", duration: 0.2 }, 0.1)
        // 2. the line extends across the viewport
        .to(path, { strokeDashoffset: 0, duration: 1.5 }, 0.3)
        // 3–4. it crosses the footage; enemies crossing take an Instability Mark
        .to(".cross-band", { opacity: 1, duration: 0.3 }, 1.15)
        .to(".enemy-node", { opacity: 1, duration: 0.25, stagger: 0.12 }, 1.2)
        .to(".enemy-mark", { fill: "#e8409a", duration: 0.25, stagger: 0.12 }, 1.2)
        .to(chip(".v-cross"), { color: "#3adbe0", borderColor: "rgba(58,219,224,0.6)", duration: 0.2 }, 1.2)
        .to(chip(".v-mark"), { color: "#e8409a", borderColor: "rgba(232,64,154,0.6)", duration: 0.2 }, 1.5)
        // 5. Anchor B locks · tension rises
        .to(anchorB, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.4)" }, 1.75)
        .to(path, { stroke: "#f2a93b", strokeWidth: 3.5, duration: 0.4 }, 1.8)
        .to(chip(".v-tension"), { color: "#f2a93b", borderColor: "rgba(242,169,59,0.6)", duration: 0.2 }, 1.85)
        .to(".tether-frame", { x: 2.5, duration: 0.1, repeat: 7, yoyo: true }, 2.0)
        // 6. Rupture
        .to(".rupture-burst", { opacity: 1, scale: 1, duration: 0.18 }, 2.5)
        .to(path, { stroke: "#e8409a", strokeWidth: 5, duration: 0.1 }, 2.5)
        .to(chip(".v-rupture"), { color: "#e8409a", borderColor: "rgba(232,64,154,0.7)", duration: 0.15 }, 2.55)
        .to(".rupture-burst", { opacity: 0, duration: 0.4 }, 2.7)
        .fromTo(".rupture-note", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, 2.7);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="tether" ref={root} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-col gap-3">
            <SectionLabel index="03" name="The Tether" ref="MECH-01" />
            <h2 className="max-w-3xl font-display text-[clamp(2.1rem,5.2vw,4.4rem)] uppercase leading-[0.9] text-ivory">
              Anchor the impossible.
            </h2>
            <p className="max-w-md font-mono text-sm leading-relaxed text-pale/80">
              Positioning and spatial manipulation matter as much as shooting. The Tether is a
              weapon, an instrument, and a narrative mechanism at once.
            </p>
          </div>

          {/* the tethered battlefield */}
          <div className="relative mt-10">
            <div className="tether-frame relative mx-auto aspect-video w-full max-w-4xl">
              <MediaFrame
                src={assets.gameplayA}
                alt="ERRANT NORTH gameplay — the Tether line cutting across a battlefield"
                wash={0.4}
                reticle
                className="size-full"
              >
                {/* cross band where the line intersects the frame */}
                <div className="cross-band pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-anomaly/70" />
                <div className="cross-band pointer-events-none absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 bg-anomaly/10" />
                {/* enemy markers on the line */}
                {MARK_X.map((x) => (
                  <span
                    key={x}
                    className="enemy-node pointer-events-none absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45"
                    style={{ left: `${x}%`, zIndex: 5 }}
                  >
                    <svg viewBox="0 0 10 10" className="size-full overflow-visible">
                      <rect className="enemy-mark" x="1" y="1" width="8" height="8" />
                    </svg>
                  </span>
                ))}
                {/* instability tag */}
                <div className="cross-band pointer-events-none absolute right-4 top-4 border border-anomaly/60 bg-ink/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-anomaly">
                  instability mark
                </div>
              </MediaFrame>
            </div>

            {/* anchors as non-distorting HTML markers */}
            <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2">
              <svg viewBox="0 0 24 24" className="anchor-a size-9 text-spectral" style={{ opacity: 0 }}>
                <Anchor x={12} y={12} color="currentColor" r={4} />
              </svg>
            </div>
            <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
              <svg viewBox="0 0 24 24" className="anchor-b size-9 text-spectral" style={{ opacity: 0 }}>
                <Anchor x={12} y={12} color="currentColor" r={4} />
              </svg>
            </div>

            {/* the tether line */}
            <svg
              className="pointer-events-none absolute inset-0 size-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="tether-path"
                d="M 4 50 L 96 50"
                fill="none"
                strokeWidth="0.5"
                strokeLinecap="round"
                pathLength={1}
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* rupture burst */}
            <div
              className="rupture-burst pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,64,154,0.5) 0%, rgba(232,64,154,0.12) 45%, transparent 70%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* verbs */}
          <div className="mt-10 flex flex-wrap items-center gap-2.5">
            {VERBS.map((v) => (
              <span
                key={v.key}
                className={`v-chip ${v.cls} border border-ivory/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-pale transition-colors`}
              >
                {v.label}
              </span>
            ))}
            <p className="rupture-note ml-auto max-w-xs font-mono text-[11px] leading-relaxed text-anomaly/80">
              Rupture resolves the geometry. Marked targets break first.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
