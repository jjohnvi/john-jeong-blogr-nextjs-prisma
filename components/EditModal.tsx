import React, { useState } from "react";
import { TbCircleX } from "react-icons/tb";

const EditModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  deletePost: (postId) => void;
  postId: string;
}> = ({ visible, onClose, deletePost, postId }) => {
  if (!visible) return null;
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-[1px] flex justify-center items-center">
      <div className="w-[310px] h-[243px] bg-[#FFFAFA] rounded-[8px] flex  items-center flex-col p-[17px]">
        <div className="flex">
          <TbCircleX className="text-[#FF7070] text-[52px]" />
        </div>
        <h1 className="text-[24px] font-[700] py-[9px]">Are you sure?</h1>
        <p className="text-[14px] font-[400] text-[#737373]">
          Do you really want to delete this post?
        </p>
        <div className="flex justify-between w-full p-[12px]">
          <button
            onClick={onClose}
            className="w-[122px] h-[40px] bg-[#FF7070] rounded-[8px] text-[#FFEAEA] font-[700] text-[20px]"
          >
            Cancel
          </button>
          <button
            onClick={() => deletePost(postId)}
            className="w-[122px] h-[40px] bg-[#FF7070] rounded-[8px] text-[#FFEAEA] font-[700] text-[20px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
