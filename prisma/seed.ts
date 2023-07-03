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

  // const course = await prisma.courses.create({
  //   data: {
  //     number: "CS112",
  //     name: "Fundamental Programming Concepts",
  //     note: "Course Note",
  //     sections: {
  //       create: {
  //         name: "12 (F 15 - 17)",
  //         note: "Section Note",
  //         semester: {
  //           create: {
  //             year: "2566",
  //             term: "First",
  //             startDate: new Date("2023-07-01"),
  //           },
  //         },
  //         created_by: {
  //           connect: {
  //             id: adminUser.id,
  //           },
  //         },
  //         instructors: {
  //           connect: {
  //             id: adminUser.id,
  //           },
  //         },
  //         active: true,
  //       },
  //     },
  //   },
  // });

  // const simpleTask = await prisma.tasks.create({
  //   data: {
  //     name: "Simple Task",
  //     isPrivate: false,
  //     type: "Typing",
  //     body: "Lorem Ipsum",
  //     owner: {
  //       connect: {
  //         id: adminUser.id,
  //       },
  //     },
  //     history: {
  //       create: {
  //         action: "Create a Task",
  //         user: {
  //           connect: {
  //             id: adminUser.id,
  //           },
  //         },
  //       },
  //     },
  //     tags: {
  //       create: {
  //         name: "Typing",
  //       },
  //     },
  //   },
  // });

  console.log("Finished creating admin user");
  console.log(adminUser);
  // console.log("Finished creating Course and Section");
  // console.log(course);
  // console.log("Finished Simple Task");
  // console.log(simpleTask);
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
