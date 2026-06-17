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
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const refreshOnboardingStatus = async (showLoader = true) => {
      if (showLoader) {
        setCheckingOnboarding(true);
      }

      try {
        const res = await fetch(`/api/business/dashboard-status`);
        if (!res.ok) return;

        const responseBody = await res.json();
        if (responseBody.success === false) return;

        const status = responseBody.data ?? responseBody;
        const completed = status.onboardingCompleted === true;
        setOnboardingCompleted(completed);

        const path = router.pathname;
        if (!completed && path !== "/app/dashboard" && path !== "/app/onboarding") {
          router.replace("/app/dashboard");
        }
      } catch (e) {
        console.error("Failed to check onboarding status", e);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    refreshOnboardingStatus();

    const onOnboardingComplete = () => {
      refreshOnboardingStatus(false);
    };

    window.addEventListener("vscan:onboarding-complete", onOnboardingComplete);
    return () => window.removeEventListener("vscan:onboarding-complete", onOnboardingComplete);
  }, [mounted, router.pathname]);

  if (!mounted || checkingOnboarding) {
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
