// Emerald Executive chart palette — mirrors design tokens in styles.css.
// SVG presentation attrs need concrete strings, not CSS vars.
export const CHART = {
  emerald: "#064e3b",
  jade: "#0d7a5f",
  gold: "#c9a84c",
  cream: "#f5f0e0",
  teal: "#0f766e",
  amber: "#d97706",
  red: "#dc2626",
  slate: "#64748b",
  slateLight: "#cbd5e1",
  // aliases so existing pages keep compiling without edits
  navy: "#064e3b",
  blue: "#0f766e",
  green: "#0d7a5f",
};

export const CHART_SERIES = [CHART.emerald, CHART.jade, CHART.gold, CHART.teal, CHART.red];
export const AXIS_COLOR = "#64748b";
export const GRID_COLOR = "#e5e0d0";
