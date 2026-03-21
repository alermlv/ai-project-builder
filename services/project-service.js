import { generateId } from "../utils/ids.js";

export function createTask(title) {
  return {
    id: generateId("task"),
    title,
    status: "planned",
  };
}

export function createStep({
  title,
  description,
  tasks = [],
  status = "planned",
}) {
  return {
    id: generateId("step"),
    title,
    description,
    status,
    tasks,
  };
}

export function createProject({ goal }) {
  const step1 = createStep({
    title: "Set up the project foundation",
    description: "Create the initial structure, layout, and app shell.",
    status: "current",
    tasks: [
      createTask("Create the base file structure"),
      createTask("Set up index.html, styles.css, and app.js"),
      createTask("Create simple routing between screens"),
    ],
  });

  const step2 = createStep({
    title: "Add local state and persistence",
    description: "Introduce a stable app state and save it locally.",
    status: "planned",
    tasks: [
      createTask("Define the app data model"),
      createTask("Save state to localStorage"),
      createTask("Restore state on reload"),
    ],
  });

  const step3 = createStep({
    title: "Build the main execution screen",
    description: "Show the current step and let users move forward.",
    status: "planned",
    tasks: [
      createTask("Render the current step"),
      createTask("Display tasks"),
      createTask("Prepare task completion logic"),
    ],
  });

  return {
    id: generateId("project"),
    title: goal || "New AI Project",
    goal: goal || "",
    stack: ["HTML", "CSS", "JavaScript"],
    skills: ["UI structure", "state management", "local persistence"],
    estimatedSize: "MVP",
    status: "active",
    currentStepId: step1.id,
    steps: [step1, step2, step3],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
