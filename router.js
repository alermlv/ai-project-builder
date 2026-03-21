import { getState } from "./state.js";
import { renderEntryGoal } from "./screens/entry-goal.js";
import { renderCurrentStep } from "./screens/current-step.js";
import { renderProjectMap } from "./screens/project-map.js";

export function renderRoute() {
  const app = document.getElementById("app");
  const { route } = getState();

  if (!app) {
    return;
  }

  switch (route) {
    case "entry-goal":
      app.innerHTML = renderEntryGoal();
      break;

    case "current-step":
      app.innerHTML = renderCurrentStep();
      break;

    case "project-map":
      app.innerHTML = renderProjectMap();
      break;

    default:
      app.innerHTML = renderEntryGoal();
      break;
  }
}
