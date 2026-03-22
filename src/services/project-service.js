import { generateId } from "../utils/ids.js";

export function buildProjectFromServerPlan(serverPlan) {
  return {
    id: generateId("project"),
    title: serverPlan?.title || "New AI Project",
    goal: serverPlan?.goal || "",
    level: serverPlan?.level || "",
    scope: serverPlan?.scope || "",
    summary: serverPlan?.summary || "",
    stack: serverPlan?.stack || ["HTML", "CSS", "JavaScript"],
    skills: serverPlan?.skills || [],
    estimatedSize: serverPlan?.estimatedSize || "MVP",
    recommendationSource: serverPlan?.recommendationSource || "server",
    isFallbackRecommendation: Boolean(serverPlan?.isFallbackRecommendation),
    status: serverPlan?.status || "active",
    currentStepId: serverPlan?.currentStepId || null,
    steps: Array.isArray(serverPlan?.steps) ? serverPlan.steps : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
