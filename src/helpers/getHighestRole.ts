import { roles } from "@prisma/client";

export const getHighestRole = (roles: roles[]) => {
  const isAdmin = roles.includes("ADMIN");
  const isTeacher = roles.includes("TEACHER");
  if (isAdmin) return "ADMIN";
  if (isTeacher) return "TEACHER";
  return "STUDENT";
};
