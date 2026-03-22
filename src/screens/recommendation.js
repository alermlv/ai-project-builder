import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { requestProjectRecommendation } from "../services/ai.js";
import { createProjectFromRecommendation } from "../services/project-service.js";

export function renderRecommendation() {
  const { entry, recommendation, ui } = getState();
  const error = ui?.errors?.recommendation || "";
  const isLoading = ui?.isLoading;

  if (!recommendation) {
    return `
      <div class="screen">
        <h1>No recommendation yet</h1>

        <div class="card">
          <p>Complete the entry flow first to generate a project recommendation.</p>
        </div>

        <button data-nav="${ROUTES.ENTRY_GOAL}">Go to entry</button>
      </div>
    `;
  }

  const stackHtml = recommendation.stack
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const skillsHtml = recommendation.skills
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <div class="screen">
      <h1>Recommended project</h1>

      <div class="card">
        <p><strong>Goal:</strong> ${escapeHtml(entry.goal || "-")}</p>
        <p><strong>Level:</strong> ${escapeHtml(formatLabel(entry.level))}</p>
        <p><strong>Scope:</strong> ${escapeHtml(formatLabel(entry.scope))}</p>
      </div>

      <div class="card">
        <p><strong>Project title:</strong> ${escapeHtml(recommendation.title)}</p>
        <p>${escapeHtml(recommendation.summary)}</p>
      </div>

      <div class="card">
        <p><strong>Suggested stack</strong></p>
        <ul class="bullet-list">
          ${stackHtml}
        </ul>
      </div>

      <div class="card">
        <p><strong>Skills practiced</strong></p>
        <ul class="bullet-list">
          ${skillsHtml}
        </ul>
      </div>

      <div class="card">
        <p><strong>Estimated size:</strong> ${escapeHtml(recommendation.estimatedSize)}</p>
      </div>

      ${error ? `<p class="error-text">${error}</p>` : ""}

      <div class="button-row">
        <button class="secondary-button" id="retryRecommendationBtn" ${isLoading ? "disabled" : ""}>
          ${isLoading ? "Refreshing..." : "Try another stub"}
        </button>
        <button id="startProjectBtn" ${isLoading ? "disabled" : ""}>Start project</button>
      </div>

      <button class="secondary-button" data-back="entry-scope" ${isLoading ? "disabled" : ""}>
        Back
      </button>
    </div>
  `;
}

document.addEventListener("click", async (e) => {
  if (e.target.id === "retryRecommendationBtn") {
    const { entry, ui } = getState();

    if (ui.isLoading) {
      return;
    }

    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        isLoading: true,
        errors: {},
      },
    }));

    try {
      const recommendation = await requestProjectRecommendation({
        goal: entry.goal,
        level: entry.level,
        scope: entry.scope,
      });

      commitState((state) => ({
        ...state,
        recommendation,
        ui: {
          ...state.ui,
          isLoading: false,
          errors: {},
        },
      }));
    } catch (error) {
      commitState((state) => ({
        ...state,
        ui: {
          ...state.ui,
          isLoading: false,
          errors: {
            ...state.ui.errors,
            recommendation:
              error.message || "Failed to refresh recommendation.",
          },
        },
      }));
    }

    return;
  }

  if (e.target.id !== "startProjectBtn") {
    return;
  }

  const { entry, recommendation, ui } = getState();

  if (ui.isLoading) {
    return;
  }

  if (!recommendation) {
    commitState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        errors: {
          ...state.ui.errors,
          recommendation:
            "Recommendation is missing. Please generate it again.",
        },
      },
    }));
    return;
  }

  const project = createProjectFromRecommendation({
    entry,
    recommendation,
  });

  commitState((state) => ({
    ...state,
    project,
    route: ROUTES.CURRENT_STEP,
    ui: {
      ...state.ui,
      errors: {},
    },
  }));
});

function formatLabel(value) {
  if (!value) {
    return "-";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
