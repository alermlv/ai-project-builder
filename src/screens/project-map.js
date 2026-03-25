import { getState, commitState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { escapeHtml, formatLabel } from "../utils/formatters.js";
import { renderAppHeader } from "../components/app-header.js";
import { renderSideMenu } from "../components/side-menu.js";
import { renderMapStepCard } from "../components/map-step-card.js";
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

      return renderMapStepCard({
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
        <div class="card notice-card">
          <p><strong>Note:</strong> In this demo, only steps 5 and 6 are available.</p>
        </div>

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
