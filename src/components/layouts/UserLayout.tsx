import { ReactNode } from "react";

import Sidebar from "@/components/dashboard/Sidebar";

import { userSidebarMenu } from "@/config/user-sidebar-menu";

interface Props {
  children: ReactNode;
}

export default function UserLayout({
  children,
}: Props) {

  return (
    <Sidebar menus={userSidebarMenu}>
      {children}
    </Sidebar>
  );
}