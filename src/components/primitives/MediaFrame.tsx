import { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import CartographicGrid from "./CartographicGrid";
import RegistrationMarks from "./RegistrationMarks";

type MediaFrameProps = {
  src: string;
  alt: string;
  className?: string;
  /** CSS clip-path applied to the whole frame */
  clip?: string;
  /** strength of the graphite gradient wash over the media (0..1) */
  wash?: number;
  label?: string;
  coords?: string;
  /** eager-load above-the-fold media */
  priority?: boolean;
  marks?: boolean;
  reticle?: boolean;
  children?: ReactNode;
  imgClassName?: string;
};

/**
 * A cinematic media frame: official art sits on a cartographic fallback so a
 * slow/failed asset still reads as an intentional instrument panel. Supports
 * geometric clip-path masks, corner labels and registration marks.
 */
export default function MediaFrame({
  src,
  alt,
  className,
  clip,
  wash = 0.55,
  label,
  coords,
  priority = false,
  marks = true,
  reticle = false,
  children,
  imgClassName,
}: MediaFrameProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const failed = status === "error";

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-gradient-to-br from-panel via-graphite to-ink",
        className,
      )}
      style={clip ? { clipPath: clip } : undefined}
    >
      {/* cartographic fallback layer */}
      <div className="absolute inset-0" aria-hidden="true">
        <CartographicGrid step={40} major={4} opacity={failed ? 0.9 : 0.5} />
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-anomaly/80">
              reference lost
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-pale/50">
              {coords ?? "awaiting anchor"}
            </span>
          </div>
        )}
      </div>

      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            status === "loaded" ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}

      {/* graphite wash */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/90 via-graphite/40 to-ink/30"
        style={{ opacity: wash }}
        aria-hidden="true"
      />

      {marks && <RegistrationMarks className="opacity-70" reticle={reticle} />}

      {(label || coords) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-3 font-mono text-[9px] uppercase tracking-[0.22em] text-ivory/70">
          {label && <span>{label}</span>}
          {coords && <span className="text-spectral/80">{coords}</span>}
        </div>
      )}

      {children}
    </div>
  );
}
