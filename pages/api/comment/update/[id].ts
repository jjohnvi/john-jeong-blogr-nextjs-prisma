import prisma from "../../../../lib/prisma";

export default async function handle(req, res) {
  const commentId = req.query.id;
  const { content } = req.body;
  if (req.method === "PUT") {
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content },
    });
    res.json(comment);
  }
}
