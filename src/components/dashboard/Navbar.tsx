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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-app-border bg-app-bg/85 backdrop-blur-md px-4 lg:px-6 text-white">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden text-app-text-muted hover:text-white"
        >
          <PanelLeftOpen size={24} />
        </button>

        {/* DESKTOP TOGGLE */}
        <button
          onClick={onToggleSidebar}
          className="hidden rounded-lg border border-app-border p-2 text-app-text-muted hover:text-white hover:bg-app-surface-glass lg:flex transition-colors"
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

        <button className="relative text-app-text-muted hover:text-white transition-colors">
          <Bell size={22} />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-app-error" />
        </button>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold">
            S
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              Sanket
            </p>

            <p className="text-xs text-app-text-muted">
              User
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}