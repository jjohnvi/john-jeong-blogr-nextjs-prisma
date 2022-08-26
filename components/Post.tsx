import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
    image: string;
  } | null;
  content: string;
  published: boolean;
};

/**
 * this is how routing starts. This file/component has props. They get the information from the feed. The feed has
 * access to the entire object properties of post. e.g. id, title, content, author, authorId, etc.
 * This is what gets put in the parameter, which is labeled as post.
 * When you console log post, the object of a post appears with all its properties.
 */

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  // console.log(post);
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div
      className="py-4"
      onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
    >
      <div className="flex items-center">
        <img src={post.author.image} className="w-8 h-8 rounded-full" />
        <h2 className="font-semibold flex items-center p-3">{authorName}</h2>
      </div>
      <ReactMarkdown children={post.content} />
    </div>
  );
};

export default Post;
