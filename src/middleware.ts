import { withAuth } from "next-auth/middleware";
import { PATH } from "@/constants/PATH";

export default withAuth(async function middleware(req) {}, {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async authorized({ req, token }) {
      if (!token) return false;
      return true;
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
