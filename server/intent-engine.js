export function handleStepIntent({ message, context }) {
  const text = String(message?.text || "").trim();

  const intent = detectIntent(text);

  if (intent === "problem") {
    return buildProblemResponse({ text, context });
  }

  return buildQuestionResponse({ text, context });
}

function detectIntent(text) {
  const normalized = text.toLowerCase();

  const problemSignals = [
    "error",
    "uncaught",
    "referenceerror",
    "typeerror",
    "syntaxerror",
    "unexpected token",
    "missing )",
    "missing ;",
    "failed",
    "fix ",
  ];

  const isProblem = problemSignals.some((signal) =>
    normalized.includes(signal),
  );

  return isProblem ? "problem" : "question";
}

function buildQuestionResponse({ text, context }) {
  const currentTask = context?.currentTask || {};
  const normalized = text.toLowerCase();

  if (
    normalized.includes("console in chrome") ||
    normalized.includes("open browser console") ||
    normalized.includes("how do i open the console")
  ) {
    return {
      intent: "question",
      title: "How to open the browser console in Chrome",
      body: {
        summary:
          "For this task, you need the browser console to check whether script.js is connected correctly and whether there are any JavaScript errors.",
        explanation: [
          "In Chrome on Windows or Linux, press Ctrl + Shift + J.",
          "In Chrome on Mac, press Command + Option + J.",
          "You can also right-click the page, choose Inspect, and then open the Console tab.",
          "After that, refresh the page and check whether any red error messages appear.",
        ],
        codeReference: null,
      },
    };
  }

  return {
    intent: "question",
    title: `Explanation for ${currentTask.title || "current task"}`,
    body: {
      summary:
        "This task prepares JavaScript state and DOM references so the counter can work in later steps.",
      explanation: [
        "The variable count stores the current counter number in JavaScript.",
        "document.getElementById(...) selects the visible value element and the three buttons from the page.",
        "These references are needed before you can attach click events for increase, decrease, and reset.",
      ],
      codeReference: {
        label: currentTask.files?.[0]?.path || "Relevant code",
        language: currentTask.files?.[0]?.language || "javascript",
        code: currentTask.files?.[0]?.code || "",
      },
    },
  };
}

function buildProblemResponse({ text, context }) {
  const currentTask = context?.currentTask || {};
  const files = Array.isArray(currentTask.files) ? currentTask.files : [];
  const scriptFile =
    files.find((file) => file.path === "src/script.js") ||
    files.find((file) => file.language === "javascript") ||
    null;

  const normalized = text.toLowerCase();

  if (
    normalized.includes("syntaxerror") &&
    (normalized.includes("unexpected token") ||
      normalized.includes("missing ;") ||
      normalized.includes("expected"))
  ) {
    return {
      intent: "problem",
      title: "Fix for the syntax error in script.js",
      body: {
        cause:
          "This happened because the first line in script.js is missing a semicolon. When JavaScript reads the file, it can fail to parse the next line correctly and throws a syntax error before the rest of the script runs.",
        fixedCode: {
          label: "Correct code",
          language: "javascript",
          code:
            scriptFile?.code ||
            `let count = 0;

const value = document.getElementById("value");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const resetBtn = document.getElementById("reset");`,
        },
      },
    };
  }

  return {
    intent: "problem",
    title: `Fix for ${text}`,
    body: {
      cause:
        "This console problem most likely means there is a syntax mistake or a missing connection in the current task code. Check the first lines of script.js and confirm that every statement is written correctly.",
      fixedCode: {
        label: "Correct code",
        language: scriptFile?.language || "javascript",
        code:
          scriptFile?.code ||
          `let count = 0;

const value = document.getElementById("value");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const resetBtn = document.getElementById("reset");`,
      },
    },
  };
}
