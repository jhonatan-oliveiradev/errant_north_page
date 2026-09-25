import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionLabel from "@/components/primitives/SectionLabel";
import CartographicGrid from "@/components/primitives/CartographicGrid";
import { cn } from "@/utils/cn";

type Frame = "a" | "b";
type NodeType = "route" | "observation" | "condition" | "state";

const NODES: { x: number; y: number; label: string; type: NodeType }[] = [
  { x: 11, y: 44, label: "R-00", type: "route" },
  { x: 27, y: 22, label: "OBS-12", type: "observation" },
  { x: 38, y: 50, label: "C-03", type: "condition" },
  { x: 41, y: 12, label: "ST-07", type: "state" },
  { x: 60, y: 38, label: "OBS-31", type: "observation" },
  { x: 82, y: 47, label: "R-09", type: "route" },
  { x: 55, y: 9, label: "ST-11", type: "state" },
  { x: 20, y: 8, label: "C-01", type: "condition" },
  { x: 73, y: 16, label: "OBS-44", type: "observation" },
  { x: 90, y: 28, label: "ST-19", type: "state" },
];

type EdgeFrame = Frame | "both" | "none";
const EDGES: { a: number; b: number; frame: EdgeFrame; bow: number }[] = [
  { a: 0, b: 1, frame: "a", bow: -4 },
  { a: 1, b: 3, frame: "b", bow: 5 },
  { a: 1, b: 2, frame: "a", bow: -3 },
  { a: 2, b: 4, frame: "both", bow: 3 },
  { a: 3, b: 6, frame: "b", bow: -5 },
  { a: 4, b: 5, frame: "a", bow: 4 },
  { a: 4, b: 8, frame: "b", bow: -4 },
  { a: 6, b: 8, frame: "both", bow: 4 },
  { a: 7, b: 3, frame: "a", bow: 3 },
  { a: 8, b: 9, frame: "b", bow: -3 },
  { a: 0, b: 2, frame: "none", bow: 8 },
  { a: 5, b: 9, frame: "none", bow: -6 },
  { a: 6, b: 4, frame: "none", bow: 7 },
];

const W = 100;
const H = 56;

function edgePath(a: number, b: number, bow: number) {
  const A = NODES[a];
  const B = NODES[b];
  const mx = (A.x + B.x) / 2;
  const my = (A.y + B.y) / 2;
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return `M ${A.x} ${A.y} Q ${cx} ${cy} ${B.x} ${B.y}`;
}

function edgeStyle(frame: EdgeFrame, active: Frame) {
  switch (frame) {
    case "a":
      return { stroke: "#3adbe0", opacity: active === "a" ? 0.9 : 0.16, dash: undefined };
    case "b":
      return { stroke: "#e8409a", opacity: active === "b" ? 0.9 : 0.16, dash: undefined };
    case "both":
      return { stroke: "#eae5d7", opacity: 0.55, dash: undefined };
    case "none":
      return { stroke: "#96a2b2", opacity: 0.4, dash: "1.5 2.5" };
    default:
      return { stroke: "#96a2b2", opacity: 0.2, dash: undefined };
  }
}

function NodeGlyph({ type, color }: { type: NodeType; color: string }) {
  const common = { fill: color, stroke: "none" };
  if (type === "route")
    return <rect x={-2.4} y={-2.4} width={4.8} height={4.8} transform="rotate(45)" {...common} />;
  if (type === "observation") return <circle r={2.2} {...common} />;
  if (type === "condition")
    return <rect x={-2} y={-2} width={4} height={4} {...common} />;
  return (
    <path d="M0 -2.6 L2.2 -1.3 L2.2 1.3 L0 2.6 L-2.2 1.3 L-2.2 -1.3 Z" {...common} />
  );
}

export default function ImpossibleRoute() {
  const root = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const candidate = useRef<SVGLineElement>(null);
  const [frame, setFrame] = useState<Frame>("a");
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".ir-node", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
        duration: 0.6,
        ease: "back.out(2)",
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".ir-edge", {
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".ir-caption", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  const handleMove = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    const line = candidate.current;
    if (!svg || !line) return;
    const r = svg.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    const vy = ((e.clientY - r.top) / r.height) * H;
    line.setAttribute("x1", String(NODES[0].x));
    line.setAttribute("y1", String(NODES[0].y));
    line.setAttribute("x2", String(vx));
    line.setAttribute("y2", String(vy));
    line.style.opacity = "1";

    let nearest = -1;
    let best = Infinity;
    NODES.forEach((n, i) => {
      const d = Math.hypot(n.x - vx, (n.y - vy) * (W / H));
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    nodeRefs.current.forEach((g, i) => {
      if (!g) return;
      g.classList.toggle("is-near", i === nearest && best < 9);
    });
  };

  const clear = () => {
    if (candidate.current) candidate.current.style.opacity = "0";
    nodeRefs.current.forEach((g) => g?.classList.remove("is-near"));
  };

  return (
    <section id="route" ref={root} className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <SectionLabel index="08" name="The Impossible Route" ref="GRAPH" tone="anomaly" />
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl font-display text-[clamp(2.6rem,7vw,6rem)] uppercase leading-[0.84] text-ivory">
            A graph of what may become possible.
          </h2>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-pale/60">
              reference frame
            </span>
            {(["a", "b"] as Frame[]).map((f) => (
              <button
                key={f}
                onClick={() => setFrame(f)}
                aria-pressed={frame === f}
                className={cn(
                  "border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                  frame === f
                    ? f === "a"
                      ? "border-spectral/70 bg-spectral/10 text-spectral"
                      : "border-anomaly/70 bg-anomaly/10 text-anomaly"
                    : "border-ivory/15 text-pale hover:text-ivory",
                )}
              >
                frame {f === "a" ? "α" : "β"}
              </button>
            ))}
          </div>
        </div>

        <div
          className="relative mt-10 aspect-[16/9] w-full overflow-hidden border border-ivory/10 bg-ink/40"
          onPointerMove={handleMove}
          onPointerLeave={clear}
        >
          <CartographicGrid step={40} major={5} opacity={0.5} />

          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 size-full"
            aria-label="The Impossible Route — a contradictory navigational graph"
          >
            {EDGES.map((e, i) => {
              const s = edgeStyle(e.frame, frame);
              return (
                <path
                  key={i}
                  className="ir-edge"
                  d={edgePath(e.a, e.b, e.bow)}
                  fill="none"
                  stroke={s.stroke}
                  strokeWidth="0.28"
                  strokeOpacity={s.opacity}
                  strokeDasharray={s.dash}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            <line
              ref={candidate}
              x1={NODES[0].x}
              y1={NODES[0].y}
              x2={NODES[0].x}
              y2={NODES[0].y}
              stroke="#f2a93b"
              strokeWidth="0.3"
              strokeDasharray="1 1.5"
              strokeOpacity="0.8"
              style={{ opacity: 0 }}
              vectorEffect="non-scaling-stroke"
            />

            {NODES.map((n, i) => (
              <g
                key={n.label}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                className="ir-node"
                transform={`translate(${n.x} ${n.y})`}
              >
                <circle r="3.4" fill="rgba(5,8,14,0.6)" />
                <g className="ir-glyph">
                  <NodeGlyph
                    type={n.type}
                    color={i === 0 ? "#f2a93b" : frame === "a" ? "#3adbe0" : "#e8409a"}
                  />
                </g>
                <text
                  x="0"
                  y="6.4"
                  textAnchor="middle"
                  className="fill-ivory/60 font-mono"
                  fontSize="2.1"
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>

          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-pale/60">
            <span className="text-spectral">— frame α · stable refs</span>
            <span className="text-anomaly">— frame β · errant refs</span>
            <span className="text-pale/70">-- paths valid in no frame</span>
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3 font-mono text-[9px] tracking-[0.2em] text-amber/70">
            move pointer · pre-trajectory
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <p className="ir-caption font-display text-[clamp(1.6rem,3.4vw,2.8rem)] uppercase leading-[0.95] text-ivory">
            This is not a map of where you can go.
          </p>
          <p className="ir-caption max-w-lg self-end font-mono text-sm leading-relaxed text-pale/70">
            The route contains decisions not yet made. It changes as new spatial exceptions are
            stabilized — prediction, causality and manifestation left deliberately unresolved.
          </p>
        </div>
      </div>

      <style>{`
        .ir-glyph { transform-box: fill-box; transform-origin: center; transition: transform 0.2s ease; }
        .ir-node.is-near .ir-glyph { transform: scale(2); transition: transform 0.15s ease; }
      `}</style>
    </section>
  );
}
