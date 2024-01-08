import { env } from "~/env.mjs";
import Google from "next-auth/providers/google";
import Credential from "next-auth/providers/credentials";
import { prisma } from "~/server/db";
import { api } from "~/services/Axios";
import bcrypt from "bcrypt";
import type { roles } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credential({
      name: "NonKU Login",
      credentials: {
        username: { label: "username", type: "text", placeholder: "jsmith" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (credentials) {
            const user = await prisma.users.findFirst({
              where: {
                student_id: credentials.username as string,
                deleted_at: null,
              },
            });

            if (user) {
              const samePassword = await bcrypt.compare(
                credentials.password as string,
                user.password as string
              );

              if (samePassword) {
                return {
                  id: user.student_id,
                  student_id: user.student_id,
                  roles: user.roles as roles[],
                  full_name: user.full_name,
                  email: user.email,
                };
              }
              await api.post("/auth-logger", {
                type: "FAILED-LOGIN",
                email: user.email,
                ip: req.headers
                  ? req.headers.get("x-forwarded-for")
                  : "localhost",
              });
            }
            throw new Error("wrong-credential");
          }
        } catch (err) {
          throw new Error("wrong-credential");
        }

        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ account, profile }) {
      if (account) {
        if (account.type === "credentials") {
          return true;
        }
        if (account.type === "oidc") {
          try {
            if (profile && profile.email?.endsWith("@ku.th")) {
              const user = await prisma.users.findFirst({
                where: {
                  email: profile.email,
                  deleted_at: null,
                },
              });

              if (user?.deleted_at === null) {
                return true;
              }
              throw new Error("not-found");
            }
          } catch (err) {
            throw new Error("something-went-wrong");
          }
        }
        throw new Error("not-authorize");
      }
      return false;
    },
    async jwt({ token, user }) {
      try {
        //   // TODO : wait to implement redis here
        const fetchUser = await prisma.users.findFirst({
          where: {
            email: token.email as string,
            deleted_at: null,
          },
        });
        token.roles = fetchUser?.roles as roles[];
        token.full_name = fetchUser?.full_name as string;
        token.student_id = fetchUser?.student_id as string;
      } catch (err) {}

      if (user) {
        token.image = user.image ?? "/assets/profile-placeholder.png";
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.student_id,
          roles: token.roles,
          full_name: token.full_name,
          student_id: token.student_id,
          email: token.email,
          image: token.image,
        },
      };
    },
  },
} satisfies NextAuthConfig;
