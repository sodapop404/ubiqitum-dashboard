import { fetchDashboardData } from "./core/apiClient";
import { initLineMetrics } from "./widgets/lineMetrics";
import { initRingMetrics } from "./widgets/keyBrandMetric_ringChart";
import './styles/charts.css';

window.keyBrandMetric_ringChart = keyBrandMetric_ringChart;

document.addEventListener("DOMContentLoaded", async () => {
  const url = getSubmittedUrl();
  if (!url) return;

  const data = await fetchDashboardData(url);

  initLineMetrics(data);
  initRingMetrics(data);
});




