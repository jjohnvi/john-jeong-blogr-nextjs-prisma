import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  const { content } = req.body;
  const { postId } = req.query;
  // console.log(postId);

  const session = await getSession({ req });
  if (req.method === "POST") {
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
else if (req.method === "GET") {
  const comments = await prisma.comment.findMany({
    where: {postId: postId},
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {name: true, email: true, image: true, username: true}
      },
      _count: {
        select: {likes: true},
      },
      likes: true
    }
  })
}
}
