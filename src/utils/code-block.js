import { escapeHtml } from "./formatters.js";

export function renderCodeBlock({ code = "", label = "", language = "" }) {
  const safeCode = String(code);
  const encodedCode = encodeURIComponent(safeCode);

  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-block-label">
          ${escapeHtml(label || language || "Code")}
        </span>

        <button
          class="copy-code-button"
          type="button"
          data-copy-code="${encodedCode}"
        >
          Copy
        </button>
      </div>

      <pre class="code-block"><code>${escapeHtml(safeCode)}</code></pre>
    </div>
  `;
}
