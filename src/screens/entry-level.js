import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export function renderEntryLevel() {
  const { entry, ui } = getState();
  const error = ui?.errors?.level || "";

  const optionsHtml = LEVEL_OPTIONS.map((option) => {
    const isSelected = entry.level === option.value;

    return `
      <button
        class="option-card ${isSelected ? "is-selected" : ""}"
        data-level="${option.value}"
        type="button"
      >
        ${option.label}
      </button>
    `;
  }).join("");

  return `
    <div class="screen">
      <h1>What is your current level?</h1>

      <div class="card">
        <p>Pick the level that best matches your current confidence.</p>
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

  if (level) {
    commitState((state) => ({
      ...state,
      entry: {
        ...state.entry,
        level,
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

  const { entry } = getState();

  if (!entry.level) {
    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        errors: {
          ...state.ui.errors,
          level: "Please choose your level.",
        },
      },
    }));
    return;
  }

  commitState((state) => ({
    ...state,
    route: ROUTES.ENTRY_SCOPE,
    ui: {
      ...state.ui,
      errors: {},
    },
  }));
});
