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
        isMenuOpen: false,
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
  document.addEventListener("click", async (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.copyCode) {
      await handleCopyCode(target);
      return;
    }

    if (target.dataset.openMenu === "true") {
      openMenu();
      return;
    }

    if (target.dataset.closeMenu === "true") {
      closeMenu();
      return;
    }

    if (target.dataset.nav) {
      navigateTo(target.dataset.nav);
      return;
    }

    if (target.dataset.back === "entry-goal") {
      navigateTo(ROUTES.ENTRY_GOAL);
      return;
    }

    if (target.dataset.back === "entry-level") {
      navigateTo(ROUTES.ENTRY_LEVEL);
      return;
    }

    if (target.dataset.back === "entry-scope") {
      navigateTo(ROUTES.ENTRY_SCOPE);
      return;
    }

    if (target.dataset.back === "recommendation") {
      navigateTo(ROUTES.RECOMMENDATION);
    }
  });
}

function navigateTo(route) {
  commitState((state) => ({
    ...state,
    route,
    ui: {
      ...state.ui,
      errors: {},
      notice: "",
      isMenuOpen: false,
    },
  }));
}

function openMenu() {
  commitState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      isMenuOpen: true,
    },
  }));
}

function closeMenu() {
  commitState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      isMenuOpen: false,
    },
  }));
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
