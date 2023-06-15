import { useSession } from "next-auth/react";

function useRole() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.roles.split(",").includes("ADMIN");
  const isTeacher = session?.user?.roles.split(",").includes("TEACHER");
  const isStudent = session?.user?.roles.split(",").includes("STUDENT");

  return { isAdmin, isTeacher, isStudent };
}

export default useRole;
