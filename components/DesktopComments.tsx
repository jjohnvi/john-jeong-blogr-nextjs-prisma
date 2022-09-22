import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";
import { TbX, TbSend } from "react-icons/tb";
import Router from "next/router";

interface resData {
  author: {
    name: string;
    email: string;
    image: string;
    username: string;
  };
  authorId: string;
  comments: Array<{
    content: string;
    id: string;
    user: string;
  }>;
  content: string;
  createdAt: string;
  id: string;
  published: boolean;
}

const DesktopComments: React.FC<{
  postId: string;
  closeComments: () => void;
}> = ({ postId, closeComments }) => {
  const [data, setData] = useState<resData>();
  const [comment, setComment] = useState<string>("");
  console.log(data);

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
      Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchResult = async () => {
    const result = await axios.get(`/api/post/${postId}`);
    setData(result.data);
  };

  useEffect(() => {
    const fetchResult = async () => {
      const result = await axios.get(`/api/post/${postId}`);
      setData(result.data);
      console.log(result.data);
      return result;
    };
    if (postId) {
      fetchResult();
    }
  }, [postId]);

  const commentsDisplay = data?.comments.map((comment) => {
    return (
      <div className="py-4">
        <div className="flex pb-3">
          <img
            className="w-[30px] h-[30px] rounded-full"
            src={comment.user.image}
          ></img>
          <div className="text-[14px] font-[600] pl-2">{comment.user.name}</div>
          <div className="text-[14px] font-[400] text-[#737373] pl-2">
            {"@" + comment.user.username}
          </div>
        </div>
        <div className="text-[14px]">{comment.content}</div>
      </div>
    );
  });

  //fetch comments using postId
  return (
    <div>
      <div className="w-full h-screen px-8 pt-5">
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
      <div className="flex fixed bottom-0 h-[62px] border-t w-[400px] border-[#FFD8D8] p-[16px] items-center justify-between bg-[#FFFAFA]">
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
