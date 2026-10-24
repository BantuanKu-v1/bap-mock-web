import { createMiddleware } from "hono/factory";
import { AppEnv } from "../types";
import { getCookie } from "hono/cookie";
import { verifyAdminSession } from "../services/authService";

export const apiKeyAuth = createMiddleware<AppEnv>(async (c, next) => {
  const authorization = c.req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return c.json(
        {
          success: false,
          message: "Missing or invalid Authorization header",
        },
        401
    );
  }

  const token = authorization.slice(7);

  if (!c.env.API_KEY || token !== c.env.API_KEY) {
    return c.json(
        {
          success: false,
          message: "Invalid API key",
        },
        401
    );
  }

  c.set("clientId", "development-client");

  await next();
});

export const adminAuth = createMiddleware<AppEnv>(async (c, next) => {
  const authorization = c.req.header("Authorization");

  // Existing admin API key authentication
  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice(7);

    if (c.env.ADMIN_API_KEY && token === c.env.ADMIN_API_KEY) {
      await next();
      return;
    }
  }

  // Browser session authentication
  const sessionToken = getCookie(c, "jkm_admin_session");

  if (sessionToken) {
    const valid = await verifyAdminSession(
        c.env.jkm_mock_db,
        sessionToken
    );

    if (valid) {
      await next();
      return;
    }
  }

  return c.json(
      {
        success: false,
        message: "Unauthorized administrator",
      },
      401
  );
});
