import { generateId } from "../utils/ids.js";
import { createStarterPlanBlueprint } from "./plan-blueprint.js";

export function createProjectFromRecommendation({ entry, recommendation }) {
  const steps = createStarterPlanBlueprint();

  return {
    id: generateId("project"),
    title: recommendation?.title || entry.goal || "New AI Project",
    goal: entry.goal || "",
    level: entry.level || "",
    scope: entry.scope || "",
    summary: recommendation?.summary || "",
    stack: recommendation?.stack || ["HTML", "CSS", "JavaScript"],
    skills: recommendation?.skills || [],
    estimatedSize: recommendation?.estimatedSize || entry.scope || "MVP",
    recommendationSource: recommendation?.source || "unknown",
    isFallbackRecommendation: Boolean(recommendation?.isFallback),
    status: "active",
    currentStepId: steps[0]?.id || null,
    steps,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
