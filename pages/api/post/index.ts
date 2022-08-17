// pages/api/post/index.ts

import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content

// this code implements the handler function for any requests coming in at the `/api/post/` route.
// It extracts the `title` and `content` from the body of the incoming HTTP POST request. After, it checks whether the request in coming from an authenticated user with the `getSession` helper function
// NextAuth.js. Finally, it uses Prisma Client to create a new `Post` record in the database.

export default async function handle(req, res) {
  const { title, content } = req.body;

  const session = await getSession({ req });
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}
