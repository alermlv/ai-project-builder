import { getState } from "./state.js";
import { renderEntryGoal } from "./screens/entry-goal.js";
import { renderCurrentStep } from "./screens/current-step.js";
import { renderProjectMap } from "./screens/project-map.js";

export function renderRoute() {
  const app = document.getElementById("app");
  const { route } = getState();

  if (route === "entry-goal") {
    app.innerHTML = renderEntryGoal();
  }

  if (route === "current-step") {
    app.innerHTML = renderCurrentStep();
  }

  if (route === "project-map") {
    app.innerHTML = renderProjectMap();
  }
}
