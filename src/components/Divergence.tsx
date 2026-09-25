import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionLabel from "@/components/primitives/SectionLabel";

const TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

function Diagram() {
  const c = 100;
  const pt = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [c + r * Math.cos(rad), c + r * Math.sin(rad)];
  };
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden="true">
      {/* reference rings */}
      {[92, 68, 44, 20].map((r, i) => (
        <circle
          key={r}
          className="dg-ring"
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="rgba(58,219,224,0.35)"
          strokeWidth={i === 0 ? 0.8 : 0.5}
        />
      ))}
      {/* errant ring set (rotated) */}
      <g className="dg-errant" stroke="rgba(232,64,154,0.4)" fill="none" strokeWidth="0.5">
        <circle cx={c} cy={c} r="80" strokeDasharray="3 4" />
        <circle cx={c} cy={c} r="56" strokeDasharray="3 4" />
      </g>
      {/* radial ticks */}
      {TICKS.map((deg) => {
        const major = deg % 90 === 0;
        const [x1, y1] = pt(deg, major ? 86 : 90);
        const [x2, y2] = pt(deg, major ? 74 : 86);
        return (
          <line
            key={deg}
            className="dg-tick"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={major ? "rgba(234,229,215,0.7)" : "rgba(234,229,215,0.3)"}
            strokeWidth={major ? 0.9 : 0.5}
          />
        );
      })}
      {/* cardinal labels */}
      {[
        ["N", 0],
        ["E", 90],
        ["S", 180],
        ["W", 270],
      ].map(([label, deg]) => {
        const [x, y] = pt(deg as number, 104);
        return (
          <text
            key={label as string}
            x={x}
            y={y + 3}
            textAnchor="middle"
            className="dg-tick fill-ivory/70 font-mono"
            fontSize="9"
          >
            {label as string}
          </text>
        );
      })}
      {/* TRUE NORTH vector */}
      <g className="dg-north">
        <line x1={c} y1={c} x2={c} y2={26} stroke="#3adbe0" strokeWidth="1.2" />
        <path d={`M ${c - 4} 32 L ${c} 22 L ${c + 4} 32 Z`} fill="#3adbe0" />
      </g>
      {/* contradictory vector */}
      <g className="dg-conflict">
        <line x1={c} y1={c} x2={pt(137, 82)[0]} y2={pt(137, 82)[1]} stroke="#e8409a" strokeWidth="1.1" />
        <circle
          cx={pt(137, 82)[0]}
          cy={pt(137, 82)[1]}
          r="2.4"
          fill="none"
          stroke="#e8409a"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

export default function Divergence() {
  const root = useRef<HTMLElement>(null);
  const doc = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(
          [".dg-ring", ".dg-tick", ".dg-north", ".dg-conflict", ".dg-errant", ".dv-frag", ".dv-stamp", ".dv-missing"],
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

      tl.fromTo(".dg-ring", { scale: 0.6, opacity: 0, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1 }, 0)
        .fromTo(".dg-tick", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.02 }, 0.4)
        .fromTo(".dg-north", { opacity: 0, scaleY: 0, transformOrigin: "100px 100px" }, { opacity: 1, scaleY: 1, duration: 0.5 }, 0.7)
        .fromTo(".dv-frag", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 }, 0.5)
        // the conflict
        .fromTo(".dg-conflict", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5)
        .fromTo(".dg-errant", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.5)
        .fromTo(".dv-values", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.6)
        // the document destabilizes
        .to(doc.current, { skewX: -2.5, rotate: -0.6, x: -10, duration: 1 }, 1.9)
        .to(".dg-errant", { rotate: 6, transformOrigin: "center", duration: 1 }, 1.9)
        .fromTo(".dv-stamp", { opacity: 0, scale: 1.6, rotate: -14 }, { opacity: 1, scale: 1, rotate: -8, duration: 0.4, ease: "power3.out" }, 2.1)
        .fromTo(".dv-missing", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.1 }, 2.3)
        .to(doc.current, { clipPath: "polygon(0 0, 100% 0, 100% 92%, 96% 100%, 0 100%)", duration: 0.6 }, 2.4);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="divergence" ref={root} className="relative md:h-[230vh]">
      <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-5 py-12 sm:px-8 md:sticky md:top-0 md:h-[100dvh] md:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <SectionLabel index="05" name="The Divergence" ref="ARCHIVE" tone="anomaly" />

          <div
            ref={doc}
            className="relative mt-5 border border-ivory/12 bg-panel/70 p-6 backdrop-blur-sm sm:p-9"
          >
            {/* header bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ivory/10 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-pale/70">
              <span>USRI // True North — Universal Spatial Reference Initiative</span>
              <span className="text-spectral">DOC 0xD1 · RECOVERED · PARTIAL</span>
            </div>

            <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
              {/* text column */}
              <div className="order-2 md:order-1">
                <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.4rem)] uppercase leading-[0.9] text-ivory">
                  True north promised an absolute reference.
                </h2>
                <div className="mt-5 space-y-3 font-mono text-[13px] leading-relaxed text-pale/80">
                  <p className="dv-frag">
                    A ship anywhere in known space could determine exactly where it was — and
                    where it faced — without stars, beacons, or local cartography.
                  </p>
                  <p className="dv-frag">
                    Then the Divergence Event. The system built to make every reference converge
                    began producing incompatible answers.
                  </p>
                  <p className="dv-frag text-ivory">And all of them remained correct.</p>
                  <p className="dv-frag text-anomaly">
                    The phenomenon became known as: ERRANT NORTH.
                  </p>
                  <p className="dv-frag text-pale/60">
                    Whether the experiment created it, revealed something that had always
                    existed, or gave a latent property a structure to manifest through — remains
                    unanswered.
                  </p>
                </div>

                {/* measurement conflict */}
                <div className="dv-values mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-ivory/10 pt-4 font-mono text-xs">
                  <span className="text-spectral">BEARING 000.0°</span>
                  <span className="text-pale/40">/</span>
                  <span className="text-anomaly">BEARING 137.4°</span>
                  <span className="text-pale/60">— both valid</span>
                </div>
              </div>

              {/* diagram column */}
              <div className="relative order-1 md:order-2">
                <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                  <Diagram />
                  {/* missing regions */}
                  <div className="dv-missing absolute left-[6%] top-[8%] h-[26%] w-[40%] bg-pale/10 [background-image:repeating-linear-gradient(45deg,rgba(150,162,178,0.18)_0,rgba(150,162,178,0.18)_2px,transparent_2px,transparent_6px)]" />
                  <div className="dv-missing absolute bottom-[10%] right-[4%] h-[22%] w-[46%] bg-pale/10 [background-image:repeating-linear-gradient(45deg,rgba(150,162,178,0.18)_0,rgba(150,162,178,0.18)_2px,transparent_2px,transparent_6px)]" />
                  <span className="dv-missing absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.24em] text-pale/50">
                    excluded from representation
                  </span>
                </div>
              </div>
            </div>

            {/* divergence stamp */}
            <div className="dv-stamp pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-2 border-anomaly/70 px-3 py-1 font-display text-xl uppercase tracking-widest text-anomaly/90 sm:text-2xl">
              The Divergence
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
