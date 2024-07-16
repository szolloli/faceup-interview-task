import { serve } from "@hono/node-server";
import { Prisma, PrismaClient, Report } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();

const app = new Hono();

app.get("/reports", async (c) => {
  const reports = await prisma.report.findMany();
  return c.text("Hello Hono! Reports: " + JSON.stringify(reports));
});

app.get("/reports/:id", (c) => {
  const report = prisma.report.findUnique({
    where: {
      id: parseInt(c.req.param("id")),
    },
  });
  return c.text("Hello Hono! Report: " + JSON.stringify(report));
});

app.post("/reports", async (c) => {
  const report = (await c.req.json()) as Report;
  const newReport = await prisma.report.create({
    data: {
      name: report.name,
      age: report.age,
      content: report.content,
    },
  });
  return c.text("Hello Hono! New report: " + JSON.stringify(newReport));
});

app.put("/reports/:id", async (c) => {
  const id = c.req.param("id");
  const post = await prisma.report.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!post) {
    // 204 No Content
    return new Response(null, { status: 204 });
  }

  const param = await c.req.json();
  const updatedReport = await prisma.report.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: param.name,
      age: param.age,
      content: param.content,
    },
  });

  return c.text("Hello Hono! Updated report: " + JSON.stringify(updatedReport));
});

app.delete("/reports/:id", async (c) => {
  const report = await prisma.report.delete({
    where: {
      id: parseInt(c.req.param("id")),
    },
  });
  return c.text("Hello Hono! Deleted report: " + JSON.stringify(report));
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
