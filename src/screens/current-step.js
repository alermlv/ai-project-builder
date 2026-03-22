import { getState, commitState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { escapeHtml, formatLabel } from "../utils/formatters.js";
import { renderCodeBlock } from "../utils/code-block.js";
import { renderAppHeader } from "../components/app-header.js";
import { renderProgressSummary } from "../components/progress-summary.js";
import { renderTaskCard } from "../components/task-card.js";
import {
  completeTaskInProject,
  getCompletedTaskCount,
  getCurrentStep,
  getCurrentStepIndex,
} from "../services/project-service.js";

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

  if (project.status === "completed") {
    return `
      <div class="screen screen--with-fixed-header">
        ${renderAppHeader({
          title: project.title,
          subtitle: "Project completed",
          rightActionLabel: "Map",
          rightActionRoute: ROUTES.PROJECT_MAP,
        })}

        <div class="screen-body">
          <section class="card">
            <p class="eyebrow">Done</p>
            <h2>Project completed</h2>
            <p>You completed all steps in this guided project.</p>
          </section>

          <section class="card">
            <p><strong>Goal:</strong> ${escapeHtml(project.goal || "-")}</p>
            <p><strong>Level:</strong> ${escapeHtml(formatLabel(project.level))}</p>
            <p><strong>Scope:</strong> ${escapeHtml(formatLabel(project.scope))}</p>
            <p><strong>Estimated size:</strong> ${escapeHtml(project.estimatedSize || "-")}</p>
          </section>

          <section class="card">
            <p><strong>Summary:</strong> ${escapeHtml(project.summary || "-")}</p>
          </section>

          <button data-nav="${ROUTES.PROJECT_MAP}">Open Project Map</button>
        </div>
      </div>
    `;
  }

  const steps = Array.isArray(project.steps) ? project.steps : [];
  const currentIndex = getCurrentStepIndex(project);
  const currentStep = getCurrentStep(project);

  if (!currentStep || currentIndex < 0) {
    return `
      <div class="screen">
        ${renderAppHeader({
          title: project.title,
          subtitle: "Current project",
          rightActionLabel: "Map",
          rightActionRoute: ROUTES.PROJECT_MAP,
        })}

        <div class="screen-body">
          <div class="card">
            <p>No current step found.</p>
          </div>
        </div>
      </div>
    `;
  }

  const completedTaskCount = getCompletedTaskCount(currentStep);
  const totalTaskCount = Array.isArray(currentStep.tasks)
    ? currentStep.tasks.length
    : 0;

  const taskCardsHtml = (currentStep.tasks || [])
    .map((task, index) => renderTaskCard(task, index))
    .join("");

  const verificationHtml = (currentStep.verificationSteps || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const stackHtml = (project.stack || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const sourceNote = project.isFallbackRecommendation
    ? `
      <div class="card notice-card">
        <p><strong>Note:</strong> This project was started from a fallback recommendation.</p>
      </div>
    `
    : "";

  return `
    <div class="screen screen--with-fixed-header">
      ${renderAppHeader({
        title: project.title,
        subtitle: "Current project",
        rightActionLabel: "Map",
        rightActionRoute: ROUTES.PROJECT_MAP,
      })}

      <div class="screen-body">
        ${sourceNote}

        ${renderProgressSummary({
          currentIndex,
          totalSteps: steps.length,
          currentStepTitle: currentStep.title,
          currentStepSummary: currentStep.summary,
        })}

        <section class="card">
          <p class="eyebrow">Project context</p>
          <p><strong>Goal:</strong> ${escapeHtml(project.goal || "-")}</p>
          <p><strong>Level:</strong> ${escapeHtml(formatLabel(project.level))}</p>
          <p><strong>Scope:</strong> ${escapeHtml(formatLabel(project.scope))}</p>
          <p><strong>Estimated size:</strong> ${escapeHtml(project.estimatedSize || "-")}</p>
        </section>

        <section class="card explanation-card">
          <p class="eyebrow">AI explanation</p>
          <p><strong>Why this step matters:</strong> ${escapeHtml(currentStep.whyItMatters || "-")}</p>
          <p>${escapeHtml(project.summary || "No project summary yet.")}</p>
        </section>

        <section class="card">
          <p class="eyebrow">Suggested stack</p>
          <ul class="bullet-list">
            ${stackHtml}
          </ul>
        </section>

        <section class="card progress-inline-card">
          <p class="eyebrow">Task progress</p>
          <p><strong>${completedTaskCount}</strong> of <strong>${totalTaskCount}</strong> task(s) completed</p>
        </section>

        <section class="task-section">
          <div class="section-heading">
            <h2>Tasks</h2>
            <p>${totalTaskCount} task(s) in this step</p>
          </div>

          ${
            taskCardsHtml ||
            `
            <div class="card">
              <p>No tasks available for this step yet.</p>
            </div>
          `
          }
        </section>

        <section class="card">
          <p class="eyebrow">How to verify this step</p>
          <ul class="bullet-list">
            ${verificationHtml}
          </ul>
        </section>

        <section class="card">
          <p class="eyebrow">Step outcome</p>
          <p>${escapeHtml(currentStep.outcomeSummary || "-")}</p>
        </section>

        <section class="card">
          <p class="eyebrow">Recommended commit</p>
          ${renderCodeBlock({
            label: "Commit message",
            language: "text",
            code: currentStep.commitMessage || "",
          })}
        </section>
      </div>
    </div>
  `;
}

document.addEventListener("click", (e) => {
  const taskId = e.target.dataset.completeTask;

  if (!taskId) {
    return;
  }

  const { project } = getState();

  if (!project || project.status === "completed") {
    return;
  }

  commitState((state) => ({
    ...state,
    project: completeTaskInProject(state.project, taskId),
  }));
});
