import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { requestProjectRecommendation } from "../services/ai.js";

const SCOPE_OPTIONS = [
  { value: "small", label: "Small project" },
  { value: "medium", label: "Medium project" },
  { value: "large", label: "Large project" },
];

export function renderEntryScope() {
  const { entry, ui } = getState();
  const error = ui?.errors?.scope || "";
  const isLoading = ui?.isLoading;

  const optionsHtml = SCOPE_OPTIONS.map((option) => {
    const isSelected = entry.scope === option.value;

    return `
      <button
        class="option-card ${isSelected ? "is-selected" : ""}"
        data-scope="${option.value}"
        type="button"
        ${isLoading ? "disabled" : ""}
      >
        ${option.label}
      </button>
    `;
  }).join("");

  return `
    <div class="screen">
      <h1>What project size do you want?</h1>

      <div class="card">
        <p>Choose the scope so AI can suggest the right project size.</p>
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

  if (scope) {
    commitState((state) => ({
      ...state,
      entry: {
        ...state.entry,
        scope,
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

  if (!entry.scope) {
    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        errors: {
          ...state.ui.errors,
          scope: "Please choose a project size.",
        },
      },
    }));
    return;
  }

  commitState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      isLoading: true,
      errors: {},
    },
  }));

  try {
    const recommendation = await requestProjectRecommendation({
      goal: entry.goal,
      level: entry.level,
      scope: entry.scope,
    });

    commitState((state) => ({
      ...state,
      recommendation,
      route: ROUTES.RECOMMENDATION,
      ui: {
        ...state.ui,
        isLoading: false,
        errors: {},
      },
    }));
  } catch (error) {
    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        isLoading: false,
        errors: {
          ...state.ui.errors,
          scope: error.message || "Failed to get recommendation from server.",
        },
      },
    }));
  }
});
