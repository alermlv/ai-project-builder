import { escapeHtml } from "../utils/formatters.js";
import { renderCodeBlock } from "../utils/code-block.js";

export function renderAiReplyCard(aiReply) {
  if (!aiReply) {
    return "";
  }

  if (aiReply.intent === "question") {
    const explanationHtml = (aiReply.body?.explanation || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    return `
      <section class="card ai-reply-card">
        <p class="eyebrow">AI reply</p>
        <h2>${escapeHtml(aiReply.title || "Explanation")}</h2>
        <p>${escapeHtml(aiReply.body?.summary || "-")}</p>

        <ul class="bullet-list">
          ${explanationHtml}
        </ul>

        ${
          aiReply.body?.codeReference
            ? renderCodeBlock({
                label: aiReply.body.codeReference.label || "Relevant code",
                language: aiReply.body.codeReference.language || "javascript",
                code: aiReply.body.codeReference.code || "",
              })
            : ""
        }
      </section>
    `;
  }

  if (aiReply.intent === "problem") {
    return `
      <section class="card ai-reply-card">
        <p class="eyebrow">AI reply</p>
        <h2>${escapeHtml(aiReply.title || "Fix")}</h2>
        <p><strong>Why the error happened:</strong> ${escapeHtml(aiReply.body?.cause || "-")}</p>

        ${
          aiReply.body?.fixedCode
            ? renderCodeBlock({
                label: aiReply.body.fixedCode.label || "Correct code",
                language: aiReply.body.fixedCode.language || "javascript",
                code: aiReply.body.fixedCode.code || "",
              })
            : ""
        }
      </section>
    `;
  }

  if (aiReply.intent === "system") {
    return `
      <section class="card ai-reply-card">
        <p class="eyebrow">AI reply</p>
        <h2>${escapeHtml(aiReply.title || "Notice")}</h2>
        <p>${escapeHtml(aiReply.body?.summary || "No AI response available.")}</p>
      </section>
    `;
  }

  return `
    <section class="card ai-reply-card">
      <p class="eyebrow">AI reply</p>
      <h2>Notice</h2>
      <p>No AI response available.</p>
    </section>
  `;
}
