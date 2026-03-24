import { escapeHtml } from "../utils/formatters.js";

export function renderAppHeader({
  title = "",
  subtitle = "",
  rightActionLabel = "",
  rightActionRoute = "",
}) {
  return `
    <header class="app-header">
      <div class="app-header__left-group">
        <button
          type="button"
          class="app-header__menu-button secondary-button"
          data-open-menu="true"
        >
          Menu
        </button>

        <div class="app-header__left">
          <p class="app-header__eyebrow">${escapeHtml(subtitle || "Current project")}</p>
          <h1 class="app-header__title">${escapeHtml(title || "AI Project Builder")}</h1>
        </div>
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
