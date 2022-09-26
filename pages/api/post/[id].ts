// pages/api/post/:d
import prisma from "../../../lib/prisma";

// DELETE /api/post/:id

export default async function handle(req, res) {
  const postId = req.query.id;
  if (req.method === "DELETE") {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.json(post);
    /**
     * here for the PUT Method, we had two things in mind that we wanted to change which was the content of the post and to change if it's published
     * or not. The reason we wrote it this way is because I wanted to use this in two different components, only changing one thing
     * on each of those components. Changing two different things on two different components. So this still needed to take in two
     * things from the body which is content and published.
     */
  } else if (req.method === "PUT") {
    const { content, published } = req.body;
    // console.log(typeof published);
    const currentPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content: content || currentPost.content,
        published: published !== undefined ? published : currentPost.published,
      },
    });
    res.json(updatedPost);
  } else if (req.method === "GET") {
    const postId = req.query.id
    // console.log(postId);
      const post = await prisma.post.findUnique({
        where: {
          id: String(postId),
        },
        include: {
          author: {
            select: { name: true, email: true, image: true, username: true },
          },
          comments: {
            select: {content: true, id: true, user: true, likes: true },
          }
        },
      });
    
      return res.json(post)}
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
