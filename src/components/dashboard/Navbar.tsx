import {
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface Props {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onMobileMenuOpen: () => void;
}

export default function Navbar({
  collapsed,
  onToggleSidebar,
  onMobileMenuOpen,
}: Props) {

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden"
        >
          <PanelLeftOpen size={24} />
        </button>

        {/* DESKTOP TOGGLE */}
        <button
          onClick={onToggleSidebar}
          className="hidden rounded-lg border p-2 hover:bg-gray-100 lg:flex"
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        <button className="relative">
          <Bell size={22} />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
            S
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium">
              Sanket
            </p>

            <p className="text-xs text-gray-500">
              User
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}