import { escapeHtml } from "./formatters.js";
import { highlightCode } from "./syntax-highlight.js";

export function renderCodeBlock({ code = "", label = "", language = "" }) {
  const sourceCode = String(code ?? "");
  const encodedCode = encodeURIComponent(sourceCode);
  const highlightedCode = highlightCode(sourceCode, language);

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

      <pre class="code-block language-${escapeHtml(language || "text")}"><code>${highlightedCode}</code></pre>
    </div>
  `;
}
