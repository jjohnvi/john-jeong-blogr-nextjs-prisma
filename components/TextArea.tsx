import React, { useState } from "react";
import { useSession } from "next-auth/react";

const TextArea: React.FC = () => {
  const [newPost, setNewPost] = useState<string>("");
  const { data: session, status } = useSession();

  return (
    <div className="p-4 border-b-[1px] border-[#FFD8D8] h-[220px]">
      <div className="font-[700] text-[24px] py-4">Feed</div>
      <div className="flex items-center">
        <img
          src={session?.user?.image}
          className="w-[50px] h-[50px] rounded-full"
        />
        <input
          placeholder="What is on your mind?"
          maxLength={255}
          className="bg-[#FFFBFB] text-[#737373] font-[700] text-[17px] px-[15px] outline-none resize-none w-full h-full"
        />
      </div>
    </div>
  );
};

export default TextArea;
