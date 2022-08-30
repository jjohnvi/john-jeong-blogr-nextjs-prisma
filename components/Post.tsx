import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import { useRouter } from "next/router";
import { TbTrash, TbHeart, TbBrandHipchat } from "react-icons/tb";
import { useSession } from "next-auth/react";

export type PostProps = {
  id: string;
  title: string;
  author: {
    username: string;
    name: string;
    email: string;
    image: string;
    id: string;
  } | null;
  authorId: string;
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
  const { data: session, status } = useSession();
  const isActive: (pathname: String) => boolean = (pathname) =>
    router.pathname === pathname;
  const authorName = post.author ? post.author.name : "Unknown author";

  async function deletePost(id: string): Promise<void> {
    await fetch(`/api/post/${id}`, {
      method: "DELETE",
    });
    if (isActive("/")) {
      Router.push("/");
    } else if (isActive("/drafts")) {
      Router.push("/drafts");
    }
  }

  console.log(post);
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {isActive("/") && (
          <>
            <div className="flex justify-start items-center w-full">
              <img
                src={post.author.image}
                className="w-[30px] h-[30px] rounded-full"
              />
              <h2 className="font-semibold flex items-center p-[8px]">
                {authorName}
              </h2>
              <div className="font-[400] text-[14px] text-[#737373]">
                {"@" + post.author.username}
              </div>
            </div>
            {session && session.user.id === post.authorId ? (
              <button
                onClick={() => deletePost(post.id)}
                className="flex justify-end w-[16px] h-[18px]"
              >
                <TbTrash />
              </button>
            ) : null}
          </>
        )}
        {/* <div className="mb-2 flex justify-between w-full"> */}
        {isActive("/drafts") && (
          <div className="">
            {post.published && (
              <div className="mb-2 flex justify-between w-full">
                <div className="flex justify-center items-center rounded-[16px] w-[100px] h-[32px] bg-[#FF7070] p-[8px] text-[#FFFAFA] text-[14px]">
                  Pubished
                </div>
              </div>
            )}
          </div>
        )}
        {!post.published && (
          <div className="mb-2 flex justify-between w-full">
            <div className="flex justify-center items-center rounded-[16px] w-[100px] h-[32px] bg-[#D9D9D9] p-[8px] text-[14px]">
              Unpublished
            </div>
          </div>
        )}
        {session && isActive("/drafts") && session.user.id === post.authorId ? (
          <button
            onClick={() => deletePost(post.id)}
            className="flex justify-end w-[16px] h-[18px]"
          >
            <TbTrash />
          </button>
        ) : null}
        {/* </div> */}
      </div>
      <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
        <ReactMarkdown children={post.content} />
        {isActive("/") && (
          <div className="flex pt-4">
            <TbHeart />
            <TbBrandHipchat />
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
