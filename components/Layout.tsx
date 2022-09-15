import React, { ReactNode } from "react";
import Header from "./Header";
import { useRouter } from "next/router";
import DesktopSidebar from "./DesktopSidebar";
type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <>
    <div className="bg-[#FFFAFA] min-h-screen w-full md:hidden">
      <Header />
      <div className="h-full w-full">{props.children}</div>
    </div>
    <div className="hidden md:flex min-h-screen w-full">
      <DesktopSidebar />
      <div className="">{props.children}</div>
      <div></div>
    </div>
  </>
);

export default Layout;
