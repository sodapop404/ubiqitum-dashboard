// keyBrandMetric_ringChart.js

import { chartManager } from "./chartManager.js";
import { animateNumber, clamp, prettifyMetricKey } from "./utils.js";
import { state } from "./state.js";

const CIRCUMFERENCE = 2 * Math.PI * 40; // radius 40px

function createRingChart(canvas, value) {
  // Use chartManager to handle canvas lifecycle
  chartManager.destroy(canvas);

  const ctx = canvas.getContext("2d");

  // Gradient for the blue portion
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#8adfff");
  gradient.addColorStop(1, "#00bfff");

  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [{
        data: [0, 100], // start from 0
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

  // Animate the blue portion
  const startTime = performance.now();
  const duration = 1000;

  function animate() {
    const progress = Math.min((performance.now() - startTime) / duration, 1);
    const current = clamp(value) * progress;

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

  const clampedValue = clamp(value);

  // Use chartManager to get existing chart or create new
  if (!chartManager.get(canvas)) {
    chartManager.create(canvas, createRingChart(canvas, clampedValue));
  } else {
    // fallback: just animate text & visual
    animateNumber(textEl, clampedValue);
  }

  animateNumber(textEl, clampedValue);

  if (label && labelEl) {
    labelEl.textContent = prettifyMetricKey(label);
  }

  if (deltaEl && delta !== null) {
    const rounded = Math.round(delta);
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

export const keyBrandMetric_ringChart = {
  init(apiData = null) {
    const data = apiData || state.getState();
    if (!data) return;

    populateMetrics(data);
  }
};
