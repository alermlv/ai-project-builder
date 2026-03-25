export function handleStepIntent({ message, context }) {
  const text = String(message?.text || "").trim();
  const currentTask = context?.currentTask || {};

  if (currentTask.id === "task_10") {
    return buildProblemResponse({ text, context });
  }

  return buildQuestionResponse({ text, context });
}

function buildQuestionResponse({ context }) {
  const currentTask = context?.currentTask || {};

  return {
    intent: "question",
    title: "How to open the browser console in Chrome",
    body: {
      summary:
        "For this task, you need the browser console to check whether script.js is connected correctly and whether any JavaScript errors appear.",
      explanation: [
        "In Chrome on Windows or Linux, press Ctrl + Shift + J.",
        "In Chrome on Mac, press Command + Option + J.",
        "You can also right-click the page, choose Inspect, and then open the Console tab.",
        "After that, refresh the page and check whether any red error messages appear.",
      ],
      codeReference: {
        label:
          currentTask.files?.[1]?.path ||
          currentTask.files?.[0]?.path ||
          "Relevant code",
        language:
          currentTask.files?.[1]?.language ||
          currentTask.files?.[0]?.language ||
          "javascript",
        code:
          currentTask.files?.[1]?.code || currentTask.files?.[0]?.code || "",
      },
    },
  };
}

function buildProblemResponse({ context }) {
  const currentTask = context?.currentTask || {};
  const files = Array.isArray(currentTask.files) ? currentTask.files : [];
  const scriptFile =
    files.find((file) => file.path === "src/script.js") ||
    files.find((file) => file.language === "javascript") ||
    null;

  return {
    intent: "problem",
    title: "Fix for the syntax error in script.js",
    body: {
      cause:
        "The error appears because the line with count++ was left incomplete in the click handler. In this demo scenario, the statement needs to end correctly before JavaScript can continue to the next line that updates the page.",
      fixedCode: {
        label: "Correct code",
        language: "javascript",
        code:
          scriptFile?.code ||
          `let count = 0;

const value = document.getElementById("value");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const resetBtn = document.getElementById("reset");

increaseBtn.addEventListener("click", function () {
  count++;
  value.textContent = count;
});`,
      },
    },
  };
}
