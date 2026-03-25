import { renderCodeBlock } from "../utils/code-block.js";

export function renderCommitCard(commitMessage = "") {
  return `
    <section class="card">
      <p class="eyebrow">Recommended commit</p>
      ${renderCodeBlock({
        label: "Commit message",
        language: "text",
        code: commitMessage || "",
      })}
    </section>
  `;
}
