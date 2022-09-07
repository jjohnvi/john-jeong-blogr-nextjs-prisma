import React, { useState } from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import { useRouter } from "next/router";
import {
  TbTrash,
  TbHeart,
  TbBrandHipchat,
  TbDotsVertical,
  TbPencil,
} from "react-icons/tb";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Like } from "@prisma/client";
import { Popover, Transition } from "@headlessui/react";
import prisma from "../lib/prisma";
import EditModal from "./EditModal";

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
  _count: { comments: number; likes: number };
  likes: Like[];
};

/**
 * this is how routing starts. This file/component has props. They get the information from the feed. The feed has
 * access to the entire object properties of post. e.g. id, title, content, author, authorId, etc.
 * This is what gets put in the parameter, which is labeled as post.
 * When you console log post, the object of a post appears with all its properties.
 */

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
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

  const likePost = async (postId): Promise<void> => {
    await axios.post(`/api/like/${postId}`);
    Router.push("/");
  };

  const closeModal = (): void => {
    setShowDeleteModal(false);
  };

  /**
   * in this deleteLike api call, we take in a parameter called postId, because that was our first requirement from req.query.id
   * in the api delete [id].ts file. This will be passed in from the props this component receives from the main page (index.ts).
   * With this delete request, we pass in the postId in the parameter and then we also send the userId in the body as it expects
   * in the api file. This function does not need a second parameter because we will be sending the
   * session.user.id as the body which comes from UseSession();.
   */

  const deleteLike = async (postId): Promise<void> => {
    await axios.delete(`/api/like/delete/${postId}`, {
      data: { userId: session.user.id },
    });
    Router.push("/");
  };

  const loggedInUserId = session?.user.id;
  const isPostLiked = post.likes
    ?.map((like) => {
      return like.userId;
    })
    .includes(loggedInUserId);

  // const likeDiv = post.likes.map((like) => {
  //   return (
  //     <div
  //       onClick={() => deleteLike(like.id)}
  //       className="flex items-center text-[17px]"
  //     >
  //       <div className="">
  //         <TbHeart className="fill-[#FF7070]" />
  //       </div>
  //       {post?._count?.likes !== 0 ? (
  //         <div className="px-[3px]">{post?._count?.likes}</div>
  //       ) : null}
  //     </div>
  //   );
  // });

  // console.log(likeId);
  // console.log(isPostLiked);
  // console.log(post);
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
              <Popover className="relative">
                <Popover.Button className="outline-none">
                  <TbDotsVertical />
                </Popover.Button>
                <Transition
                  enter="transition duration-300 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-300 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Popover.Panel
                    static
                    className="absolute z-10 rounded-[8px] w-[163px] h-[64px] bg-[#FFFFFF] shadow-xl right-[4px]"
                  >
                    <div className="flex flex-col w-full h-full ">
                      <div className="flex items-center justify-start  w-full h-full p-[2px]">
                        <button className="flex items-center justify-start text-[14px] px-[13.67px] hover:bg-[#FFD8D8] rounded-[8px] w-full h-full">
                          <div className="pr-[9.11px]">
                            <TbPencil />
                          </div>
                          edit
                        </button>
                      </div>
                      <div className="border-b border-[#FFD8D8]"></div>
                      <div className="flex items-center justify-start w-full h-full p-[2px]">
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="flex items-center justify-start text-[14px] px-[13.67px] hover:bg-[#FFD8D8] rounded-[8px] w-full h-full"
                        >
                          <div className="pr-[9.11px]">
                            <TbTrash />
                          </div>
                          delete
                        </button>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
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
          <Popover className="relative">
            <Popover.Button className="outline-none">
              <TbDotsVertical />
            </Popover.Button>
            <Transition
              enter="transition duration-300 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-300 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel
                static
                className="absolute z-10 rounded-[8px] w-[163px] h-[64px] bg-[#FFFFFF] shadow-xl right-[4px]"
              >
                <div className="flex flex-col w-full h-full ">
                  <div className="flex items-center justify-start  w-full h-full p-[2px]">
                    <button className="flex items-center justify-start text-[14px] px-[13.67px] hover:bg-[#FFD8D8] rounded-[8px] w-full h-full">
                      <div className="pr-[9.11px]">
                        <TbPencil />
                      </div>
                      edit
                    </button>
                  </div>
                  <div className="border-b border-[#FFD8D8]"></div>
                  <div className="flex items-center justify-start w-full h-full p-[2px]">
                    <button
                      onClick={() => deletePost(post.id)}
                      className="flex items-center justify-start text-[14px] px-[13.67px] hover:bg-[#FFD8D8] rounded-[8px] w-full h-full"
                    >
                      <div className="pr-[9.11px]">
                        <TbTrash />
                      </div>
                      delete
                    </button>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        ) : null}
        {/* </div> */}
      </div>
      <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
        <ReactMarkdown children={post.content} />
      </div>
      {isActive("/") && (
        <div className="flex pt-4 items-center">
          {!isPostLiked ? (
            <div
              onClick={() => likePost(post.id)}
              className="flex items-center text-[17px]"
            >
              <div>
                <TbHeart />
              </div>
              {post?._count?.likes !== 0 ? (
                <div className="px-[3px]">{post?._count?.likes}</div>
              ) : null}
            </div>
          ) : (
            isPostLiked && (
              <>
                <div
                  onClick={() => deleteLike(post.id)}
                  className="flex items-center text-[17px]"
                >
                  <div className="">
                    <TbHeart className="fill-[#FF7070]" />
                  </div>
                  {post?._count?.likes !== 0 ? (
                    <div className="px-[3px]">{post?._count?.likes}</div>
                  ) : null}
                </div>
              </>
            )
          )}
          <div className="flex items-center text-[17px]">
            <div className="pr-[3px]">
              <TbBrandHipchat />
            </div>
            {post?._count?.comments !== 0 ? post?._count?.comments : null}
          </div>
        </div>
      )}
      <EditModal
        onClose={closeModal}
        visible={showDeleteModal}
        deletePost={deletePost}
        postId={post.id}
      />
    </div>
  );
};

export default Post;
