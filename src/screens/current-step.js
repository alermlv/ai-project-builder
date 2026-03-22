import { getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import {
  escapeHtml,
  formatLabel,
  formatTaskStatus,
} from "../utils/formatters.js";

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
    <div class="screen">
      <h1>${escapeHtml(project.title)}</h1>

      ${sourceNote}

      <div class="card">
        <p><strong>Goal:</strong> ${escapeHtml(project.goal || "-")}</p>
        <p><strong>Level:</strong> ${escapeHtml(formatLabel(project.level))}</p>
        <p><strong>Scope:</strong> ${escapeHtml(formatLabel(project.scope))}</p>
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
        <p class="eyebrow">Current step</p>
        <h2>${escapeHtml(currentStep.title)}</h2>
        <p><strong>Summary:</strong> ${escapeHtml(currentStep.summary || "-")}</p>
        <p><strong>Why this matters:</strong> ${escapeHtml(currentStep.whyItMatters || "-")}</p>
      </div>

      ${taskCardsHtml}

      <div class="card">
        <p class="eyebrow">Step verification</p>
        <ul class="bullet-list">
          ${verificationHtml}
        </ul>
      </div>

      <div class="card">
        <p class="eyebrow">Step outcome</p>
        <p>${escapeHtml(currentStep.outcomeSummary || "-")}</p>
      </div>

      <div class="card">
        <p class="eyebrow">Recommended commit</p>
        <pre class="code-block"><code>${escapeHtml(currentStep.commitMessage || "")}</code></pre>
      </div>

      <button data-nav="${ROUTES.PROJECT_MAP}">Open Project Map</button>
    </div>
  `;
}

function renderTaskCard(task, index) {
  const filesHtml = (task.files || [])
    .map((file) => renderFileArtifact(file))
    .join("");

  const terminalHtml = (task.terminal || [])
    .map(
      (item) => `
        <div class="terminal-block">
          <p><strong>${escapeHtml(item.label || "Command")}</strong></p>
          <pre class="code-block"><code>${escapeHtml(item.command || "")}</code></pre>
        </div>
      `,
    )
    .join("");

  const commonMistakesHtml = (task.commonMistakes || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <div class="card task-card">
      <div class="meta-row">
        <span class="badge badge-neutral">Task ${index + 1}</span>
        <span class="badge badge-status">${escapeHtml(formatTaskStatus(task.status))}</span>
      </div>

      <h3>${escapeHtml(task.title)}</h3>

      <p><strong>What to do:</strong> ${escapeHtml(task.explanation || "-")}</p>
      <p><strong>Why:</strong> ${escapeHtml(task.purpose || "-")}</p>
      <p><strong>Definition of Done:</strong> ${escapeHtml(task.definitionOfDone || "-")}</p>
      <p><strong>Expected result:</strong> ${escapeHtml(task.expectedResult || "-")}</p>

      ${
        commonMistakesHtml
          ? `
            <div>
              <p><strong>Common mistakes</strong></p>
              <ul class="bullet-list">
                ${commonMistakesHtml}
              </ul>
            </div>
          `
          : ""
      }

      ${filesHtml}
      ${terminalHtml}
    </div>
  `;
}

function renderFileArtifact(file) {
  return `
    <div class="file-artifact">
      <p><strong>File:</strong> ${escapeHtml(file.path || "-")}</p>
      <pre class="code-block"><code>${escapeHtml(file.code || "")}</code></pre>
    </div>
  `;
}
