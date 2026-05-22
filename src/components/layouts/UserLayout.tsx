import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/dashboard/Sidebar";
import { userSidebarMenu } from "@/config/user-sidebar-menu";

interface Props {
  children: ReactNode;
}

export default function UserLayout({ children }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkStateAndRoute = () => {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) {
        // Redirection to Login if not authenticated
        router.push("/auth/login");
        return;
      }

      const onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true";
      const path = router.pathname;

      if (!onboardingCompleted && path !== "/app/onboarding") {
        router.push("/app/onboarding");
      } else if (onboardingCompleted && path === "/app/onboarding") {
        router.push("/app/dashboard");
      } else {
        setAuthorized(true);
      }
    };

    checkStateAndRoute();
  }, [mounted, router.pathname]);

  if (!mounted || (!authorized && router.pathname !== "/app/onboarding")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-xs text-gray-500 font-medium">Checking session...</p>
        </div>
      </div>
    );
  }

  // Do not show the navigation sidebar on the onboarding wizard page
  if (router.pathname === "/app/onboarding") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <Sidebar menus={userSidebarMenu}>
      {children}
    </Sidebar>
  );
}