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
      number: "CS112",
      name: "Fundamental Programming Concepts",
      note: "Course Note",
      sections: {
        create: {
          name: "12 (F 15 - 17)",
          note: "Section Note",
          semester: {
            create: {
              year: "2566",
              term: "First",
              startDate: new Date("2023-07-01"),
            },
          },
          created_by: {
            connect: {
              full_name: adminUser.full_name,
            },
          },
          instructors: {
            connect: {
              full_name: adminUser.full_name,
            },
          },
          active: true,
        },
      },
    },
  });

  const simpleTask = await prisma.tasks.create({
    data: {
      name: "Simple Task",
      isPrivate: false,
      type: "Typing",
      body: "Lorem Ipsum",
      owner: {
        connect: {
          full_name: adminUser.full_name,
        },
      },
      history: {
        create: {
          action: "Create a Task",
          user: {
            connect: {
              full_name: adminUser.full_name,
            },
          },
        },
      },
      tags: {
        create: {
          name: "Typing",
        },
      },
    },
  });

  console.log("Finished creating admin user");
  console.log(adminUser);
  console.log("Finished creating Course and Section");
  console.log(course);
  console.log("Finished Simple Task");
  console.log(simpleTask);
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
