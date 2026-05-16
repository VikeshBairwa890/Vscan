import { ReactNode } from "react";

import Sidebar from "@/components/dashboard/Sidebar";

import { adminSidebarMenu } from "@/config/admin-sidebar-menu";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: Props) {

  return (
    <Sidebar menus={adminSidebarMenu}>
      {children}
    </Sidebar>
  );
}