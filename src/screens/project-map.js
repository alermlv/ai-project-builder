import { getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { escapeHtml, formatLabel } from "../utils/formatters.js";

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

  const stepsHtml = (project.steps || [])
    .map((step, index) => {
      const isCurrent = step.id === project.currentStepId;

      return `
        <div class="card">
          <div class="meta-row">
            <span class="badge badge-neutral">Step ${index + 1}</span>
            <span class="badge ${isCurrent ? "badge-current" : "badge-status"}">
              ${escapeHtml(formatLabel(step.status || "planned"))}
            </span>
          </div>

          <p><strong>${escapeHtml(step.title)}</strong></p>
          <p>${escapeHtml(step.summary || "-")}</p>
          <p><strong>Tasks:</strong> ${(step.tasks || []).length}</p>
        </div>
      `;
    })
    .join("");

  return `
    <div class="screen">
      <h1>Project Map</h1>

      <div class="card">
        <p><strong>Project:</strong> ${escapeHtml(project.title)}</p>
        <p><strong>Estimated size:</strong> ${escapeHtml(project.estimatedSize || "-")}</p>
      </div>

      ${stepsHtml}

      <button data-nav="${ROUTES.CURRENT_STEP}">Back to Current Step</button>
    </div>
  `;
}
