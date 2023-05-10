
import { getSession } from "next-auth/react";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const withAuth =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = session.user;

    return handler(req, res);
  };

export default withAuth;
