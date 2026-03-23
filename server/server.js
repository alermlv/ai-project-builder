import http from "http";
import { generateProjectRecommendation } from "./recommendation-engine.js";
import { generateProjectPlan } from "./plan-engine.js";
import { handleStepIntent } from "./intent-engine.js";

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/recommend-project") {
    try {
      const body = await readJsonBody(req);
      const validationError = validateRecommendationInput(body);

      if (validationError) {
        sendJson(res, 400, {
          error: validationError,
        });
        return;
      }

      const recommendation = generateProjectRecommendation({
        goal: body.goal,
        level: body.level,
        scope: body.scope,
      });

      sendJson(res, 200, {
        success: true,
        data: recommendation,
      });
      return;
    } catch (error) {
      console.error("Failed to handle /api/recommend-project:", error);

      sendJson(res, 500, {
        error: "Internal server error",
      });
      return;
    }
  }

  if (req.method === "POST" && req.url === "/api/generate-plan") {
    try {
      const body = await readJsonBody(req);
      const validationError = validateGeneratePlanInput(body);

      if (validationError) {
        sendJson(res, 400, {
          error: validationError,
        });
        return;
      }

      const projectPlan = generateProjectPlan({
        entry: body.entry,
        recommendation: body.recommendation,
      });

      sendJson(res, 200, {
        success: true,
        data: projectPlan,
      });
      return;
    } catch (error) {
      console.error("Failed to handle /api/generate-plan:", error);

      sendJson(res, 500, {
        error: "Internal server error",
      });
      return;
    }
  }

  if (req.method === "POST" && req.url === "/api/step-intent") {
    try {
      const body = await readJsonBody(req);
      const validationError = validateStepIntentInput(body);

      if (validationError) {
        sendJson(res, 400, {
          error: validationError,
        });
        return;
      }

      const reply = handleStepIntent({
        message: body.message,
        context: body.context,
      });

      sendJson(res, 200, {
        success: true,
        data: reply,
      });
      return;
    } catch (error) {
      console.error("Failed to handle /api/step-intent:", error);

      sendJson(res, 500, {
        error: "Internal server error",
      });
      return;
    }
  }

  sendJson(res, 404, {
    error: "Not found",
  });
});

server.listen(PORT, () => {
  console.log(`AI proxy server is running on http://localhost:${PORT}`);
});

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = rawBody ? JSON.parse(rawBody) : {};
        resolve(parsed);
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
}

function validateRecommendationInput(body) {
  if (!body.goal || typeof body.goal !== "string") {
    return "Field 'goal' is required.";
  }

  if (!body.level || typeof body.level !== "string") {
    return "Field 'level' is required.";
  }

  if (!body.scope || typeof body.scope !== "string") {
    return "Field 'scope' is required.";
  }

  return null;
}

function validateGeneratePlanInput(body) {
  if (!body.entry || typeof body.entry !== "object") {
    return "Field 'entry' is required.";
  }

  if (!body.recommendation || typeof body.recommendation !== "object") {
    return "Field 'recommendation' is required.";
  }

  if (!body.entry.goal || typeof body.entry.goal !== "string") {
    return "Field 'entry.goal' is required.";
  }

  if (!body.entry.level || typeof body.entry.level !== "string") {
    return "Field 'entry.level' is required.";
  }

  if (!body.entry.scope || typeof body.entry.scope !== "string") {
    return "Field 'entry.scope' is required.";
  }

  return null;
}

function validateStepIntentInput(body) {
  if (!body.message || typeof body.message !== "object") {
    return "Field 'message' is required.";
  }

  if (!body.message.text || typeof body.message.text !== "string") {
    return "Field 'message.text' is required.";
  }

  if (!body.context || typeof body.context !== "object") {
    return "Field 'context' is required.";
  }

  if (
    !body.context.currentTask ||
    typeof body.context.currentTask !== "object"
  ) {
    return "Field 'context.currentTask' is required.";
  }

  return null;
}
