import { withAuth } from "next-auth/middleware";
import { prisma } from "@/server/prisma";

export default withAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async authorized({ req, token }) {
      return !!token;
    },
  },
});
