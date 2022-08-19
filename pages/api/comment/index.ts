import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  const { content } = req.body;
  const { postId } = req.query;
  console.log(postId);

  const session = await getSession({ req });
  const result = await prisma.comment.create({
    data: {
      content: content,
      // 'user': { connect: { email: session?.user?.email } },
      user: {
        connect: {
          email: session?.user?.email,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    },
  });
  res.json(result);
}
