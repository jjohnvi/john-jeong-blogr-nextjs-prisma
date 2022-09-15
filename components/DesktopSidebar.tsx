import React, { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const DesktopSidebar: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col justify-between w-[290px] min-h-screen p-4">
      <div className="">
        <div>LocoMoco icon</div>
        <div>Feed</div>
        <div>My drafts</div>
      </div>
      <div className="flex justify-center">
        <img
          src={session.user.image}
          className="w-[46px] h-[46px] rounded-full"
        />
        <div>
          <div>{session.user.name}</div>
          <div>{"@" + session.user.username}</div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;