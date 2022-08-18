import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
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
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
        div:hover {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Post;
