import { escapeHtml } from "../utils/formatters.js";

export function renderAppHeader({
  title = "",
  subtitle = "",
  rightActionLabel = "",
  rightActionRoute = "",
}) {
  return `
    <header class="app-header">
      <div class="app-header__left">
        <p class="app-header__eyebrow">${escapeHtml(subtitle || "Current project")}</p>
        <h1 class="app-header__title">${escapeHtml(title || "AI Project Builder")}</h1>
      </div>

      ${
        rightActionRoute
          ? `
            <button
              class="app-header__action secondary-button"
              data-nav="${escapeHtml(rightActionRoute)}"
            >
              ${escapeHtml(rightActionLabel || "Open")}
            </button>
          `
          : ""
      }
    </header>
  `;
}
