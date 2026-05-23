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
    <div className="flex min-h-screen">

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
          border-r border-app-border bg-app-surface
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
            flex items-center border-b border-app-border px-5 py-5
            ${collapsed ? "justify-center" : "justify-between"}
          `}
        >

          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold shadow-lg shadow-violet-600/35">
                <span className="text-white text-xs font-black">V</span>
              </div>
              <span className="font-syne text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Vscan
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold shadow-lg shadow-violet-600/35">
              <span className="text-white text-xs font-black">V</span>
            </div>
          )}

          <Button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white bg-transparent hover:bg-app-surface-glass min-w-0 p-2"
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
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                      : "text-app-text-muted hover:bg-app-surface-glass hover:text-white"
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
                      rounded-md bg-app-surface border border-app-border px-3 py-2
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
        <div className="border-t border-app-border p-4">

          {!collapsed && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-app-text-dimmed">
                Signed In As
              </p>

              <p className="mt-1 break-all text-sm font-medium text-white">
                user@example.com
              </p>
            </>
          )}

          <button
            className={`
              mt-5 flex items-center text-app-error hover:opacity-85 transition-opacity

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

        <main className="flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}