import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";

const DEMO_GOAL = "Build a simple counter";

export function renderEntryGoal() {
  const { ui } = getState();
  const error = ui?.errors?.goal || "";

  return `
    <div class="screen">
      <h1>What do you want to learn?</h1>

      <div class="card">
        <p>This is a demo version of the app.</p>
        <p>Only the demo counter project is available right now.</p>
        <p>In this demo, only step_5 and step_6 are active guided steps.</p>
      </div>

      <div class="card">
        <p>Demo goal</p>
        <input
          id="goalInput"
          value="${escapeHtml(DEMO_GOAL)}"
          disabled
          readonly
        />
      </div>

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
