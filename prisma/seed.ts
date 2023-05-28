import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.users.create({
    data: {
      student_id: "sornchai.som@ku.th",
      full_name: "Sornchai Somsakul",
      email: "sornchai.som@ku.th",
      roles: {
        set: ["ADMIN", "STUDENT"],
      },
    },
  });

  const course = await prisma.courses.create({
    data: {
      number: "CPE314",
      name: "Computer Architecture",
      note: "Computer Architecture Course",
      sections: {
        create: {
          name: "CPE314-1",
          note: "Computer Architecture Section 1",
          semester: {
            create: {
              year: "2566",
              term: "F",
              startDate: new Date("2021-08-01"),
            },
          },
          created_by: {
            connect: {
              full_name: "Sornchai Somsakul",
            },
          },
          active: true,
        },
      },
    },
  });

  console.log("Finished creating admin user");
  console.log(adminUser);
  console.log("Finished creating Course and Section");
  console.log(course);
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
