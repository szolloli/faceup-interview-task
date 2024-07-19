import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { deleteFile, uploadFile } from "../firebase/firebase";

const prisma = new PrismaClient();

const app = new Hono();

// Get all users
app.get("/", async (c) => {
  const users = await prisma.user.findMany();
  return c.json(users);
});

// Get user by id
app.get("/:id", async (c) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(c.req.param("id")),
    },
  });
  return c.json(user);
});

// Get all reports of a user with specified id
app.get("/:id/reports", async (c) => {
  const result = await prisma.user.findUnique({
    where: {
      id: parseInt(c.req.param("id")),
    },
    select: {
      reports: true,
    },
  });
  return c.json(result?.reports ?? []);
});

// Create a new report for a user with specified id
app.post("/:id/reports", async (c) => {
  const id = c.req.param("id");
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(c.req.param("id")),
    },
  });

  // Check if user exists
  if (!user) {
    console.error(`User with id ${id} not found`);
    return new Response(null, { status: 204 });
  }

  const report = await c.req.parseBody();

  let attachmentURL = undefined;

  // Create attachment if it is a file
  if (
    report.attachment != "undefined" &&
    typeof report.attachment != "string"
  ) {
    attachmentURL = await uploadFile(report.attachment);
  }

  const newReport = await prisma.report.create({
    data: {
      authorId: parseInt(c.req.param("id")),
      name: report.name as string,
      age: parseInt(report.age as string),
      content: report.content as string,
      attachmentURL: attachmentURL,
    },
  });
  return c.json(newReport);
});

// Update a specific report of a user with specified id
app.put("/:userId/reports/:reportId", async (c) => {
  const userId = c.req.param("userId");
  const reportId = c.req.param("reportId");
  const result = await prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
    select: {
      reports: {
        where: {
          id: parseInt(reportId),
        },
      },
    },
  });

  // Check if report exists
  if (!result || result.reports.length == 0) {
    console.error(`User with id ${userId} not found`);
    return new Response(null, { status: 204 });
  }

  const report = await c.req.parseBody();

  let attachmentURL = undefined;

  // Update attachment if it is a file
  if (report.attachment != undefined && typeof report.attachment != "string") {
    // Delete old attachment if it exists
    if (result.reports[0].attachmentURL) {
      deleteFile(result.reports[0].attachmentURL);
    }
    attachmentURL = await uploadFile(report.attachment);
  }

  const updatedReport = await prisma.report.update({
    where: {
      id: parseInt(reportId),
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

// Update a user with specified id
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  // Check if user exists
  if (!user) {
    console.error(`Report with id ${id} not found`);
    return new Response(null, { status: 204 });
  }

  const param = await c.req.json();
  const updatedReport = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: param.name,
      age: param.age,
    },
  });

  return c.json(updatedReport);
});

// Delete a user with specified id
app.delete("/:id", async (c) => {
  const user = await prisma.user.delete({
    where: {
      id: parseInt(c.req.param("id")),
    },
  });
  return c.json(user);
});

export default app;
