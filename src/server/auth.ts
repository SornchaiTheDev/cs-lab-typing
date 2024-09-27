import type {
  NextApiRequest,
  GetServerSidePropsContext,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";
import { api } from "~/services/Axios";
import NextAuth from "next-auth/next";
import type { roles } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      roles: roles[];
      full_name: string;
      student_id: string;
    };
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    roles: roles[];
    full_name: string;
    email: string;
    image: string;
    student_id: string;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: {
        timeout: 1 * 60 * 1000,
      },
    }),
    CredentialsProvider({
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
                student_id: credentials.username,
                deleted_at: null,
              },
            });

            if (user) {
              const samePassword = await bcrypt.compare(
                credentials.password,
                user.password as string
              );

              if (samePassword) {
                return {
                  id: user.student_id,
                  student_id: user.student_id,
                  full_name: user.full_name,
                  email: user.email,
                };
              }
              await api.post("/auth-logger", {
                type: "FAILED-LOGIN",
                email: user.email,
                ip: req.headers ? req.headers["x-forwarded-for"] : "localhost",
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
    async signIn({ account, profile }) {
      if (account) {
        if (account.type === "credentials") {
          return true;
        }
        if (account.type === "oauth") {
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
          roles: token.roles,
          full_name: token.full_name,
          student_id: token.student_id,
          email: token.email,
          image: token.image,
        },
      };
    },
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export const withAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const authOptionsPlusEvents: NextAuthOptions = {
    ...authOptions,
    events: {
      async signIn(message) {
        const { user } = message;
        try {
          await api.post("/auth-logger", {
            type: "LOGIN",
            email: user.email,
            ip: req.headers ? req.headers["x-forwarded-for"] : "localhost",
          });
        } catch (err) {}
      },
      async signOut(message) {
        const { token } = message;
        try {
          await api.post("/auth-logger", {
            type: "LOGOUT",
            email: token.email,
            ip: req.headers ? req.headers["x-forwarded-for"] : "localhost",
          });
        } catch (err) {}
      },
    },
  };
  return NextAuth(req, res, authOptionsPlusEvents);
};
