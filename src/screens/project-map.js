import { getState, commitState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import {
  escapeHtml,
  formatLabel,
  formatTaskStatus,
} from "../utils/formatters.js";
import { renderAppHeader } from "../components/app-header.js";
import { renderSideMenu } from "../components/side-menu.js";
import { getCompletedTaskCount } from "../services/project-service.js";

export function renderProjectMap() {
  const { project, ui } = getState();

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
  const expandedStepIds = Array.isArray(ui?.expandedStepIds)
    ? ui.expandedStepIds
    : [];

  const stepsHtml = steps
    .map((step, index) => {
      const isCurrent = step.id === project.currentStepId;
      const isCompleted = step.status === "completed";
      const isPlanned = step.status === "planned";
      const isExpanded = isCurrent || expandedStepIds.includes(step.id);

      const completedTasks = getCompletedTaskCount(step);
      const totalTasks = Array.isArray(step.tasks) ? step.tasks.length : 0;

      return renderStepMapCard({
        step,
        index,
        isCurrent,
        isCompleted,
        isPlanned,
        isExpanded,
        completedTasks,
        totalTasks,
      });
    })
    .join("");

  return `
    <div class="screen screen--with-fixed-header">
      ${renderSideMenu({
        projectTitle: project.title,
        isOpen: ui.isMenuOpen,
      })}

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
          <p><strong>Status:</strong> ${escapeHtml(formatLabel(project.status || "active"))}</p>
        </div>

        <section class="map-step-list">
          ${stepsHtml}
        </section>
      </div>
    </div>
  `;
}

function renderStepMapCard({
  step,
  index,
  isCurrent,
  isCompleted,
  isPlanned,
  isExpanded,
  completedTasks,
  totalTasks,
}) {
  const statusBadgeClass = isCompleted
    ? "badge-completed"
    : isCurrent
      ? "badge-current"
      : "badge-status";

  const cardClass = [
    "card",
    "map-step-card",
    isCurrent ? "card--current-step" : "",
    isCompleted ? "card--completed-step" : "",
    isPlanned ? "card--planned-step" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const canToggle = isCompleted;
  const toggleLabel = isExpanded ? "Hide details" : "Show details";

  const tasksHtml =
    isExpanded && Array.isArray(step.tasks)
      ? step.tasks
          .map(
            (task, taskIndex) => `
              <li class="map-task-item">
                <div class="meta-row">
                  <span class="badge badge-neutral">Task ${taskIndex + 1}</span>
                  <span class="badge ${
                    task.status === "completed"
                      ? "badge-completed"
                      : "badge-status"
                  }">
                    ${escapeHtml(formatTaskStatus(task.status))}
                  </span>
                </div>

                <p><strong>${escapeHtml(task.title)}</strong></p>
                <p>${escapeHtml(task.explanation || "-")}</p>
              </li>
            `,
          )
          .join("")
      : "";

  return `
    <article class="${cardClass}">
      <div class="meta-row">
        <span class="badge badge-neutral">Step ${index + 1}</span>
        <span class="badge ${statusBadgeClass}">
          ${escapeHtml(formatLabel(step.status || "planned"))}
        </span>
      </div>

      <div class="map-step-card__header">
        <div class="map-step-card__content">
          <h2 class="map-step-card__title">${escapeHtml(step.title)}</h2>
          <p>${escapeHtml(step.summary || "-")}</p>
        </div>

        ${
          canToggle
            ? `
              <button
                type="button"
                class="secondary-button map-step-card__toggle"
                data-toggle-step="${escapeHtml(step.id)}"
              >
                ${toggleLabel}
              </button>
            `
            : ""
        }
      </div>

      <div class="map-step-card__stats">
        <p><strong>Tasks:</strong> ${completedTasks}/${totalTasks} completed</p>
        <p><strong>Why it matters:</strong> ${escapeHtml(step.whyItMatters || "-")}</p>
      </div>

      ${
        isCurrent
          ? `
            <div class="card map-inline-panel">
              <p class="eyebrow">Current step</p>
              <ul class="map-task-list">
                ${(step.tasks || [])
                  .map(
                    (task, taskIndex) => `
                      <li class="map-task-item">
                        <div class="meta-row">
                          <span class="badge badge-neutral">Task ${taskIndex + 1}</span>
                          <span class="badge ${
                            task.status === "completed"
                              ? "badge-completed"
                              : "badge-status"
                          }">
                            ${escapeHtml(formatTaskStatus(task.status))}
                          </span>
                        </div>
                        <p><strong>${escapeHtml(task.title)}</strong></p>
                        <p>${escapeHtml(task.definitionOfDone || "-")}</p>
                      </li>
                    `,
                  )
                  .join("")}
              </ul>

              <button data-nav="${ROUTES.CURRENT_STEP}">
                Return to current step
              </button>
            </div>
          `
          : ""
      }

      ${
        isCompleted && isExpanded
          ? `
            <div class="card map-inline-panel">
              <p class="eyebrow">Completed step details</p>
              <ul class="map-task-list">
                ${tasksHtml}
              </ul>
            </div>
          `
          : ""
      }

      ${
        isPlanned
          ? `
            <div class="card map-inline-panel">
              <p class="eyebrow">Planned step preview</p>
              <p>${escapeHtml(step.outcomeSummary || "This step will unlock after earlier work is completed.")}</p>
            </div>
          `
          : ""
      }
    </article>
  `;
}

document.addEventListener("click", (e) => {
  const stepId = e.target.dataset.toggleStep;

  if (!stepId) {
    return;
  }

  commitState((state) => {
    const expandedStepIds = Array.isArray(state.ui?.expandedStepIds)
      ? state.ui.expandedStepIds
      : [];

    const isExpanded = expandedStepIds.includes(stepId);

    return {
      ...state,
      ui: {
        ...state.ui,
        expandedStepIds: isExpanded
          ? expandedStepIds.filter((id) => id !== stepId)
          : [...expandedStepIds, stepId],
      },
    };
  });
});
