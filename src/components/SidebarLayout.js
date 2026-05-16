import { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LayoutDashboard, QrCode, BarChart3, Sparkles, CreditCard, LogOut, } from "lucide-react";
import { Button } from "@heroui/react";
const menus = [
    {
        name: "Profile Settings",
        icon: User,
        link: "/app/profile-settings",
    },
    {
        name: "Mini-Website",
        icon: LayoutDashboard,
        link: "/app/mini-website",
    },
    {
        name: "Smart QR",
        icon: QrCode,
        link: "/app/smart-qr",
    },
    {
        name: "Analytics",
        icon: BarChart3,
        link: "/app/analytics",
    },
    {
        name: "AI Suggestions",
        icon: Sparkles,
        link: "/app/ai-suggestions",
    },
    {
        name: "Billing",
        icon: CreditCard,
        link: "/app/billing",
    },
];

export default function Sidebar({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">

            {open && (<div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />)}

            <aside className={` fixed top-0 left-0 z-50 h-full w-70 bg-white border-r transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 `}  >
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <h1 className="text-3xl font-bold">  Presence1 </h1>
                    <Button onClick={() => setOpen(false)} className="lg:hidden" > <X size={28} /></Button>
                </div>

                <div className="flex-1 p-5 space-y-2">
                    {menus.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <Link key={i} href={item.link} className="flex items-center gap-3 rounded-sm px-3 py-3 text-gray-700 hover:bg-gray-100 transition" onClick={() => setOpen(false)} >
                                <Icon size={20} />
                                <span className="font-medium"> {item.name} </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="border-t p-5">
                    <p className="text-xs uppercase text-gray-400"> Signed In As</p>

                    <p className="mt-2 break-all text-sm font-medium">  vikeshbairwa890@gmail.com</p>

                    <button className="mt-6 flex items-center gap-2 text-red-500">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 lg:ml-70">
                <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-4 lg:hidden">
                    <button onClick={() => setOpen(true)}>
                        <Menu size={30} />
                    </button>

                    <h2 className="text-xl font-bold">
                        Presence1
                    </h2>
                </div>
                <main>{children}</main>
            </div>
        </div>
    );
}