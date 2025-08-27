// Simple shared countdown store keyed by match id (or single match for now)
const listeners = new Set();
let targetTimeMs = null; // epoch ms for match start
let intervalId = null;

function tick() {
  listeners.forEach((l) => l());
}

export const CountdownStore = {
  setTarget(timeMs) {
    targetTimeMs = timeMs;
    if (!intervalId) {
      intervalId = setInterval(tick, 1000);
    }
  },
  getRemaining() {
    if (!targetTimeMs) return 0;
    return Math.max(0, targetTimeMs - Date.now());
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};


