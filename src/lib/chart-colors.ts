// Chart colors mirror the tokens in src/styles.css but are provided as
// concrete strings because SVG presentation attributes (stroke / fill)
// don't resolve CSS custom properties reliably across browsers.
export const CHART = {
  navy: "#1e3a8a",
  blue: "#2563eb",
  green: "#16a34a",
  amber: "#f59e0b",
  red: "#dc2626",
  slate: "#64748b",
  slateLight: "#cbd5e1",
};

export const CHART_SERIES = [CHART.navy, CHART.blue, CHART.green, CHART.amber, CHART.red];
export const AXIS_COLOR = "#64748b";
export const GRID_COLOR = "#e2e8f0";
