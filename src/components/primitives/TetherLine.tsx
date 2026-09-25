import { cn } from "@/utils/cn";

export type TetherState = "idle" | "live" | "tension" | "rupture";

const STATE_COLOR: Record<TetherState, string> = {
  idle: "rgba(150,162,178,0.55)",
  live: "#3adbe0",
  tension: "#f2a93b",
  rupture: "#e8409a",
};

type AnchorProps = {
  x: number;
  y: number;
  color?: string;
  r?: number;
  className?: string;
  label?: string;
};

/** A single spatial anchor glyph: diamond + crosshair + ring. */
export function Anchor({
  x,
  y,
  color = "#3adbe0",
  r = 1.6,
  className,
}: AnchorProps) {
  return (
    <g className={cn("tether-anchor", className)} transform={`translate(${x} ${y})`}>
      <circle r={r * 2.1} fill="none" stroke={color} strokeWidth="0.3" opacity="0.5" />
      <rect
        x={-r}
        y={-r}
        width={r * 2}
        height={r * 2}
        fill={color}
        opacity="0.9"
        transform="rotate(45)"
      />
      <path
        d={`M0 ${-r * 2.6} L0 ${-r * 1.2} M0 ${r * 1.2} L0 ${r * 2.6} M${
          -r * 2.6
        } 0 L${-r * 1.2} 0 M${r * 1.2} 0 L${r * 2.6} 0`}
        stroke={color}
        strokeWidth="0.35"
      />
    </g>
  );
}

type TetherLineProps = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  state?: TetherState;
  color?: string;
  /** perpendicular bow of the line (0 = straight) */
  bow?: number;
  dashed?: boolean;
  showAnchors?: boolean;
  width?: number;
  className?: string;
  /** draw the line using normalised path length (GSAP friendly) */
  draw?: boolean;
};

/**
 * The recurring Tether motif: Anchor A → connection line → Anchor B, with a
 * tension state. Works in a normalised 0–100 viewBox (preserveAspectRatio none)
 * so it can stretch across any container.
 */
export default function TetherLine({
  ax,
  ay,
  bx,
  by,
  state = "live",
  color,
  bow = 0,
  dashed = false,
  showAnchors = true,
  width = 0.5,
  className,
  draw = true,
}: TetherLineProps) {
  const stroke = color ?? STATE_COLOR[state];
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  // perpendicular unit * bow
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  const d = bow ? `M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}` : `M ${ax} ${ay} L ${bx} ${by}`;

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="tether-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.15" />
          <stop offset="50%" stopColor={stroke} stopOpacity="1" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {showAnchors && <Anchor x={ax} y={ay} color={stroke} r={1.5} />}
      <path
        className="tether-line"
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "0.12 0.1" : undefined}
        opacity="0.95"
        pathLength={draw ? 1 : undefined}
        vectorEffect="non-scaling-stroke"
      />
      {showAnchors && <Anchor x={bx} y={by} color={stroke} r={1.5} />}
    </svg>
  );
}
