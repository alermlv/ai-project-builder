import { API_BASE_URL } from "../config.js";

export async function requestProjectRecommendation({ goal, level, scope }) {
  const payload = await postJson("/api/recommend-project", {
    goal,
    level,
    scope,
  });

  if (!payload.data) {
    throw new Error("Recommendation data is missing in the server response.");
  }

  return {
    ...payload.data,
    source: "server",
    isFallback: false,
    fallbackReason: "",
  };
}

export async function requestProjectPlan({ entry, recommendation }) {
  const payload = await postJson("/api/generate-plan", {
    entry,
    recommendation,
  });

  if (!payload.data) {
    throw new Error("Project plan data is missing in the server response.");
  }

  return payload.data;
}

export async function requestStepIntent({ message, context }) {
  const payload = await postJson("/api/step-intent", {
    message,
    context,
  });

  if (!payload.data) {
    throw new Error("AI reply data is missing.");
  }

  return payload.data;
}

async function postJson(path, body) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(getNetworkErrorMessage(path));
  }

  let payload;

  try {
    payload = await response.json();
  } catch (error) {
    throw new Error("Server returned an invalid JSON response.");
  }

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

function getNetworkErrorMessage(path) {
  if (path === "/api/recommend-project") {
    return "Could not connect to the recommendation server.";
  }

  if (path === "/api/generate-plan") {
    return "Could not connect to the plan generation server.";
  }

  if (path === "/api/step-intent") {
    return "Could not connect to the AI help server.";
  }

  return "Could not connect to the server.";
}
