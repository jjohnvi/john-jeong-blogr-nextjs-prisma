import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import PostModal from "./PostModal";
import clsx from "clsx";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  let toggle = (
    <div className="bg-[#f5f5f5] w-full flex justify-center h-9">
      <div className="bg-red-50 w-9/12 flex justify-center border border-red-200">
        <div className="flex justify-center items-center bg-red-200 w-11/12 rounded-xl">
          <Link href="/">
            <a className="bold" data-active={isActive("/")}>
              Feed
            </a>
          </Link>
        </div>
      </div>
    </div>
  );

  let right = null;

  if (status === "loading") {
    toggle = (
      <div className="bg-[#f5f5f5] w-full flex justify-center h-9">
        <div className="bg-red-50 w-9/12 flex justify-center border border-red-200">
          <div className="flex justify-center items-center bg-red-200 w-11/12 rounded-xl">
            <Link href="/">
              <a className="bold" data-active={isActive("/")}>
                Feed
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
    right = (
      <div className="h-20">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="h-20">
        <Link href="/api/auth/signin">
          <a className="button" data-active={isActive("/signup")}>
            Log in
          </a>
        </Link>
      </div>
    );
  }
  if (session) {
    toggle = (
      // <div className="w-full flex justify-center h-9">
      <div className="bg-[#FFFAFA] flex justify-center w-full p-[1px] rounded-[10px] border border-red-200 h-[34px]">
        <div className="flex justify-center items-center w-full">
          <Link href="/">
            <a
              className={clsx(
                "w-full flex justify-center items-center rounded-[8px] h-full",
                isActive("/") && "bg-[#FFD8D8]",
                !isActive("/") && "bg-[#FFFAFA]"
              )}
              data-active={isActive("/")}
            >
              Feed
            </a>
          </Link>
          <Link href="/drafts">
            <a
              className={clsx(
                "flex justify-center w-full items-center h-full",
                isActive("/drafts") && "bg-[#FFD8D8] rounded-[8px]"
              )}
              data-active={isActive("/drafts")}
            >
              My drafts
            </a>
          </Link>
        </div>
      </div>
      // </div>
    );

    right = (
      <div className="flex justify-start items-center h-20 w-full">
        <div className="relative w-12 h-12">
          <img
            src={session.user.image}
            className="rounded-full border border-gray-100 shadow-sm w-12"
          />
        </div>
        <h1 className="font-bold p-4 text-xl">
          {isActive("/drafts") && "My drafts"}
          {isActive("/") && "Home"}
        </h1>

        {/* Modal html code here */}
        {/* <Link href="/create"> */}
        <button
          onClick={() => setShowModal(true)}
          className="flex fixed bottom-4 right-4 justify-center items-center w-[49.65px] h-[49.65px] rounded-full text-2xl bg-red-200"
        >
          <a className="">+</a>
        </button>
        {/* </Link> */}

        {/* <button className="button" onClick={() => signOut()}>
          <a>Log out</a>
        </button> */}
      </div>
    );
  }

  return (
    <nav className="flex flex-col justify-center items-center bg-[#FFFAFA] h-32 px-4 w-full">
      <div className="flex flex-col justify-center items-center w-full">
        {right}
        {toggle}
        <PostModal onClose={closeModal} visible={showModal} />
      </div>
    </nav>
  );
};

export default Header;
