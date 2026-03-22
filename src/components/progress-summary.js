import { escapeHtml } from "../utils/formatters.js";

export function renderProgressSummary({
  currentIndex = 0,
  totalSteps = 0,
  currentStepTitle = "",
  currentStepSummary = "",
}) {
  const stepNumber = totalSteps > 0 ? currentIndex + 1 : 0;

  return `
    <section class="card progress-card">
      <p class="eyebrow">Progress</p>
      <p class="progress-card__counter">Step ${stepNumber} of ${totalSteps}</p>
      <h2>${escapeHtml(currentStepTitle || "Current step")}</h2>
      <p>${escapeHtml(currentStepSummary || "No current step summary yet.")}</p>
    </section>
  `;
}
