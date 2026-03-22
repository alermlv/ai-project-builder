import { getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";

export function renderCurrentStep() {
  const { project } = getState();

  if (!project) {
    return `
      <div class="screen">
        <h1>No project yet</h1>

        <div class="card">
          <p>Create a starter project first.</p>
        </div>

        <button data-nav="${ROUTES.ENTRY_GOAL}">Go to Entry</button>
      </div>
    `;
  }

  const currentStep =
    project.steps.find((step) => step.id === project.currentStepId) || null;

  if (!currentStep) {
    return `
      <div class="screen">
        <h1>${escapeHtml(project.title)}</h1>

        <div class="card">
          <p>No current step found.</p>
        </div>

        <button data-nav="${ROUTES.PROJECT_MAP}">Open Project Map</button>
      </div>
    `;
  }

  const tasksHtml = currentStep.tasks
    .map(
      (task) => `
        <li class="task-item">
          <span>${escapeHtml(task.title)}</span>
          <span>${escapeHtml(task.status)}</span>
        </li>
      `,
    )
    .join("");

  const stackHtml = (project.stack || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <div class="screen">
      <h1>${escapeHtml(project.title)}</h1>

      <div class="card">
        <p><strong>Goal:</strong> ${escapeHtml(project.goal || "-")}</p>
        <p><strong>Level:</strong> ${escapeHtml(project.level || "-")}</p>
        <p><strong>Scope:</strong> ${escapeHtml(project.scope || "-")}</p>
        <p><strong>Estimated size:</strong> ${escapeHtml(project.estimatedSize || "-")}</p>
      </div>

      <div class="card">
        <p>${escapeHtml(project.summary || "No project summary yet.")}</p>
      </div>

      <div class="card">
        <p><strong>Suggested stack</strong></p>
        <ul class="bullet-list">
          ${stackHtml}
        </ul>
      </div>

      <div class="card">
        <p><strong>Current step:</strong> ${escapeHtml(currentStep.title)}</p>
        <p>${escapeHtml(currentStep.description)}</p>
      </div>

      <div class="card">
        <p><strong>Tasks</strong></p>
        <ul class="task-list">
          ${tasksHtml}
        </ul>
      </div>

      <button data-nav="${ROUTES.PROJECT_MAP}">Open Project Map</button>
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
