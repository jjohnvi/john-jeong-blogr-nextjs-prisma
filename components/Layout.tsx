import React, { ReactNode } from "react";
import Header from "./Header";
import { useRouter } from "next/router";
type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="bg-[#FFFAFA] h-screen w-full">
    <Header />
    <div className="">{props.children}</div>
  </div>
);

export default Layout;
