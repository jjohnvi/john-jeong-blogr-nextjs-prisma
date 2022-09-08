import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout";
import axios from "axios";
import Router from "next/router";
import { TbCheck, TbX } from "react-icons/tb";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true, image: true, username: true },
      },
    },
  });

  return {
    props: post,
  };
};

type PostProps = {
  id: string;
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

const updatePost: React.FC<PostProps> = (props) => {
  const [newPost, setNewPost] = useState<string>(props.content);
  const { data: session, status } = useSession();

  async function editPost(id: string): Promise<void> {
    await axios.put(`/api/post/${id}`, { content: newPost });
    Router.push("/drafts");
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="border-b border-[#FFD8D8] w-full pb-[24px]">
          <div className="flex">
            <div className="flex gap-7 items-center w-6/12 pb-[45px]">
              <div
                className="font-[400] text-[26px]"
                onClick={() => Router.push("/")}
              >
                <TbX />
              </div>
              <h1 className="text-[20px] font-[400]">Edit</h1>
            </div>
            <button
              className="w-6/12 flex justify-end items-center pb-[45px] text-[26px] font-[400] text-[#FF7070]"
              onClick={() => editPost(props.id)}
            >
              <TbCheck />
            </button>
          </div>
          <div className="flex items-center pb-[12px]">
            {props.published ? (
              <div className="w-[100px] h-[32px] rounded-[16px] bg-[#FF7070] text-[14px] text-[#FFFAFA] font-[500] text-center flex items-center justify-center leading-none">
                Published
              </div>
            ) : (
              <div className="w-[100px] h-[32px] rounded-[16px] bg-[#D9D9D9] text-[14px] font-[500] text-center flex items-center justify-center leading-none">
                Unpublished
              </div>
            )}
          </div>
          <textarea
            maxLength={255}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="bg-[#FFFAFA] outline-none resize-none w-full h-[102px] text-[14px] font-[500]"
          ></textarea>
        </div>
      </div>
    </Layout>
  );
};

export default updatePost;
