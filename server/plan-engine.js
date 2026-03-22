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

export function generateProjectPlan({ entry, recommendation }) {
  const goal = entry?.goal || "New Web App";
  const level = entry?.level || "beginner";
  const scope = entry?.scope || "medium";

  const projectTitle = recommendation?.title || goal;
  const projectSummary =
    recommendation?.summary ||
    `A guided ${scope} web project for a ${level} builder.`;

  const step1 = createStep({
    id: "step_setup_project",
    title: "Set up the project foundation",
    status: "current",
    summary:
      "Create the initial file structure, wire the app entry point, and make the app shell render correctly.",
    whyItMatters:
      "A stable shell makes every later feature easier to add and debug.",
    tasks: [
      createTask({
        id: "task_setup_structure",
        title: "Create the base file structure",
        status: "current",
        explanation:
          "Create the folders and base files that define the shape of the app.",
        purpose:
          "This gives the project a predictable structure before feature work begins.",
        definitionOfDone:
          "All required folders and base files exist in the project.",
        expectedResult:
          "You have a clean frontend structure with screens, services, and utils folders.",
        commonMistakes: [
          "Creating files ad hoc without a plan",
          "Mixing screens and services in one folder",
          "Using inconsistent naming across files",
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
        id: "task_setup_html",
        title: "Create the main HTML entry file",
        explanation:
          "Set up index.html with a single app root and load the main JavaScript module.",
        purpose:
          "The app needs one root container so route-based rendering can work reliably.",
        definitionOfDone:
          "The browser loads index.html and app.js without errors.",
        expectedResult:
          "You have one #app mount point controlled by JavaScript.",
        commonMistakes: [
          "Forgetting type=module on the script tag",
          "Not adding the viewport meta tag",
          "Rendering directly into body instead of a dedicated root",
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
  <title>${projectTitle}</title>
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
        id: "task_setup_app",
        title: "Render the app shell from app.js",
        explanation:
          "Initialize the app, hydrate saved state, and render the current route.",
        purpose: "This creates the main lifecycle entry point for the app.",
        definitionOfDone:
          "Opening the app renders the correct screen and state survives refreshes.",
        expectedResult:
          "The app behaves like one state-driven UI instead of disconnected pages.",
        commonMistakes: [
          "Putting too much screen logic into app.js",
          "Not saving state after changes",
          "Creating brittle event listeners tied to specific DOM nodes",
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

function init() {
  registerStateListener(handleStateChange);
  hydrateAppState();
  renderRoute();
  setupGlobalEvents();
}

function hydrateAppState() {
  const savedState = loadAppState();

  if (savedState) {
    setState(savedState);
    return;
  }

  setState(createInitialState());
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
        route
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
      "Open the app in the browser and confirm the first screen appears.",
      "Refresh the page and confirm the app does not crash.",
      "Navigate between available screens and confirm the UI rerenders.",
    ],
    outcomeSummary:
      "You now have a stable app shell with a predictable structure and a state-driven entry point.",
    commitMessage: `feat(app): bootstrap project shell and state-driven rendering

Create the initial file structure, add the HTML entry point, and wire
the app shell through app.js so screens render from shared state.

This establishes the frontend foundation for the guided MVP flow.`,
  });

  const step2 = createStep({
    id: "step_add_persistence",
    title: "Add shared state and persistence",
    status: "planned",
    summary:
      "Introduce app state, localStorage persistence, and a stable way to restore progress.",
    whyItMatters:
      "Without persistence, the user loses progress every time they refresh or reopen the app.",
    tasks: [
      createTask({
        id: "task_state_shape",
        title: "Define the app state model",
        explanation:
          "Create a top-level state object for route, entry data, recommendation, project, and UI flags.",
        purpose:
          "A shared state model keeps screens consistent and easier to debug.",
        definitionOfDone:
          "The state shape includes all fields needed by the current flow.",
        expectedResult:
          "Every screen can read from one predictable source of truth.",
        commonMistakes: [
          "Letting screens invent their own local state shape",
          "Forgetting UI flags like loading or errors",
        ],
        files: [
          createFileArtifact(
            "src/state.js",
            "javascript",
            `export function createInitialState() {
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
}`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Create a project and refresh the browser.",
      "Confirm entry data still exists after reload.",
      "Confirm the current route and project state restore correctly.",
    ],
    outcomeSummary:
      "The app now restores user progress instead of starting over after each refresh.",
    commitMessage: `feat(state): add shared state model and persistence support

Define the core state contract for entry, recommendation, project, and
UI status so the app can restore progress across reloads.

This creates a stable data foundation for the guided execution flow.`,
  });

  const step3 = createStep({
    id: "step_guided_execution",
    title: "Build the guided execution screen",
    status: "planned",
    summary:
      "Render the current step with structured tasks, file artifacts, verification, and commit guidance.",
    whyItMatters:
      "This turns the product from generic advice into a concrete step-by-step builder experience.",
    tasks: [
      createTask({
        id: "task_execution_screen",
        title: "Render rich task guidance for the current step",
        explanation:
          "Show task title, explanation, purpose, definition of done, expected result, file names, and code blocks.",
        purpose: "The user needs exact next actions, not abstract suggestions.",
        definitionOfDone:
          "The current step screen shows rich guidance for each task.",
        expectedResult:
          "The user can implement the step directly from the screen.",
        commonMistakes: [
          "Showing only a step title without actionable tasks",
          "Not including file names and code artifacts",
          "Skipping verification and commit guidance",
        ],
        files: [
          createFileArtifact(
            "src/screens/current-step.js",
            "javascript",
            `export function renderCurrentStep() {
  return \`
    <div class="screen">
      <h1>Current Step</h1>
      <div class="card">
        <p>Render step summary, task guidance, code blocks, verification, and commit message here.</p>
      </div>
    </div>
  \`;
}`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Open the current step screen.",
      "Confirm task cards, code blocks, and verification items render.",
      "Confirm the commit block can be copied.",
    ],
    outcomeSummary:
      "The product now delivers a true guided execution experience instead of plain instruction text.",
    commitMessage: `feat(step-ui): add guided execution screen with task artifacts

Render the current step as a structured work unit with tasks, file
artifacts, verification steps, and a ready-to-use commit message.

This aligns the UI with the core guided builder product experience.`,
  });

  return {
    title: projectTitle,
    goal,
    level,
    scope,
    summary: projectSummary,
    stack: recommendation?.stack || ["HTML", "CSS", "JavaScript"],
    skills: recommendation?.skills || ["UI structure", "state management"],
    estimatedSize: recommendation?.estimatedSize || scope,
    recommendationSource: recommendation?.source || "server",
    isFallbackRecommendation: Boolean(recommendation?.isFallback),
    status: "active",
    currentStepId: step1.id,
    steps: [step1, step2, step3],
  };
}
