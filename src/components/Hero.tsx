import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { assets } from "@/lib/assets";
import { scrollToId } from "@/lib/scroll";
import MediaFrame from "@/components/primitives/MediaFrame";
import CartographicGrid from "@/components/primitives/CartographicGrid";
import TetherLine from "@/components/primitives/TetherLine";

const COORDS = [
  { id: "lat", text: "LAT 64.2071° N", pos: "left-5 top-20 sm:left-8 sm:top-24" },
  { id: "lon", text: "LON 008.2214° W", pos: "right-5 top-20 sm:right-8 sm:top-24" },
  { id: "vec", text: "VEC 000.00° TRUE", pos: "left-5 bottom-24 sm:left-8" },
  { id: "ref", text: "REF 0x1A · STABLE", pos: "right-5 bottom-24 sm:right-8" },
];

export default function Hero({ onWatch }: { onWatch: () => void }) {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLDivElement>(null);
  const w1 = useRef<HTMLSpanElement>(null);
  const w2 = useRef<HTMLSpanElement>(null);
  const stmt1 = useRef<HTMLParagraphElement>(null);
  const stmt2 = useRef<HTMLParagraphElement>(null);
  const ctas = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const coords = gsap.utils.toArray<HTMLElement>(".hero-coord", root.current);
      const reticles = gsap.utils.toArray<HTMLElement>(".hero-reticle", root.current);

      if (reduced) {
        gsap.set([coords, reticles, w1.current, w2.current, eyebrow.current], {
          opacity: 1,
        });
        gsap.set([stmt1.current, stmt2.current, ctas.current, hint.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // initial states
      gsap.set(bg.current, {
        clipPath: "inset(7% 7% 7% 7% round 2px)",
        scale: 1.12,
      });
      gsap.set([w1.current, w2.current], { yPercent: 110, opacity: 0 });
      gsap.set([eyebrow.current, stmt1.current, stmt2.current, ctas.current, hint.current], {
        opacity: 0,
        y: 24,
      });
      gsap.set(coords, { opacity: 0 });
      gsap.set(reticles, { scale: 0, opacity: 0, transformOrigin: "center" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(bg.current, {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        scale: 1,
        duration: 1.7,
      })
        .fromTo(
          bg.current,
          { x: -6 },
          { x: 0, duration: 0.5, ease: "elastic.out(1,0.4)" },
          0,
        )
        .to(
          coords,
          { opacity: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" },
          0.3,
        )
        .to(
          reticles,
          { scale: 1, opacity: 1, duration: 0.7, stagger: 0.1, ease: "back.out(2)" },
          0.4,
        )
        .to(eyebrow.current, { opacity: 1, y: 0, duration: 0.7 }, 0.7)
        .to(w1.current, { yPercent: 0, opacity: 1, duration: 1.1 }, 0.75)
        .to(w2.current, { yPercent: 0, opacity: 1, duration: 1.1 }, 0.9)
        .to(stmt1.current, { opacity: 1, y: 0, duration: 0.8 }, 1.25)
        .to(stmt2.current, { opacity: 1, y: 0, duration: 0.8 }, 1.4)
        .to(ctas.current, { opacity: 1, y: 0, duration: 0.7 }, 1.6)
        .to(hint.current, { opacity: 1, y: 0, duration: 0.6 }, 1.9)
        // one spatial reference becomes incorrect
        .to(".hero-coord-ref", { color: "#e8409a", duration: 0.2 }, 2.3)
        .fromTo(
          ".hero-coord-ref",
          { x: 0 },
          { x: 3, duration: 0.08, repeat: 5, yoyo: true, ease: "none" },
          2.3,
        )
        .to(".hero-anomaly-flash", { opacity: 0.16, duration: 0.12, yoyo: true, repeat: 1 }, 2.3);

      // scroll choreography — the coordinate system breaks down
      const scroll = {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(bg.current, { yPercent: 8, ease: "none", scrollTrigger: scroll });
      gsap.to(fg.current, { y: -90, opacity: 0.15, ease: "none", scrollTrigger: scroll });
      gsap.to(stmt1.current, { x: -50, ease: "none", scrollTrigger: scroll });
      gsap.to(stmt2.current, { x: 50, ease: "none", scrollTrigger: scroll });
      gsap.to(w2.current, { x: 26, ease: "none", scrollTrigger: scroll });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: false },
  );

  return (
    <section
      id="hero"
      ref={root}
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-28 pt-28 sm:pb-24"
    >
      {/* background key art */}
      <div ref={bg} className="absolute inset-0 z-0">
        <MediaFrame
          src={assets.mainMenu}
          alt="ERRANT NORTH key art — the survey ship over an unstable cartographic field"
          wash={0.5}
          priority
          marks={false}
          className="size-full"
        />
      </div>

      {/* cartographic overlays */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <CartographicGrid
          step={64}
          major={4}
          color="rgba(58,219,224,0.06)"
          majorColor="rgba(58,219,224,0.12)"
          opacity={0.7}
        />
      </div>
      {/* left scrim for legibility */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(100deg, rgba(5,8,14,0.92) 0%, rgba(5,8,14,0.6) 38%, rgba(5,8,14,0.1) 68%, rgba(5,8,14,0.35) 100%)",
        }}
        aria-hidden="true"
      />
      {/* anomaly flash */}
      <div
        className="hero-anomaly-flash pointer-events-none absolute inset-0 z-[2] bg-anomaly opacity-0 mix-blend-screen"
        aria-hidden="true"
      />
      {/* vertical scan line */}
      <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden="true">
        <div className="anim-scan absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-transparent via-spectral/10 to-transparent" />
      </div>

      {/* coordinate readouts */}
      {COORDS.map((c) => (
        <span
          key={c.id}
          className={`hero-coord hero-coord-${c.id} absolute z-[4] font-mono text-[10px] tracking-[0.2em] text-ivory/60 ${c.pos}`}
        >
          {c.text}
        </span>
      ))}
      {/* reference reticles */}
      <div className="hero-reticle pointer-events-none absolute left-[18%] top-[30%] z-[4] hidden md:block">
        <TetherLine ax={0} ay={0} bx={0} by={0} showAnchors state="live" className="size-16" />
      </div>
      <div className="hero-reticle pointer-events-none absolute right-[14%] top-[58%] z-[4] hidden md:block">
        <TetherLine ax={0} ay={0} bx={0} by={0} showAnchors state="tension" className="size-16" />
      </div>

      {/* foreground */}
      <div ref={fg} className="relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-8">
        <div
          ref={eyebrow}
          className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-ivory/70"
        >
          <span className="size-1.5 rounded-full bg-anomaly anim-blink" />
          Cartographic Expedition
          <span className="text-pale/40">//</span>
          <span className="text-anomaly">Status: Unresolved</span>
        </div>

        <h1 className="font-display uppercase leading-[0.82] text-ivory">
          <span className="block overflow-hidden">
            <span
              ref={w1}
              className="block text-[clamp(3.6rem,15vw,12.5rem)] tracking-[-0.01em]"
            >
              Errant
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              ref={w2}
              className="ml-[0.06em] block text-[clamp(3.6rem,15vw,12.5rem)] tracking-[-0.01em] text-spectral"
            >
              North
            </span>
          </span>
        </h1>

        <div className="mt-8 max-w-2xl">
          <p
            ref={stmt1}
            className="font-display text-2xl uppercase leading-tight text-ivory sm:text-4xl"
          >
            The map stopped describing the territory.
          </p>
          <p
            ref={stmt2}
            className="mt-2 font-mono text-sm uppercase tracking-[0.16em] text-spectral sm:text-base"
          >
            The territory began obeying the map.
          </p>
        </div>

        <div ref={ctas} className="mt-9 flex flex-wrap items-center gap-4">
          <button
            onClick={onWatch}
            className="group relative flex items-center gap-3 bg-ivory px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-transform duration-300 hover:scale-[1.03]"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Gameplay
          </button>
          <button
            onClick={() => scrollToId("#origin")}
            className="group flex items-center gap-3 border border-ivory/30 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-spectral hover:text-spectral"
          >
            Wishlist
            <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-9" />
          </button>
        </div>
      </div>

      {/* scroll hint */}
      <div
        ref={hint}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-pale/60">
          scroll to descend
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-ivory/15">
          <span className="anim-scan absolute inset-x-0 top-0 h-4 bg-spectral" />
        </span>
      </div>
    </section>
  );
}
