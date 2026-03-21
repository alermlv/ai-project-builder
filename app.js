import { renderRoute } from "./router.js";
import {
  getState,
  setState,
  createInitialState,
  registerStateListener,
  commitState,
} from "./state.js";
import { loadAppState, saveAppState } from "./storage.js";

function init() {
  registerStateListener(handleStateChange);
  hydrateAppState();
  renderRoute();
  setupGlobalEvents();
}

function hydrateAppState() {
  const savedState = loadAppState();

  if (savedState) {
    setState({
      ...savedState,
      ui: {
        ...(savedState.ui || {}),
        isHydrated: true,
      },
    });
    return;
  }

  const initialState = createInitialState();

  setState({
    ...initialState,
    ui: {
      ...initialState.ui,
      isHydrated: true,
    },
  });

  saveAppState(getState());
}

function handleStateChange(nextState) {
  saveAppState(nextState);
  renderRoute();
}

function setupGlobalEvents() {
  document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.dataset.nav) {
      const route = target.dataset.nav;

      commitState((state) => ({
        ...state,
        route,
      }));
    }
  });
}

init();
