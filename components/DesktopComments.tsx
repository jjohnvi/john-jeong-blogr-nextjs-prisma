import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";
import {
  TbX,
  TbSend,
  TbDotsVertical,
  TbTrash,
  TbHeart,
  TbBrandHipchat,
} from "react-icons/tb";
import Router from "next/router";
import { useRouter } from "next/router";
import { Popover, Transition } from "@headlessui/react";
import DeleteModal from "../components/DeleteModal";
import { Like } from "@prisma/client";

interface ResData {
  author: {
    name: string;
    email: string;
    image: string;
    username: string;
  };
  authorId: string;
  comments: Array<Comment>;
  content: string;
  createdAt: string;
  id: string;
  published: boolean;
}

interface Comment {
  id: string;
  content: string;
  likes: Like[];
  _count: { likes: number };
  user: {
    image: string;
    name: string;
    username: string;
    id: string;
  };
}

const DesktopComments: React.FC<{
  postId: string;
  closeComments: () => void;
}> = ({ postId, closeComments }) => {
  const [data, setData] = useState<ResData>();
  const [comment, setComment] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const router = useRouter();
  const isActive: (pathname: String) => boolean = (pathname) =>
    router.pathname === pathname;

  const closeModal = (): void => {
    setShowDeleteModal(false);
  };

  /**
   * UseEffect.
   * at the end, there is an array. If the array is empty, it's basically a componentDidMount.
   * Right there, I have postId in the array which means this component will look if there is any change of postId and if there is, the component will
   * immediately update it. It is basically subscribed to the postId
   */

  const { data: session, status } = useSession();

  const addComment = async (e: React.SyntheticEvent) => {
    // const submitData: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const body = { content: comment };
      await fetch(`/api/comment?postId=${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setComment("");
      fetchResult();
      if (isActive("/")) {
        Router.push("/");
      } else if (isActive("/drafts")) {
        Router.push("/drafts");
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function deleteComment(id: string): Promise<void> {
    await axios.delete(`/api/comment/${id}`);
    setShowDeleteModal(false);
    fetchResult();
    if (isActive("/")) {
      Router.push("/");
    } else if (isActive("/drafts")) {
      Router.push("/drafts");
    }
  }

  const fetchResult = async () => {
    const result = await axios.get(`/api/post/${postId}`);
    setData(result.data);
  };

  const likeComment = async (commentId): Promise<void> => {
    await axios.post(`/api/like/comment/${commentId}`);
    fetchResult();
    if (isActive("/")) {
      Router.push("/");
    } else if (isActive("/drafts")) {
      Router.push("/drafts");
    }
  };

  const deleteLike = async (commentId): Promise<void> => {
    await axios.delete(`/api/like/comment/${commentId}`, {
      data: { userId: session.user.id },
    });
    fetchResult();
    if (isActive("/")) {
      Router.push("/");
    } else if (isActive("/drafts")) {
      Router.push("/drafts");
    }
  };

  useEffect(() => {
    const fetchResult = async () => {
      const result = await axios.get(`/api/post/${postId}`);
      setData(result.data);
      return result;
    };
    if (postId) {
      fetchResult();
    }
  }, [postId]);

  const commentsDisplay = data?.comments.map((comment) => {
    const loggedInUserId = session?.user.id;
    const isCommentLiked = comment.likes
      ?.map((like) => {
        return like.userId;
      })
      .includes(loggedInUserId);
    return (
      <div className="py-4">
        <div className="flex pb-3 justify-between">
          <div className="flex items-center">
            <img
              className="w-[30px] h-[30px] rounded-full"
              src={comment.user.image}
            ></img>
            <div className="text-[14px] font-[600] pl-2">
              {comment.user.name}
            </div>
            <div className="text-[14px] font-[400] text-[#737373] pl-2">
              {"@" + comment.user.username}
            </div>
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
          <DeleteModal
            visible={showDeleteModal}
            onClose={closeModal}
            onDelete={() => deleteComment(comment.id)}
            name={"comment"}
          />
        </div>
        <div className="text-[14px]">{comment.content}</div>
        <div className="pt-[17px]">
          {isCommentLiked ? (
            <div
              className="flex items-center"
              onClick={() => deleteLike(comment.id)}
            >
              <TbHeart className="fill-[#FF7070]" />
              <div className="px-[3px]">{comment?._count?.likes}</div>
            </div>
          ) : (
            <div className="flex items-center">
              <div onClick={() => likeComment(comment.id)}>
                <TbHeart />
              </div>
              <div className="px-[3px]">
                {comment?._count?.likes !== 0 ? comment?._count?.likes : null}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  });

  //fetch comments using postId
  return (
    <div className="relative">
      <div className="w-full px-8 pt-5 pb-[62px]">
        {data ? (
          <div className=" border-b-[1px] border-[#FFD8D8]">
            <div className="flex-col justify-between items-start w-full">
              <div className="flex items-start justify-between w-full h-[120px]">
                <div className="text-[24px] font-[700] leading-none">
                  Comments
                </div>
                <div onClick={closeComments}>
                  <TbX />
                </div>
              </div>
            </div>
            <div className="border-b-[1px] border-[#FFD8D8] pb-[22px]">
              <div className="flex pb-[15px]">
                <img
                  className="rounded-full w-[30px] h-[30px]"
                  src={data?.author.image}
                />
                <div className="font-[600] pl-2">{data?.author.name}</div>
                <div className="text-[#737373] pl-2">
                  {"@" + data?.author.username}
                </div>
              </div>
              <div className="text-[14px]">{data?.content}</div>
            </div>
            <div>{commentsDisplay}</div>
          </div>
        ) : null}
      </div>
      <div className="flex fixed bottom-0 h-[62px] border-t w-[465px] border-[#FFD8D8] p-[16px] items-center justify-between bg-[#FFFAFA] right-0">
        {session ? (
          <div className="flex items-center w-full bg-[#FFFAFA]">
            <img
              src={session.user.image}
              className="w-[30px] h-[30px] rounded-full"
            />
            <input
              maxLength={255}
              className="border-none bg-[#FFFAFA] w-full h-[62px] flex justify-center items-center outline-none resize-none p-[14px] text-[14px] font-[500] placeholder-[#BAB8B8]"
              value={comment}
              placeholder={`Comment as ${session.user.name}...`}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={addComment} className="text-[25px] text-[#2D2D2D]">
              <TbSend />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DesktopComments;
