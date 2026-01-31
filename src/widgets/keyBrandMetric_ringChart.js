<script>
(function () {
  if (!window.Chart) {
    console.warn("Chart.js not found — keyBrandMetric_ringChart not initialised");
    return;
  }

  /* =====================================================
     INTERNAL REGISTRY
     - Prevents canvas reuse errors
  ===================================================== */

  const chartRegistry = new WeakMap();

  /* =====================================================
     COUNT-UP ANIMATION (TEXT)
  ===================================================== */

  function animateNumber(el, to, duration = 800) {
    let start = 0;
    const stepTime = 16;
    const increment = to / (duration / stepTime);

    function step() {
      start += increment;
      if (start >= to) {
        el.textContent = Math.round(to);
      } else {
        el.textContent = Math.round(start);
        requestAnimationFrame(step);
      }
    }

    step();
  }

  /* =====================================================
     CREATE RING CHART
     - Grey background is static
     - Blue gradient animates ONLY
  ===================================================== */

  function createRingChart(canvas, targetValue) {
    const ctx = canvas.getContext("2d");
    const value = Math.min(100, Math.max(0, Number(targetValue)));

    // Destroy any previous chart on this canvas
    if (chartRegistry.has(canvas)) {
      chartRegistry.get(canvas).destroy();
      chartRegistry.delete(canvas);
    }

    // Vertical gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#8adfff");
    gradient.addColorStop(1, "#00bfff");

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [0, 100],
            backgroundColor: [gradient, "#e6e6e6"],
            borderWidth: 0
          }
        ]
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

    chartRegistry.set(canvas, chart);

    // Manual animation of ONLY the blue ring
    const duration = 900;
    const start = performance.now();

    function animate() {
      const progress = Math.min((performance.now() - start) / duration, 1);
      const current = value * progress;

      chart.data.datasets[0].data = [current, 100 - current];
      chart.update("none");

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    return chart;
  }

  /* =====================================================
     UPDATE METRIC CARD
  ===================================================== */

  function updateMetricCard(card, score, delta = null, label = null) {
    const canvas = card.querySelector(".metric-chart");
    const valueEl = card.querySelector(".ring-text span");
    const titleEl = card.querySelector(".metric-title");
    const deltaEl = card.querySelector(".metric-delta");

    if (!canvas || !valueEl) return;

    const clamped = Math.min(100, Math.max(0, Number(score)));

    createRingChart(canvas, clamped);
    animateNumber(valueEl, clamped);

    if (label && titleEl) {
      titleEl.textContent = label;
    }

    if (deltaEl && delta !== null) {
      const rounded = Math.round(delta);
      deltaEl.textContent =
        `${rounded > 0 ? "▲" : rounded < 0 ? "▼" : ""} ${Math.abs(rounded)}%`;

      deltaEl.classList.toggle("positive", rounded > 0);
      deltaEl.classList.toggle("negative", rounded < 0);
    }
  }

  /* =====================================================
     HYDRATE ALL RING METRICS
  ===================================================== */

  function init(data) {
    if (!data || typeof data !== "object") {
      console.warn("keyBrandMetric_ringChart.init called without valid data");
      return;
    }

    document.querySelectorAll(".metric-card").forEach(card => {
      const metricKey = card.dataset.metric;
      if (!metricKey) return;

      const score = Number(data[metricKey]);
      if (Number.isNaN(score)) return;

      const label =
        card.dataset.label?.trim() ||
        metricKey.replace(/_/g, " ").replace(" percent", "");

      const delta = card.dataset.delta ?? null;

      updateMetricCard(card, score, delta, label);
    });
  }

  /* =====================================================
     PUBLIC API
  ===================================================== */

  window.keyBrandMetric_ringChart = {
    init
  };

  /* =====================================================
     AUTO-INIT (OPTIONAL)
     - Allows Webflow page JS to set data first
  ===================================================== */

  if (window.autoInitRingMetrics) {
    window.keyBrandMetric_ringChart.init(window.autoInitRingMetrics);
  }

})();
</script>

