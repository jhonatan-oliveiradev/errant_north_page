import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { NAV_ITEMS, SECTIONS } from "@/lib/sections";
import { scrollToId } from "@/lib/scroll";
import { Anchor } from "@/components/primitives/TetherLine";

/** Tracks which section currently occupies the viewport centre. */
function useActiveSection() {
  const [active, setActive] = useState(SECTIONS[0].id);
  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      const mid = window.innerHeight * 0.4;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return active;
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const activeMeta = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(`#${id}`);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-ivory/10 bg-graphite/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8"
        >
          {/* wordmark */}
          <a
            href="#hero"
            onClick={go("hero")}
            className="group flex items-center gap-2.5"
          >
            <svg viewBox="0 0 24 24" className="size-5 text-spectral" aria-hidden="true">
              <Anchor x={12} y={12} color="currentColor" r={4} />
            </svg>
            <span className="font-display text-lg tracking-wide text-ivory">
              ERRANT<span className="text-spectral"> NORTH</span>
            </span>
          </a>

          {/* desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative font-mono text-[11px] uppercase tracking-[0.22em] transition-colors",
                      isActive ? "text-ivory" : "text-pale hover:text-ivory",
                    )}
                  >
                    {item.nav}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-px bg-spectral transition-all duration-300",
                        isActive ? "w-full" : "w-0",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* right cluster */}
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-pale/70 md:inline-flex">
              SEC {activeMeta.code}
              <span className="mx-1.5 text-spectral/60">//</span>
              {activeMeta.name}
            </span>
            <button
              onClick={go("origin")}
              className="group relative overflow-hidden border border-spectral/60 bg-spectral/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-spectral transition-colors hover:bg-spectral hover:text-ink"
            >
              Wishlist
            </button>
            <button
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex size-9 items-center justify-center border border-ivory/15 text-ivory lg:hidden"
            >
              <span className="relative block h-2.5 w-4">
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-current transition-all",
                    open ? "top-1 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-current transition-all",
                    open ? "top-1 -rotate-45" : "top-2",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-ink/97 px-6 backdrop-blur-lg transition-all duration-400 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={go(s.id)}
            tabIndex={open ? 0 : -1}
            className="flex items-baseline gap-4 border-b border-ivory/10 py-3"
          >
            <span className="font-mono text-xs text-spectral">{s.code}</span>
            <span className="font-display text-4xl text-ivory">{s.name}</span>
          </a>
        ))}
        <span className="mt-6 font-mono text-[10px] tracking-[0.3em] text-pale/50">
          ERRANT NORTH // EXPEDITION INTERFACE v0.1
        </span>
      </div>
    </>
  );
}
