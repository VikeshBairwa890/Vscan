import { useState, useEffect, useRef } from "react";
import {
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  link: string | null;
  createdAt: string;
}

interface Props {
  user?: { name?: string, email?: string, role?: string } | null;
  collapsed: boolean;
  onToggleSidebar: () => void;
  onMobileMenuOpen: () => void;
}

export default function Navbar({
  user,
  collapsed,
  onToggleSidebar,
  onMobileMenuOpen,
}: Props) {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setNotifications(json.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id?: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        if (id) {
          setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } else {
          setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        }
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-app-border bg-app-bg/85 backdrop-blur-md px-4 lg:px-6 text-white">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}
        <button
          onClick={onMobileMenuOpen}
          suppressHydrationWarning={true}
          className="lg:hidden text-app-text-muted hover:text-white"
        >
          <PanelLeftOpen size={24} />
        </button>

        {/* DESKTOP TOGGLE */}
        <button
          onClick={onToggleSidebar}
          suppressHydrationWarning={true}
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

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            suppressHydrationWarning={true}
            className="relative flex items-center justify-center p-2 rounded-lg text-app-text-muted hover:text-white hover:bg-app-surface-glass transition-colors"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-app-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-app-error"></span>
              </span>
            )}
          </button>

          {/* DROPDOWN */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-app-border bg-app-surface shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between border-b border-app-border p-4 bg-app-bg/50">
                <h3 className="font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAsRead()}
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-app-text-muted">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`flex gap-3 p-4 border-b border-app-border/50 hover:bg-app-surface-glass transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                        onClick={() => {
                           if (!notification.isRead) markAsRead(notification.id);
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-app-text-muted'}`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-app-text-dimmed whitespace-nowrap mt-0.5">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-app-text-dimmed line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.link && (
                            <Link 
                              href={notification.link}
                              className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                              View details <ExternalLink size={12} />
                            </Link>
                          )}
                        </div>
                        {!notification.isRead && (
                          <div className="flex items-center shrink-0">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold uppercase">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              {user?.name || "Loading..."}
            </p>

            <p className="text-xs text-app-text-muted capitalize">
              {user?.role?.toLowerCase() || "User"}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}