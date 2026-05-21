import {
  User,
  LayoutDashboard,
  QrCode,
  BarChart3,
  Sparkles,
  CreditCard,
} from "lucide-react";

import { SidebarMenuItem } from "@/types/sidebar";

export const userSidebarMenu: SidebarMenuItem[] = [
  {
    name: "Dashboard",
    icon: BarChart3,
    link: "/app/dashboard",
  },
  {
    name: "Profile Settings",
    icon: User,
    link: "/app/profile-settings",
  },
  {
    name: "Mini-Website",
    icon: LayoutDashboard,
    link: "/app/mini-website",
  },
  {
    name: "Smart QR",
    icon: QrCode,
    link: "/app/smart-qr",
  },
  {
    name: "AI Suggestions",
    icon: Sparkles,
    link: "/app/ai-suggestions",
  },
  {
    name: "Billing",
    icon: CreditCard,
    link: "/app/billing",
  },
];