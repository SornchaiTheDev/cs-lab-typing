import { useSession } from "next-auth/react";
import { getHighestRole } from "~/helpers";

function useRole() {
  const { data: session } = useSession();
  const role = getHighestRole(session?.user?.roles);
  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  return { isAdmin, isTeacher, isStudent };
}

export default useRole;
