import { updateState } from "../state.js";
import { renderRoute } from "../router.js";

export function renderEntryGoal() {
  return `
    <div class="screen">
      <h1>What do you want to learn?</h1>

      <input id="goalInput" placeholder="e.g. Build a SaaS app" />

      <button id="continueBtn">Continue</button>
    </div>
  `;
}

document.addEventListener("click", (e) => {
  if (e.target.id === "continueBtn") {
    const input = document.getElementById("goalInput");

    updateState((state) => ({
      ...state,
      entry: {
        ...state.entry,
        goal: input.value,
      },
      route: "current-step",
    }));

    renderRoute();
  }
});
