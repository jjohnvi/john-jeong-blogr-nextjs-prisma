import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  const { id } = req.query;

  const session = await getSession({ req });
  const result = await prisma.like.create({
    data: {
      user: {
        connect: {
          email: session?.user?.email,
        },
      },
      post: {
        connect: {
          id,
        },
      },
    },
  });
  res.json(result);
}
