// src/index.js

import { fetchDashboardData } from "./core/apiClient";
import KeyBrandMetricRingChart from './widgets/keyBrandMetric_ringChart.js';
import './styles/charts.css';

// Expose the ring chart module to the global window object
window.keyBrandMetric_ringChart = KeyBrandMetricRingChart;

// DOM ready
document.addEventListener("DOMContentLoaded", async () => {
  // Helper function to get the submitted URL (assumes defined elsewhere)
  const url = getSubmittedUrl?.();
  if (!url) return;

  try {
    // Fetch dashboard data
    const data = await fetchDashboardData(url);

    // Initialize ring metrics chart if function exists
    if (typeof initRingMetrics === "function") {
      initRingMetrics(data);
    } else {
      console.warn("initRingMetrics function not found.");
    }
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
  }
});
