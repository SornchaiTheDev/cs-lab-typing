import NextAuth from "next-auth";

import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    roles: string;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    roles: string;
  }
}
