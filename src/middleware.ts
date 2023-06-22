import { withAuth } from "next-auth/middleware";
import { PATH } from "~/constants/PATH";
import { match } from "path-to-regexp";

export default withAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async authorized({ req, token }) {
      if (!token) return false;
      const { nextUrl } = req;
      if (!nextUrl.pathname.startsWith("/cms")) return true;

      const isAuthorized = PATH.some(({ pathname, roles }) => {
        const isInRole = roles.some((role) => token.roles?.includes(role));
        const matching = match(pathname, { decode: decodeURIComponent });
        const isMatch = matching(nextUrl.pathname);

        return !!isMatch && isInRole;
      });

      return isAuthorized;
    },
  },
});
