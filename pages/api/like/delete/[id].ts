import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  const postId = req.query.id;
  const { userId } = req.body;
  if (req.method === "DELETE") {
    const like = await prisma.like.delete({
      where: {
        userId_postId: {
          postId: postId,
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

/**
 * Here we switched from likeId from req.query.id to postId and userId.
 * We needed to figure out a way to delete the like that made it unique so we can delete that specific like from the user.
 * If it was likeId, it'd just take anyone's like and delete it.
 * Because we have @ @ unique on the prisma schema in the likes table, we have to bring that in as the object where it holds
 * both postId and userId as an object. Hence line 9-12
 */
