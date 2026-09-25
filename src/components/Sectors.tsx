import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { assets } from "@/lib/assets";
import MediaFrame from "@/components/primitives/MediaFrame";
import CartographicGrid from "@/components/primitives/CartographicGrid";
import SectionLabel from "@/components/primitives/SectionLabel";
import { cn } from "@/utils/cn";

function SectorHead({
  code,
  name,
  rule,
  tone,
}: {
  code: string;
  name: string;
  rule: string;
  tone: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-pale/70">
        <span className="h-px w-7 bg-ivory/30" />
        {code}
      </span>
      <h3 className={cn("font-display text-[clamp(2.2rem,5.5vw,4.6rem)] uppercase leading-[0.88]", tone)}>
        {name}
      </h3>
      <p className="max-w-sm font-mono text-sm leading-relaxed text-ivory/75">{rule}</p>
    </div>
  );
}

const MISSING_STYLE =
  "[background-image:repeating-linear-gradient(45deg,rgba(150,162,178,0.16)_0,rgba(150,162,178,0.16)_2px,transparent_2px,transparent_7px)]";

function DeadMeridian() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".dm-cell", {
        scaleY: 0,
        transformOrigin: "bottom",
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: { amount: 0.7, from: "start" },
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
      gsap.from(".dm-corridor", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.9,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ref.current, start: "top 66%" },
      });
      gsap.from(".dm-copy", {
        opacity: 0,
        y: 22,
        duration: 0.8,
        scrollTrigger: { trigger: ref.current, start: "top 62%" },
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="relative grid min-h-[92vh] items-center gap-10 overflow-hidden border-y border-ivory/10 py-16 md:grid-cols-2"
    >
      <CartographicGrid step={44} major={4} opacity={0.9} />
      <div className="dm-copy relative z-10 px-6 sm:px-10">
        <SectorHead
          code="SECTOR 06.1"
          name="Dead Meridian"
          rule="A perfect cartographic grid becomes physical geometry. Corridors, quadrants and alignment references organize the battlefield."
          tone="text-spectral"
        />
      </div>

      <div className="relative z-10 mx-auto aspect-square w-full max-w-md px-6 sm:px-10">
        <div className="relative size-full border border-spectral/30">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className="dm-cell border border-spectral/10"
                style={{
                  background:
                    i === 5 || i === 6 || i === 9 || i === 10
                      ? "rgba(58,219,224,0.06)"
                      : "transparent",
                }}
              />
            ))}
          </div>
          <div className="dm-corridor absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 bg-spectral/70" />
          <div className="absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2">
            <MediaFrame
              src={assets.concept1}
              alt="ERRANT NORTH — Dead Meridian sector environment concept"
              wash={0.45}
              className="size-full"
              coords="GRID 04"
            />
          </div>
          <span className="absolute -left-2 top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-[0.2em] text-spectral/70">
            000
          </span>
          <span className="absolute -right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-[0.2em] text-spectral/70">
            100
          </span>
        </div>
      </div>
    </div>
  );
}

function FoldedOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: { trigger: ref.current, start: "top 65%", end: "bottom 40%", scrub: 1 },
      });
      tl.from(".fo-left", { rotateX: 55, y: -40, transformPerspective: 900 }, 0)
        .from(".fo-right", { rotateX: -55, y: 40, transformPerspective: 900 }, 0)
        .from(".fo-seam", { scaleX: 0, duration: 0.4 }, 0.5)
        .from(".fo-copy", { opacity: 0, y: 20 }, 0.2);
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="relative min-h-[100vh] overflow-hidden border-b border-ivory/10 py-16 [perspective:1200px]"
      style={{ background: "radial-gradient(120% 80% at 50% 50%, rgba(58,219,224,0.05), transparent 60%)" }}
    >
      <div className="relative z-10 px-6 sm:px-10">
        <SectorHead
          code="SECTOR 06.2"
          name="Folded Orbit"
          rule="Edges and spatially incompatible positions become adjacent. Distance no longer determines connection."
          tone="text-anomaly"
        />
      </div>

      <div className="relative z-10 mx-auto mt-12 flex max-w-5xl flex-col items-center gap-0 px-6 sm:px-10 [transform-style:preserve-3d]">
        <div className="fo-left w-full">
          <MediaFrame
            src={assets.concept3}
            alt="ERRANT NORTH — Folded Orbit distant region A"
            wash={0.5}
            clip="polygon(0 0, 100% 0, 100% 82%, 0 100%)"
            className="aspect-video w-full"
            coords="FRAME A · DISTANT"
          />
        </div>
        <div className="fo-seam relative z-10 -my-4 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-anomaly/50" />
          <span className="border border-anomaly/60 bg-ink px-3 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-anomaly">
            now adjacent
          </span>
          <span className="h-px flex-1 bg-anomaly/50" />
        </div>
        <div className="fo-right w-full">
          <MediaFrame
            src={assets.concept4}
            alt="ERRANT NORTH — Folded Orbit distant region B, now adjacent"
            wash={0.5}
            clip="polygon(0 18%, 100% 0, 100% 100%, 0 100%)"
            className="aspect-video w-full"
            coords="FRAME B · FOLDED"
          />
        </div>
      </div>
    </div>
  );
}

function EchoField() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: 1 },
      });
      tl.fromTo(".echo-track", { xPercent: 8 }, { xPercent: -8 }, 0)
        .fromTo(".echo-ghost-1", { xPercent: 8 }, { xPercent: -8 }, 0.06)
        .fromTo(".echo-ghost-2", { xPercent: 8 }, { xPercent: -8 }, 0.12)
        .fromTo(".echo-ghost-3", { xPercent: 8 }, { xPercent: -8 }, 0.18);
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="relative min-h-[100vh] overflow-hidden border-b border-ivory/10 py-16"
    >
      <div className="relative z-10 flex flex-col gap-8 px-6 sm:px-10 md:flex-row md:items-end md:justify-between">
        <SectorHead
          code="SECTOR 06.3"
          name="Echo Field"
          rule="Movement and trajectories are recorded and physically replayed later. What you did returns."
          tone="text-amber"
        />
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-amber/80">
          <span className="size-1.5 rounded-full bg-amber anim-blink" />
          recording trajectory
        </span>
      </div>

      <div className="relative mt-12 h-[46vh] overflow-hidden">
        {[
          { g: 3, o: 0.1 },
          { g: 2, o: 0.18 },
          { g: 1, o: 0.3 },
        ].map(({ g, o }) => (
          <div
            key={g}
            className={`echo-ghost-${g} pointer-events-none absolute inset-y-0 left-0 w-[70vw]`}
            style={{ opacity: o, filter: `blur(${g * 1.5}px)` }}
          >
            <MediaFrame
              src={assets.concept5}
              alt=""
              wash={0.7}
              className="size-full"
              marks={false}
            />
          </div>
        ))}
        <div className="echo-track absolute inset-y-0 left-0 w-[62vw]">
          <MediaFrame
            src={assets.concept5}
            alt="ERRANT NORTH — Echo Field recorded trajectory replaying"
            wash={0.45}
            clip="polygon(0 0, 100% 0, 96% 100%, 0 100%)"
            className="size-full"
            coords="ECHO · T-3"
          />
        </div>
      </div>
    </div>
  );
}

function MissingMargin() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 55%", scrub: 1 },
      });
      tl.to(".mm-erase-a", { clipPath: "inset(0 0 0 62%)", duration: 1 }, 0)
        .to(".mm-erase-b", { clipPath: "inset(58% 0 0 0)", duration: 1 }, 0.2)
        .fromTo(".mm-absent", { opacity: 0 }, { opacity: 1, stagger: 0.15, duration: 0.5 }, 0.4)
        .fromTo(".mm-copy", { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.2);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative min-h-[100vh] overflow-hidden py-16">
      <div className="relative z-10 px-6 sm:px-10">
        <SectorHead
          code="SECTOR 06.4"
          name="Missing Margin"
          rule="Regions excluded from representation begin to cease existing as stable local space. What is left off the map stops being reliable."
          tone="text-pale"
        />
      </div>

      <div className="relative mx-auto mt-12 grid max-w-5xl gap-6 px-6 sm:px-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="mm-erase-a absolute inset-0">
            <MediaFrame
              src={assets.concept6}
              alt="ERRANT NORTH — Missing Margin, partially erased region"
              wash={0.5}
              className="size-full"
              marks={false}
            />
          </div>
          <div className={cn("mm-absent pointer-events-none absolute right-0 top-0 h-1/2 w-2/5 bg-pale/10", MISSING_STYLE)} />
          <span className="mm-absent pointer-events-none absolute right-3 top-3 font-mono text-[8px] uppercase tracking-[0.24em] text-pale/60">
            not represented
          </span>
        </div>
        <div className="relative">
          <div className="mm-erase-b">
            <MediaFrame
              src={assets.concept7}
              alt="ERRANT NORTH — Missing Margin secondary plate"
              wash={0.55}
              clip="polygon(0 0, 100% 8%, 100% 100%, 0 100%)"
              className="aspect-[3/4] w-full"
              marks={false}
            />
          </div>
          <p className="mm-copy mt-6 font-mono text-sm leading-relaxed text-pale/70">
            A region left off the map does not become empty. It becomes uncertain.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Sectors() {
  return (
    <section id="sectors" className="relative">
      <div className="mx-auto max-w-[1600px] px-6 pt-24 sm:px-10">
        <SectionLabel index="06" name="Explore Errant North" ref="SECTORS" tone="spectral" />
        <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl font-display text-[clamp(2.6rem,8vw,7rem)] uppercase leading-[0.84] text-ivory">
            Map what refuses to stay mapped.
          </h2>
          <p className="max-w-sm font-mono text-sm leading-relaxed text-pale/70">
            Four regions. Four incompatible spatial laws. Same cartographic grammar.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <DeadMeridian />
        <FoldedOrbit />
        <EchoField />
        <MissingMargin />
      </div>
    </section>
  );
}
