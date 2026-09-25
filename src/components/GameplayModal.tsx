import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { assets } from "@/lib/assets";
import { getLenis } from "@/lib/scroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import RegistrationMarks from "@/components/primitives/RegistrationMarks";

const SHOTS = [
  { src: assets.gameplayA, label: "DEAD MERIDIAN", coords: "SEC-06 / GRID 04" },
  { src: assets.gameplayB, label: "TETHER RUPTURE", coords: "SEC-03 / REF 0x1A" },
  { src: assets.environment, label: "ERRANT FIELD", coords: "SEC-0X / UNRESOLVED" },
];

const SHOT_MS = 5200;

/**
 * The cinematic "gameplay footage" viewer. Cross-fades key-art shots with a Ken
 * Burns move and an instrument HUD to read as captured footage. Robust: real art
 * on a cartographic fallback, reduced-motion aware, and scroll-locked.
 */
export default function GameplayModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [shot, setShot] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  // shot cadence + progress (driven via refs to avoid per-frame re-renders)
  useEffect(() => {
    if (!open) return;
    setShot(0);
    const started = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const total = t - started;
      const idx = Math.floor(total / SHOT_MS) % SHOTS.length;
      setShot((prev) => (prev === idx ? prev : idx));
      const p = (total % SHOT_MS) / SHOT_MS;
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;
      if (timeRef.current)
        timeRef.current.textContent = `${String(
          Math.floor((total % SHOT_MS) / 1000),
        ).padStart(4, "0")}s`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // scroll lock + escape + focus
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  if (!open) return null;
  const current = SHOTS[shot];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/94 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="ERRANT NORTH gameplay capture"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* frame */}
        <div className="relative aspect-video w-full overflow-hidden border border-ivory/15 bg-ink">
          {/* shots */}
          {SHOTS.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={`ERRANT NORTH gameplay — ${s.label}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-700",
                i === shot ? "opacity-90" : "opacity-0",
                !reduced && i === shot && "anim-kenburns",
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/40" />
          <div className="en-scanlines absolute inset-0 opacity-20" />
          <RegistrationMarks />

          {/* top HUD */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ivory/80">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-anomaly anim-blink" />
              rec · gameplay capture
            </span>
            <span className="text-spectral">{current.coords}</span>
          </div>

          {/* centre title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ivory/60">
              now observing
            </span>
            <span className="font-display text-5xl text-ivory sm:text-7xl">
              {current.label}
            </span>
          </div>

          {/* bottom bar */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-4">
            <span
              ref={timeRef}
              className="font-mono text-[10px] tracking-[0.2em] text-ivory/70"
            >
              0000s
            </span>
            <div className="h-px flex-1 bg-ivory/15">
              <div ref={barRef} className="h-full bg-spectral" style={{ width: "0%" }} />
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-pale/70">
              {shot + 1}/{SHOTS.length}
            </span>
          </div>
        </div>

        {/* caption row */}
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-pale/70">
          <span>errant north // twin-stick action roguelite</span>
          <button
            ref={closeRef}
            onClick={onClose}
            className="border border-ivory/20 px-4 py-1.5 text-ivory transition-colors hover:border-spectral hover:text-spectral"
          >
            close ✕
          </button>
        </div>
      </div>
    </div>
  );
}
