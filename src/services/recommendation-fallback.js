export function buildFallbackRecommendation() {
  return {
    title: "Build a simple counter",
    summary:
      "This is the demo fallback recommendation for the counter project. In demo mode, only step_5 and step_6 are available as active guided steps.",
    stack: ["HTML", "CSS", "JavaScript"],
    skills: [
      "Connect JavaScript to a page",
      "Select DOM elements with getElementById",
      "Add the first click event with addEventListener",
    ],
    estimatedSize: "very small beginner project",
    source: "fallback",
    isFallback: true,
    fallbackReason:
      "Server recommendation was unavailable, so the demo fallback was used.",
  };
}
