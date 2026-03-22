import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";

export function renderEntryGoal() {
  const { entry, ui } = getState();
  const error = ui?.errors?.goal || "";

  return `
    <div class="screen">
      <h1>What do you want to learn?</h1>

      <div class="card">
        <p>Describe the kind of project you want AI to guide you through.</p>
      </div>

      <input
        id="goalInput"
        placeholder="e.g. Build a SaaS landing page"
        value="${escapeHtml(entry.goal || "")}"
      />

      ${error ? `<p class="error-text">${error}</p>` : ""}

      <button id="goalContinueBtn">Continue</button>
    </div>
  `;
}

document.addEventListener("click", (e) => {
  if (e.target.id !== "goalContinueBtn") {
    return;
  }

  const input = document.getElementById("goalInput");
  const goal = input?.value?.trim() || "";

  if (!goal) {
    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        errors: {
          ...state.ui.errors,
          goal: "Please enter what you want to learn.",
        },
      },
    }));
    return;
  }

  commitState((state) => ({
    ...state,
    entry: {
      ...state.entry,
      goal,
    },
    route: ROUTES.ENTRY_LEVEL,
    ui: {
      ...state.ui,
      errors: {},
    },
  }));
});

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
