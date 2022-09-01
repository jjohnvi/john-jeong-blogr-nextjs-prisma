import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  const likeId = req.query.id;
  if (req.method === "DELETE") {
    const like = await prisma.like.delete({
      where: { id: likeId },
    });
    res.json(like);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
