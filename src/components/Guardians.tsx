import { useRef, type ComponentType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { assets } from "@/lib/assets";
import SectionLabel from "@/components/primitives/SectionLabel";
import { cn } from "@/utils/cn";

function FigureCompass() {
  const c = 100;
  const pt = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [c + r * Math.cos(rad), c + r * Math.sin(rad)];
  };
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden="true">
      {[92, 70, 46, 22].map((r) => (
        <circle key={r} cx={c} cy={c} r={r} fill="none" stroke="rgba(234,229,215,0.14)" strokeWidth="0.6" />
      ))}
      {Array.from({ length: 24 }, (_, i) => i * 15).map((deg) => {
        const [x1, y1] = pt(deg, 92);
        const [x2, y2] = pt(deg, deg % 90 === 0 ? 80 : 87);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(234,229,215,0.25)" strokeWidth="0.5" />;
      })}
      <g>
        <line x1={c} y1={c} x2={c} y2={22} stroke="#3adbe0" strokeWidth="1.4" />
        <path d={`M ${c - 5} 30 L ${c} 16 L ${c + 5} 30 Z`} fill="#3adbe0" />
      </g>
      <g>
        <line x1={c} y1={c} x2={pt(128, 84)[0]} y2={pt(128, 84)[1]} stroke="#e8409a" strokeWidth="1.3" />
        <circle cx={pt(128, 84)[0]} cy={pt(128, 84)[1]} r="3" fill="none" stroke="#e8409a" strokeWidth="0.9" />
      </g>
      <circle cx={c} cy={c} r="3" fill="#eae5d7" />
      <text x={c} y={112} textAnchor="middle" className="fill-pale/60 font-mono" fontSize="7">
        NORTH: UNRESOLVED
      </text>
    </svg>
  );
}

function FigureNullSurveyor() {
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden="true">
      <rect x="20" y="30" width="160" height="140" fill="none" stroke="rgba(234,229,215,0.3)" strokeWidth="0.8" strokeDasharray="4 3" />
      <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(242,169,59,0.6)" strokeWidth="0.8" />
      <path
        d="M70 90 C70 60, 130 55, 138 92 C146 130, 96 150, 78 120 C64 98, 70 96, 70 90 Z"
        fill="rgba(58,219,224,0.12)"
        stroke="#3adbe0"
        strokeWidth="0.9"
      />
      <clipPath id="ns-left">
        <rect x="0" y="0" width="100" height="200" />
      </clipPath>
      <g clipPath="url(#ns-left)">
        <path
          d="M70 90 C70 60, 130 55, 138 92 C146 130, 96 150, 78 120 C64 98, 70 96, 70 90 Z"
          fill="rgba(58,219,224,0.05)"
          stroke="none"
        />
      </g>
      <text x="46" y="46" className="fill-spectral font-mono" fontSize="8">
        VALID
      </text>
      <text x="128" y="46" className="fill-pale/60 font-mono" fontSize="8">
        EXCLUDED
      </text>
      <text x="100" y="186" textAnchor="middle" className="fill-pale/50 font-mono" fontSize="7">
        WHO DECIDES THE MAP?
      </text>
    </svg>
  );
}

function FigureParallax() {
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden="true">
      <g stroke="rgba(58,219,224,0.35)" strokeWidth="0.5">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={20 + i * 20} y1="20" x2={20 + i * 20} y2="180" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="20" y1={20 + i * 20} x2="180" y2={20 + i * 20} />
        ))}
      </g>
      <g transform="rotate(18 100 100)" stroke="rgba(232,64,154,0.4)" strokeWidth="0.5" strokeDasharray="3 3">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v2${i}`} x1={20 + i * 20} y1="20" x2={20 + i * 20} y2="180" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h2${i}`} x1="20" y1={20 + i * 20} x2="180" y2={20 + i * 20} />
        ))}
      </g>
      <path d="M40 150 Q100 90 160 60" fill="none" stroke="#f2a93b" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="40" cy="150" r="3" fill="#3adbe0" />
      <circle cx="160" cy="60" r="3" fill="#e8409a" />
      <text x="100" y="192" textAnchor="middle" className="fill-pale/50 font-mono" fontSize="7">
        FRAME α → FRAME β
      </text>
    </svg>
  );
}

function FigureEchoPress() {
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${30 + i * 6} ${150 - i * 6} Q100 ${70 - i * 8} ${172 - i * 4} ${52 - i * 6}`}
          fill="none"
          stroke={i === 0 ? "#f2a93b" : "rgba(242,169,59,0.28)"}
          strokeWidth={i === 0 ? 1.2 : 0.7}
          strokeDasharray={i === 0 ? undefined : "2 3"}
        />
      ))}
      <circle cx={30} cy="150" r="3" fill="#f2a93b" />
      <circle cx="172" cy="52" r="3" fill="none" stroke="#f2a93b" strokeWidth="0.9" />
      {[70, 100, 130].map((x, i) => (
        <rect key={x} x={x} y={96 - i * 6} width="4" height="4" transform={`rotate(45 ${x + 2} ${98 - i * 6})`} fill="rgba(242,169,59,0.5)" />
      ))}
      <text x="100" y="186" textAnchor="middle" className="fill-pale/50 font-mono" fontSize="7">
        RECORD · REPLAY · PERSIST
      </text>
    </svg>
  );
}

type Guardian = {
  code: string;
  name: string;
  role: string;
  assoc: string;
  figure: ComponentType;
  bg: string;
  alt: string;
  tone: string;
};

const GUARDIANS: Guardian[] = [
  {
    code: "G-01",
    name: "The Compass Without North",
    role: "spatial correction function · orientation",
    assoc: "Associated with incompatible orientation and vector reconciliation.",
    figure: FigureCompass,
    bg: assets.concept2,
    alt: "ERRANT NORTH — atmospheric environment behind The Compass Without North",
    tone: "text-spectral",
  },
  {
    code: "G-02",
    name: "The Null Surveyor",
    role: "spatial correction function · borders",
    assoc: "Associated with borders, exclusion, and what decides whether a region belongs to a map.",
    figure: FigureNullSurveyor,
    bg: assets.concept8,
    alt: "ERRANT NORTH — atmospheric environment behind The Null Surveyor",
    tone: "text-amber",
  },
  {
    code: "G-03",
    name: "The Parallax Engine",
    role: "spatial correction function · frames",
    assoc: "Associated with transformations between incompatible frames of reference.",
    figure: FigureParallax,
    bg: assets.concept4,
    alt: "ERRANT NORTH — atmospheric environment behind The Parallax Engine",
    tone: "text-anomaly",
  },
  {
    code: "G-04",
    name: "The Echo Press",
    role: "spatial correction function · trajectories",
    assoc: "Associated with recording and reproducing trajectories.",
    figure: FigureEchoPress,
    bg: assets.concept6,
    alt: "ERRANT NORTH — atmospheric environment behind The Echo Press",
    tone: "text-amber",
  },
];

export default function Guardians() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>(".gd-block", root.current).forEach((block) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: block, start: "top 72%" },
        });
        tl.from(block.querySelector(".gd-figure"), { opacity: 0, scale: 0.9, duration: 0.9, ease: "power3.out" })
          .from(block.querySelector(".gd-index"), { opacity: 0, x: -30, duration: 0.7 }, 0.1)
          .from(block.querySelector(".gd-name"), { opacity: 0, y: 40, duration: 0.8 }, 0.15)
          .from(block.querySelectorAll(".gd-line"), { opacity: 0, y: 18, duration: 0.6, stagger: 0.1 }, 0.35);
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="guardians" ref={root} className="relative py-28">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <SectionLabel index="09" name="Guardians" ref="CORRECTION" tone="amber" />
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl font-display text-[clamp(2.6rem,7.5vw,6.5rem)] uppercase leading-[0.84] text-ivory">
            Systems built to correct reality.
          </h2>
          <p className="max-w-sm font-mono text-sm leading-relaxed text-pale/70">
            Not oversized monsters. Reinterpretations of former spatial correction functions.
            Defeating one proves an impossible exception can remain operationally valid.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-28">
          {GUARDIANS.map((g, i) => {
            const Figure = g.figure;
            const flip = i % 2 === 1;
            return (
              <article
                key={g.code}
                className="gd-block relative grid items-center gap-10 md:grid-cols-2"
              >
                <div
                  className={cn(
                    "gd-figure relative order-1 aspect-square w-full max-w-xl",
                    flip ? "md:order-2 md:justify-self-end" : "md:order-1",
                  )}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={g.bg}
                      alt={g.alt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  </div>
                  <div className="relative p-6 sm:p-10">
                    <Figure />
                  </div>
                  <span className="pointer-events-none absolute inset-0 border border-ivory/10" />
                </div>

                <div className={cn("order-2", flip ? "md:order-1" : "md:order-2")}>
                  <span className="gd-index font-mono text-[11px] uppercase tracking-[0.28em] text-pale/60">
                    {g.code} // {g.role}
                  </span>
                  <h3 className={cn("gd-name mt-4 font-display text-[clamp(2.2rem,5vw,4.4rem)] uppercase leading-[0.86]", g.tone)}>
                    {g.name}
                  </h3>
                  <p className="gd-line mt-5 max-w-md text-lg leading-relaxed text-ivory/80">
                    {g.assoc}
                  </p>
                  <p className="gd-line mt-4 max-w-md font-mono text-xs leading-relaxed text-pale/55">
                    Final canonical form not established. Representation intentionally partial.
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
