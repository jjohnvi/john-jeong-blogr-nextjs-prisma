import React, { useState } from "react";
import { TbToggleLeft, TbX } from "react-icons/tb";
import Router from "next/router";

const PostModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  if (!visible) return null;
  const [content, setContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [published, setPublished] = useState(false);
  const closeModal = () => setShowModal(false);

  const handlePublish = (): void => {
    setPublished(!published);
  };
  console.log(published);

  const submitData = async (e: React.SyntheticEvent) => {
    // const submitData: React.FormEventHandler<HTMLFormElement> = async (e) => {
    // console.log(e);
    e.preventDefault();
    try {
      const body = { content, published };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await onClose();
      await Router.push("/drafts");
      await setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(content);
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
            maxLength={255}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What is on your mind?"
            className="rounded-[10px] bg-[#FFFAFA] border border-[#FFD8D8] w-full h-[144px] p-2 resize-none"
          ></textarea>
        </div>
        <div className="flex justify-between items-center pb-[27px]">
          <div>Publish immediately</div>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              onClick={handlePublish}
              type="checkbox"
              className="sr-only peer"
              checked={published}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <button
          disabled={!content}
          className="bg-[#FFD8D8] w-full h-[57px] rounded-[16px] text-[24px] font-[700]"
          onClick={submitData}
        >
          {published ? "Publish post" : "Save as draft"}
        </button>
      </div>
    </div>
  );
};

export default PostModal;
