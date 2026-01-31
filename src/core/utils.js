// utils.js

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number(value)));
}

export function animateNumber(el, to, duration = 800) {
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

export function prettifyMetricKey(key) {
  return key
    .replace(/_/g, " ")
    .replace(" percent", "")
    .replace(/\b\w/g, l => l.toUpperCase());
}

