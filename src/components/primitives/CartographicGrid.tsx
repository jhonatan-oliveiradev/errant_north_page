import { useId } from "react";
import { cn } from "@/utils/cn";

type CartographicGridProps = {
  /** grid cell size in px */
  step?: number;
  /** a heavier line every N cells */
  major?: number;
  color?: string;
  majorColor?: string;
  opacity?: number;
  /** faint registration cross at each major intersection */
  crosses?: boolean;
  className?: string;
};

/**
 * A cheap, pattern-based coordinate grid. Renders as a single filled rect so it
 * composites well and never causes layout thrash.
 */
export default function CartographicGrid({
  step = 48,
  major = 4,
  color = "rgba(234,229,215,0.06)",
  majorColor = "rgba(234,229,215,0.12)",
  opacity = 1,
  crosses = true,
  className,
}: CartographicGridProps) {
  const uid = useId().replace(/:/g, "");
  const minorId = `grid-minor-${uid}`;
  const majorId = `grid-major-${uid}`;
  const M = step * major;

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={minorId}
          width={step}
          height={step}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${step} 0 L 0 0 0 ${step}`}
            fill="none"
            stroke={color}
            strokeWidth="0.6"
          />
        </pattern>
        <pattern
          id={majorId}
          width={M}
          height={M}
          patternUnits="userSpaceOnUse"
        >
          <rect width={M} height={M} fill={`url(#${minorId})`} />
          <path
            d={`M ${M} 0 L 0 0 0 ${M}`}
            fill="none"
            stroke={majorColor}
            strokeWidth="0.9"
          />
          {crosses && (
            <path
              d={`M ${M / 2} ${M / 2 - 4} L ${M / 2} ${M / 2 + 4} M ${
                M / 2 - 4
              } ${M / 2} L ${M / 2 + 4} ${M / 2}`}
              stroke={majorColor}
              strokeWidth="0.7"
              opacity="0.7"
            />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${majorId})`} opacity={opacity} />
    </svg>
  );
}
