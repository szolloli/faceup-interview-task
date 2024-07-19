import { serve } from "@hono/node-server";
import { Hono } from "hono";
import reports from "./reports";
import { cors } from "hono/cors";
import users from "./users";

const app = new Hono().basePath("/api/v1");

app.use("/*", cors());

app.route("/users", users);
app.route("/reports", reports);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
