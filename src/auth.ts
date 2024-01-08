import { authConfig } from "~/auth.config";
import NextAuth from "next-auth";

export const { handlers, auth } = NextAuth(authConfig);
