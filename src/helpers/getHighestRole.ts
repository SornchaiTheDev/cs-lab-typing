import type { roles } from "@prisma/client";

export const getHighestRole = (roles: roles[]) => {
  const isAdmin = roles.includes("ADMIN");
  const isTeacher = roles.includes("TEACHER");
  const isStudent = roles.includes("STUDENT");
  if (isAdmin) return "ADMIN";
  if (isTeacher) return "TEACHER";
  if (isStudent) return "STUDENT";
  return null;
};
