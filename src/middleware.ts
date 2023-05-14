import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { PATH } from "@/constants/PATH";

export default withAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async authorized({ req }) {
      const token = await getToken({ req, secret: process.env.JWT_SECRET });
      return !!token;
      // const { nextUrl } = req;

      // const resolvePath = PATH.find(
      //   ({ pathname }) => nextUrl.pathname === pathname
      // );

      // if (resolvePath === undefined) return true;

      // const isAuthorized = resolvePath?.roles.some((role) =>
      //   token?.roles!.includes(role)
      // );

      // return isAuthorized;
    },
  },
});
