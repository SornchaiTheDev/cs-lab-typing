import type { users } from "@prisma/client";
import type { EachField } from "~/components/Forms";
import type { FormSchema } from "~/hooks/useEditUser";

export const getKUStudentFields = (
  user: users
): EachField<FormSchema<"KUStudent">>[] => {
  if (!user) return [];

  return [
    {
      label: "student_id",
      title: "Student ID",
      type: "text",
      value: user.student_id,
    },
    {
      label: "email",
      title: "Email",
      type: "text",
      value: user.email,
      disabled: true,
    },
    {
      label: "full_name",
      title: "Full Name",
      type: "text",
      value: user.full_name,
    },
    {
      label: "roles",
      title: "Roles",
      type: "multiple-search",
      options: [
        { label: "Student", value: "STUDENT" },
        { label: "Teacher", value: "TEACHER" },
        { label: "Admin", value: "ADMIN" },
      ],
      value: user.roles.map((role) => ({
        label: role.charAt(0) + role.slice(1).toLowerCase(),
        value: role,
      })),
    },
  ];
};
