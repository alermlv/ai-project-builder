import { getState } from "../state.js";

export function renderProjectMap() {
  const { project } = getState();

  if (!project) {
    return `
      <div class="screen">
        <h1>Project Map</h1>

        <div class="card">
          <p>No project created yet.</p>
        </div>

        <button data-nav="entry-goal">Go to Entry</button>
      </div>
    `;
  }

  const stepsHtml = project.steps
    .map(
      (step, index) => `
        <div class="card">
          <p><strong>Step ${index + 1}:</strong> ${step.title}</p>
          <p>Status: ${step.status}</p>
          <p>${step.description}</p>
        </div>
      `,
    )
    .join("");

  return `
    <div class="screen">
      <h1>Project Map</h1>

      ${stepsHtml}

      <button data-nav="current-step">Back to Current Step</button>
    </div>
  `;
}
