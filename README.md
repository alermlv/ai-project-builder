# AI Project Builder Demo

A mobile-first demo web app where AI guides the user through a small project step by step.

This demo is intentionally narrow:
- Only one demo project is available
- Only **step 5** and **step 6** are active
- The AI helper is configured only for the active demo tasks

## What the demo shows

The app demonstrates a guided learning flow:

1. The user starts a demo project
2. The app opens the current step
3. The user completes the current task
4. The app moves to the next step automatically
5. The user can open the project map
6. The user can use AI help for the active demo task

## Tech stack

### Frontend
- HTML
- CSS
- Plain JavaScript

### Storage
- localStorage

### Server
- Node.js
- Minimal AI proxy

## Project structure

```
/src
  index.html
  styles.css
  app.js
  config.js
  router.js
  state.js
  storage.js

  /components
  /screens
  /services
  /utils

/server
  server.js
  recommendation-engine.js
  plan-engine.js
  intent-engine.js
```

## How to run locally

### 1. Start the server

From the project root:

```bash
node server/server.js
```

Server runs on:
```
http://localhost:3000
```

### 2. Start the frontend

Open `src/index.html` using a local server (e.g. VS Code Live Server).

Make sure config is set:

```js
export const API_BASE_URL = "http://localhost:3000";
```

## Demo flow

1. Open the app
2. Press **Continue**
3. Press **Continue** on level
4. Press **Get recommendation**
5. Press **Start**
6. On step 5 → press **Ask AI**
7. Press **Complete task**
8. On step 6 → press **Ask AI**
9. Press **Complete task**
10. Open **Project Map** or view **Project completed**

## AI behavior

### Step 5 (Task 9)
Question:
- How to open the browser console in Chrome?

### Step 6 (Task 10)
Problem:
- Console syntax error scenario (missing semicolon / JS error)

AI is disabled on:
- Project Map
- Project completed screen

## Notes

- This is a demo MVP
- Flow is intentionally limited
- State is stored in localStorage
- No authentication or multi-project support

## Deploy (next step)

Frontend:
- Vercel or Netlify

Backend:
- Render or Railway

After deploy, update:

```js
export const API_BASE_URL = "https://your-backend-url"
```

## Purpose

This project demonstrates how AI can guide users through:
- Structured learning
- Step-by-step coding
- Contextual debugging help
