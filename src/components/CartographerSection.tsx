import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { assets } from "@/lib/assets";
import MediaFrame from "@/components/primitives/MediaFrame";
import SectionLabel from "@/components/primitives/SectionLabel";
import { cn } from "@/utils/cn";

type Line = { text: string; kind?: "dim" | "normal" | "climax" | "anomaly" };

const LINES: Line[] = [
  { text: "Two measurements.", kind: "normal" },
  { text: "Both impossible.", kind: "normal" },
  { text: "Both correct.", kind: "climax" },
  { text: "The authority asked her to discard one.", kind: "normal" },
  { text: "She refused.", kind: "climax" },
  { text: "She received a transmission in her own voice.", kind: "normal" },
  { text: "She came to map Errant North.", kind: "climax" },
  { text: "Errant North had already mapped her.", kind: "anomaly" },
  { text: "She is not the chosen one.", kind: "normal" },
  { text: "She is the unresolved one.", kind: "climax" },
];

const SIZE: Record<string, string> = {
  normal: "text-[clamp(1.6rem,3.6vw,3rem)] text-pale",
  climax: "text-[clamp(2rem,5vw,4.2rem)] text-ivory",
  anomaly: "text-[clamp(2rem,5vw,4.2rem)] text-anomaly",
};

export default function CartographerSection() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>(".ct-line", root.current);
      if (reduced) {
        gsap.set(lines, { opacity: 1, color: "#eae5d7" });
        return;
      }
      gsap.set(lines, { opacity: 0.22, color: "#96a2b2" });
      lines.forEach((line) => {
        ScrollTrigger.create({
          trigger: line,
          start: "top 64%",
          end: "bottom 40%",
          onEnter: () => gsap.to(line, { opacity: 1, color: "#eae5d7", duration: 0.4 }),
          onEnterBack: () => gsap.to(line, { opacity: 1, color: "#eae5d7", duration: 0.4 }),
          onLeave: () => gsap.to(line, { opacity: 0.22, color: "#96a2b2", duration: 0.4 }),
          onLeaveBack: () => gsap.to(line, { opacity: 0.22, color: "#96a2b2", duration: 0.4 }),
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="cartographer" ref={root} className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <SectionLabel index="10" name="The Cartographer" ref="SUBJECT-00" tone="anomaly" />

        <div className="mt-6 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* portrait */}
          <div className="relative">
            <div className="lg:sticky lg:top-24">
              <div className="relative mx-auto max-w-sm">
                <MediaFrame
                  src={assets.protagonist}
                  alt="The ERRANT NORTH cartographer — protagonist portrait"
                  wash={0.35}
                  reticle
                  clip="polygon(0 0, 100% 0, 100% 92%, 4% 100%)"
                  className="aspect-[3/4] w-full"
                />
                <span className="pointer-events-none absolute -left-3 top-6 -rotate-90 origin-left font-mono text-[9px] uppercase tracking-[0.3em] text-pale/60">
                  subject // the cartographer
                </span>
                <span className="pointer-events-none absolute right-3 top-3 border border-anomaly/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-anomaly">
                  license revoked
                </span>
                <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-spectral">
                  status // unresolved
                </span>
              </div>
            </div>
          </div>

          {/* statements */}
          <div className="flex flex-col gap-[16vh] pb-[22vh] pt-4 sm:gap-[20vh]">
            <h2 className="max-w-xl font-display text-[clamp(2.2rem,5.5vw,4.6rem)] uppercase leading-[0.88] text-ivory">
              An independent cartographer enters a region where space stopped agreeing with
              itself.
            </h2>
            {LINES.map((l, i) => (
              <p
                key={i}
                className={cn(
                  "ct-line max-w-2xl font-display uppercase leading-[0.94]",
                  SIZE[l.kind ?? "normal"],
                )}
              >
                {l.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
