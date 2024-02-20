import type { roles } from "@prisma/client";

export const hasHigherRoleThan = (currentRoles: roles[], role: roles) => {
  // let filterRoles;
  if (role === "ADMIN") throw new Error("THIS_IS_HIGHEST_ROLE");
  // switch (role) {
  //   case "TEACHER":
  //     filterRoles = ["ADMIN"];
  //   case "STUDENT":
  //     filterRoles = ["TEACHER", "ADMIN"];
  // }

  return currentRoles.includes(role);
};
