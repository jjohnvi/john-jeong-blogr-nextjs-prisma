import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Router from "next/router";

const TextArea: React.FC = () => {
  const [newPost, setNewPost] = useState<string>("");
  const { data: session, status } = useSession();

  const submitPost = async (e: React.SyntheticEvent) => {
    // const submitData: React.FormEventHandler<HTMLFormElement> = async (e) => {
    // console.log(e);
    e.preventDefault();
    axios.post(`/api/post`, {
      content: newPost,
    });
    await Router.push("/drafts");
    resetPost();
  };

  const resetPost = (): void => {
    setNewPost("");
  };

  return (
    <div className="p-5 border-b-[1px] border-[#FFD8D8] h-[220px]">
      <div className="font-[700] text-[24px] py-4">Feed</div>
      <div className="flex">
        <img
          src={session?.user?.image}
          className="w-[50px] h-[50px] rounded-full"
        />
        <textarea
          placeholder="What is on your mind?"
          maxLength={255}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="bg-[#FFFBFB] text-[#737373] font-[700] text-[17px] px-[15px] outline-none resize-none w-full h-[80px]"
        />
      </div>
      <div className="flex justify-end items-center">
        <button className="text-[14px] font-[700] text-[#CA7474] pr-4">
          Save as draft
        </button>
        <button className="rounded-[30px] bg-[#FFD8D8] w-[136px] h-[39px] text-[17px] font-[700]">
          Publish
        </button>
      </div>
    </div>
  );
};

export default TextArea;
