import { D1Database } from "@cloudflare/workers-types";
import { Hono } from "hono";

type AppEnv = {
  Bindings: {
    bwe_mock_db: D1Database;
  };
};

const app = new Hono<AppEnv>();

app.get("/api/health", (c) => {
  return c.json({
    success: true,
    message: "BWE Mock API is running",
  });
});

export default app;
