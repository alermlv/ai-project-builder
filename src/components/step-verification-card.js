import { escapeHtml } from "../utils/formatters.js";

export function renderStepVerificationCard(verificationSteps = []) {
  const verificationHtml = verificationSteps
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <section class="card">
      <p class="eyebrow">How to verify this step</p>
      <ul class="bullet-list">
        ${verificationHtml}
      </ul>
    </section>
  `;
}
