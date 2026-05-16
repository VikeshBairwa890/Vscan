import {
  useState,
  ReactNode,
} from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import {
  LogOut,
  X,
} from "lucide-react";

import { Button } from "@heroui/react";

import Navbar from "./Navbar";

import { SidebarMenuItem } from "@/types/sidebar";

interface SidebarProps {
  children: ReactNode;
  menus: SidebarMenuItem[];
}

export default function Sidebar({
  children,
  menus,
}: SidebarProps) {

  const router = useRouter();

  // MOBILE SIDEBAR
  const [mobileOpen, setMobileOpen] =
    useState(false);

  // DESKTOP COLLAPSE
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          flex h-full flex-col
          border-r bg-white
          transition-all duration-300

          ${collapsed ? "w-20" : "w-70"}

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        {/* HEADER */}
        <div
          className={`
            flex items-center border-b px-5 py-5
            ${collapsed ? "justify-center" : "justify-between"}
          `}
        >

          {!collapsed ? (
            <h1 className="text-2xl font-bold">
              Presence1
            </h1>
          ) : (
            <h1 className="text-2xl font-bold">
              P
            </h1>
          )}

          <Button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <X size={22} />
          </Button>

        </div>

        {/* MENUS */}
        <div className="flex-1 space-y-2 p-3">

          {menus.map((item, index) => {

            const Icon = item.icon;

            const isActive =
              router.pathname === item.link;

            return (
              <Link
                key={index}
                href={item.link}
                onClick={() => setMobileOpen(false)}
                className={`
                  group relative flex items-center
                  rounded-xl px-4 py-3
                  transition-all

                  ${
                    collapsed
                      ? "justify-center"
                      : "gap-3"
                  }

                  ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >

                <Icon size={20} />

                {!collapsed && (
                  <span className="font-medium">
                    {item.name}
                  </span>
                )}

                {/* TOOLTIP */}
                {collapsed && (
                  <div
                    className="
                      invisible absolute left-16
                      rounded-md bg-black px-3 py-2
                      text-sm text-white opacity-0
                      transition-all

                      group-hover:visible
                      group-hover:opacity-100
                    "
                  >
                    {item.name}
                  </div>
                )}

              </Link>
            );
          })}

        </div>

        {/* FOOTER */}
        <div className="border-t p-4">

          {!collapsed && (
            <>
              <p className="text-xs uppercase text-gray-400">
                Signed In As
              </p>

              <p className="mt-2 break-all text-sm font-medium">
                user@example.com
              </p>
            </>
          )}

          <button
            className={`
              mt-5 flex items-center text-red-500

              ${
                collapsed
                  ? "justify-center"
                  : "gap-2"
              }
            `}
          >

            <LogOut size={20} />

            {!collapsed && (
              <span>Sign Out</span>
            )}

          </button>

        </div>

      </aside>

      {/* PAGE CONTENT */}
      <div
        className={`
          flex flex-1 flex-col
          transition-all duration-300

          ${collapsed ? "lg:ml-20" : "lg:ml-70"}
        `}
      >

        <Navbar
          collapsed={collapsed}
          onToggleSidebar={() =>
            setCollapsed(!collapsed)
          }
          onMobileMenuOpen={() =>
            setMobileOpen(true)
          }
        />

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>

      </div>

    </div>
  );
}