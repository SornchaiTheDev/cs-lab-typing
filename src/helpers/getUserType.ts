import { isKUStudent, isNonKUStudent, isValidTeacher } from "./isValidUser";

type userType = {
  student_id: string;
  full_name: string;
  email: string;
  password?: string | null;
};

export const getUserType = (user: userType) => {
  if (isKUStudent([user.student_id, user.email, user.full_name]))
    return "KUStudent";
  if (
    isNonKUStudent([
      user.student_id,
      user.password as string,
      user.email,
      user.full_name,
    ])
  )
    return "NonKUStudent";
  if (isValidTeacher([user.email, user.full_name])) return "Teacher";
  return "Admin";
};
