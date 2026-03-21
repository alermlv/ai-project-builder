import { commitState } from "../state.js";
import { createProject } from "../services/project-service.js";

export function renderEntryGoal() {
  return `
    <div class="screen">
      <h1>What do you want to learn?</h1>

      <div class="card">
        <p>Describe the kind of project you want AI to guide you through.</p>
      </div>

      <input
        id="goalInput"
        placeholder="e.g. Build a SaaS landing page"
      />

      <button id="continueBtn">Create starter project</button>
    </div>
  `;
}

document.addEventListener("click", (e) => {
  if (e.target.id !== "continueBtn") {
    return;
  }

  const input = document.getElementById("goalInput");
  const goal = input?.value?.trim() || "";

  const project = createProject({ goal });

  commitState((state) => ({
    ...state,
    entry: {
      ...state.entry,
      goal,
    },
    project,
    route: "current-step",
  }));
});
