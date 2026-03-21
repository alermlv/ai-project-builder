let state = {
  route: "entry-goal",
  entry: {
    goal: "",
  },
};

export function getState() {
  return state;
}

export function setState(nextState) {
  state = nextState;
}

export function updateState(updater) {
  state = updater(state);
}
