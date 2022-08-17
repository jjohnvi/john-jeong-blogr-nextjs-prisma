import prisma from "../../../lib/prisma";

// PUT /api/publish/:id

/**
 * Here we have an async function called handle that takes in two parameters.
 * One to send a request, and one where we get a response back.
 * With req, we make a variable called postId which is from req.query.id;
 * This is how it's going to know which post to edit. Which to actually publish.
 * And to call that promise, we use prisma.post.update.
 * In our data base, we know that we have a post with a unique id and it has a boolean known as published.
 * We will send that to the front end so that the client side will know whether to display the post or not in the feed.
 */

export default async function handle(req, res) {
  const postId = req.query.id;
  const post = await prisma.post.update({
    where: { id: postId },
    data: { published: true },
  });
  res.json(post);
}
