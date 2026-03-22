import { getState } from "./state.js";
import { ROUTES } from "./utils/routes.js";
import { renderEntryGoal } from "./screens/entry-goal.js";
import { renderEntryLevel } from "./screens/entry-level.js";
import { renderEntryScope } from "./screens/entry-scope.js";
import { renderCurrentStep } from "./screens/current-step.js";
import { renderProjectMap } from "./screens/project-map.js";

const routeRenderers = {
  [ROUTES.ENTRY_GOAL]: renderEntryGoal,
  [ROUTES.ENTRY_LEVEL]: renderEntryLevel,
  [ROUTES.ENTRY_SCOPE]: renderEntryScope,
  [ROUTES.CURRENT_STEP]: renderCurrentStep,
  [ROUTES.PROJECT_MAP]: renderProjectMap,
};

export function renderRoute() {
  const app = document.getElementById("app");
  const { route } = getState();

  if (!app) {
    return;
  }

  const renderScreen = routeRenderers[route] || renderEntryGoal;
  app.innerHTML = renderScreen();
}
