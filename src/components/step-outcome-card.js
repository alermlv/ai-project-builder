import { escapeHtml } from "../utils/formatters.js";

export function renderStepOutcomeCard(outcomeSummary = "") {
  return `
    <section class="card">
      <p class="eyebrow">Step outcome</p>
      <p>${escapeHtml(outcomeSummary || "-")}</p>
    </section>
  `;
}
