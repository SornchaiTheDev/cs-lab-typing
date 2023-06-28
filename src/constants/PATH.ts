import type { roles } from "@prisma/client";

interface IPATH {
  pathname: string;
  roles: roles[];
}

export const PATH: IPATH[] = [
  {
    pathname: "/courses/:courseId/labs/:labId/typing/:taskId",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  { pathname: "/cms", roles: ["ADMIN", "TEACHER"] },
  { pathname: "/cms/semesters", roles: ["ADMIN"] },
  { pathname: "/cms/logger", roles: ["ADMIN"] },
  { pathname: "/cms/users", roles: ["ADMIN"] },
  { pathname: "/cms/tasks", roles: ["ADMIN", "TEACHER"] },
  { pathname: "/cms/tasks/:taskId", roles: ["ADMIN", "TEACHER", "STUDENT"] },
  {
    pathname: "/cms/tasks/:taskId/(.*)",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  { pathname: "/cms/courses", roles: ["ADMIN", "TEACHER"] },
  { pathname: "/cms/courses/:courseId", roles: ["ADMIN", "TEACHER"] },
  { pathname: "/cms/courses/:courseId/labs", roles: ["ADMIN", "TEACHER"] },
  { pathname: "/cms/courses/:courseId/settings", roles: ["ADMIN", "TEACHER"] },
  {
    pathname: "/cms/courses/:courseId/labs/:labId",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    pathname: "/cms/courses/:courseId/labs/:labId/(.*)",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    pathname: "/cms/courses/:courseId/sections",
    roles: ["ADMIN", "TEACHER"],
  },
  {
    pathname: "/cms/courses/:courseId/sections/:sectionId",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    pathname:
      "/cms/courses/:courseId/sections/:sectionId/((?!students|labset).*)",
    roles: ["ADMIN"],
  },
  {
    pathname:
      "/cms/courses/:courseId/sections/:sectionId/((?!students|history|logs|settings).*)",
    roles: ["STUDENT"],
  },
  {
    pathname: "/cms/courses/:courseId/sections/:sectionId/(.*)",
    roles: ["TEACHER"],
  },
];
