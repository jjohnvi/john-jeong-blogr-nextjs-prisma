import React, { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
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

  /**
   * Here you have a function called closeModal.
   * This is how you type it to be type safe.
   * closeModal is an arrow function that takes in no parameter that returns void. Doesn't have a return.
   * It is a function that simple changes state to false.
   */
  const closeModal = (): void => {
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
              My posts
            </a>
          </Link>
        </div>
      </div>
      // </div>
    );

    right = (
      <div className="flex justify-start items-center h-20 w-full">
        <div className="relative w-12 h-12">
          <Popover className="relative">
            <Popover.Button className="outline-1 rounded-full outline-[#2D2D2D] p-[1px]">
              <img
                src={session.user.image}
                className="rounded-full border border-gray-100 shadow-sm w-12 outline-none"
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
                className="absolute z-10 rounded-[8px] w-[300px] h-[202px] bg-[#FFFCFC] shadow-xl"
              >
                <div className="flex flex-col h-full">
                  <div className="flex border-b border-[#FFD8D8] w-full h-full items-center pl-[16px]">
                    <img
                      src={session.user.image}
                      className="rounded-full border border-gray-100 shadow-sm w-12 h-12"
                    />
                    <div className="pl-[14px]">
                      <h1 className="font-[500] text-[17px] text-[#2D2D2D]">
                        {session.user.name}
                      </h1>
                      <h3 className="text-[#737373] font-[500] text-[14px]">
                        {"@" + session.user.username}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex items-center w-full h-full leading-none rounded-[6px] p-[4px]">
                      <button className="h-[58px] rounded-[6px] w-full  hover:bg-[#FFD8D8] ease-in duration-300 text-start p-3">
                        <a>Add an existing account</a>
                      </button>
                    </div>
                    <div className="flex items-center w-full h-full leading-none rounded-[6px] p-[4px]">
                      <button
                        className="h-[58px] rounded-[6px] w-full  hover:bg-[#FFD8D8] ease-in duration-300 text-start p-3"
                        onClick={() => signOut()}
                      >
                        <a>{"Log out @" + session.user.username}</a>
                      </button>
                    </div>
                  </div>
                </div>

                <img src="/solutions.jpg" alt="" />
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
        <h1 className="font-bold p-4 text-xl">
          {isActive("/drafts") && "My posts"}
          {isActive("/") && "Home"}
        </h1>

        {/* Modal html code here */}
        {/* <Link href="/create"> */}

        <button
          onClick={() => setShowModal(true)}
          className="flex fixed bottom-4 right-4 justify-center items-center w-[49.65px] h-[49.65px] rounded-full text-2xl bg-red-200"
        >
          <a className="font-[200] text-[40px] flex justify-center items-center pb-1">
            +
          </a>
        </button>
        {/* </Link> */}
      </div>
    );
  }

  return (
    <>
      {!isActive("/") && !isActive("/drafts") ? null : (
        <nav className="flex flex-col justify-center items-center bg-[#FFFAFA] h-32 px-4 w-full">
          <div className="flex flex-col justify-center items-center w-full">
            {right}
            {toggle}
            {/**Here you are passing down the function that changes state in this component.
             * To change state in another component, you have to pass down a function that so
             * you can change the state from another component. Because you're passing this down,
             * the component you're passing this down to will now expect this function in their parameter.
             * Whenever you're passing anything down, it will need to be typed out in the parameter with
             * the name and its type. closeModal is a parameter called onClose that's a function that returns void. That types out as
             * onClose: () => void. We are also passing down the state which is showModal. We are passing it down
             * to be called visible in the PostModal component. This will be typed out as visible: boolean
             * because it's a variable with a type that is boolean.
             */}

            <PostModal onClose={closeModal} visible={showModal} />
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
