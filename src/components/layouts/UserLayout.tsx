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

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

    // useEffect(() => {
    //   if (!mounted) return;

    //   const checkStateAndRoute = () => {
    //     const userStr = localStorage.getItem("currentUser");
    //     if (!userStr) {
    //       // Redirection to Login if not authenticated
    //       router.push("/auth/login");
    //       return;
    //     }

    //     const onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true";
    //     const path = router.pathname;

    //     if (!onboardingCompleted && path !== "/app/onboarding") {
    //       router.push("/app/onboarding");
    //     } else if (onboardingCompleted && path === "/app/onboarding") {
    //       // router.push("/app/dashboard");
    //       router.push("/app/onboarding");
    //     } else {
    //       setAuthorized(true);
    //     }
    //   };

    //   checkStateAndRoute();
    // }, [mounted, router.pathname]);

  // if (!mounted || (!authorized && router.pathname !== "/app/onboarding")) {
  //   return (
  //     <div className="min-h-screen bg-app-bg flex items-center justify-center text-white">
  //       <div className="flex flex-col items-center gap-3">
  //         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  //         <p className="text-xs text-app-text-muted font-medium">Checking session...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Do not show the navigation sidebar on the onboarding wizard page
  if (router.pathname === "/app/onboarding") {
    return <div className="min-h-screen bg-app-bg">{children}</div>;
  }

  return (
    <Sidebar menus={userSidebarMenu}>
      {children}
    </Sidebar>
  );
}