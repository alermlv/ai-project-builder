export async function requestProjectRecommendation({ goal, level, scope }) {
  let response;

  try {
    response = await fetch("http://localhost:3000/api/recommend-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal,
        level,
        scope,
      }),
    });
  } catch (error) {
    throw new Error("Could not connect to the recommendation server.");
  }

  let payload;

  try {
    payload = await response.json();
  } catch (error) {
    throw new Error("Server returned an invalid JSON response.");
  }

  if (!response.ok) {
    throw new Error(
      payload.error || "Failed to get recommendation from server.",
    );
  }

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
  let response;

  try {
    response = await fetch("http://localhost:3000/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry,
        recommendation,
      }),
    });
  } catch (error) {
    throw new Error("Could not connect to the plan generation server.");
  }

  let payload;

  try {
    payload = await response.json();
  } catch (error) {
    throw new Error("Server returned an invalid JSON plan response.");
  }

  if (!response.ok) {
    throw new Error(payload.error || "Failed to generate project plan.");
  }

  if (!payload.data) {
    throw new Error("Project plan data is missing in the server response.");
  }

  return payload.data;
}

export async function requestStepIntent({ message, context }) {
  let response;

  try {
    response = await fetch("http://localhost:3000/api/step-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        context,
      }),
    });
  } catch (error) {
    throw new Error("Could not connect to the AI help server.");
  }

  let payload;

  try {
    payload = await response.json();
  } catch (error) {
    throw new Error("Server returned an invalid AI reply.");
  }

  if (!response.ok) {
    throw new Error(payload.error || "Failed to get AI help.");
  }

  if (!payload.data) {
    throw new Error("AI reply data is missing.");
  }

  return payload.data;
}
