import React, { useState } from "react";
import axios from "axios";
import { Popover, Transition } from "@headlessui/react";
import Router from "next/router";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  TbMoodCrazyHappy,
  TbSmartHome,
  TbFilePencil,
  TbFile,
} from "react-icons/tb";

const DesktopSidebar: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col justify-between items-center w-[290px] min-h-screen p-4">
      <div className="">
        <div className="flex items-center text-[24px] font-[700] text-[#CA7474] py-4">
          <TbMoodCrazyHappy />
        </div>
        <Link href="/">
          <div className="flex items-center text-[24px] font-[700] py-4 hover:cursor-pointer">
            <div className="pr-5">
              <TbSmartHome />
            </div>
            Feed
          </div>
        </Link>
        <Link href="/drafts">
          <div className="flex items-center text-[24px] font-[700] hover:cursor-pointer">
            <div className="pr-5">
              <TbFilePencil />
            </div>
            My drafts
          </div>
        </Link>
      </div>
      <div className="flex justify-center items-center pb-[20px]">
        <Popover className="relative">
          <Popover.Button className="outline-1 rounded-full outline-[#2D2D2D] p-[1px]">
            <img
              src={session?.user?.image}
              className="w-[46px] h-[46px] rounded-full"
            />
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
              className="absolute z-10 rounded-[8px] w-[254px] h-[140px] bg-[#FFEAEA] shadow-xl bottom-[75px]"
            >
              <div className="flex flex-col h-full">
                <div className="flex border-b border-[#FFD8D8] w-full h-[84px] items-center pl-[16px]">
                  <img
                    src={session?.user?.image}
                    className="rounded-full border border-gray-100 shadow-sm w-12 h-12"
                  />
                  <div className="pl-[14px]">
                    <h1 className="font-[500] text-[17px] text-[#2D2D2D]">
                      {session?.user?.name}
                    </h1>
                    <h3 className="text-[#737373] font-[500] text-[14px]">
                      {"@" + session?.user?.username}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  {/* <div className="flex items-center w-full h-full leading-none rounded-[6px] p-[4px]">
                      <button className="h-[58px] rounded-[6px] w-full  hover:bg-[#FFD8D8] ease-in duration-300 text-start p-3">
                        <a>Add an existing account</a>
                      </button>
                    </div> */}
                  <div className="flex items-center w-full h-full leading-none rounded-[6px] p-[4px]">
                    <button
                      className="h-[58px] rounded-[6px] w-full  hover:bg-[#FFD8D8] ease-in duration-300 text-start p-3"
                      onClick={() => signOut()}
                    >
                      <a>{"Log out @" + session?.user?.username}</a>
                    </button>
                  </div>
                </div>
              </div>

              <img src="/solutions.jpg" alt="" />
            </Popover.Panel>
          </Transition>
        </Popover>

        <div className="pl-2">
          <div className="font-[700] text-[17px]">{session?.user?.name}</div>
          <div className="text-[#737373] text-[15px] font-[400]">
            {"@" + session?.user?.username}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
