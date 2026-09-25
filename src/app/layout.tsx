import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERRANT NORTH — Cartography of the Impossible",
  description:
    "ERRANT NORTH is a single-player twin-stick action roguelite about anchoring impossible points and redrawing space to survive. The map stopped describing the territory. The territory began obeying the map.",
  openGraph: {
    title: "ERRANT NORTH — Cartography of the Impossible",
    description:
      "A twin-stick action roguelite about weaponizing impossible space. Enter a living anomaly. Anchor impossible points. Redraw space to survive.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05080e",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
