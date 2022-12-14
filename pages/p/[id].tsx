import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Router from "next/router";
import Layout from "../../components/Layout";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { TbTrash, TbDotsVertical } from "react-icons/tb";
import { Popover, Transition } from "@headlessui/react";
import {
  HiTrash,
  HiBan,
  HiChat,
  HiOutlineDotsHorizontal,
} from "react-icons/hi";
import { TbArrowLeft, TbSend } from "react-icons/tb";
import DeleteModal from "../../components/DeleteModal";

/**
 * this page used `getServerSideProps` (SSR) instead of `getStaticProps` (SSG).
 * This is because the data is dynamic, it depends on the `id` of the `Post` that's requested in the URL.
 * For example, the view on route `/p/42` displays the `Post` where the `id` is `42`.
 */

/**
 * in this function takes a parameter called params which comes from [id] which is the file name.
 * With the id is how we select which specific post we are updating. In this case, we are only making sure that the post has an author. If this exists, the post will be sent and available.
 * params comes from this component. This is a feature of Next.js
 */

/**
 * getServerSideProps and getStatisProps is only used on pages, not components.
 * Functional components are to be used in components.
 * Prop Types are also to be typed and defined in the page, not in the components.
 * Fetching data is to be done in the pages as well. Big decisions are done in the pages.
 * Deciding what type of information, getting information from prisma/database is done on pages.
 * Otherwise, next/typescript will throw an error.
 * Next.Js set it up so that file paths are how routing would work.
 *
 * So, since this file is named [id].tsx, in the url itself, will have a param.
 * This URL query is filled by the id of the post itself.
 *
 * This is a page.
 * this is a specific post.
 * Now we have access to ID.
 * Because the file name is in square brackets, it will show up as a key in `params`.
 * Now that we have the id, we tell prisma to find a post using this id.
 */
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true, image: true, username: true },
      },
      comments: {
        select: {
          content: true,
          id: true,
          replies: {
            select: {
              content: true,
              id: true,
            },
          },
          user: {
            select: {
              name: true,
              id: true,
              image: true,
              username: true,
            },
          },
        },
      },
    },
  });

  return {
    props: post,
  };
};

/**
 * in Publishpost(), takes in a parameter of ID that we use to edit the specific post
 */

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}

// async function addComment(id: string, content: string): Promise<void> {
//   await fetch(`/api/comment/${id}`, {
//     method: "POST",
//   });
//   Router.push(`/p/${id}`);
// }

type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
    image: string;
    username: string;
  } | null;
  authorId: string;
  content: string;
  published: boolean;
  comments: Array<{
    content: string;
    id: string;
    user: {
      name: string;
      id: string;
      image: string;
      username: string;
    };
  }>;
};

const Post: React.FC<PostProps> = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const [viewEditComment, setViewEditcomment] = useState(false);
  const [viewComment, setViewComment] = useState(false);
  const { data: session, status } = useSession();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  const closeModal = (): void => {
    setShowDeleteModal(false);
  };

  const addComment = async (e: React.SyntheticEvent) => {
    // const submitData: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const body = { content: comment };
      await fetch(`/api/comment?postId=${props.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setComment("");
      changeViewComment();
      await Router.push(`/p/${props.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  async function deleteComment(id: string): Promise<void> {
    await fetch(`/api/comment/${id}`, {
      method: "DELETE",
    });
    setShowDeleteModal(false);
    Router.push(`/p/${props.id}`);
  }

  async function updateComment(
    id: string,
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const body = { content: newComment };
    await fetch(`/api/comment/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setNewComment("");
    changeViewEditComment();
    setEditMode(false);
    Router.push(`/p/${props.id}`);
  }

  const changeViewEditComment = () => {
    setViewEditcomment(!viewEditComment);
  };

  const changeViewComment = () => {
    setViewComment(!viewComment);
  };

  const changeEditMode = () => {
    setEditMode(!editMode);
    setViewEditcomment(true);
  };

  return (
    <Layout>
      <div className="p-4 pb-[62px]">
        <div className="border-b border- border-[#FFD8D8] w-full pb-[24px]">
          <div className="flex justify-between items-center w-6/12 pb-[45px]">
            <button
              className="font-[400] text-[26px]"
              onClick={() => Router.push("/")}
            >
              <TbArrowLeft />
            </button>
            <h1 className="text-[20px] font-[400]">Comments</h1>
          </div>
          <div className="flex items-center pb-[12px]">
            <img
              src={props.author.image}
              className="w-[30px] h-[30px] rounded-full"
            />
            <h2 className="px-[8px] font-[600] text-[14px]">
              {props?.author?.name || "Unknown author"}
            </h2>
            <p className="font-[400] text-[14px] text-[#737373]">
              {"@" + props?.author?.username}
            </p>
          </div>
          <ReactMarkdown children={props.content} />
          {/* {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>
            <HiTrash />
          </button>
        )} */}
        </div>
        <div className="pt-[24px]">
          {props.comments
            ? props.comments.map((comment) => {
                return (
                  <div className="pb-[18px]">
                    <div className="flex justify-between">
                      <div className="flex items-center pb-[12px]">
                        <img
                          src={comment.user.image}
                          className="rounded-full w-[30px] h-[30px]"
                        />
                        <h3 className="px-[8px] font-[600] text-[14px]">
                          {comment.user.name}
                        </h3>
                        <p className="font-[400] text-[14px] text-[#737373]">
                          {"@" + comment.user.username}
                        </p>
                      </div>
                      {session && session.user.id === comment.user.id ? (
                        // <div className="flex items-start justify-end">
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
                              className="absolute z-10 rounded-[8px] w-[163px] h-[32px] bg-[#FFFFFF] shadow-xl right-[4px]"
                            >
                              <div className="flex flex-col w-full h-full ">
                                {/* <div className="flex items-center justify-start  w-full h-full p-[2px]"></div>
                                <div className="border-b border-[#FFD8D8]"></div>
                                <div className="flex items-center justify-start  w-full h-full p-[2px]"></div>
                                <div className="border-b border-[#FFD8D8]"></div> */}
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
                      ) : null}
                    </div>
                    <p>{comment.content}</p>
                    {session && session.user.id === comment.user.id ? (
                      <>
                        {/* {editMode ? (
                          <div>
                            <button onClick={() => changeEditMode()}>
                              <HiOutlineDotsHorizontal />
                            </button>
                            <button onClick={() => deleteComment(comment.id)}>
                              <HiTrash />
                            </button>
                            {viewEditComment ? (
                              <div>
                                <form
                                  onSubmit={(e) => updateComment(comment.id, e)}
                                >
                                  <input
                                    placeholder="New comment..."
                                    onChange={(e) =>
                                      setNewComment(e.target.value)
                                    }
                                    value={newComment}
                                  />
                                  <InputButton
                                    disabled={!newComment}
                                    type="submit"
                                    value="Update"
                                  />
                                </form>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <button onClick={() => changeEditMode()}>
                            <HiOutlineDotsHorizontal />
                          </button>
                        )} */}
                      </>
                    ) : null}
                    <DeleteModal
                      visible={showDeleteModal}
                      onClose={closeModal}
                      onDelete={() => deleteComment(comment.id)}
                      name={"comment"}
                    />
                  </div>
                );
              })
            : null}
        </div>
      </div>
      {props.published ? (
        <div className="flex fixed bottom-0 w-full h-[62px] border-t border-[#FFD8D8] p-[16px] items-center justify-between bg-[#FFFAFA]">
          {session ? (
            <div className="flex items-center w-full bg-[#FFFAFA]">
              <img
                src={session.user.image}
                className="w-[30px] h-[30px] rounded-full"
              />
              <input
                maxLength={255}
                className="border-none bg-[#FFFAFA w-full h-[62px] flex justify-center items-center outline-none resize-none p-[14px] text-[14px] font-[500] placeholder-[#BAB8B8]"
                value={comment}
                placeholder={`Comment as ${session.user.name}...`}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={addComment}
                className="text-[25px] text-[#2D2D2D]"
              >
                <TbSend />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </Layout>
  );
};

export default Post;

const InputButton = styled.input`
  background: #ececec;
  border: 0;
  padding: 0;
  padding: 1rem 2rem;

  &:hover {
    box-shadow: 1px 1px 3px #aaa;

    &:disabled {
      cursor: not-allowed;
      box-shadow: none;
    }
  }
`;
