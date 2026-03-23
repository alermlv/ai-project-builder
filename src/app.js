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
      recommendation: savedState.recommendation || null,
      project: savedState.project || null,
      ui: {
        isHydrated: true,
        isLoading: false,
        errors: {},
        notice: "",
        expandedStepIds: [],
        aiInput: "",
        aiReply: null,
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
  document.addEventListener("click", async (e) => {
    const target = e.target;

    if (target.dataset.copyCode) {
      await handleCopyCode(target);
      return;
    }

    if (target.dataset.nav) {
      const route = target.dataset.nav;

      commitState((state) => ({
        ...state,
        route,
        ui: {
          ...state.ui,
          errors: {},
          notice: "",
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
          notice: "",
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
          notice: "",
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
          notice: "",
        },
      }));
    }

    if (target.dataset.back === "recommendation") {
      commitState((state) => ({
        ...state,
        route: ROUTES.RECOMMENDATION,
        ui: {
          ...state.ui,
          errors: {},
          notice: "",
        },
      }));
    }
  });
}

async function handleCopyCode(button) {
  const encodedCode = button.dataset.copyCode || "";
  const originalText = button.textContent || "Copy";

  try {
    const code = decodeURIComponent(encodedCode);
    await navigator.clipboard.writeText(code);

    button.textContent = "Copied";
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1200);
  } catch (error) {
    console.error("Failed to copy code:", error);

    button.textContent = "Failed";

    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1200);
  }
}

init();
