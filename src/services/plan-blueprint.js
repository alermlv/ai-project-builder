function createFileArtifact(path, language, code) {
  return {
    path,
    language,
    code,
  };
}

function createTask({
  id,
  title,
  status = "planned",
  explanation,
  purpose,
  definitionOfDone,
  expectedResult,
  commonMistakes = [],
  files = [],
  terminal = [],
}) {
  return {
    id,
    title,
    status,
    explanation,
    purpose,
    definitionOfDone,
    expectedResult,
    commonMistakes,
    files,
    terminal,
  };
}

function createStep({
  id,
  title,
  status = "planned",
  summary,
  whyItMatters,
  tasks = [],
  verificationSteps = [],
  outcomeSummary,
  commitMessage,
}) {
  return {
    id,
    title,
    status,
    summary,
    whyItMatters,
    tasks,
    verificationSteps,
    outcomeSummary,
    commitMessage,
  };
}

export function createStarterPlanBlueprint() {
  const step1 = createStep({
    id: "step_day_1",
    title: "Day 1 — Bootstrap the project shell",
    status: "current",
    summary:
      "Create the initial file structure, wire the app entry point, and make the first screens render through a central router.",
    whyItMatters:
      "This step creates the skeleton of the app. Without a stable shell, every next feature becomes messier and harder to debug.",
    tasks: [
      createTask({
        id: "task_day_1_structure",
        title: "Create the base file structure",
        status: "current",
        explanation:
          "Create the minimal folders and files that define the frontend app shape. The goal is not to fill them all immediately, but to lock the architecture early.",
        purpose:
          "This prevents chaotic growth and makes future steps predictable.",
        definitionOfDone:
          "All required files and folders exist and the project opens without missing imports.",
        expectedResult:
          "You have a clear /src structure with screens, services, and utils.",
        commonMistakes: [
          "Creating files ad hoc only when needed",
          "Mixing screen files with service files in one folder",
          "Not using a consistent file naming style",
        ],
        files: [
          createFileArtifact(
            "/src structure",
            "text",
            `/src
  index.html
  styles.css
  app.js
  state.js
  storage.js
  router.js
  config.js

  /screens
    entry-goal.js
    entry-level.js
    entry-scope.js
    recommendation.js
    current-step.js
    project-map.js

  /services
    ai.js
    project-service.js

  /utils
    ids.js
    routes.js`,
          ),
        ],
      }),
      createTask({
        id: "task_day_1_html",
        title: "Set up index.html as the app entry point",
        status: "planned",
        explanation:
          "Create a single app root and load the frontend from app.js using type=module.",
        purpose:
          "This gives the browser one predictable mount point and lets your JavaScript own screen rendering.",
        definitionOfDone:
          "The page loads in the browser and the script is executed without console errors.",
        expectedResult:
          "There is one #app container ready for route rendering.",
        commonMistakes: [
          "Forgetting type=module",
          "Not including the viewport meta tag",
          "Rendering directly into body instead of a dedicated root node",
        ],
        files: [
          createFileArtifact(
            "src/index.html",
            "html",
            `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Project Builder</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./app.js"></script>
</body>
</html>`,
          ),
        ],
      }),
      createTask({
        id: "task_day_1_app",
        title: "Wire app.js to render the current route",
        status: "planned",
        explanation:
          "Initialize the app, hydrate state, set up global click handling, and render the current screen.",
        purpose:
          "This becomes the top-level coordinator of your app lifecycle.",
        definitionOfDone:
          "Opening the app renders a screen and route changes update the UI.",
        expectedResult:
          "The app behaves like one state-driven interface instead of disconnected pages.",
        commonMistakes: [
          "Putting too much screen logic directly into app.js",
          "Not clearing UI errors when moving between screens",
          "Creating per-button listeners instead of event delegation",
        ],
        files: [
          createFileArtifact(
            "src/app.js",
            "javascript",
            `import { renderRoute } from "./router.js";
import {
  getState,
  setState,
  createInitialState,
  registerStateListener,
  commitState
} from "./state.js";
import { loadAppState, saveAppState } from "./storage.js";
import { ROUTES } from "./utils/routes.js";

function init() {
  registerStateListener(handleStateChange);
  hydrateAppState();
  renderRoute();
  setupGlobalEvents();
}

function hydrateAppState() {
  const savedState = loadAppState();

  if (savedState) {
    setState({
      ...savedState,
      entry: {
        goal: "",
        level: "",
        scope: "",
        ...(savedState.entry || {})
      },
      recommendation: savedState.recommendation || null,
      project: savedState.project || null,
      ui: {
        isHydrated: true,
        isLoading: false,
        errors: {},
        notice: "",
        ...(savedState.ui || {})
      }
    });
    return;
  }

  const initialState = createInitialState();

  setState({
    ...initialState,
    ui: {
      ...initialState.ui,
      isHydrated: true
    }
  });

  saveAppState(getState());
}

function handleStateChange(nextState) {
  saveAppState(nextState);
  renderRoute();
}

function setupGlobalEvents() {
  document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.dataset.nav) {
      const route = target.dataset.nav;

      commitState((state) => ({
        ...state,
        route,
        ui: {
          ...state.ui,
          errors: {},
          notice: ""
        }
      }));
    }

    if (target.dataset.back === "entry-goal") {
      commitState((state) => ({
        ...state,
        route: ROUTES.ENTRY_GOAL,
        ui: {
          ...state.ui,
          errors: {},
          notice: ""
        }
      }));
    }

    if (target.dataset.back === "entry-level") {
      commitState((state) => ({
        ...state,
        route: ROUTES.ENTRY_LEVEL,
        ui: {
          ...state.ui,
          errors: {},
          notice: ""
        }
      }));
    }

    if (target.dataset.back === "entry-scope") {
      commitState((state) => ({
        ...state,
        route: ROUTES.ENTRY_SCOPE,
        ui: {
          ...state.ui,
          errors: {},
          notice: ""
        }
      }));
    }

    if (target.dataset.back === "recommendation") {
      commitState((state) => ({
        ...state,
        route: ROUTES.RECOMMENDATION,
        ui: {
          ...state.ui,
          errors: {},
          notice: ""
        }
      }));
    }
  });
}

init();`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Open the app and confirm the first screen renders.",
      "Navigate between the available screens and confirm rendering changes.",
      "Refresh the page and confirm the app does not crash.",
    ],
    outcomeSummary:
      "You now have a stable frontend shell with a central entry point and predictable routing flow.",
    commitMessage: `feat(app): bootstrap project shell with central routing and screen scaffolding

Create the initial frontend file structure, wire index.html and app.js,
and establish route-based rendering for the core MVP screens.

This lays down the app shell that later steps will build on for state,
recommendations, and execution flow.`,
  });

  const step2 = createStep({
    id: "step_day_2",
    title: "Day 2 — Add app state and persistence",
    status: "planned",
    summary:
      "Introduce the app state model, localStorage hydration, and a stable project object.",
    whyItMatters:
      "Without persistence, the user loses progress. Without a shared state, the UI becomes fragile.",
    tasks: [
      createTask({
        id: "task_day_2_state",
        title: "Define the shared app state shape",
        explanation:
          "Create a single source of truth for route, entry data, recommendation, project, and UI state.",
        purpose: "This keeps the app predictable and makes re-rendering cheap.",
        definitionOfDone:
          "State contains all top-level keys needed by the current UI flow.",
        expectedResult:
          "Screens read from one shared state object instead of duplicating local assumptions.",
        commonMistakes: [
          "Letting individual screens invent their own state shape",
          "Not including UI state for errors or loading",
        ],
        files: [
          createFileArtifact(
            "src/state.js",
            "javascript",
            `let state = createInitialState();
let onStateChange = null;

export function createInitialState() {
  return {
    route: "entry-goal",
    entry: {
      goal: "",
      level: "",
      scope: ""
    },
    recommendation: null,
    project: null,
    ui: {
      isHydrated: false,
      isLoading: false,
      errors: {},
      notice: ""
    }
  };
}

export function getState() {
  return state;
}

export function setState(nextState) {
  state = nextState;
}

export function updateState(updater) {
  state = updater(state);
}

export function registerStateListener(listener) {
  onStateChange = listener;
}

export function commitState(updater) {
  updateState(updater);

  if (onStateChange) {
    onStateChange(state);
  }
}`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Create a project and refresh the browser.",
      "Confirm entry data and current route are still available.",
      "Confirm no localStorage parsing error appears in the console.",
    ],
    outcomeSummary:
      "The app now survives refreshes and has a stable state contract for the rest of the MVP.",
    commitMessage: `feat(state): add shared app state and localStorage persistence

Define the core state model for entry, recommendation, project, and UI,
then hydrate and persist it with localStorage.

This gives the MVP a stable foundation for restoring progress across
reloads and keeps rendering state-driven.`,
  });

  const step3 = createStep({
    id: "step_day_3",
    title: "Day 3 — Build the multi-step entry flow",
    status: "planned",
    summary:
      "Split onboarding into goal, level, and scope screens with validation and back navigation.",
    whyItMatters:
      "The product starts with structured input. This creates better recommendations and a more guided user flow.",
    tasks: [
      createTask({
        id: "task_day_3_routes",
        title: "Add route constants and screen switching",
        explanation:
          "Move route names into constants and render screens through a route map.",
        purpose:
          "This prevents route string drift and keeps screen selection centralized.",
        definitionOfDone:
          "Every screen route is defined once and used consistently.",
        expectedResult: "Navigation becomes cleaner and easier to extend.",
        commonMistakes: [
          "Hardcoding route strings in multiple files",
          "Using different route spellings in different screens",
        ],
        files: [],
      }),
    ],
    verificationSteps: [
      "Go through goal → level → scope.",
      "Use Back buttons and confirm data is still there.",
      "Trigger validation and confirm the error message is visible.",
    ],
    outcomeSummary:
      "The app now has a structured onboarding flow instead of a single loose input screen.",
    commitMessage: `feat(entry): add multi-step onboarding flow with route constants

Split onboarding into goal, level, and scope screens with validation,
back navigation, and centralized route constants.

This makes the input flow more structured and prepares the app for
recommendation and confirmation steps.`,
  });

  return [step1, step2, step3];
}
