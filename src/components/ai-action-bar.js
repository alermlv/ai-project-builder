import { escapeHtml } from "../utils/formatters.js";

export function renderAiActionBar({
  value = "",
  isLoading = false,
  isDisabled = false,
}) {
  const isButtonDisabled = isLoading || isDisabled;

  return `
    <div class="ai-action-bar">
      <div class="ai-action-bar__content">
        <textarea
          id="aiStepInput"
          class="ai-action-bar__textarea"
          disabled
          readonly
        >${escapeHtml(value)}</textarea>

        <button
          id="askAiBtn"
          ${isButtonDisabled ? "disabled" : ""}
        >
          ${isLoading ? "Loading..." : "Ask AI"}
        </button>
      </div>
    </div>
  `;
}
