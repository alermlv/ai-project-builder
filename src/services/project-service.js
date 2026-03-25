import { generateId } from "../utils/ids.js";

export function buildProjectFromServerPlan(serverPlan) {
  return {
    id: generateId("project"),
    title: serverPlan?.title || "New AI Project",
    goal: serverPlan?.goal || "",
    level: serverPlan?.level || "",
    scope: serverPlan?.scope || "",
    summary: serverPlan?.summary || "",
    stack: Array.isArray(serverPlan?.stack)
      ? serverPlan.stack
      : ["HTML", "CSS", "JavaScript"],
    skills: Array.isArray(serverPlan?.skills) ? serverPlan.skills : [],
    estimatedSize: serverPlan?.estimatedSize || "MVP",
    recommendationSource: serverPlan?.recommendationSource || "server",
    isFallbackRecommendation: Boolean(serverPlan?.isFallbackRecommendation),
    status: serverPlan?.status || "active",
    currentStepId: serverPlan?.currentStepId || null,
    steps: normalizeSteps(serverPlan?.steps || []),
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

  if (!Array.isArray(currentStep.tasks) || currentStep.tasks.length === 0) {
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

  const normalizedCurrentTasks = normalizeTaskStatuses(updatedTasks);
  const areAllTasksCompleted = normalizedCurrentTasks.every(
    (task) => task.status === "completed",
  );

  const updatedCurrentStep = {
    ...currentStep,
    tasks: normalizedCurrentTasks,
    status: areAllTasksCompleted ? "completed" : "current",
  };

  const updatedSteps = [...project.steps];
  updatedSteps[currentStepIndex] = updatedCurrentStep;

  let nextCurrentStepId = project.currentStepId;
  let nextProjectStatus = project.status;

  if (areAllTasksCompleted) {
    const nextStepIndex = findNextAvailableStepIndex(
      project,
      updatedSteps,
      currentStepIndex,
    );

    if (nextStepIndex >= 0) {
      const nextStep = updatedSteps[nextStepIndex];

      updatedSteps[nextStepIndex] = {
        ...nextStep,
        status: "current",
        tasks: normalizeTaskStatuses(nextStep.tasks || []),
      };

      nextCurrentStepId = nextStep.id;
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

function normalizeSteps(steps) {
  return steps.map((step) => ({
    ...step,
    tasks: normalizeTasksForStep(step),
  }));
}

function normalizeTasksForStep(step) {
  const tasks = Array.isArray(step?.tasks) ? step.tasks : [];

  if (tasks.length === 0) {
    return [];
  }

  if (step?.status === "completed") {
    return tasks.map((task) => ({
      ...task,
      status: task.status === "completed" ? "completed" : "completed",
    }));
  }

  if (step?.status === "current") {
    return normalizeTaskStatuses(tasks);
  }

  return tasks.map((task, index) => ({
    ...task,
    status:
      task.status === "completed"
        ? "completed"
        : index === 0 && tasks.length === 1 && task.status === "current"
          ? "current"
          : "planned",
  }));
}

function normalizeTaskStatuses(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return [];
  }

  const firstIncompleteIndex = tasks.findIndex(
    (task) => task.status !== "completed",
  );

  return tasks.map((task, index) => {
    if (task.status === "completed") {
      return {
        ...task,
        status: "completed",
      };
    }

    return {
      ...task,
      status: index === firstIncompleteIndex ? "current" : "planned",
    };
  });
}

function findNextAvailableStepIndex(project, steps, currentStepIndex) {
  const demoAvailableStepIds = Array.isArray(project?.demoAvailableStepIds)
    ? project.demoAvailableStepIds
    : [];

  for (let index = currentStepIndex + 1; index < steps.length; index += 1) {
    const step = steps[index];

    if (!step || step.status === "completed") {
      continue;
    }

    if (project?.demoMode) {
      if (demoAvailableStepIds.includes(step.id)) {
        return index;
      }

      continue;
    }

    return index;
  }

  return -1;
}
