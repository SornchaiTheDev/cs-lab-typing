export const getHighestRole = (
  roles: string[]
): "ADMIN" | "TEACHER" | "STUDENT" => {
  const isAdmin = roles.includes("ADMIN");
  const isTeacher = roles.includes("TEACHER");
  if (isAdmin) return "ADMIN";
  if (isTeacher) return "TEACHER";
  return "STUDENT";
};
