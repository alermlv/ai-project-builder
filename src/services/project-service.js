import { generateId } from "../utils/ids.js";

export function buildProjectFromServerPlan(serverPlan) {
  return {
    id: generateId("project"),
    title: serverPlan?.title || "New AI Project",
    goal: serverPlan?.goal || "",
    level: serverPlan?.level || "",
    scope: serverPlan?.scope || "",
    summary: serverPlan?.summary || "",
    stack: serverPlan?.stack || ["HTML", "CSS", "JavaScript"],
    skills: serverPlan?.skills || [],
    estimatedSize: serverPlan?.estimatedSize || "MVP",
    recommendationSource: serverPlan?.recommendationSource || "server",
    isFallbackRecommendation: Boolean(serverPlan?.isFallbackRecommendation),
    status: serverPlan?.status || "active",
    currentStepId: serverPlan?.currentStepId || null,
    steps: Array.isArray(serverPlan?.steps) ? serverPlan.steps : [],
    demoMode: Boolean(serverPlan?.demoMode),
    demoAvailableStepIds: Array.isArray(serverPlan?.demoAvailableStepIds)
      ? serverPlan.demoAvailableStepIds
      : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function completeTaskInProject(project, taskId) {
  if (!project || !Array.isArray(project.steps)) {
    return project;
  }

  const currentStepIndex = project.steps.findIndex(
    (step) => step.id === project.currentStepId,
  );

  if (currentStepIndex < 0) {
    return project;
  }

  const currentStep = project.steps[currentStepIndex];

  if (!Array.isArray(currentStep.tasks)) {
    return project;
  }

  let taskWasUpdated = false;

  const updatedTasks = currentStep.tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    if (task.status === "completed") {
      return task;
    }

    taskWasUpdated = true;

    return {
      ...task,
      status: "completed",
    };
  });

  if (!taskWasUpdated) {
    return project;
  }

  const nextIncompleteTaskIndex = updatedTasks.findIndex(
    (task) => task.status !== "completed",
  );

  const normalizedTasks = updatedTasks.map((task, index) => {
    if (task.status === "completed") {
      return task;
    }

    return {
      ...task,
      status: index === nextIncompleteTaskIndex ? "current" : "planned",
    };
  });

  const areAllTasksCompleted = normalizedTasks.every(
    (task) => task.status === "completed",
  );

  const updatedCurrentStep = {
    ...currentStep,
    tasks: normalizedTasks,
    status: areAllTasksCompleted ? "completed" : "current",
  };

  const updatedSteps = [...project.steps];
  updatedSteps[currentStepIndex] = updatedCurrentStep;

  let nextCurrentStepId = project.currentStepId;
  let nextProjectStatus = project.status;

  if (areAllTasksCompleted) {
    const demoAvailableStepIds = Array.isArray(project.demoAvailableStepIds)
      ? project.demoAvailableStepIds
      : [];

    const nextStep = updatedSteps.find(
      (step) =>
        step.id !== currentStep.id &&
        demoAvailableStepIds.includes(step.id) &&
        step.status !== "completed",
    );

    if (nextStep && nextStep.id === "step_6" && currentStep.id === "step_5") {
      updatedSteps.forEach((step, index) => {
        if (step.id === "step_6") {
          updatedSteps[index] = {
            ...step,
            status: "current",
            tasks: Array.isArray(step.tasks)
              ? step.tasks.map((task, taskIndex) => ({
                  ...task,
                  status:
                    task.status === "completed"
                      ? "completed"
                      : taskIndex === 0
                        ? "current"
                        : "planned",
                }))
              : [],
          };
        }
      });

      nextCurrentStepId = "step_6";
    } else {
      nextCurrentStepId = null;
      nextProjectStatus = "completed";
    }
  }

  return {
    ...project,
    status: nextProjectStatus,
    currentStepId: nextCurrentStepId,
    steps: updatedSteps,
    updatedAt: new Date().toISOString(),
  };
}

export function getCurrentStep(project) {
  if (!project || !Array.isArray(project.steps)) {
    return null;
  }

  return (
    project.steps.find((step) => step.id === project.currentStepId) || null
  );
}

export function getCurrentStepIndex(project) {
  if (!project || !Array.isArray(project.steps)) {
    return -1;
  }

  return project.steps.findIndex((step) => step.id === project.currentStepId);
}

export function getCompletedTaskCount(step) {
  if (!step || !Array.isArray(step.tasks)) {
    return 0;
  }

  return step.tasks.filter((task) => task.status === "completed").length;
}

export function getCurrentTask(step) {
  if (!step || !Array.isArray(step.tasks)) {
    return null;
  }

  return (
    step.tasks.find((task) => task.status === "current") ||
    step.tasks.find((task) => task.status !== "completed") ||
    null
  );
}

export function buildCurrentTaskContext(project) {
  const currentStep = getCurrentStep(project);
  const currentTask = getCurrentTask(currentStep);

  if (!project || !currentStep || !currentTask) {
    return null;
  }

  return {
    project: {
      title: project.title || "",
      goal: project.goal || "",
      level: project.level || "",
      scope: project.scope || "",
    },
    currentStep: {
      id: currentStep.id || "",
      title: currentStep.title || "",
      summary: currentStep.summary || "",
      whyItMatters: currentStep.whyItMatters || "",
    },
    currentTask: {
      id: currentTask.id || "",
      title: currentTask.title || "",
      explanation: currentTask.explanation || "",
      purpose: currentTask.purpose || "",
      definitionOfDone: currentTask.definitionOfDone || "",
      expectedResult: currentTask.expectedResult || "",
      files: Array.isArray(currentTask.files) ? currentTask.files : [],
    },
  };
}
