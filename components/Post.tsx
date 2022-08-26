import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const isActive: (pathname: String) => boolean = (pathname) =>
    router.pathname === pathname;
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div
      className="py-4"
      onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
    >
      <div className="flex items-center">
        {isActive("/") && (
          <>
            <img
              src={post.author.image}
              className="w-[30px] h-[30px] rounded-full"
            />
            <h2 className="font-semibold flex items-center p-[8px]">
              {authorName}
            </h2>{" "}
          </>
        )}
        {isActive("/drafts") && (
          <div className="">
            {post.published && (
              <div className="flex justify-center items-center rounded-[16px] w-[100px] h-[32px] bg-[#FF7070] p-[8px] text-[#FFFAFA] text-[14px]">
                Pubished
              </div>
            )}
          </div>
        )}
        {!post.published && (
          <div className="flex justify-center items-center rounded-[16px] w-[100px] h-[32px] bg-[#D9D9D9] p-[8px] text-[14px]">
            Unpublished
          </div>
        )}
      </div>
      <ReactMarkdown children={post.content} />
    </div>
  );
};

export default Post;
