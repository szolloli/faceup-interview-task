import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { deleteFile, uploadFile } from "../firebase/firebase";

const prisma = new PrismaClient();

const app = new Hono();

// Get all reports
app.get("/", async (c) => {
  const reports = await prisma.report.findMany();
  return c.json(reports);
});

// Get report by id
app.get("/:id", (c) => {
  const report = prisma.report.findUnique({
    where: {
      id: parseInt(c.req.param("id")),
    },
  });
  return c.json(report);
});

// Update a report with specified id
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const post = await prisma.report.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!post) {
    // 204 No Content
    console.error(`Report with id ${id} not found`);
    return new Response(null, { status: 204 });
  }

  const report = await c.req.parseBody();

  let attachmentURL = undefined;

  // Update attachment if it is a file
  if (report.attachment != undefined && typeof report.attachment != "string") {
    // Delete old attachment if it exists
    if (post.attachmentURL) {
      deleteFile(post.attachmentURL);
    }
    attachmentURL = await uploadFile(report.attachment);
  }

  const updatedReport = await prisma.report.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: report.name as string,
      age: parseInt(report.age as string),
      content: report.content as string,
      attachmentURL: attachmentURL,
    },
  });

  return c.json(updatedReport);
});

// Delete a report with specified id
app.delete("/:id", async (c) => {
  const report = await prisma.report.findUnique({
    where: { id: parseInt(c.req.param("id")) },
  });

  // Check if report exists
  if (!report) {
    console.error(`Report with id ${c.req.param("id")} not found`);
    return new Response(null, { status: 204 });
  }

  // Delete attachment if it exists
  if (report.attachmentURL) {
    deleteFile(report.attachmentURL);
  }

  const deletedReport = await prisma.report.delete({
    where: {
      id: parseInt(c.req.param("id")),
    },
  });
  return c.json(deletedReport);
});

export default app;
