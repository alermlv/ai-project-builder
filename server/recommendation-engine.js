export function generateProjectRecommendation({ goal, level, scope }) {
  const normalizedGoal = (goal || "").trim();

  const title = buildProjectTitle(normalizedGoal, scope);
  const stack = buildStack(level);
  const skills = buildSkills(normalizedGoal, level);
  const estimatedSize = buildEstimatedSize(scope);
  const summary = buildSummary({ goal: normalizedGoal, level, scope });

  return {
    title,
    summary,
    stack,
    skills,
    estimatedSize,
  };
}

function buildProjectTitle(goal, scope) {
  if (!goal) {
    return "Starter AI Project";
  }

  const capitalizedGoal = goal.charAt(0).toUpperCase() + goal.slice(1);

  if (scope === "small") {
    return `${capitalizedGoal} Mini Project`;
  }

  if (scope === "large") {
    return `${capitalizedGoal} Extended Project`;
  }

  return `${capitalizedGoal} Project`;
}

function buildStack(level) {
  const baseStack = ["HTML", "CSS", "JavaScript"];

  if (level === "advanced") {
    return [...baseStack, "API integration"];
  }

  if (level === "intermediate") {
    return [...baseStack, "localStorage"];
  }

  return baseStack;
}

function buildSkills(goal, level) {
  const baseSkills = ["UI structure", "screen flow", "task-based execution"];

  if (goal.toLowerCase().includes("dashboard")) {
    baseSkills.push("data presentation");
  }

  if (goal.toLowerCase().includes("landing")) {
    baseSkills.push("layout composition");
  }

  if (level === "beginner") {
    baseSkills.push("basic DOM work");
  }

  if (level === "intermediate") {
    baseSkills.push("state organization");
  }

  if (level === "advanced") {
    baseSkills.push("feature design");
  }

  return baseSkills;
}

function buildEstimatedSize(scope) {
  if (scope === "small") {
    return "1–2 focused screens";
  }

  if (scope === "large") {
    return "5+ screens with extended flow";
  }

  return "3–4 screens MVP";
}

function buildSummary({ goal, level, scope }) {
  const safeGoal = goal || "a practical product";

  return `A ${scope || "medium"} ${safeGoal} project tailored for a ${level || "general"} builder. This recommendation is designed to be realistic for your current stage while still giving you a concrete result you can ship.`;
}
