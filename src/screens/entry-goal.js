import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";

const DEMO_GOAL = "Build a simple counter";

export function renderEntryGoal() {
  const { ui } = getState();
  const error = ui?.errors?.goal || "";

  return `
    <div class="screen">
      <h1>What do you want to learn?</h1>

      <div class="card notice-card">
        <p><strong>Note:</strong> This is a demo. Press the Continue button.</p>
      </div>

      <input
        id="goalInput"
        class="u-hidden"
        value="${escapeHtml(DEMO_GOAL)}"
        disabled
        readonly
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

  commitState((state) => ({
    ...state,
    entry: {
      ...state.entry,
      goal: DEMO_GOAL,
    },
    route: ROUTES.ENTRY_LEVEL,
    ui: {
      ...state.ui,
      errors: {},
    },
  }));
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
