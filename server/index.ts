import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { startScheduledMessageJob } from "./scheduledJobHandler";
import path from "path";
import fs from "fs";

const app = express();

// Production static file serving - handles multiple possible locations
function serveProductionStatic(expressApp: express.Express) {
  // Try multiple possible locations for the static files
  const possiblePaths = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(process.cwd(), "public"),
  ];
  
  let staticPath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) {
      staticPath = p;
      console.log(`[SERVER] Found static files at: ${p}`);
      break;
    }
  }
  
  if (!staticPath) {
    console.error("[SERVER] Could not find static files directory. Tried:", possiblePaths);
    // Serve a basic error page
    expressApp.use("*", (_req, res) => {
      res.status(500).send("Static files not found. Please rebuild the application.");
    });
    return;
  }
  
  expressApp.use(express.static(staticPath));
  expressApp.use("*", (_req, res) => {
    res.sendFile(path.resolve(staticPath!, "index.html"));
  });
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error('[SERVER] Error:', err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      // Use our custom static file serving that handles multiple paths
      serveProductionStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
      
      // Start the scheduled message job processor (non-blocking)
      startScheduledMessageJob();
    });
  } catch (error) {
    console.error('[SERVER] Failed to start:', error);
    process.exit(1);
  }
})();
