import "next-auth";
import type { roles } from "@prisma/client";

declare module "next-auth" {
  interface User {
    roles: roles[];
    full_name: string;
    student_id: string;
  }

  interface Session {
    user: null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    roles: roles[];
    full_name: string;
    email: string;
    image: string;
    student_id: string;
  }
}
