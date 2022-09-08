import React, { useState } from "react";
import { TbCircleX } from "react-icons/tb";

const DeleteModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  deletePost: (postId) => void;
  postId: string;
}> = ({ visible, onClose, deletePost, postId }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-[2px] flex justify-center items-center bg-[#737373] px-10 z-10">
      <div className="w-full bg-[#FFFAFA] rounded-[8px] p-4">
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-playstation-x text-[#FF7070]"
            width="52"
            height="52"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z"></path>
            <path d="M8.5 8.5l7 7"></path>
            <path d="M8.5 15.5l7 -7"></path>
          </svg>
        </div>
        <h1 className="text-[24px] font-[700] leading-none mt-8 mb-2 text-center">
          Are you sure?
        </h1>
        <p className="text-[14px] font-[400] text-[#737373] text-center">
          Do you really want to delete this post?
        </p>
        <div className="flex justify-between w-full mt-8 gap-5">
          <button
            onClick={onClose}
            className="flex-1 h-[40px] bg-[#FF7070] rounded-[8px] text-[#FFEAEA] font-[700] text-[20px]"
          >
            Cancel
          </button>
          <button
            onClick={() => deletePost(postId)}
            className="flex-1 h-[40px] bg-[#FF7070] rounded-[8px] text-[#FFEAEA] font-[700] text-[20px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
