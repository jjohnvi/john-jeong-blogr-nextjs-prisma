import prisma from "../../../lib/prisma";

// DELETE /api/post/:id

export default async function handle(req, res) {
  const replyId = req.query.id;
  if (req.method === "DELETE") {
    const comment = await prisma.reply.delete({
      where: { id: replyId },
    });
    res.json(comment);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
