
// chartManager.js

const chartRegistry = new WeakMap();

function create(canvas, config) {
  destroy(canvas);

  const ctx = canvas.getContext("2d");
  const chart = new Chart(ctx, config);

  chartRegistry.set(canvas, chart);
  return chart;
}

function destroy(canvas) {
  const existing = chartRegistry.get(canvas);
  if (existing) {
    existing.destroy();
    chartRegistry.delete(canvas);
  }
}

function get(canvas) {
  return chartRegistry.get(canvas) || null;
}

export const chartManager = {
  create,
  destroy,
  get
};
