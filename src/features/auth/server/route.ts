import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator"
import { ID } from "node-appwrite";

import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { AUTH_COOKIE, COOKIE_MAX_AGE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";

const app = new Hono()
  /**
   * @route: /api/auth/v0/current
   * @method: GET
   * @description: Retrieve the currently authenticated user's information.
   * @responses: 
   *   - 200 OK: The user's information is returned.
   *   - 401 Unauthorized: The user is not authenticated.
   */
  .get("/current", sessionMiddleware, c => {
    const user = c.get("user");
    return c.json({ data: user });
  })

  /**
   * @route: /api/auth/v0/login
   * @method: POST
   * @description: Authenticate a user and return a session token.
   * @requestBody: 
   *   - email (string, required): The user's email address.
   *   - password (string, required): The user's password.
   * @responses: 
   *   - 200 OK: The user is authenticated, and a session token is returned.
   *   - 401 Unauthorized: The user's credentials are invalid.
   *   - 500 Internal Server Error: An error occurred during authentication.
   */
  .post("/login", zValidator("json", loginSchema), async c => {
    const { email, password } = c.req.valid("json");
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
    });

    return c.json({ success: true, token: session.secret });
  })

  /**
   * @route: /api/auth/v0/register
   * @method: POST
   * @description: Create a new user account and return a session token.
   * @requestBody: 
   *   - name (string, required): The user's name.
   *   - email (string, required): The user's email address.
   *   - password (string, required): The user's password.
   * @responses: 
   *   - 201 Created: The user account is created, and a session token is returned.
   *   - 400 Bad Request: The request body is invalid.
   *   - 500 Internal Server Error: An error occurred during user creation.
   */
  .post("/register", zValidator("json", registerSchema), async c => {
    const { name, email, password } = c.req.valid("json");
    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
    });

    return c.json({ success: true, token: session.secret }, 201);
  })

  /**
   * @route: /api/auth/v0/logout
   * @method: POST
   * @description: Revoke the user's active session, removing the authentication cookie and requiring re-authentication for future requests.
   * @responses: 
   *   - 200 OK: The user's session has been successfully revoked, and the authentication cookie has been removed.
   *   - 401 Unauthorized: The user's authentication cookie is missing or invalid.
   */
  .post("/logout", sessionMiddleware, async c => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return c.json({ success: true });
  })

export default app;
