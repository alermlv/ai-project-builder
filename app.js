import { renderRoute } from "./router.js";
import {
  getState,
  setState,
  createInitialState,
  registerStateListener,
  commitState,
} from "./state.js";
import { loadAppState, saveAppState } from "./storage.js";
import { ROUTES } from "./utils/routes.js";

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
      entry: {
        goal: "",
        level: "",
        scope: "",
        ...(savedState.entry || {}),
      },
      ui: {
        isHydrated: true,
        errors: {},
        ...(savedState.ui || {}),
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
        ui: {
          ...state.ui,
          errors: {},
        },
      }));
    }

    if (target.dataset.back === "entry-goal") {
      commitState((state) => ({
        ...state,
        route: ROUTES.ENTRY_GOAL,
        ui: {
          ...state.ui,
          errors: {},
        },
      }));
    }

    if (target.dataset.back === "entry-level") {
      commitState((state) => ({
        ...state,
        route: ROUTES.ENTRY_LEVEL,
        ui: {
          ...state.ui,
          errors: {},
        },
      }));
    }

    if (target.dataset.back === "entry-scope") {
      commitState((state) => ({
        ...state,
        route: ROUTES.ENTRY_SCOPE,
        ui: {
          ...state.ui,
          errors: {},
        },
      }));
    }
  });
}

init();
