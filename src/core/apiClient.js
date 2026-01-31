// apiClient.js

const API_BASE = "/api/analyse";

async function fetchDashboardData({ url, plan = "free" }) {
  if (!url) throw new Error("URL is required");

  const params = new URLSearchParams({
    url,
    plan
  });

  const res = await fetch(`${API_BASE}?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export const apiClient = {
  fetchDashboardData
};

