import prisma from "../../../lib/prisma";



export default async function handle(req, res) {
  const {postId} = req.query;
  const likesArr = await prisma.like.findMany({
    where: {
      postId: postId
    },
    include: {
      post: {
        select: { likes: true },
      },
    },
  });
  return {likesArr}
};
