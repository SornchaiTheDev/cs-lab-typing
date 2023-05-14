import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const role = await prisma.roles.createMany({
    data: [{ name: "ADMIN" }, { name: "TEACHER" }, { name: "STUDENT" }],
  });

  const adminUser = await prisma.users.create({
    data: {
      student_id: "sornchai.som@ku.th",
      full_name: "Sornchai Somsakul",
      email: "sornchai.som@ku.th",
      roles: {
        connect: [{ name: "ADMIN" }, { name: "STUDENT" }],
      },
    },
  });

  console.log("Finished creating roles and admin user");
  console.log(role);
  console.log(adminUser);
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
