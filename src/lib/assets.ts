/**
 * ERRANT NORTH — official asset registry.
 *
 * Assets are provided via a shared Google Drive folder and referenced through
 * Drive's stable thumbnail endpoint so the site renders reliably without
 * bundling large binaries into the single-file build. Every consumer pairs
 * these with a CSS/SVG cartographic fallback so the composition holds together
 * even if a remote asset is slow or unavailable.
 */

const drive = (id: string, size = 2560) =>
  `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=s${size}`;

export const assets = {
  // ---- Signature key art & motion sources -------------------------------
  mainMenu: drive("18NsYwSN2YoLhZNxuINXGrLmnJobo3TyF"),
  environment: drive("1Dq0-2kDfkfaMUNFnFI-QYjCankQIT4lo"),
  protagonist: drive("16TDW_EWewPuA10eABOXASwyDWsuSLtBB"),

  // ---- Gameplay footage --------------------------------------------------
  gameplayA: drive("1OAioKPD3YEWBQghLIR0xOXf8_9ZdGdbv"),
  gameplayB: drive("1a3J9OtK5XOqM6DxT5CNLIva-lLTu3-cs"),

  // ---- Concept / environment plates -------------------------------------
  concept1: drive("18x1Zp2e0_MKOyLRXEbQS1U9F0OdV2VxR"),
  concept2: drive("11Krp_Cd1HZIPfy0Y1MDJBqcQ0i8CDzwf"),
  concept3: drive("1Y46YXtR2KWw8WbrcmFJlrwDvHJmOkWIh"),
  concept4: drive("18pKWyp5EteXS2B1qjcQ6j8UCJ2Lk7qw1"),
  concept5: drive("1Z3jOOlI5XGElV-iRtgVX0NyBva37uDBG"),
  concept6: drive("1RXKqBRo76HGndi32PVeXLcaq4smP-W_9"),
  concept7: drive("1wlFSUGypMs8RHwW1CVgITYSUgFOrrddh"),
  concept8: drive("10RIpBuSA7notUg-tXE5foNlVReRy-qFJ"),
} as const;

export type AssetKey = keyof typeof assets;
