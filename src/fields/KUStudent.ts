import type { users } from "@prisma/client";
import type { EachField } from "~/components/Forms";
import type { TKUStudentSchema } from "~/schemas/KUStudentSchema";

export function getKUStudentFields(user: users): EachField<TKUStudentSchema>[] {
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
      type: "static-search",
      multiple: true,
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
}
