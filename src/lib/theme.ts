/* ─────────────────────────────────────────────────────────
   MOURNING THEME — site-wide muted colors (desaturated +
   darkened, see --mourning-filter in globals.css) during the
   mourning period. Flip MOURNING_DEFAULT to false when it
   ends; users who already opted back to full color are
   unaffected.
   ───────────────────────────────────────────────────────── */

export const MOURNING_DEFAULT = true;

/** localStorage key — "mourning" | "normal" */
export const THEME_KEY = "jl-theme";

/** class toggled on <html> (see html.mourning in globals.css) */
export const MOURNING_CLASS = "mourning";

/* Runs in <head> before first paint so there is no color flash.
   Kept as a prebuilt string because the layout is a Server Component. */
export const MOURNING_INIT_SCRIPT = `(function(){try{var v=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});if(v?v==="mourning":${MOURNING_DEFAULT})document.documentElement.classList.add(${JSON.stringify(
  MOURNING_CLASS,
)})}catch(e){}})()`;
