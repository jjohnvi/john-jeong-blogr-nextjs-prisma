import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import styled from "styled-components";

export type SessionProps = {};

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();
  let toggle = (
    <div className="bg-[#f5f5f5] w-full flex justify-center h-9">
      <div className="bg-red-200 w-9/12 flex justify-center ">
        <div className="flex justify-center items-center bg-red-100 w-11/12 rounded-xl">
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
        <div className="bg-red-200 w-9/12 flex justify-center">
          <div className="flex justify-center items-center bg-red-100 w-11/12 rounded-xl">
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
      <div className="bg-[#f5f5f5] w-full flex justify-center h-9">
        <div className="bg-red-200 flex justify-center w-9/12">
          <div className="flex justify-center items-center bg-red-100 w-11/12 rounded-xl">
            <Link href="/">
              <a
                className="w-full flex justify-center"
                data-astive={isActive("/")}
              >
                Feed
              </a>
            </Link>
            <Link href="/drafts">
              <a
                className="flex justify-center w-full"
                data-active={isActive("/drafts")}
              >
                My drafts
              </a>
            </Link>
          </div>
        </div>
      </div>
    );

    right = (
      <div className="flex justify-center items-center h-20">
        <div className="relative w-12 h-12">
          <img
            src={session.user.image}
            className="rounded-full border border-gray-100 shadow-sm w-10"
          />
        </div>
        <p>
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/create">
          <button className="button">
            <a>New Post</a>
          </button>
        </Link>
        <button className="button" onClick={() => signOut()}>
          <a>Log out</a>
        </button>
      </div>
    );
  }

  return (
    <nav className="flex flex-col justify-center bg-[#f5f5f5] h-32">
      {right}
      {toggle}
    </nav>
  );
};

export default Header;

// styled components
const LeftDiv = styled.div`
  max-width: 768px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  bottom: 0;
`;
