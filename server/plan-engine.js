function createFileArtifact(path, language, code) {
  return {
    path,
    language,
    code,
  };
}

function createTask({
  id,
  title,
  status = "planned",
  explanation = "",
  purpose = "",
  definitionOfDone = "",
  expectedResult = "",
  commonMistakes = [],
  files = [],
  terminal = [],
}) {
  return {
    id,
    title,
    status,
    explanation,
    purpose,
    definitionOfDone,
    expectedResult,
    commonMistakes,
    files,
    terminal,
  };
}

function createStep({
  id,
  title,
  status = "planned",
  summary = "",
  whyItMatters = "",
  tasks = [],
  verificationSteps = [],
  outcomeSummary = "",
  commitMessage = "",
  demoAvailable = false,
}) {
  return {
    id,
    title,
    status,
    summary,
    whyItMatters,
    tasks,
    verificationSteps,
    outcomeSummary,
    commitMessage,
    demoAvailable,
  };
}

export function generateProjectPlan() {
  const step1 = createStep({
    id: "step_1",
    title: "Create the first HTML file",
    status: "completed",
    summary: "Start with only the base HTML document",
    whyItMatters:
      "A beginner should first understand the minimum HTML structure before adding app content",
    tasks: [],
    verificationSteps: [],
    outcomeSummary: "The project now has a basic HTML file and connected CSS",
    commitMessage: "",
    demoAvailable: false,
  });

  const step2 = createStep({
    id: "step_2",
    title: "Add the page heading",
    status: "completed",
    summary: "Show the first visible content and style the page body",
    whyItMatters:
      "Beginners learn better when they add one visible element at a time and immediately see the result",
    tasks: [],
    verificationSteps: [],
    outcomeSummary:
      "The page now shows its first visible content with basic body styling",
    commitMessage: "",
    demoAvailable: false,
  });

  const step3 = createStep({
    id: "step_3",
    title: "Add the counter value",
    status: "completed",
    summary: "Create the value display and style it separately",
    whyItMatters:
      "The value display is the core output of the counter and should be built before the controls",
    tasks: [],
    verificationSteps: [],
    outcomeSummary: "The counter value is visible and styled",
    commitMessage: "",
    demoAvailable: false,
  });

  const step4 = createStep({
    id: "step_4",
    title: "Add the counter buttons",
    status: "completed",
    summary: "Create the control buttons and style them",
    whyItMatters:
      "The learner now builds the controls that will later trigger JavaScript actions",
    tasks: [],
    verificationSteps: [],
    outcomeSummary: "The full counter interface is now visible",
    commitMessage: "",
    demoAvailable: false,
  });

  const step5 = createStep({
    id: "step_5",
    title: "Connect JavaScript",
    status: "current",
    summary: "Create the script file and prepare DOM references",
    whyItMatters:
      "Before adding behavior, the project needs a connected script and selected elements",
    demoAvailable: true,
    tasks: [
      createTask({
        id: "task_9",
        title: "Create counter variable and select elements",
        status: "current",
        explanation:
          "Create script.js, connect it in index.html, add a count variable, and select the value and button elements",
        purpose:
          "To prepare JavaScript state and DOM references for future button actions",
        definitionOfDone:
          "script.js is connected and contains count plus all needed element selectors",
        expectedResult:
          "The page loads with no console errors and JavaScript can access the UI elements",
        commonMistakes: [],
        files: [
          createFileArtifact(
            "src/index.html",
            "html",
            `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Simple Counter</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Counter</h1>
  <div id="value">0</div>

  <button id="decrease">-</button>
  <button id="reset">Reset</button>
  <button id="increase">+</button>

  <script src="script.js"></script>
</body>
</html>`,
          ),
          createFileArtifact(
            "src/script.js",
            "javascript",
            `let count = 0;

const value = document.getElementById("value");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const resetBtn = document.getElementById("reset");`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Refresh the page in browser",
      "Open browser console",
      "Check that there are no missing script or selector errors",
    ],
    outcomeSummary: "JavaScript is connected and ready to control the counter",
    commitMessage: `feat: connect script file and prepare counter references

Add script.js to the project and connect it at the bottom of index.html
so JavaScript runs after the page elements load.

Create the count variable and select the value element together with the
three button elements to prepare for interactive behavior.`,
  });

  const step6 = createStep({
    id: "step_6",
    title: "Add increase behavior",
    status: "planned",
    summary: "Make the plus button increase the number",
    whyItMatters:
      "This is the first interactive action and teaches the event-listener pattern",
    demoAvailable: true,
    tasks: [
      createTask({
        id: "task_10",
        title: "Add increase button event",
        status: "planned",
        explanation:
          "Use addEventListener on the increase button to add 1 to count and update the value text",
        purpose: "To teach how a click event changes data and updates the page",
        definitionOfDone:
          "Clicking + increases the number from 0 to 1, 2, 3, and so on",
        expectedResult: "The plus button works in the browser",
        commonMistakes: [],
        files: [
          createFileArtifact(
            "src/script.js",
            "javascript",
            `let count = 0;

const value = document.getElementById("value");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const resetBtn = document.getElementById("reset");

increaseBtn.addEventListener("click", function () {
  count++;
  value.textContent = count;
});`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Refresh the page in browser",
      "Click the + button several times",
      "Check that the number increases by 1 each click",
    ],
    outcomeSummary: "The increase button now updates the counter",
    commitMessage: `feat: add increase click behavior for counter value

Introduce the first interactive event listener on the increase button.

Update the counter variable on click and render the new value inside the
value element so the learner can see immediate browser feedback.`,
  });

  const step7 = createStep({
    id: "step_7",
    title: "Add decrease behavior",
    status: "planned",
    summary: "Make the minus button decrease the number",
    whyItMatters:
      "The second action reinforces the same JavaScript pattern with a different result",
    tasks: [],
    verificationSteps: [],
    outcomeSummary: "The decrease button now updates the counter",
    commitMessage: "",
    demoAvailable: false,
  });

  const step8 = createStep({
    id: "step_8",
    title: "Add reset behavior",
    status: "planned",
    summary: "Make the reset button return the counter to zero",
    whyItMatters:
      "Reset introduces direct state replacement instead of incrementing or decrementing",
    tasks: [],
    verificationSteps: [],
    outcomeSummary: "The simple counter now has all required interactions",
    commitMessage: "",
    demoAvailable: false,
  });

  const step9 = createStep({
    id: "step_9",
    title: "Review the final app",
    status: "planned",
    summary: "Test the full project and keep the final version simple",
    whyItMatters:
      "A final review helps beginners confirm that every part works and understand the finished code",
    tasks: [],
    verificationSteps: [],
    outcomeSummary:
      "The project is finished and ready for beginner practice or reuse",
    commitMessage: "",
    demoAvailable: false,
  });

  return {
    title: "Build a simple counter",
    goal: "build a simple counter",
    level: "beginner",
    scope: "small",
    summary:
      "Create a simple counter web app step by step. In this demo, only step_5 and step_6 are available as active guided steps.",
    stack: ["HTML", "CSS", "JavaScript"],
    skills: [
      "Connect JavaScript to a page",
      "Select DOM elements with getElementById",
      "Add the first click event with addEventListener",
    ],
    estimatedSize: "very small beginner project",
    recommendationSource: "server",
    isFallbackRecommendation: false,
    status: "active",
    currentStepId: step5.id,
    demoMode: true,
    demoAvailableStepIds: ["step_5", "step_6"],
    steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9],
  };
}
