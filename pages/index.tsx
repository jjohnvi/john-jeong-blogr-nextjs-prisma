import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import styled from "styled-components";

//prisma is the interface to the database when you want to read and write
/**
 * data in it. You can create new `User` record by calling `prisma.user.create()`or
 * retrieve all the `Post`recordsfrom the database with `prisma.post.findMany()`.
 */

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: { username: true, email: true, image: true, name: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
      likes: true,
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

/**
 * A `where` filter is specified to include only `Post` records where `published` is `true` line 15.
 * The `name` of the `author` of the `Post` record is queried as well and will be included in the returned objects. Line 16-18
 */

type Props = {
  feed: PostProps[];
};

/**
 * console.log(props) brings an OBJECT that has an array of the posts.
 * passing down props, which came from prisma.post.findMany
 * needs to be put in the parameter of the Blog function to be able to map through the posts to display
 * it in the feed and to pass down the props info to the Post component which is the child of this page.
 * It goes to /p/${post.id} which is the params.
 *
 * To not be confused which component you're passing it down to, remember
 * that typescript requires you to type the type out on the component you're passing it down to.
 * That component will expect all those properties to be typed out or typescript will throw and error.
 */

const Blog: React.FC<Props> = (props) => {
  console.log(props);
  return (
    <Layout>
      <div className="flex">
        <div className="page">
          <main>
            {props.feed.map((post) => (
              <div
                key={post.id}
                className="px-4 md:border-b-[1px] md:border-[#FFD8D8]"
              >
                <Post post={post} />
              </div>
            ))}
          </main>
        </div>
        <div className="hidden md:block">
          <div className="w-[290px] min-h-screen p-4 border-l-[1px] border-[#FFD8D8]">
            Comments
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
