import { escapeHtml, formatTaskStatus } from "../utils/formatters.js";
import { renderCodeBlock } from "../utils/code-block.js";

export function renderTaskCard(task, index) {
  const filesHtml = (task.files || [])
    .map((file) => renderFileArtifact(file))
    .join("");

  const terminalHtml = (task.terminal || [])
    .map(
      (item) => `
        <div class="terminal-block">
          <p><strong>${escapeHtml(item.label || "Command")}</strong></p>
          ${renderCodeBlock({
            label: item.label || "Command",
            language: "bash",
            code: item.command || "",
          })}
        </div>
      `,
    )
    .join("");

  const commonMistakesHtml = (task.commonMistakes || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <article class="card task-card">
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
    </article>
  `;
}

function renderFileArtifact(file) {
  return `
    <div class="file-artifact">
      <p><strong>File:</strong> ${escapeHtml(file.path || "-")}</p>
      ${renderCodeBlock({
        label: file.path || file.language || "Code",
        language: file.language || "",
        code: file.code || "",
      })}
    </div>
  `;
}
