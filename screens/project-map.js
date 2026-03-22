import { getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";

export function renderProjectMap() {
  const { project } = getState();

  if (!project) {
    return `
      <div class="screen">
        <h1>Project Map</h1>

        <div class="card">
          <p>No project created yet.</p>
        </div>

        <button data-nav="${ROUTES.ENTRY_GOAL}">Go to Entry</button>
      </div>
    `;
  }

  const stepsHtml = project.steps
    .map(
      (step, index) => `
        <div class="card">
          <p><strong>Step ${index + 1}:</strong> ${escapeHtml(step.title)}</p>
          <p><strong>Status:</strong> ${escapeHtml(step.status)}</p>
          <p>${escapeHtml(step.description)}</p>
        </div>
      `,
    )
    .join("");

  return `
    <div class="screen">
      <h1>Project Map</h1>

      <div class="card">
        <p><strong>Project:</strong> ${escapeHtml(project.title)}</p>
      </div>

      ${stepsHtml}

      <button data-nav="${ROUTES.CURRENT_STEP}">Back to Current Step</button>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
