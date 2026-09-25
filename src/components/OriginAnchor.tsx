import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionLabel from "@/components/primitives/SectionLabel";
import CartographicGrid from "@/components/primitives/CartographicGrid";
import { cn } from "@/utils/cn";

function OriginReticle() {
  return (
    <svg viewBox="0 0 120 120" className="size-full" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(58,219,224,0.25)" strokeWidth="0.6" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="rgba(58,219,224,0.4)" strokeWidth="0.6" strokeDasharray="3 4" />
      <circle className="oa-ping" cx="60" cy="60" r="20" fill="none" stroke="#3adbe0" strokeWidth="0.8" style={{ transformOrigin: "60px 60px" }} />
      <rect x="54" y="54" width="12" height="12" transform="rotate(45 60 60)" fill="#3adbe0" />
      <path
        d="M60 26 L60 40 M60 80 L60 94 M26 60 L40 60 M80 60 L94 60"
        stroke="#3adbe0"
        strokeWidth="0.8"
      />
    </svg>
  );
}

export default function OriginAnchor({ onWatch }: { onWatch: () => void }) {
  const root = useRef<HTMLElement>(null);
  const [note, setNote] = useState(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      tl.from(".oa-grid", { opacity: 0, duration: 1 })
        .from(".oa-reticle", { scale: 0.6, opacity: 0, duration: 1, ease: "back.out(1.6)" }, 0.1)
        .from(".oa-title", { opacity: 0, y: 40, duration: 0.9 }, 0.3)
        .from(".oa-line", { opacity: 0, y: 20, duration: 0.7, stagger: 0.12 }, 0.5)
        .fromTo(
          ".oa-ping",
          { scale: 0.6, opacity: 0.6 },
          { scale: 2.2, opacity: 0, duration: 1.6, repeat: -1, ease: "power2.out" },
          0.6,
        );
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="origin"
      ref={root}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center sm:px-10"
    >
      {/* stability veil — recedes the global errant grid so alignment reads as restored */}
      <div className="pointer-events-none absolute inset-0 bg-graphite/80" aria-hidden="true" />

      {/* stable, aligned grid */}
      <div className="oa-grid pointer-events-none absolute inset-0">
        <CartographicGrid
          step={48}
          major={4}
          color="rgba(58,219,224,0.07)"
          majorColor="rgba(58,219,224,0.14)"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 45%, rgba(58,219,224,0.06), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center">
        <SectionLabel index="11" name="Origin Anchor" ref="STABLE" tone="spectral" />

        {/* locked anchor */}
        <div className="oa-reticle relative mt-10 size-28 sm:size-36">
          <OriginReticle />
        </div>

        <p className="oa-line mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-spectral">
          grid realigned · noise reduced · reference reconciled
        </p>

        <h2 className="oa-title mt-6 font-display text-[clamp(3.4rem,15vw,11rem)] uppercase leading-[0.82] text-ivory">
          Errant North
        </h2>

        <p className="oa-line mt-6 max-w-xl text-lg leading-relaxed text-ivory/80 sm:text-xl">
          A twin-stick action roguelite about weaponizing impossible space.
        </p>
        <p className="oa-line mt-2 max-w-xl font-mono text-sm leading-relaxed text-pale/60">
          Enter a living anomaly. Anchor impossible points. Redraw space to survive.
        </p>

        {/* CTAs */}
        <div className="oa-line mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setNote((v) => !v)}
              aria-expanded={note}
              className="group relative flex items-center gap-3 bg-spectral px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
              </svg>
              Wishlist on Steam
            </button>
            <button
              onClick={onWatch}
              className="group flex items-center gap-3 border border-ivory/30 px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-spectral hover:text-spectral"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Gameplay
            </button>
          </div>

          {/* honest pending state — no fabricated Steam URL */}
          <div
            className={cn(
              "overflow-hidden font-mono text-[11px] leading-relaxed text-amber/80 transition-all duration-500",
              note ? "mt-3 max-h-24 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <span className="border border-amber/40 bg-amber/5 px-4 py-2 inline-block">
              STEAM DESTINATION — PENDING. This anchor is unresolved. No store page is published
              yet.
            </span>
          </div>
        </div>

        <p className="oa-line mt-12 font-mono text-[10px] uppercase tracking-[0.24em] text-pale/50">
          You have returned from the expedition. What you stabilize, you keep.
        </p>
      </div>
    </section>
  );
}
