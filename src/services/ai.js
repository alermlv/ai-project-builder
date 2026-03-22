export async function requestProjectRecommendation({ goal, level, scope }) {
  const response = await fetch("http://localhost:3000/api/recommend-project", {
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

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Failed to get recommendation");
  }

  if (!payload.data) {
    throw new Error("Recommendation data is missing");
  }

  return payload.data;
}
