import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/server/prisma";
import bcrypt from "bcrypt";

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

            if (samePassword) {
              return {
                id: user.student_id,
                student_id: user.student_id,
                full_name: user.full_name,
                email: user.email,
                roles: JSON.stringify(user.roles.map((role) => role.name)),
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
        }
      }
      throw new Error("not-authorize");
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
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.roles = token.roles;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
