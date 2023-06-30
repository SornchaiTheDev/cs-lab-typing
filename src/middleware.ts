import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { PATH } from "~/constants/PATH";
import { match } from "path-to-regexp";
import csrf from "edge-csrf";

const csrfProtect = csrf({
  cookie: {
    name: "token",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10,
  },
});

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const { nextUrl } = request;
    const response = NextResponse.next();

    const matching = match("/courses/:courseId/labs/:labId/typing/:taskId", {
      decode: decodeURIComponent,
    });
    const isMatch = matching(nextUrl.pathname);
    const isNotSubmitTyping = nextUrl.pathname !== "/api/submitTyping";
    if (!isMatch && isNotSubmitTyping) return response;

    // csrf protection
    const csrfError = await csrfProtect(request, response);

    // check result
    if (csrfError) {
      return new NextResponse("INVALID_TOKEN", { status: 403 });
    }

    return response;
  },
  {
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
  }
);
