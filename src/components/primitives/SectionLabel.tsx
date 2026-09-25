import { cn } from "@/utils/cn";

const TONE: Record<string, string> = {
  spectral: "text-spectral",
  anomaly: "text-anomaly",
  amber: "text-amber",
  ivory: "text-ivory",
  pale: "text-pale",
};

type SectionLabelProps = {
  index: string;
  name: string;
  ref?: string;
  tone?: keyof typeof TONE;
  className?: string;
};

/** Small technical section eyebrow: a leading tether tick + index + name + ref. */
export default function SectionLabel({
  index,
  name,
  ref,
  tone = "spectral",
  className,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em]",
        className,
      )}
    >
      <span className="h-px w-7 bg-spectral/70" aria-hidden="true" />
      <span className={TONE[tone]}>[{index}]</span>
      <span className="text-ivory">{name}</span>
      {ref && (
        <>
          <span className="text-pale/40">//</span>
          <span className="text-pale/80">{ref}</span>
        </>
      )}
    </span>
  );
}
