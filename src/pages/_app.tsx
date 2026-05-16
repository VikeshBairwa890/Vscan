import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Sidebar from "@/components/SidebarLayout";

const inter = Inter({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className} >
      <Sidebar>
        <Component {...pageProps} />
      </Sidebar>
    </div>
  )
}
