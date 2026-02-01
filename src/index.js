import { fetchDashboardData } from "./core/apiClient";
import KeyBrandMetricRingChart from './widgets/keyBrandMetric_ringChart.js';
import './styles/charts.css';

window.keyBrandMetric_ringChart = KeyBrandMetricRingChart;

document.addEventListener("DOMContentLoaded", async () => {
  const url = getSubmittedUrl();
  if (!url) return;

  const data = await fetchDashboardData(url);

  initRingMetrics(data);
});








