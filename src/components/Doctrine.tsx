import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionLabel from "@/components/primitives/SectionLabel";
import TetherLine from "@/components/primitives/TetherLine";
import { cn } from "@/utils/cn";

const TONE_HEX: Record<string, string> = {
  spectral: "#3adbe0",
  anomaly: "#e8409a",
  amber: "#f2a93b",
  pale: "#96a2b2",
};

const DEFS = [
  { k: "Axiom", v: "what can be true.", d: "An impossible rule, observed and made reproducible." },
  { k: "Module", v: "how the ship exploits it.", d: "Engineering designed to weaponize that truth." },
  { k: "Doctrine", v: "how you interpret it.", d: "A framework that organizes the engineering." },
];

const SCHOOLS = [
  {
    name: "Meridian Assembly",
    code: "SCH-01",
    keywords: ["precision", "protection", "territory"],
    axiom: "An alignment, once measured, can be held.",
    module: "Stabilization lattices that lock geometry in place.",
    doctrine: "Measure the anomaly — then defend the measurement.",
    tone: "spectral",
  },
  {
    name: "Cautery Foundry",
    code: "SCH-02",
    keywords: ["rupture", "heat", "overload"],
    axiom: "A contradiction can be spent before it spreads.",
    module: "Overload cores that convert instability into rupture.",
    doctrine: "Burn the unknown before it becomes uncontrollable.",
    tone: "anomaly",
  },
  {
    name: "Parallax Collective",
    code: "SCH-03",
    keywords: ["mobility", "redirection", "transformation"],
    axiom: "Distance and orientation have no privileged answer.",
    module: "Fold drives that redirect trajectory between frames.",
    doctrine: "Refuse the assumption of one where you are.",
    tone: "amber",
  },
  {
    name: "Pale Archive",
    code: "SCH-04",
    keywords: ["marks", "echoes", "persistence"],
    axiom: "What disappears leaves residual geometry behind.",
    module: "Echo recorders that persist marks across removal.",
    doctrine: "Keep what the map tried to erase.",
    tone: "pale",
  },
];

export default function Doctrine() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const school = SCHOOLS[active];
  const hex = TONE_HEX[school.tone];

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        ".doc-node",
        { scale: 0.6, opacity: 0.3, transformOrigin: "center" },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.12, ease: "back.out(2)" },
      );
    },
    { scope: root, dependencies: [active, reduced] },
  );

  return (
    <section id="doctrine" ref={root} className="relative py-28">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <SectionLabel index="07" name="Build Your Doctrine" ref="RESEARCH" tone="spectral" />
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,8vw,7rem)] uppercase leading-[0.84] text-ivory">
          What can be true?
        </h2>

        {/* definitions */}
        <div className="mt-12 grid gap-6 border-y border-ivory/10 py-8 md:grid-cols-3">
          {DEFS.map((d) => (
            <div key={d.k} className="flex flex-col gap-1.5">
              <span className="font-display text-3xl text-spectral">{d.k}</span>
              <span className="font-mono text-sm text-ivory">= {d.v}</span>
              <span className="font-mono text-xs leading-relaxed text-pale/60">{d.d}</span>
            </div>
          ))}
        </div>

        {/* research console */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* school selector */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-pale/60">
              technical schools
            </span>
            <ul className="mt-4 flex flex-col">
              {SCHOOLS.map((s, i) => (
                <li key={s.name}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={active === i}
                    className={cn(
                      "group flex w-full items-center gap-4 border-b border-ivory/10 py-4 text-left transition-colors",
                      active === i ? "text-ivory" : "text-pale/70 hover:text-ivory",
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] text-pale/50">
                      {s.code}
                    </span>
                    <span className="font-display text-2xl uppercase tracking-wide">
                      {s.name}
                    </span>
                    <span
                      className="ml-auto h-2 w-2 rotate-45 transition-all"
                      style={{ background: active === i ? TONE_HEX[s.tone] : "transparent", border: `1px solid ${TONE_HEX[s.tone]}` }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* detail panel */}
          <div className="relative border border-ivory/12 bg-panel/50 p-6 sm:p-9">
            {/* connector diagram */}
            <div className="relative mb-8 h-16">
              <TetherLine
                ax={8}
                ay={50}
                bx={50}
                by={50}
                state="live"
                color={hex}
                showAnchors={false}
                width={1.5}
              />
              <TetherLine
                ax={50}
                ay={50}
                bx={92}
                by={50}
                state="live"
                color={hex}
                showAnchors={false}
                width={1.5}
              />
              {[
                { x: 8, label: "A" },
                { x: 50, label: "M" },
                { x: 92, label: "D" },
              ].map((n) => (
                <span
                  key={n.label}
                  className="doc-node absolute top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-mono text-xs"
                  style={{ left: `${n.x}%`, borderColor: hex, color: hex }}
                >
                  {n.label}
                </span>
              ))}
            </div>

            <div key={active} className="doc-detail">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[clamp(1.8rem,4vw,3rem)] uppercase leading-[0.9]" style={{ color: hex }}>
                  {school.name}
                </h3>
                <span className="font-mono text-[10px] tracking-[0.2em] text-pale/60">{school.code}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {school.keywords.map((k) => (
                  <span
                    key={k}
                    className="border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ borderColor: `${hex}55`, color: hex }}
                  >
                    {k}
                  </span>
                ))}
              </div>

              <dl className="mt-7 space-y-5">
                {[
                  { k: "Axiom", v: school.axiom },
                  { k: "Module", v: school.module },
                  { k: "Doctrine", v: school.doctrine },
                ].map((row) => (
                  <div key={row.k} className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-pale/60">
                      {row.k}
                    </dt>
                    <dd className="text-lg leading-snug text-ivory/90">{row.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-7 border-t border-ivory/10 pt-4 font-mono text-[11px] leading-relaxed text-pale/50">
                No school is objectively correct. The cartographer remains independent and
                combines technologies derived from incompatible schools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
