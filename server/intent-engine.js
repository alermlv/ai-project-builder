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
    "is not defined",
    "cannot read",
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
  const files = Array.isArray(currentTask.files) ? currentTask.files : [];
  const firstFile = files[0] || null;

  const requestedFunction = extractFunctionName(text);
  const matchedSnippet =
    requestedFunction && firstFile?.code
      ? extractFunctionSnippet(firstFile.code, requestedFunction)
      : "";

  const summary = requestedFunction
    ? `The code around ${requestedFunction} supports the current task: ${currentTask.title || "current task"}.`
    : `This code supports the current task: ${currentTask.title || "current task"}.`;

  const explanation = [
    currentTask.purpose
      ? `It exists to achieve this goal: ${currentTask.purpose}`
      : "It exists to support the current task inside this step.",
    currentTask.explanation
      ? `In this step, you are expected to do this: ${currentTask.explanation}`
      : "It is part of the implementation work for the current step.",
    requestedFunction
      ? `The requested function ${requestedFunction} works inside the broader file logic and should be understood in relation to the current task.`
      : "The code should be read in the context of the current task, not as isolated syntax.",
  ];

  if (matchedSnippet) {
    explanation.push(
      `The most relevant code was found in ${firstFile.path || "the current file"}, so the answer is grounded in the current task context.`,
    );
  }

  return {
    intent: "question",
    title: requestedFunction
      ? `Explanation for ${requestedFunction}`
      : `Explanation for ${currentTask.title || "current task"}`,
    body: {
      summary,
      explanation,
      codeReference: matchedSnippet
        ? {
            label: firstFile?.path || "Relevant code",
            language: firstFile?.language || "javascript",
            code: matchedSnippet,
          }
        : null,
    },
  };
}

function buildProblemResponse({ text, context }) {
  const currentTask = context?.currentTask || {};
  const files = Array.isArray(currentTask.files) ? currentTask.files : [];
  const firstFile = files[0] || null;

  const parsedProblem = inferProblem(text, firstFile?.code || "");

  return {
    intent: "problem",
    title: `Fix for ${text}`,
    body: {
      cause: parsedProblem.cause,
      fixedCode: {
        label: "Correct code",
        language: firstFile?.language || "javascript",
        code: parsedProblem.fixedCode,
      },
    },
  };
}

function inferProblem(text, fileCode) {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("setglobalevents is not defined") ||
    normalized.includes("referenceerror: setglobalevents")
  ) {
    return {
      cause:
        "The error appears because the code calls setGlobalEvents(), but the actual function name in this project should be setupGlobalEvents(). JavaScript treats those as different identifiers, so the wrong name causes a ReferenceError.",
      fixedCode: replaceFirstOccurrence(
        fileCode,
        "setGlobalEvents",
        "setupGlobalEvents",
      ),
    };
  }

  return {
    cause:
      "This console problem most likely appears because the current task code references something that is missing, misspelled, or called before it is defined. Check function names, imported names, and DOM references first.",
    fixedCode: fileCode || "// Add the corrected code for this task here.",
  };
}

function extractFunctionName(text) {
  const match = text.match(/(?:function|explain)\s+([a-zA-Z_$][\w$]*)/i);

  if (!match) {
    return "";
  }

  return match[1];
}

function extractFunctionSnippet(code, functionName) {
  if (!code || !functionName) {
    return "";
  }

  const escapedName = escapeRegExp(functionName);
  const functionPattern = new RegExp(
    `(function\\s+${escapedName}\\s*\$begin:math:text$\[\^\)\]\*\\$end:math:text$\\s*\\{[\\s\\S]*?\\n\\}|const\\s+${escapedName}\\s*=\\s*\$begin:math:text$\[\^\)\]\*\\$end:math:text$\\s*=>\\s*\\{[\\s\\S]*?\\n\\}|async\\s+function\\s+${escapedName}\\s*\$begin:math:text$\[\^\)\]\*\\$end:math:text$\\s*\\{[\\s\\S]*?\\n\\})`,
  );

  const match = code.match(functionPattern);
  return match ? match[0] : "";
}

function replaceFirstOccurrence(source, fromValue, toValue) {
  if (!source) {
    return `${toValue}();`;
  }

  return source.replace(fromValue, toValue);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
