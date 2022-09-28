import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  const { content } = req.body;
  const { commentId } = req.query;

  const session = await getSession({ req });
  const result = await prisma.reply.create({
    data: {
      content: content,
      // 'user': { connect: { email: session?.user?.email } },
      user: {
        connect: {
          email: session?.user?.email,
        },
      },
      comment: {
        connect: {
          id: commentId,
        },
      },
    },
  });
  res.json(result);
}
