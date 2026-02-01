import { fetchDashboardData } from "./core/apiClient.js";
import KeyBrandMetricRingChart from './widgets/keyBrandMetric_ringChart.js';
import './styles/charts.css';

// Optional: attach to window if you want global access
window.keyBrandMetric_ringChart = KeyBrandMetricRingChart;

// Helper to get submitted URL (assuming you have a function like this)
function getSubmittedUrl() {
  const input = document.querySelector("#dashboard-url-input");
  return input ? input.value : null;
}

document.addEventListener("DOMContentLoaded", async () => {
  const url = getSubmittedUrl();
  if (!url) return;

  try {
    const data = await fetchDashboardData(url);
    KeyBrandMetricRingChart.init(data); // initialize all ring charts
  } catch (err) {
    console.error("Failed to fetch dashboard data:", err);
  }
});
