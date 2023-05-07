import { z } from "zod";

export const isKUStudent = (user: string) => {
  const [student_id, email, full_name] = user.split(",");
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

export const isNonKUStudent = (user: string) => {
  const [username, password, email, full_name] = user.split(",");
  const isValidUsername = z
    .string()
    .refine((value) => {
      const firstChar = value.charAt(0);
      return isNaN(parseInt(firstChar)) || /\s/.test(firstChar);
    })
    .safeParse(username).success;
  const isValidPassword = z.string().safeParse(password).success;
  const isValidEmail = z.string().email().safeParse(email).success;
  const isValidName = z.string().min(1).safeParse(full_name).success;
  const isValid =
    isValidUsername && isValidPassword && isValidEmail && isValidName;
  return isValid;
};

export const isValidTeacher = (user: string) => {
  const [email, full_name] = user.split(",");
  const isValidEmail = z.string().email().safeParse(email).success;
  const isValidName = z.string().min(1).safeParse(full_name).success;
  const isValid = isValidEmail && isValidName;
  return isValid;
};
