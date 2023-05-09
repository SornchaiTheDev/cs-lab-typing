import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ req, token }) {
      console.log(token)
      return !!token;
    },
  },
});
