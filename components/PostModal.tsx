import React, { useState } from "react";
import { TbX } from "react-icons/tb";

export default function PostModal({ visible, onClose }) {
  if (!visible) return null;
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-[4px] flex justify-center items-end">
      <div className="bg-[#FFFAFA] w-full h-[347px] rounded-[16px] p-4">
        <div className="flex justify-between items-center px-2">
          <div className="text-[20px] text-[#2D2D2D]">New Post</div>
          <button onClick={onClose} className="text-[20px] text-[#2D2D2D]">
            <TbX />
          </button>
        </div>
        <div className="py-4">
          <textarea
            placeholder="What is on your mind?"
            className="rounded-[10px] bg-[#FFFAFA] border border-[#FFD8D8] w-[356px] h-[144px] p-2"
          ></textarea>
        </div>
        <div className="flex justify-between items-center pb-[27px]">
          <div>Publish immediately</div>
          <div>Toggle</div>
        </div>
        <button className="bg-[#FFD8D8] w-[358px] h-[57px] rounded-[16px] text-[24px] font-[700]">
          Save as draft
        </button>
      </div>
    </div>
  );
}
