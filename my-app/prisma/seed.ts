import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  // We need a user with id 1 to be able to create reports
  await prisma.user.create({
    data: {
      id: 1,
      name: "Bob",
      age: 32,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
