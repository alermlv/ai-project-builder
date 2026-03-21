import { getState } from "../state.js";

export function renderCurrentStep() {
  const { project } = getState();

  if (!project) {
    return `
      <div class="screen">
        <h1>No project yet</h1>

        <div class="card">
          <p>Create a starter project first.</p>
        </div>

        <button data-nav="entry-goal">Go to Entry</button>
      </div>
    `;
  }

  const currentStep =
    project.steps.find((step) => step.id === project.currentStepId) || null;

  if (!currentStep) {
    return `
      <div class="screen">
        <h1>${project.title}</h1>

        <div class="card">
          <p>No current step found.</p>
        </div>

        <button data-nav="project-map">Open Project Map</button>
      </div>
    `;
  }

  const tasksHtml = currentStep.tasks
    .map(
      (task) => `
        <li class="task-item">
          <span>${task.title}</span>
          <span>${task.status}</span>
        </li>
      `,
    )
    .join("");

  return `
    <div class="screen">
      <h1>${project.title}</h1>

      <div class="card">
        <p><strong>Current step:</strong> ${currentStep.title}</p>
        <p>${currentStep.description}</p>
      </div>

      <div class="card">
        <p><strong>Tasks</strong></p>
        <ul class="task-list">
          ${tasksHtml}
        </ul>
      </div>

      <button data-nav="project-map">Open Project Map</button>
    </div>
  `;
}
