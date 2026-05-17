import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import "@/styles/globals.css";

import UserLayout from "@/components/layouts/UserLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Toaster } from "sonner";
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />;
export default function App({
  Component,
  pageProps,
}: AppProps) {

  const router = useRouter();

  // USER DASHBOARD
  if (router.pathname.startsWith("/app")) {
    return (
      <UserLayout>
        <Component {...pageProps} />
        <Toaster position="top-right" richColors />
      </UserLayout>
    );
  }

  // ADMIN DASHBOARD
  if (router.pathname.startsWith("/admin")) {
    return (
      <AdminLayout>
        <Toaster position="top-right" richColors />
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  // AUTH / PUBLIC PAGES
  return <Component {...pageProps} />;
}