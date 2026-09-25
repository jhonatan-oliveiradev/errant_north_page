import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { assets } from "@/lib/assets";
import MediaFrame from "@/components/primitives/MediaFrame";
import SectionLabel from "@/components/primitives/SectionLabel";

type Verb = {
  verb: string;
  caption: string;
  src: string;
  alt: string;
  clip: string;
  tone: string;
};

const VERBS: Verb[] = [
  {
    verb: "Move.",
    caption: "Independent movement. The ship answers to you, not to the grid.",
    src: assets.gameplayB,
    alt: "ERRANT NORTH gameplay — independent ship movement through a sector",
    clip: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
    tone: "text-ivory",
  },
  {
    verb: "Aim.",
    caption: "Directional combat. Aim independently while you keep piloting.",
    src: assets.gameplayA,
    alt: "ERRANT NORTH gameplay — directional aiming during an encounter",
    clip: "polygon(0 0, 92% 0, 100% 100%, 0 100%)",
    tone: "text-spectral",
  },
  {
    verb: "Fire.",
    caption: "Continuous primary fire. Pressure builds Rift Charge.",
    src: assets.gameplayA,
    alt: "ERRANT NORTH gameplay — primary fire generating Rift Charge",
    clip: "polygon(0 6%, 100% 0, 100% 100%, 0 94%)",
    tone: "text-amber",
  },
  {
    verb: "Impulse.",
    caption: "Dash to reposition. Distance is a decision, not a constant.",
    src: assets.gameplayB,
    alt: "ERRANT NORTH gameplay — Impulse dash repositioning",
    clip: "polygon(0 0, 100% 0, 100% 100%, 6% 92%)",
    tone: "text-ivory",
  },
  {
    verb: "Anchor.",
    caption: "Place an anchor and keep flying while the line extends.",
    src: assets.gameplayA,
    alt: "ERRANT NORTH gameplay — placing a Tether anchor mid-combat",
    clip: "polygon(0 0, 94% 4%, 100% 100%, 0 100%)",
    tone: "text-spectral",
  },
  {
    verb: "Rupture.",
    caption: "Resolve the geometry. Marked targets break first.",
    src: assets.gameplayB,
    alt: "ERRANT NORTH gameplay — a Tether Rupture resolving across enemies",
    clip: "polygon(0 0, 100% 6%, 100% 100%, 0 100%)",
    tone: "text-anomaly",
  },
];

export default function Battlefield() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.utils.toArray<HTMLElement>(".bf-panel", root.current).forEach((p) => {
          gsap.from(p, {
            opacity: 0,
            y: 36,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: p, start: "top 88%" },
          });
        });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const getPan = () => (track.current?.scrollWidth ?? 0) - window.innerWidth;
        gsap.to(track.current, {
          x: () => -getPan(),
          ease: "none",
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: () => `+=${getPan()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.to(bar.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: () => `+=${getPan()}`,
            scrub: true,
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".bf-panel", root.current).forEach((p) => {
          const word = p.querySelector(".bf-verb");
          const media = p.querySelector(".bf-media");
          gsap.from(word, {
            xPercent: -18,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: p, start: "top 80%" },
          });
          gsap.fromTo(
            media,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: p, start: "top 82%" },
            },
          );
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="battlefield"
      ref={root}
      className="relative bg-gradient-to-b from-transparent via-ink/40 to-transparent"
    >
      <div
        ref={stage}
        className="flex min-h-[100dvh] flex-col justify-center overflow-hidden py-24"
      >
        {/* header */}
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8">
          <SectionLabel index="04" name="Redraw the Battlefield" ref="LOOP-01" tone="amber" />
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl font-display text-[clamp(2.4rem,7vw,6rem)] uppercase leading-[0.86] text-ivory">
              Redraw the battlefield.
            </h2>
            <p className="max-w-xs font-mono text-sm leading-relaxed text-pale/70">
              Fast. Fluid. An action roguelite where positioning is the weapon — not an
              atmospheric detour.
            </p>
          </div>
        </div>

        {/* reel */}
        <div className="relative mt-10 flex-1 overflow-hidden">
          <div
            ref={track}
            className={`no-scrollbar flex h-full gap-5 px-5 sm:gap-8 sm:px-8 ${
              reduced ? "flex-col" : "flex-col md:flex-row"
            }`}
          >
            {VERBS.map((v, i) => (
              <article
                key={v.verb}
                className={`bf-panel relative h-[68vh] w-full shrink-0 md:h-full md:w-[46vw] lg:w-[38vw] ${
                  reduced ? "" : ""
                }`}
              >
                <div className="bf-media relative h-full w-full">
                  <MediaFrame
                    src={v.src}
                    alt={v.alt}
                    clip={v.clip}
                    wash={0.5}
                    className="size-full"
                    label={`verb ${String(i + 1).padStart(2, "0")}`}
                    coords={`0x${(i + 1).toString(16).toUpperCase()}A`}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <h3
                    className={`bf-verb font-display text-[clamp(3rem,7vw,6.5rem)] uppercase leading-[0.82] ${v.tone}`}
                  >
                    {v.verb}
                  </h3>
                  <p className="mt-2 max-w-[22rem] font-mono text-xs leading-relaxed text-ivory/75">
                    {v.caption}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* reel progress */}
        <div className="mx-auto mt-6 w-full max-w-[1600px] px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-pale/60">
              combat loop
            </span>
            <div className="h-px flex-1 overflow-hidden bg-ivory/10">
              <div
                ref={bar}
                className="h-full w-full origin-left bg-spectral"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
