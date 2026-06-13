import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";

import "@/styles/globals.css";

import UserLayout from "@/components/layouts/UserLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Toaster } from "sonner";

export default function App({
  Component,
  pageProps,
}: AppProps) {
  const router = useRouter();

  const renderContent = () => {
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
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      {renderContent()}
    </>
  );
}