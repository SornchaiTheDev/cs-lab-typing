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

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account) {
        if (account.type === "credentials") {
          return true;
        }
        if (account.type === "oauth") {
          try {
            if (profile && profile.email?.endsWith("@ku.th")) {
              const user = await prisma.users.findUnique({
                where: {
                  email: profile.email,
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
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        const fetchUser = await prisma.users.findUnique({
          where: {
            email: user.email as string,
          },
          include: {
            roles: true,
          },
        });
        token.roles = JSON.stringify(fetchUser?.roles.map((role) => role.name));
        token.full_name = fetchUser?.full_name!;
      }
      return token;
    },
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
