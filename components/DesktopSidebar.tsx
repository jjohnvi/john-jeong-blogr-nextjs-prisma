import React, { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
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
    <div className="flex flex-col justify-between w-[290px] min-h-screen p-4">
      <div className="">
        <div className="flex items-center text-[24px] font-[700] text-[#CA7474]">
          <TbMoodCrazyHappy />
        </div>
        <div className="flex items-center text-[24px] font-[700]">
          <TbSmartHome /> Feed
        </div>
        <div className="flex items-center text-[24px] font-[700]">
          <TbFilePencil />
          My drafts
        </div>
      </div>
      <div className="flex justify-center">
        <img
          src={session.user.image}
          className="w-[46px] h-[46px] rounded-full"
        />
        <div>
          <div className="font-[700] text-[17px]">{session.user.name}</div>
          <div className="text-[#737373] text-[15px] font-[400]">
            {"@" + session.user.username}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
