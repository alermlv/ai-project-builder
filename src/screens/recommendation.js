import { commitState, getState } from "../state.js";
import { ROUTES } from "../utils/routes.js";
import { requestProjectPlan } from "../services/ai.js";
import { buildProjectFromServerPlan } from "../services/project-service.js";
import { escapeHtml } from "../utils/formatters.js";

export function renderRecommendation() {
  const { recommendation, ui } = getState();
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

  return `
    <div class="screen">
      <h1>Recommended project</h1>

      ${
        error
          ? `
        <div class="card error-card">
          <p><strong>Error:</strong> ${escapeHtml(error)}</p>
        </div>
      `
          : ""
      }

      <div class="card notice-card">
        <p><strong>Note:</strong> The demo is currently locked to a simple counter project. </p>
      </div>

      <div class="card recommendation-hero">
        <p class="eyebrow">Project</p>
        <h2>${escapeHtml(recommendation.title)}</h2>
        <p>${escapeHtml(recommendation.summary)}</p>
      </div>

      <div class="button-row">
        <button id="startProjectBtn" ${isLoading ? "disabled" : ""}>
          ${isLoading ? "Starting..." : "Start"}
        </button>
      </div>

      <button class="secondary-button" data-back="entry-scope" ${isLoading ? "disabled" : ""}>
        Back
      </button>
    </div>
  `;
}

document.addEventListener("click", async (e) => {
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
