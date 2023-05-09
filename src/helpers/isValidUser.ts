import { z } from "zod";

type userType = {
  student_id?: string;
  full_name: string;
  email: string;
  password?: string | null;
};

export const isKUStudent = (user: string[]) => {
  const [student_id, email, full_name] = user;
  const isValidStudentID = z
    .string()
    .length(10)
    .refine((val) => parseInt(val))
    .safeParse(student_id).success;
  const isValidEmail = z.string().email().safeParse(email).success;
  const isValidName = z.string().min(1).safeParse(full_name).success;
  const isValid = isValidStudentID && isValidEmail && isValidName;
  return isValid;
};

export const isNonKUStudent = (user: string[]) => {
  const [username, password, email, full_name] = user;
  const isValidUsername = z
    .string()
    .refine((value) => {
      const firstChar = value.charAt(0);
      return isNaN(parseInt(firstChar)) || /\s/.test(firstChar);
    })
    .safeParse(username).success;
  const isValidPassword = z.string().safeParse(password).success;
  const isValidEmail = z.string().email().safeParse(email).success;
  const isValidFullName = z.string().min(1).safeParse(full_name).success;
  const isValid =
    isValidUsername && isValidPassword && isValidEmail && isValidFullName;
  return isValid;
};

export const isValidTeacher = (user: string[]) => {
  const [email, full_name] = user;
  const isValidEmail = z.string().email().safeParse(email).success;
  const isValidName = z.string().min(1).safeParse(full_name).success;
  const isValid = isValidEmail && isValidName;
  return isValid;
};

export const importTeacher = (user: string[]) => {
  const [email, full_name] = user;
  const isValidEmail = z.string().email().safeParse(email).success;
  const isValidFullName = z.string().min(1).safeParse(full_name).success;
  return isValidEmail && isValidFullName;
};

export const isAllUserValid = (users: string[]) => {
  return users
    .map((user) => {
      const splittedUser = user.split(",");
      return (
        isKUStudent(splittedUser) ||
        isNonKUStudent(splittedUser) ||
        isValidTeacher(splittedUser)
      );
    })
    .every((isValid) => isValid);
};
