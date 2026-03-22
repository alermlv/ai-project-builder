import { getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { escapeHtml, formatLabel } from "../utils/formatters.js";
import { renderAppHeader } from "../components/app-header.js";

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

  const steps = Array.isArray(project.steps) ? project.steps : [];

  const stepsHtml = steps
    .map((step, index) => {
      const isCurrent = step.id === project.currentStepId;

      return `
        <div class="card ${isCurrent ? "card--current-step" : ""}">
          <div class="meta-row">
            <span class="badge badge-neutral">Step ${index + 1}</span>
            <span class="badge ${isCurrent ? "badge-current" : "badge-status"}">
              ${escapeHtml(formatLabel(step.status || "planned"))}
            </span>
          </div>

          <p><strong>${escapeHtml(step.title)}</strong></p>
          <p>${escapeHtml(step.summary || "-")}</p>
          <p><strong>Tasks:</strong> ${(step.tasks || []).length}</p>

          ${
            isCurrent
              ? `<button data-nav="${ROUTES.CURRENT_STEP}">Return to current step</button>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  return `
    <div class="screen screen--with-fixed-header">
      ${renderAppHeader({
        title: project.title,
        subtitle: "Project map",
        rightActionLabel: "Back",
        rightActionRoute: ROUTES.CURRENT_STEP,
      })}

      <div class="screen-body">
        <div class="card">
          <p><strong>Project:</strong> ${escapeHtml(project.title)}</p>
          <p><strong>Estimated size:</strong> ${escapeHtml(project.estimatedSize || "-")}</p>
          <p><strong>Total steps:</strong> ${steps.length}</p>
        </div>

        ${stepsHtml}
      </div>
    </div>
  `;
}
