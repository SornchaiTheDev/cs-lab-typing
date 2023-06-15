export const getHighestRole = (
  roleString: string | undefined
): "ADMIN" | "TEACHER" | "STUDENT" | null => {
  if (roleString === undefined) return null;

  const roles = roleString.split(",");
  const isAdmin = roles.includes("ADMIN");
  const isTeacher = roles.includes("TEACHER");
  if (isAdmin) return "ADMIN";
  if (isTeacher) return "TEACHER";
  return "STUDENT";
};
