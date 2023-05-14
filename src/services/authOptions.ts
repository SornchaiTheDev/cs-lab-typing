import { prisma } from "@/server/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { api } from "./Axios";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "NonKU Login",
      credentials: {
        username: { label: "username", type: "text", placeholder: "jsmith" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials) {
          const user = await prisma.users.findUnique({
            where: {
              student_id: credentials.username,
            },
            include: {
              roles: true,
            },
          });

          if (user) {
            const samePassword = await bcrypt.compare(
              credentials.password,
              user.password!
            );

            await api.post("/auth-logger", {
              type: samePassword ? "LOGIN" : "FAILED-LOGIN",
              email: user.email,
            });

            if (samePassword) {
              return {
                id: user.student_id,
                student_id: user.student_id,
                full_name: user.full_name,
                email: user.email,
                image: "/assets/profile-placeholder.png",
              };
            }
          }
          throw new Error("wrong-credential");
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.roles = token.roles;
        session.full_name = token.full_name;
        session.email = token.email;
      }
      return session;
    },
  },
};
