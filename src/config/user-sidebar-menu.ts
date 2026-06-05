import {
  User,
  LayoutDashboard,
  QrCode,
  Sparkles,
  CreditCard,
  TrendingUp,
  Globe,
  Contact,
} from "lucide-react";

import { SidebarMenuItem } from "@/types/sidebar";

export const userSidebarMenu: SidebarMenuItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/app/dashboard",
  },
  {
    name: "My Website",
    icon: Globe,
    link: "/app/mini-website",
  },
  {
    name: "Smart QR",
    icon: QrCode,
    link: "/app/smart-qr",
  },
  {
    name: "Business Card",
    icon: Contact,
    link: "/app/business-card",
  },
  {
    name: "AI Studio",
    icon: Sparkles,
    link: "/app/ai-suggestions",
  },
  {
    name: "Analytics",
    icon: TrendingUp,
    link: "/app/analytics",
  },
  {
    name: "Subscriptions",
    icon: CreditCard,
    link: "/app/billing",
  },
  {
    name: "Profile & Settings",
    icon: User,
    link: "/app/profile-settings",
  },
];