import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/dashboard/Sidebar";
import { userSidebarMenu } from "@/config/user-sidebar-menu";
import { useAppContext } from "@/contexts/AppContext";

interface Props {
  children: ReactNode;
}

export default function UserLayout({ children }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { status, statusLoading, refreshStatus } = useAppContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || statusLoading || !status) return;

    const completed = status.onboardingCompleted === true;
    const path = router.pathname;
    if (!completed && path !== "/app/dashboard" && path !== "/app/onboarding") {
      router.replace("/app/dashboard");
    }
  }, [mounted, status, statusLoading, router.pathname]);

  useEffect(() => {
    const onOnboardingComplete = () => {
      refreshStatus();
    };

    window.addEventListener("vscan:onboarding-complete", onOnboardingComplete);
    return () => window.removeEventListener("vscan:onboarding-complete", onOnboardingComplete);
  }, [refreshStatus]);

  if (!mounted || statusLoading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="text-xs text-app-text-muted font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (router.pathname === "/app/onboarding") {
    return <div className="min-h-screen bg-app-bg">{children}</div>;
  }

  const onboardingCompleted = status?.onboardingCompleted === true;
  const blockSidebar = !onboardingCompleted && router.pathname === "/app/dashboard";

  if (blockSidebar) {
    return <div className="min-h-screen bg-app-bg">{children}</div>;
  }

  return (
    <Sidebar menus={userSidebarMenu}>
      {children}
    </Sidebar>
  );
}
