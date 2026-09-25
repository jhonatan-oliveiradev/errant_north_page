"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { initSmoothScroll } from "@/lib/scroll";

import GlobalField from "@/components/GlobalField";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Phenomenon from "@/components/Phenomenon";
import TetherSection from "@/components/TetherSection";
import Battlefield from "@/components/Battlefield";
import Divergence from "@/components/Divergence";
import Sectors from "@/components/Sectors";
import Doctrine from "@/components/Doctrine";
import ImpossibleRoute from "@/components/ImpossibleRoute";
import Guardians from "@/components/Guardians";
import CartographerSection from "@/components/CartographerSection";
import OriginAnchor from "@/components/OriginAnchor";
import GameplayModal from "@/components/GameplayModal";

function Footer() {
  return (
    <footer className="relative z-10 border-t border-ivory/10 bg-ink/60">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" className="size-5 text-spectral" aria-hidden="true">
            <path d="M12 2 L14.6 9.4 L22 12 L14.6 14.6 L12 22 L9.4 14.6 L2 12 L9.4 9.4 Z" fill="currentColor" />
          </svg>
          <span className="font-display text-lg tracking-wide text-ivory">
            ERRANT<span className="text-spectral"> NORTH</span>
          </span>
        </div>
        <p className="max-w-md font-mono text-[11px] leading-relaxed text-pale/60">
          A single-player twin-stick action roguelite about weaponizing impossible space.
          Cartography of the Impossible.
        </p>
        <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-pale/50 md:items-end">
          <span>expedition interface v0.1</span>
          <span className="text-spectral/70">coordinates resolved</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [watch, setWatch] = useState(false);

  useEffect(() => {
    const cleanup = initSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 1200);
    return () => {
      cleanup();
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className="relative">
      <GlobalField />
      <div className="en-grain" aria-hidden="true" />
      <div className="en-scanlines" aria-hidden="true" />

      <Navigation />

      <main className="relative z-10">
        <Hero onWatch={() => setWatch(true)} />
        <Phenomenon />
        <TetherSection />
        <Battlefield />
        <Divergence />
        <Sectors />
        <Doctrine />
        <ImpossibleRoute />
        <Guardians />
        <CartographerSection />
        <OriginAnchor onWatch={() => setWatch(true)} />
      </main>

      <Footer />

      <GameplayModal open={watch} onClose={() => setWatch(false)} />
    </div>
  );
}
