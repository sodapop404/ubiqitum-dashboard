// keyBrandMetric_ringChart.js
// Ring chart for key brand metrics using Chart.js
// Converted to ES Module with default export

import { Chart } from "chart.js";
import { chartManager } from "./core/chartManager.js"; // your global chartManager
import { animateNumber, prettifyMetricKey } from "./core/utils.js";

const CIRCUMFERENCE = 2 * Math.PI * 40; // radius 40px

function createRingChart(canvas, value) {
  chartManager.destroy(canvas);

  const ctx = canvas.getContext("2d");

  // Blue gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#8adfff");
  gradient.addColorStop(1, "#00bfff");

  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [{
        data: [0, 100],
        backgroundColor: [gradient, "#e6e6e6"],
        borderWidth: 0
      }]
    },
    options: {
      rotation: -Math.PI / 2,
      cutout: "72%",
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });

  const startTime = performance.now();
  const duration = 1000;

  function animate() {
    const progress = Math.min((performance.now() - startTime) / duration, 1);
    const current = Math.min(Math.max(0, value)) * progress;

    chart.data.datasets[0].data = [current, 100 - current];
    chart.update("none");

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  return chart;
}

function updateMetricCard(card, value, delta = null, label = null) {
  const canvas = card.querySelector(".metric-chart");
  const textEl = card.querySelector(".ring-text span");
  const labelEl = card.querySelector(".metric-title");
  const deltaEl = card.querySelector(".metric-delta");

  if (!canvas || !textEl) return;

  const clampedValue = Math.min(Math.max(0, Number(value)));

  if (!chartManager.get(canvas)) {
    chartManager.create(canvas, createRingChart(canvas, clampedValue));
  }

  // Animate the number regardless
  animateNumber(textEl, clampedValue);

  if (label && labelEl) {
    labelEl.textContent = prettifyMetricKey(label);
  }

  if (deltaEl && delta !== null) {
    const rounded = Math.round(Number(delta));
    deltaEl.textContent = `${rounded > 0 ? "▲" : rounded < 0 ? "▼" : ""} ${Math.abs(rounded)}%`;
    deltaEl.classList.toggle("positive", rounded > 0);
    deltaEl.classList.toggle("negative", rounded < 0);
  }
}

function populateMetrics(data) {
  document.querySelectorAll(".metric-card").forEach(card => {
    const key = card.dataset.metric;
    if (!key) return;

    const score = data?.[key] ?? 0;
    const label = card.dataset.label ?? key;
    const delta = card.dataset.delta ?? null;

    updateMetricCard(card, score, delta, label);
  });
}

// Default export for ES Module
const keyBrandMetric_ringChart = {
  init(apiData = null) {
    const data = apiData || (window.state && state.getState());
    if (!data) return;

    populateMetrics(data);
  }
};

export default keyBrandMetric_ringChart;
