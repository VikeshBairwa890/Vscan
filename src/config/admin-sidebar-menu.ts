import {
  Users,
  Shield,
  Settings,
  LayoutDashboard,
} from "lucide-react";

import { SidebarMenuItem } from "@/types/sidebar";

export const adminSidebarMenu: SidebarMenuItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/admin/dashboard",
  },
  {
    name: "Users",
    icon: Users,
    link: "/admin/users",
  },
  {
    name: "Roles",
    icon: Shield,
    link: "/admin/roles",
  },
  {
    name: "Settings",
    icon: Settings,
    link: "/admin/settings",
  },
];