export function buildFallbackRecommendation({ goal, level, scope }) {
  const safeGoal = (goal || "").trim() || "Practical Web App";

  return {
    title: buildFallbackTitle(safeGoal, scope),
    summary: buildFallbackSummary({ goal: safeGoal, level, scope }),
    stack: buildFallbackStack(level),
    skills: buildFallbackSkills(goal, level),
    estimatedSize: buildFallbackSize(scope),
    source: "fallback",
    isFallback: true,
    fallbackReason:
      "Server recommendation was unavailable, so a local fallback was used.",
  };
}

function buildFallbackTitle(goal, scope) {
  const normalizedGoal = capitalizeFirstLetter(goal);

  if (scope === "small") {
    return `${normalizedGoal} Starter Project`;
  }

  if (scope === "large") {
    return `${normalizedGoal} Guided Build`;
  }

  return `${normalizedGoal} MVP Project`;
}

function buildFallbackSummary({ goal, level, scope }) {
  const safeLevel = level || "general";
  const safeScope = scope || "medium";

  return `This is a fallback recommendation for a ${safeScope} project based on your goal: ${goal}. It is shaped for a ${safeLevel} builder and keeps the scope realistic enough to start immediately.`;
}

function buildFallbackStack(level) {
  const base = ["HTML", "CSS", "JavaScript"];

  if (level === "intermediate" || level === "advanced") {
    return [...base, "localStorage"];
  }

  return base;
}

function buildFallbackSkills(goal, level) {
  const skills = [
    "screen structure",
    "UI implementation",
    "step-by-step delivery",
  ];

  if ((goal || "").toLowerCase().includes("landing")) {
    skills.push("page composition");
  }

  if ((goal || "").toLowerCase().includes("dashboard")) {
    skills.push("data layout");
  }

  if (level === "beginner") {
    skills.push("basic DOM interactions");
  }

  if (level === "advanced") {
    skills.push("feature planning");
  }

  return skills;
}

function buildFallbackSize(scope) {
  if (scope === "small") {
    return "1–2 screens";
  }

  if (scope === "large") {
    return "4–6 screens";
  }

  return "2–4 screens";
}

function capitalizeFirstLetter(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
