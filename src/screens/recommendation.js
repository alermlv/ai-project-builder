import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { requestProjectPlan } from "../services/ai.js";
import { buildProjectFromServerPlan } from "../services/project-service.js";
import { formatLabel, escapeHtml } from "../utils/formatters.js";

export function renderRecommendation() {
  const { entry, recommendation, ui } = getState();
  const error = ui?.errors?.recommendation || "";
  const notice = ui?.notice || "";
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

  const stackHtml = (recommendation.stack || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const skillsHtml = (recommendation.skills || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const recommendationBadge = recommendation.isFallback
    ? `<span class="badge badge-warning">Fallback recommendation</span>`
    : `<span class="badge badge-success">Server recommendation</span>`;

  return `
    <div class="screen">
      <h1>Recommended project</h1>

      <div class="card">
        <div class="meta-row">
          ${recommendationBadge}
        </div>
        <p><strong>Goal:</strong> ${escapeHtml(entry.goal || "-")}</p>
        <p><strong>Level:</strong> ${escapeHtml(formatLabel(entry.level))}</p>
        <p><strong>Scope:</strong> ${escapeHtml(formatLabel(entry.scope))}</p>
      </div>

      ${
        notice
          ? `
        <div class="card notice-card">
          <p><strong>Note:</strong> ${escapeHtml(notice)}</p>
        </div>
      `
          : ""
      }

      ${
        error
          ? `
        <div class="card error-card">
          <p><strong>Error:</strong> ${escapeHtml(error)}</p>
        </div>
      `
          : ""
      }

      <div class="card recommendation-hero">
        <p class="eyebrow">Project title</p>
        <h2>${escapeHtml(recommendation.title)}</h2>
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
        <p><strong>Estimated size:</strong> ${escapeHtml(recommendation.estimatedSize || "-")}</p>
      </div>

      <div class="card">
        <p>Recommendation refresh is disabled in demo mode.</p>
      </div>

      <div class="button-row">
        <button class="secondary-button" id="retryRecommendationBtn" disabled>
          Refresh unavailable
        </button>
        <button id="startProjectBtn" ${isLoading ? "disabled" : ""}>
          ${isLoading ? "Generating plan..." : "Start project"}
        </button>
      </div>

      <button class="secondary-button" data-back="entry-scope" ${isLoading ? "disabled" : ""}>
        Back
      </button>
    </div>
  `;
}

document.addEventListener("click", async (e) => {
  if (e.target.id === "retryRecommendationBtn") {
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

  commitState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      isLoading: true,
      errors: {},
      notice: "",
    },
  }));

  try {
    const serverPlan = await requestProjectPlan({
      entry,
      recommendation,
    });

    const project = buildProjectFromServerPlan(serverPlan);

    commitState((state) => ({
      ...state,
      project,
      route: ROUTES.CURRENT_STEP,
      ui: {
        ...state.ui,
        isLoading: false,
        errors: {},
        notice: "",
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
            error.message || "Failed to generate the project plan.",
        },
      },
    }));
  }
});
