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
  TbFileExport,
  TbFileSymlink,
} from "react-icons/tb";
import { useSession } from "next-auth/react";
import axios from "axios";

import { Popover, Transition } from "@headlessui/react";
import prisma from "../lib/prisma";
import DeleteModal from "./DeleteModal";

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
  likes: Array<{
    content: string;
    id: string;
    userId: string;
    user: {
      name: string;
      id: string;
      image: string;
      username: string;
    };
  }>;
};

/**
 * this is how routing starts. This file/component has props. They get the information from the feed. The feed has
 * access to the entire object properties of post. e.g. id, title, content, author, authorId, etc.
 * This is what gets put in the parameter, which is labeled as post.
 * When you console log post, the object of a post appears with all its properties.
 */

const DraftPost: React.FC<{ post: PostProps; savePostId: () => void }> = ({
  post,
  savePostId,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [publish, setPublish] = useState<boolean>(post.published);
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

  async function publishPost(id: string): Promise<void> {
    // setPublish(true);
    await axios.put(`/api/post/${id}`, { published: !post.published });
    Router.push("/drafts");
  }

  async function unpublishPost(id: string): Promise<void> {
    // setPublish(false);
    console.log("unpublishfired");
    await axios.put(`api/post/${id}`, { published: false });
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

  // console.log(likeId);
  // console.log(isPostLiked);

  return (
    <div className="py-4 md:py-8">
      <div className="flex items-center md:items-start justify-between">
        {/* <div className="mb-2 flex justify-between w-full"> */}
        {isActive("/drafts") && (
          <div className="">
            {post.published && (
              <div className="mb-2 md:mb-3 flex justify-between w-full">
                <div className="flex justify-center items-center rounded-[16px] w-[100px] h-[32px] bg-[#FF7070] p-[8px] text-[#FFFAFA] text-[14px]">
                  Pubished
                </div>
              </div>
            )}
          </div>
        )}
        {!post.published && (
          <div className="mb-2 md:mb-3 flex justify-between w-full">
            <div className="flex justify-center items-center rounded-[16px] w-[100px] h-[32px] bg-[#D9D9D9] p-[8px] text-[14px]">
              Unpublished
            </div>
          </div>
        )}
        {session && isActive("/drafts") && session.user.id === post.authorId ? (
          <div>
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
                  className="absolute z-10 rounded-[8px] w-[163px] h-[95px] bg-[#FFFFFF] shadow-xl right-[4px]"
                >
                  <div className="flex flex-col w-full h-full ">
                    <div className="flex items-center justify-start  w-full h-full p-[2px]">
                      {!post.published ? (
                        <button
                          className="flex items-center justify-start text-[14px] px-[13.67px] hover:bg-[#FFD8D8] rounded-[8px] w-full h-full"
                          onClick={() => publishPost(post.id)}
                        >
                          <div className="pr-[9.11px]">
                            <TbFileExport />
                          </div>
                          Publish
                        </button>
                      ) : (
                        <button
                          className="flex items-center justify-start text-[14px] px-[13.67px] hover:bg-[#FFD8D8] rounded-[8px] w-full h-full"
                          onClick={() => publishPost(post.id)}
                        >
                          <div className="pr-[9.11px]">
                            <TbFileSymlink />
                          </div>
                          Unpublish
                        </button>
                      )}
                    </div>
                    <div className="border-b border-[#FFD8D8]"></div>
                    <div className="flex items-center justify-start  w-full h-full p-[2px]">
                      <button
                        className="flex items-center justify-start text-[14px] px-[13.67px] hover:bg-[#FFD8D8] rounded-[8px] w-full h-full"
                        onClick={() => Router.push("/u/[id]", `/u/${post.id}`)}
                      >
                        <div className="pr-[9.11px]">
                          <TbPencil />
                        </div>
                        Edit
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
                        Delete
                      </button>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
        ) : null}
        {/* </div> */}
      </div>
      <div
        className="text-[14px] md:hidden"
        onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
      >
        <ReactMarkdown children={post.content} />
      </div>
      <div className="text-[14px] hidden md:block" onClick={savePostId}>
        <ReactMarkdown children={post.content} />
      </div>

      <div className="hidden pt-4 items-center md:flex">
        {!isPostLiked ? (
          <div
            onClick={() => likePost(post.id)}
            className="flex items-center text-[17px] md:w-[110px] md:justify-start"
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
              <div className="hidden md:flex md:w-[110px] md:justify-start">
                <div
                  onClick={() => deleteLike(post.id)}
                  className="flex items-center text-[17px]"
                >
                  <div className="pr-[3px]">
                    <TbHeart className="fill-[#FF7070]" />
                  </div>
                  {post?._count?.likes !== 0 ? (
                    <div className="">{post?._count?.likes}</div>
                  ) : null}
                </div>
              </div>
            </>
          )
        )}
        <div className="hidden md:flex w-[80px] justify-start">
          <div className="flex items-center text-[17px]">
            <div className="pr-[3px]">
              <TbBrandHipchat />
            </div>
            {post?._count?.comments !== 0 ? post?._count?.comments : null}
          </div>
        </div>
      </div>

      <DeleteModal
        onClose={closeModal}
        visible={showDeleteModal}
        onDelete={() => deletePost(post.id)}
        name={"post"}
      />
    </div>
  );
};

export default DraftPost;
