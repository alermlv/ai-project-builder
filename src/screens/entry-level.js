import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";

const DEMO_LEVEL = "beginner";

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner", isEnabled: true },
  { value: "intermediate", label: "Intermediate", isEnabled: false },
  { value: "advanced", label: "Advanced", isEnabled: false },
];

export function renderEntryLevel() {
  const { ui } = getState();
  const error = ui?.errors?.level || "";

  const optionsHtml = LEVEL_OPTIONS.map((option) => {
    const isSelected = option.value === DEMO_LEVEL;
    const isDisabled = !option.isEnabled;

    return `
      <button
        class="option-card ${isSelected ? "is-selected" : ""} ${isDisabled ? "is-disabled" : ""}"
        data-level="${option.value}"
        type="button"
        ${isDisabled ? "disabled" : ""}
      >
        ${option.label}
      </button>
    `;
  }).join("");

  return `
    <div class="screen">
      <h1>What is your current level?</h1>

      <div class="card notice-card">
        <p><strong>Note:</strong> The demo is currently locked to a beginner path.</p>
      </div>

      <div class="option-list">
        ${optionsHtml}
      </div>

      ${error ? `<p class="error-text">${error}</p>` : ""}

      <div class="button-row">
        <button class="secondary-button" data-back="entry-goal">Back</button>
        <button id="levelContinueBtn">Continue</button>
      </div>
    </div>
  `;
}

document.addEventListener("click", (e) => {
  const level = e.target.dataset.level;

  if (level === DEMO_LEVEL) {
    commitState((state) => ({
      ...state,
      entry: {
        ...state.entry,
        level: DEMO_LEVEL,
      },
      ui: {
        ...state.ui,
        errors: {
          ...state.ui.errors,
          level: "",
        },
      },
    }));
    return;
  }

  if (e.target.id !== "levelContinueBtn") {
    return;
  }

  commitState((state) => ({
    ...state,
    entry: {
      ...state.entry,
      level: DEMO_LEVEL,
    },
    route: ROUTES.ENTRY_SCOPE,
    ui: {
      ...state.ui,
      errors: {},
    },
  }));
});
