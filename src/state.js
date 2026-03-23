let state = createInitialState();
let onStateChange = null;

export function createInitialState() {
  return {
    route: "entry-goal",
    entry: {
      goal: "",
      level: "",
      scope: "",
    },
    recommendation: null,
    project: null,
    ui: {
      isHydrated: false,
      isLoading: false,
      errors: {},
      notice: "",
      expandedStepIds: [],
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
