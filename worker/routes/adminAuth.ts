import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { AppEnv } from "../types";
import {
  createAdminSession,
  verifyAdminSession,
  deleteAdminSession,
} from "../services/authService";

const adminAuth = new Hono<AppEnv>();

const COOKIE_NAME = "jkm_admin_session";

adminAuth.post("/login", async (c) => {
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json(
        {
          success: false,
          message: "Invalid JSON request body",
        },
        400
    );
  }

  if (
      typeof body !== "object" ||
      body === null ||
      !("username" in body) ||
      !("password" in body) ||
      typeof body.username !== "string" ||
      typeof body.password !== "string"
  ) {
    return c.json(
        {
          success: false,
          message: "Username and password are required",
        },
        400
    );
  }

  if (
      !c.env.ADMIN_USERNAME ||
      !c.env.ADMIN_PASSWORD ||
      body.username !== c.env.ADMIN_USERNAME ||
      body.password !== c.env.ADMIN_PASSWORD
  ) {
    return c.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        401
    );
  }

  const session = await createAdminSession(c.env.jkm_mock_db);

  setCookie(c, COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: new URL(c.req.url).protocol === "https:",
    sameSite: "Strict",
    path: "/",
    maxAge: session.maxAge,
  });

  return c.json({
    success: true,
    message: "Login successful",
  });
});

adminAuth.get("/me", async (c) => {
  const token = getCookie(c, COOKIE_NAME);

  if (!token) {
    return c.json(
        {
          success: false,
          message: "Not authenticated",
        },
        401
    );
  }

  const valid = await verifyAdminSession(c.env.jkm_mock_db, token);

  if (!valid) {
    return c.json(
        {
          success: false,
          message: "Session expired or invalid",
        },
        401
    );
  }

  return c.json({
    success: true,
    data: {
      username: c.env.ADMIN_USERNAME,
    },
  });
});

adminAuth.post("/logout", async (c) => {
  const token = getCookie(c, COOKIE_NAME);

  if (token) {
    await deleteAdminSession(c.env.jkm_mock_db, token);
  }

  deleteCookie(c, COOKIE_NAME, {
    path: "/",
  });

  return c.json({
    success: true,
    message: "Logout successful",
  });
});

export default adminAuth;
