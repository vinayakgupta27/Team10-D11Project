const listeners = new Set();
// id -> { joined: boolean, currentSize: number | undefined }
const state = new Map();

export const JoinedStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  emit() {
    listeners.forEach((l) => l());
  },
  markJoined(contestId, nextCurrentSize) {
    const prev = state.get(contestId) || {};
    const updated = {
      joined: true,
      currentSize: typeof nextCurrentSize === 'number' ? nextCurrentSize : prev.currentSize,
    };
    state.set(contestId, updated);
    this.emit();
  },
  markUnjoined(contestId, nextCurrentSize) {
    const prev = state.get(contestId) || {};
    const updated = {
      joined: false,
      currentSize: typeof nextCurrentSize === 'number' ? nextCurrentSize : prev.currentSize,
    };
    state.set(contestId, updated);
    this.emit();
  },
  get(contestId) {
    return state.get(contestId);
  },
};


