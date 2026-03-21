let state = createInitialState();
let onStateChange = null;

export function createInitialState() {
  return {
    route: "entry-goal",
    entry: {
      goal: "",
    },
    project: null,
    ui: {
      isHydrated: false,
    },
  };
}

export function getState() {
  return state;
}

export function setState(nextState) {
  state = nextState;
}

export function updateState(updater) {
  state = updater(state);
}

export function registerStateListener(listener) {
  onStateChange = listener;
}

export function commitState(updater) {
  updateState(updater);

  if (onStateChange) {
    onStateChange(state);
  }
}
