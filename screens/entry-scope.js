import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { createProject } from "../services/project-service.js";

const SCOPE_OPTIONS = [
  { value: "small", label: "Small project" },
  { value: "medium", label: "Medium project" },
  { value: "large", label: "Large project" },
];

export function renderEntryScope() {
  const { entry, ui } = getState();
  const error = ui?.errors?.scope || "";

  const optionsHtml = SCOPE_OPTIONS.map((option) => {
    const isSelected = entry.scope === option.value;

    return `
      <button
        class="option-card ${isSelected ? "is-selected" : ""}"
        data-scope="${option.value}"
        type="button"
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
        <button class="secondary-button" data-back="entry-level">Back</button>
        <button id="scopeContinueBtn">Continue</button>
      </div>
    </div>
  `;
}

document.addEventListener("click", (e) => {
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

  const { entry } = getState();

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

  const project = createProject({
    goal: entry.goal,
    level: entry.level,
    scope: entry.scope,
  });

  commitState((state) => ({
    ...state,
    project,
    route: ROUTES.CURRENT_STEP,
    ui: {
      ...state.ui,
      errors: {},
    },
  }));
});
