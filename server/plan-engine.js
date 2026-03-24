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
  explanation,
  purpose,
  definitionOfDone,
  expectedResult,
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
  summary,
  whyItMatters,
  tasks = [],
  verificationSteps = [],
  outcomeSummary,
  commitMessage,
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
  };
}

export function generateProjectPlan() {
  const step1 = createStep({
    id: "step_1",
    title: "Create the first HTML file",
    summary: "Start with only the base HTML document",
    whyItMatters:
      "A beginner should first understand the minimum HTML structure before adding app content",
    status: "current",
    tasks: [
      createTask({
        id: "task_1",
        title: "Write the base HTML document",
        status: "current",
        explanation:
          "Create index.html with only the basic HTML5 structure, page title, and empty body",
        purpose: "To learn the minimum structure every HTML page needs",
        definitionOfDone:
          "index.html contains doctype, html, head, meta charset, title, and body",
        expectedResult:
          "Opening index.html shows a blank page with the browser tab title",
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
</head>
<body>

</body>
</html>`,
          ),
        ],
      }),
      createTask({
        id: "task_2",
        title: "Create style.css and connect it",
        status: "planned",
        explanation:
          "Create an empty style.css file and link it inside index.html",
        purpose:
          "To prepare the project for styling and practice connecting files",
        definitionOfDone:
          "style.css exists and is linked in the head section of index.html",
        expectedResult:
          "The HTML page still looks blank, but CSS is connected correctly",
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

</body>
</html>`,
          ),
          createFileArtifact("src/style.css", "css", ``),
        ],
      }),
    ],
    verificationSteps: [
      "Open index.html in browser",
      "Check that the page opens without errors",
      "Make sure style.css is linked in the head",
    ],
    outcomeSummary: "The project now has a basic HTML file and connected CSS",
    commitMessage: `feat: create base HTML file and connect stylesheet

Add the minimum HTML5 document structure with lang, meta charset,
title, and empty body.

Create and connect style.css in the head so the project is ready for
styling in the next steps.`,
  });

  const step2 = createStep({
    id: "step_2",
    title: "Add the page heading",
    summary: "Show the first visible content and style the page body",
    whyItMatters:
      "Beginners learn better when they add one visible element at a time and immediately see the result",
    status: "planned",
    tasks: [
      createTask({
        id: "task_3",
        title: "Add the heading",
        status: "planned",
        explanation:
          "Write an h1 element with the text Counter inside the body",
        purpose: "To place the first visible app element on the page",
        definitionOfDone: "The page shows a Counter heading in the browser",
        expectedResult: "The learner sees the heading text on the page",
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
</body>
</html>`,
          ),
        ],
      }),
      createTask({
        id: "task_4",
        title: "Write styles for body",
        status: "planned",
        explanation:
          "Add very simple body styles: font, text alignment, and top margin",
        purpose: "To make the page easier to read with minimal CSS",
        definitionOfDone:
          "The heading is centered and the page has basic spacing",
        expectedResult:
          "The page looks cleaner without using complex layout rules",
        commonMistakes: [],
        files: [
          createFileArtifact(
            "src/style.css",
            "css",
            `body {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Refresh the page in browser",
      "Check that the Counter heading is visible",
      "Check that the heading is centered",
    ],
    outcomeSummary:
      "The page now shows its first visible content with basic body styling",
    commitMessage: `feat: add page heading and beginner body styles

Add the main h1 heading so the counter page has a visible title.

Introduce simple body styles for font, centered text, and top spacing
to make the page readable for further UI work.`,
  });

  const step3 = createStep({
    id: "step_3",
    title: "Add the counter value",
    summary: "Create the value display and style it separately",
    whyItMatters:
      "The value display is the core output of the counter and should be built before the controls",
    status: "planned",
    tasks: [
      createTask({
        id: "task_5",
        title: "Add the value element",
        status: "planned",
        explanation: "Write a div with id value and set its initial text to 0",
        purpose:
          "To create a clear place where JavaScript will later show the counter number",
        definitionOfDone: "The page displays the number 0 under the heading",
        expectedResult:
          "The learner sees the starting counter value on the page",
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
</body>
</html>`,
          ),
        ],
      }),
      createTask({
        id: "task_6",
        title: "Write styles for the value element",
        status: "planned",
        explanation:
          "Add font size and margin for the value so it is easy to notice",
        purpose: "To visually separate the counter number from the heading",
        definitionOfDone: "The 0 is larger and has space around it",
        expectedResult: "The counter value stands out clearly on the page",
        commonMistakes: [],
        files: [
          createFileArtifact(
            "src/style.css",
            "css",
            `body {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}

#value {
  font-size: 40px;
  margin: 20px;
}`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Refresh the page in browser",
      "Check that 0 appears below the heading",
      "Check that the value text is larger than normal text",
    ],
    outcomeSummary: "The counter value is visible and styled",
    commitMessage: `feat: add counter value block and simple value styles

Add a div with id value and set the initial displayed number to 0.

Style the value with a larger font size and spacing so it becomes the
main visual output of the app.`,
  });

  const step4 = createStep({
    id: "step_4",
    title: "Add the counter buttons",
    summary: "Create the control buttons and style them",
    whyItMatters:
      "The learner now builds the controls that will later trigger JavaScript actions",
    status: "planned",
    tasks: [
      createTask({
        id: "task_7",
        title: "Add three buttons",
        status: "planned",
        explanation:
          "Write decrease, reset, and increase buttons under the value element",
        purpose: "To create the controls for changing the counter",
        definitionOfDone:
          "Three buttons are visible with labels -, Reset, and +",
        expectedResult: "The page now has the full visible UI of the counter",
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
</body>
</html>`,
          ),
        ],
      }),
      createTask({
        id: "task_8",
        title: "Write styles for buttons",
        status: "planned",
        explanation: "Add font size, padding, and margin for all buttons",
        purpose: "To make the controls easier to click and read",
        definitionOfDone: "All buttons have simple readable spacing and size",
        expectedResult:
          "The buttons look clean and usable for a beginner project",
        commonMistakes: [],
        files: [
          createFileArtifact(
            "src/style.css",
            "css",
            `body {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}

#value {
  font-size: 40px;
  margin: 20px;
}

button {
  font-size: 18px;
  padding: 10px;
  margin: 5px;
}`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Refresh the page in browser",
      "Check that three buttons are visible",
      "Check that the buttons have spacing and readable text",
    ],
    outcomeSummary: "The full counter interface is now visible",
    commitMessage: `feat: add counter controls and beginner button styles

Add three buttons for decrease, reset, and increase so the UI has all
required controls.

Apply very simple button styles with readable font size, padding, and
margin to keep the interface clear and easy to use.`,
  });

  const step5 = createStep({
    id: "step_5",
    title: "Connect JavaScript",
    summary: "Create the script file and prepare DOM references",
    whyItMatters:
      "Before adding behavior, the project needs a connected script and selected elements",
    status: "planned",
    tasks: [
      createTask({
        id: "task_9",
        title: "Create counter variable and select elements",
        status: "planned",
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
    summary: "Make the plus button increase the number",
    whyItMatters:
      "This is the first interactive action and teaches the event-listener pattern",
    status: "planned",
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
    summary: "Make the minus button decrease the number",
    whyItMatters:
      "The second action reinforces the same JavaScript pattern with a different result",
    status: "planned",
    tasks: [
      createTask({
        id: "task_11",
        title: "Add decrease button event",
        status: "planned",
        explanation:
          "Use addEventListener on the decrease button to subtract 1 from count and update the value text",
        purpose:
          "To practice another event listener that changes the same counter state",
        definitionOfDone: "Clicking - decreases the current number by 1",
        expectedResult: "The minus button works in the browser",
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
});

decreaseBtn.addEventListener("click", function () {
  count--;
  value.textContent = count;
});`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Refresh the page in browser",
      "Click the - button several times",
      "Check that the number decreases by 1 each click",
    ],
    outcomeSummary: "The decrease button now updates the counter",
    commitMessage: `feat: add decrease click behavior for counter value

Extend the counter logic with a second event listener on the decrease
button.

Subtract one from the counter variable and write the new value back into
the page so both directions of change are now supported.`,
  });

  const step8 = createStep({
    id: "step_8",
    title: "Add reset behavior",
    summary: "Make the reset button return the counter to zero",
    whyItMatters:
      "Reset introduces direct state replacement instead of incrementing or decrementing",
    status: "planned",
    tasks: [
      createTask({
        id: "task_12",
        title: "Add reset button event",
        status: "planned",
        explanation:
          "Use addEventListener on the reset button to set count back to 0 and update the value text",
        purpose:
          "To complete the full counter behavior with a state reset action",
        definitionOfDone: "Clicking Reset always shows 0 in the value element",
        expectedResult: "The reset button works in the browser",
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
});

decreaseBtn.addEventListener("click", function () {
  count--;
  value.textContent = count;
});

resetBtn.addEventListener("click", function () {
  count = 0;
  value.textContent = count;
});`,
          ),
        ],
      }),
    ],
    verificationSteps: [
      "Refresh the page in browser",
      "Click + or - to change the number",
      "Click Reset and check that the number becomes 0",
    ],
    outcomeSummary: "The simple counter now has all required interactions",
    commitMessage: `feat: add reset behavior for complete counter flow

Finish the counter logic by adding a reset event listener to the reset
button.

Set the counter variable back to zero and re-render the value element so
the user can always return to the initial state.`,
  });

  const step9 = createStep({
    id: "step_9",
    title: "Review the final app",
    summary: "Test the full project and keep the final version simple",
    whyItMatters:
      "A final review helps beginners confirm that every part works and understand the finished code",
    status: "planned",
    tasks: [
      createTask({
        id: "task_13",
        title: "Test the full counter flow",
        status: "planned",
        explanation:
          "Open the page and test increase, decrease, and reset in different orders",
        purpose:
          "To verify that the finished app behaves correctly in normal use",
        definitionOfDone: "All three buttons work correctly without errors",
        expectedResult:
          "The learner can use the counter smoothly in the browser",
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
});

decreaseBtn.addEventListener("click", function () {
  count--;
  value.textContent = count;
});

resetBtn.addEventListener("click", function () {
  count = 0;
  value.textContent = count;
});`,
          ),
        ],
      }),
      createTask({
        id: "task_14",
        title: "Check the connected files one more time",
        status: "planned",
        explanation:
          "Verify that index.html links to style.css and script.js correctly",
        purpose:
          "To prevent common beginner mistakes with missing file connections",
        definitionOfDone:
          "Both CSS and JavaScript load correctly after refreshing the page",
        expectedResult:
          "The app keeps its styles and behavior with no missing file errors",
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
        ],
      }),
    ],
    verificationSteps: [
      "Open index.html in browser",
      "Click every button several times",
      "Ensure no console errors are shown",
    ],
    outcomeSummary:
      "The project is finished and ready for beginner practice or reuse",
    commitMessage: `feat: review final counter app and confirm file wiring

Run a final pass on the simple counter to verify that increase,
decrease, and reset all behave correctly in the browser.

Confirm that index.html still links the stylesheet and script file
properly so the final beginner project remains stable and easy to study.`,
  });

  return {
    title: "Build a simple counter",
    goal: "build a simple counter",
    level: "beginner",
    scope: "small",
    summary:
      "Create a simple counter web app step by step. The learner will first build the HTML skeleton, then connect CSS, add visible elements one by one, style them with very simple rules, and finally add JavaScript logic for increase, decrease, and reset actions.",
    stack: ["HTML", "CSS", "JavaScript"],
    skills: [
      "Build basic page structure with HTML",
      "Write simple beginner-friendly styles with CSS",
      "Add interactivity with JavaScript and DOM events",
    ],
    estimatedSize: "very small beginner project",
    recommendationSource: "server",
    isFallbackRecommendation: false,
    status: "active",
    currentStepId: step1.id,
    steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9],
  };
}
