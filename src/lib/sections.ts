export type SectionMeta = {
  id: string;
  code: string;
  name: string;
  /** label used in the top navigation, if any */
  nav?: string;
};

/** Single source of truth for section order, codes and navigation. */
export const SECTIONS: SectionMeta[] = [
  { id: "hero", code: "01", name: "HERO", nav: "GAME" },
  { id: "phenomenon", code: "02", name: "PHENOMENON" },
  { id: "tether", code: "03", name: "TETHER", nav: "TETHER" },
  { id: "battlefield", code: "04", name: "BATTLEFIELD" },
  { id: "divergence", code: "05", name: "DIVERGENCE", nav: "LORE" },
  { id: "sectors", code: "06", name: "SECTORS", nav: "SECTORS" },
  { id: "doctrine", code: "07", name: "DOCTRINE" },
  { id: "route", code: "08", name: "IMPOSSIBLE ROUTE", nav: "ROUTE" },
  { id: "guardians", code: "09", name: "GUARDIANS" },
  { id: "cartographer", code: "10", name: "CARTOGRAPHER" },
  { id: "origin", code: "11", name: "ORIGIN ANCHOR" },
];

export const NAV_ITEMS = SECTIONS.filter((s) => s.nav);
