import { getState, commitState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { escapeHtml, formatLabel } from "../utils/formatters.js";
import { renderCodeBlock } from "../utils/code-block.js";
import { renderAppHeader } from "../components/app-header.js";
import { renderProgressSummary } from "../components/progress-summary.js";
import { renderTaskCard } from "../components/task-card.js";
import { renderSideMenu } from "../components/side-menu.js";
import {
  completeTaskInProject,
  getCompletedTaskCount,
  getCurrentStep,
  getCurrentStepIndex,
  buildCurrentTaskContext,
  getCurrentTask,
} from "../services/project-service.js";
import { requestStepIntent } from "../services/ai.js";

const DEMO_AI_INPUTS = {
  task_9: "How to open the browser console in Chrome?",
  task_10: "Uncaught SyntaxError: Unexpected identifier 'value' in script.js",
};

export function renderCurrentStep() {
  const { project, ui } = getState();

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
        ${renderSideMenu({
          projectTitle: project.title,
          isOpen: ui.isMenuOpen,
        })}

        ${renderAppHeader({
          title: project.title,
          subtitle: "Project completed",
          rightActionLabel: "Map",
          rightActionRoute: ROUTES.PROJECT_MAP,
        })}

        <div class="screen-body screen-body--with-ai-bar">
          <section class="card">
            <p class="eyebrow">Done</p>
            <h2>Project completed</h2>
            <p>You completed all demo steps in this guided project.</p>
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

          ${renderAiReply(ui.aiReply)}

          <button data-nav="${ROUTES.PROJECT_MAP}">Open Project Map</button>
        </div>
      </div>
    `;
  }

  const steps = Array.isArray(project.steps) ? project.steps : [];
  const currentIndex = getCurrentStepIndex(project);
  const currentStep = getCurrentStep(project);
  const currentTask = getCurrentTask(currentStep);
  const demoAiInput = getDemoAiInput(currentTask);

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
      ${renderSideMenu({
        projectTitle: project.title,
        isOpen: ui.isMenuOpen,
      })}

      ${renderAppHeader({
        title: project.title,
        subtitle: "Current project",
        rightActionLabel: "Map",
        rightActionRoute: ROUTES.PROJECT_MAP,
      })}

      <div class="screen-body screen-body--with-ai-bar">
        ${sourceNote}

        <section class="card notice-card">
          <p><strong>Demo mode:</strong> only step_5 and step_6 are active in this demo.</p>
        </section>

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

        ${renderAiReply(ui.aiReply)}
      </div>

      <div class="ai-action-bar">
        <div class="ai-action-bar__content">
          <textarea
            id="aiStepInput"
            class="ai-action-bar__textarea"
            disabled
            readonly
          >${escapeHtml(demoAiInput)}</textarea>

          <button
            id="askAiBtn"
            ${ui.isLoading ? "disabled" : ""}
          >
            ${ui.isLoading ? "Asking..." : "Ask AI"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function getDemoAiInput(currentTask) {
  if (!currentTask?.id) {
    return "";
  }

  return DEMO_AI_INPUTS[currentTask.id] || "";
}

function renderAiReply(aiReply) {
  if (!aiReply) {
    return "";
  }

  if (aiReply.intent === "question") {
    const explanationHtml = (aiReply.body?.explanation || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    return `
      <section class="card ai-reply-card">
        <p class="eyebrow">AI reply</p>
        <h2>${escapeHtml(aiReply.title || "Explanation")}</h2>
        <p>${escapeHtml(aiReply.body?.summary || "-")}</p>

        <ul class="bullet-list">
          ${explanationHtml}
        </ul>

        ${
          aiReply.body?.codeReference
            ? renderCodeBlock({
                label: aiReply.body.codeReference.label || "Relevant code",
                language: aiReply.body.codeReference.language || "javascript",
                code: aiReply.body.codeReference.code || "",
              })
            : ""
        }
      </section>
    `;
  }

  if (aiReply.intent === "problem") {
    return `
      <section class="card ai-reply-card">
        <p class="eyebrow">AI reply</p>
        <h2>${escapeHtml(aiReply.title || "Fix")}</h2>
        <p><strong>Why the error happened:</strong> ${escapeHtml(aiReply.body?.cause || "-")}</p>

        ${
          aiReply.body?.fixedCode
            ? renderCodeBlock({
                label: aiReply.body.fixedCode.label || "Correct code",
                language: aiReply.body.fixedCode.language || "javascript",
                code: aiReply.body.fixedCode.code || "",
              })
            : ""
        }
      </section>
    `;
  }

  if (aiReply.intent === "system") {
    return `
      <section class="card ai-reply-card">
        <p class="eyebrow">AI reply</p>
        <h2>${escapeHtml(aiReply.title || "Notice")}</h2>
        <p>${escapeHtml(aiReply.body?.summary || "No AI response available.")}</p>
      </section>
    `;
  }

  return `
    <section class="card ai-reply-card">
      <p class="eyebrow">AI reply</p>
      <h2>Notice</h2>
      <p>No AI response available.</p>
    </section>
  `;
}

document.addEventListener("click", async (e) => {
  const taskId = e.target.dataset.completeTask;

  if (taskId) {
    const { project } = getState();

    if (!project || project.status === "completed") {
      return;
    }

    commitState((state) => ({
      ...state,
      project: completeTaskInProject(state.project, taskId),
      ui: {
        ...state.ui,
        aiReply: null,
      },
    }));

    return;
  }

  if (e.target.id !== "askAiBtn") {
    return;
  }

  const { project, ui } = getState();

  if (!project || ui.isLoading) {
    return;
  }

  const context = buildCurrentTaskContext(project);
  const text = getDemoAiInput(context?.currentTask).trim();

  if (!text) {
    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        aiReply: {
          intent: "system",
          title: "No demo input available",
          body: {
            summary:
              "This demo AI helper is only configured for step_5 and step_6.",
          },
        },
      },
    }));
    return;
  }

  if (!context) {
    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        aiInput: text,
        aiReply: {
          intent: "system",
          title: "No current task available",
          body: {
            summary:
              "AI help is only available when the current step has an active task.",
          },
        },
      },
    }));
    return;
  }

  commitState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      isLoading: true,
      aiInput: text,
      aiReply: null,
    },
  }));

  try {
    const reply = await requestStepIntent({
      message: {
        text,
      },
      context,
    });

    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        isLoading: false,
        aiReply: reply,
      },
    }));
  } catch (error) {
    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        isLoading: false,
        aiReply: {
          intent: "system",
          title: "AI help failed",
          body: {
            summary:
              error.message || "Could not get AI help for the current task.",
          },
        },
      },
    }));
  }
});
