import { escapeHtml, formatLabel } from "../utils/formatters.js";

export function renderProjectContextCard(project) {
  return `
    <section class="card">
      <p class="eyebrow">Project context</p>
      <p><strong>Goal:</strong> ${escapeHtml(project?.goal || "-")}</p>
      <p><strong>Level:</strong> ${escapeHtml(formatLabel(project?.level))}</p>
      <p><strong>Scope:</strong> ${escapeHtml(formatLabel(project?.scope))}</p>
      <p><strong>Estimated size:</strong> ${escapeHtml(project?.estimatedSize || "-")}</p>
    </section>
  `;
}
