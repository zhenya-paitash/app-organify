import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api/v1");

app.get("/hello", c => {
  return c.json({ message: "Hello World!" });
});

app.get("/users/:userId", c => {
  const { userId } = c.req.param();
  return c.json({ userId });
})

export const GET = handle(app);

