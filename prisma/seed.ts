import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.users.create({
    data: {
      student_id: "sornchai.som@ku.th",
      full_name: "Sornchai Somsakul",
      email: "sornchai.som@ku.th",
      roles: {
        set: ["ADMIN"],
      },
    },
  });

  console.log("Finished creating roles and admin user");
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
