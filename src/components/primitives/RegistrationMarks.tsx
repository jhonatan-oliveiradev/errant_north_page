import { cn } from "@/utils/cn";

type RegistrationMarksProps = {
  className?: string;
  color?: string;
  /** show a faint centre reticle */
  reticle?: boolean;
};

/**
 * Print-style registration marks for instrument frames: corner crop ticks plus
 * an optional centre reticle. Purely decorative.
 */
export default function RegistrationMarks({
  className,
  color = "rgba(234,229,215,0.4)",
  reticle = false,
}: RegistrationMarksProps) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* corner crop marks */}
      <g stroke={color} strokeWidth="0.4" fill="none">
        <path d="M1 5 L1 1 L5 1" />
        <path d="M95 1 L99 1 L99 5" />
        <path d="M99 95 L99 99 L95 99" />
        <path d="M5 99 L1 99 L1 95" />
      </g>
      {reticle && (
        <g stroke={color} strokeWidth="0.3" fill="none" opacity="0.6">
          <circle cx="50" cy="50" r="6" />
          <path d="M50 42 L50 46 M50 54 L50 58 M42 50 L46 50 M54 50 L58 50" />
        </g>
      )}
    </svg>
  );
}
