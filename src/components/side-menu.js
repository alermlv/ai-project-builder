import { escapeHtml } from "../utils/formatters.js";

export function renderSideMenu({ projectTitle = "", isOpen = false }) {
  const currentProjectTitle = projectTitle || "Current project";

  return `
    <div class="side-menu-overlay ${isOpen ? "is-open" : ""}" data-close-menu="true"></div>

    <aside class="side-menu ${isOpen ? "is-open" : ""}" aria-hidden="${isOpen ? "false" : "true"}">
      <div class="side-menu__header">
        <button
          type="button"
          class="secondary-button side-menu__close"
          data-close-menu="true"
        >
          Close
        </button>
      </div>

      <div class="side-menu__body">
        <button
          type="button"
          class="side-menu__new-project"
          disabled
        >
          New project
        </button>

        <div class="side-menu__section">
          <p class="side-menu__label">Projects</p>

          <button
            type="button"
            class="side-menu__project side-menu__project--active"
            data-nav="current-step"
            data-close-menu="true"
          >
            <span class="side-menu__project-title">${escapeHtml(currentProjectTitle)}</span>
            <span class="side-menu__project-status">Current</span>
          </button>

          <button
            type="button"
            class="side-menu__project side-menu__project--disabled"
            disabled
          >
            <span class="side-menu__project-title">Build a weather app</span>
            <span class="side-menu__project-status">Demo only</span>
          </button>

          <button
            type="button"
            class="side-menu__project side-menu__project--disabled"
            disabled
          >
            <span class="side-menu__project-title">Build a simple to-do list</span>
            <span class="side-menu__project-status">Demo only</span>
          </button>
        </div>
      </div>
    </aside>
  `;
}
