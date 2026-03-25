import { escapeHtml } from "../utils/formatters.js";

export function renderStepExplanationCard({ currentStep, project }) {
  return `
    <section class="card explanation-card">
      <p class="eyebrow">AI explanation</p>
      <p><strong>Why this step matters:</strong> ${escapeHtml(currentStep?.whyItMatters || "-")}</p>
      <p>${escapeHtml(project?.summary || "No project summary yet.")}</p>
    </section>
  `;
}
