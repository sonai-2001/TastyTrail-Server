import "dotenv/config";
import http from "http";
import app from "./app";
import connectDB from "./config/db";
import logger from "./config/logger";
import listEndpoints from "express-list-endpoints";

const PORT = process.env.PORT || 4000;
let server: http.Server;

async function start() {
  try {
    console.log("Starting server...", process.env.MONGO_URI);
    await connectDB(process.env.MONGO_URI!);
    server = http.createServer(app);
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);

      // console.log("Is app defined?", !!app);
      // console.log("App Internal Router exists?", !!(app as any)._router);

      // if ((app as any)._router && (app as any)._router.stack) {
      //   console.log("Routes in stack:", (app as any)._router.stack.length);
      // }

      const endpoints = listEndpoints(app);
      console.log("✅ Registered API Endpoints:");
      console.log("\n--- API ROUTES ---");
      endpoints.forEach((route) => {
        console.log(`[${route.methods.join(", ")}] ${route.path}`);
      });
    });

    const shutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down...`);
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
      // Force exit after 10s
      setTimeout(() => {
        logger.error("Forcefully exiting");
        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    logger.error("Startup error", { err });
    process.exit(1);
  }
}

start();
