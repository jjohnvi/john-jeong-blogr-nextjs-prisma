import prisma from "../../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    if(req.method === "POST") {
    const {id} = req.query;

    const session = await getSession({req});
    const result = await prisma.like.create({
        data: {
            user: {
                connect: {
                    // email: session?.user?.email,
                    id: session?.user?.id
                }
            },
            comment: {
                connect: {
                    id,
                }
            }
        }
    })
    res.json(result);
}
else if (req.method === "DELETE") {
    const commentId = req.query.id;
    const {userId} = req.body;
    const like = await prisma.like.delete({
        where: {
          userId_commentId: {
            commentId: commentId,
            userId: userId,
          },
        },
      });
      res.json(like);
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
}
}