import type { users } from "@prisma/client";
import type { EachField } from "~/components/Forms";
import type { TTeacherSchema } from "~/schemas/TeacherSchema";

export const getTeacherFields = (user: users): EachField<TTeacherSchema>[] => {
  if (!user) return [];

  return [
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
};
