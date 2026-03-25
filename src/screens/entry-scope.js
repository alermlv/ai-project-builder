import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { requestProjectRecommendation } from "../services/ai.js";
import { buildFallbackRecommendation } from "../services/recommendation-fallback.js";

const DEMO_SCOPE = "small";

const SCOPE_OPTIONS = [
  { value: "small", label: "Small project", isEnabled: true },
  { value: "medium", label: "Medium project", isEnabled: false },
  { value: "large", label: "Large project", isEnabled: false },
];

export function renderEntryScope() {
  const { ui } = getState();
  const error = ui?.errors?.scope || "";
  const isLoading = ui?.isLoading;

  const optionsHtml = SCOPE_OPTIONS.map((option) => {
    const isSelected = option.value === DEMO_SCOPE;
    const isDisabled = !option.isEnabled;

    return `
      <button
        class="option-card ${isSelected ? "is-selected" : ""} ${isDisabled ? "is-disabled" : ""}"
        data-scope="${option.value}"
        type="button"
        ${isLoading || isDisabled ? "disabled" : ""}
      >
        ${option.label}
      </button>
    `;
  }).join("");

  return `
    <div class="screen">
      <h1>What project size do you want?</h1>

      <div class="card notice-card">
        <p><strong>Note:</strong> The demo is currently locked to a small project. Press the Get recommendation button.</p>
      </div>

      <div class="option-list">
        ${optionsHtml}
      </div>

      ${error ? `<p class="error-text">${error}</p>` : ""}

      <div class="button-row">
        <button class="secondary-button" data-back="entry-level" ${isLoading ? "disabled" : ""}>
          Back
        </button>
        <button id="scopeContinueBtn" ${isLoading ? "disabled" : ""}>
          ${isLoading ? "Getting recommendation..." : "Get recommendation"}
        </button>
      </div>
    </div>
  `;
}

document.addEventListener("click", async (e) => {
  const scope = e.target.dataset.scope;

  if (scope === DEMO_SCOPE) {
    commitState((state) => ({
      ...state,
      entry: {
        ...state.entry,
        scope: DEMO_SCOPE,
      },
      ui: {
        ...state.ui,
        errors: {
          ...state.ui.errors,
          scope: "",
        },
      },
    }));
    return;
  }

  if (e.target.id !== "scopeContinueBtn") {
    return;
  }

  const { entry, ui } = getState();

  if (ui.isLoading) {
    return;
  }

  commitState((state) => ({
    ...state,
    entry: {
      ...state.entry,
      scope: DEMO_SCOPE,
    },
    ui: {
      ...state.ui,
      isLoading: true,
      errors: {},
      notice: "",
    },
  }));

  try {
    const recommendation = await requestProjectRecommendation({
      goal: entry.goal || "Build a simple counter",
      level: entry.level || "beginner",
      scope: DEMO_SCOPE,
    });

    commitState((state) => ({
      ...state,
      entry: {
        ...state.entry,
        scope: DEMO_SCOPE,
      },
      recommendation,
      route: ROUTES.RECOMMENDATION,
      ui: {
        ...state.ui,
        isLoading: false,
        errors: {},
        notice: "",
      },
    }));
  } catch (error) {
    const fallbackRecommendation = buildFallbackRecommendation({
      goal: entry.goal || "Build a simple counter",
      level: entry.level || "beginner",
      scope: DEMO_SCOPE,
    });

    commitState((state) => ({
      ...state,
      entry: {
        ...state.entry,
        scope: DEMO_SCOPE,
      },
      recommendation: fallbackRecommendation,
      route: ROUTES.RECOMMENDATION,
      ui: {
        ...state.ui,
        isLoading: false,
        errors: {},
        notice:
          error.message ||
          "Server recommendation failed, so fallback data was used.",
      },
    }));
  }
});
