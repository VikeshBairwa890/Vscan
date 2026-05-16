import { Button, Input, InputGroup, Tab, TabList, Tabs, TextField } from "@heroui/react";
import { Copy, Download, Globe, Star, User, LayoutGrid, ArrowRight, MessageCircle, CheckCircle2, QrCode } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const menuItems = [
    {
        icon: Star,
        title: "Leave a Review",
        subtitle: "How was your experience?",
        color: "from-emerald-700/60 to-emerald-900/40",
        iconColor: "text-emerald-400",
    },
    {
        icon: User,
        title: "Business Card",
        subtitle: "Save contact info",
        color: "from-slate-700/60 to-slate-800/40",
        iconColor: "text-slate-300",
    },
    {
        icon: LayoutGrid,
        title: "Mini Website",
        subtitle: "Services, Hours & More",
        color: "from-slate-700/60 to-slate-800/40",
        iconColor: "text-slate-300",
    },
];

export default function SmartQR() {
    const [hovered, setHovered] = useState(null);
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-start justify-start w-full p-2 border-b">
                    <h1 className="text-2xl font-bold">Smart QR Page</h1>
                    <p className="text-lg text-gray-600">Welcome to the Smart QR page!</p>
                </div>
                <div className="flex flex-col justify-content-start p-2 border w-2xl mt-5">
                    {/* Makr 4 tabs for hero ui to show qr codes and download */}
                    <Tabs className="w-full">
                        <Tabs.ListContainer>
                            <Tabs.List aria-label="Options">
                                <Tabs.Tab id="smart-menu">
                                    Smart Menu
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="reviews">
                                    Reviews
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="contact-info">
                                    Contact Info
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="website">
                                    Website
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.ListContainer>
                        <Tabs.Panel className="pt-4" id="smart-menu">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-sm text-gray-600 mb-4">Generate and download your Smart Menu QR code.</p>
                                <QrCode size={300} className="border rounded" />
                                <div className="flex row items-center justify-between gap-4 mt-4">
                                    <Button variant="tertiary" className="mt-4"> Simulate </Button>
                                    <Button variant="primary" className="mt-4"><Download className="size-4 text-white" /> Download QR Code</Button>
                                </div>
                                <div className="mt-6">
                                    <TextField className="w-full max-w-70" defaultValue="heroui.com" name="website">
                                        <InputGroup>
                                            <InputGroup.Prefix>
                                                <Globe className="size-4 text-muted" />
                                            </InputGroup.Prefix>
                                            <InputGroup.Input className="w-full max-w-70" />
                                            <InputGroup.Suffix className="pr-0">
                                                <Button isIconOnly aria-label="Copy" size="sm" variant="ghost">
                                                    <Copy className="size-4" />
                                                </Button>
                                            </InputGroup.Suffix>
                                        </InputGroup>
                                    </TextField>
                                </div>
                            </div>

                        </Tabs.Panel>
                        <Tabs.Panel className="pt-4" id="reviews">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-sm text-gray-600 mb-4">Generate and download your Reviews QR code.</p>
                                <QrCode size={300} className="border rounded" />
                                <div className="flex row items-center justify-between gap-4 mt-4">
                                    <Button variant="tertiary" className="mt-4"> Simulate </Button>
                                    <Button variant="primary" className="mt-4"><Download className="size-4 text-white" /> Download QR Code</Button>
                                </div>
                                <div className="mt-6">
                                    <TextField className="w-full max-w-70" defaultValue="heroui.com" name="website">
                                        <InputGroup>
                                            <InputGroup.Prefix>
                                                <Globe className="size-4 text-muted" />
                                            </InputGroup.Prefix>
                                            <InputGroup.Input className="w-full max-w-70" />
                                            <InputGroup.Suffix className="pr-0">
                                                <Button isIconOnly aria-label="Copy" size="sm" variant="ghost">
                                                    <Copy className="size-4" />
                                                </Button>
                                            </InputGroup.Suffix>
                                        </InputGroup>
                                    </TextField>
                                </div>
                            </div>
                        </Tabs.Panel>
                        <Tabs.Panel className="pt-4" id="contact-info">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-sm text-gray-600 mb-4">Generate and download your Contact Info QR code.</p>
                                <QrCode size={300} className="border rounded" />
                                <div className="flex row items-center justify-between gap-4 mt-4">
                                    <Button variant="tertiary" className="mt-4"> Simulate </Button>
                                    <Button variant="primary" className="mt-4"><Download className="size-4 text-white" /> Download QR Code</Button>
                                </div>
                                <div className="mt-6">
                                    <TextField className="w-full max-w-70" defaultValue="heroui.com" name="website">
                                        <InputGroup>
                                            <InputGroup.Prefix>
                                                <Globe className="size-4 text-muted" />
                                            </InputGroup.Prefix>
                                            <InputGroup.Input className="w-full max-w-70" />
                                            <InputGroup.Suffix className="pr-0">
                                                <Button isIconOnly aria-label="Copy" size="sm" variant="ghost">
                                                    <Copy className="size-4" />
                                                </Button>
                                            </InputGroup.Suffix>
                                        </InputGroup>
                                    </TextField>
                                </div>
                            </div>
                        </Tabs.Panel>
                        <Tabs.Panel className="pt-4" id="website">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-sm text-gray-600 mb-4">Generate and download your Website QR code.</p>
                                <QrCode size={300} className="border rounded" />
                                <div className="flex row items-center justify-between gap-4 mt-4">
                                    <Button variant="tertiary" className="mt-4"> Simulate </Button>
                                    <Button variant="primary" className="mt-4"><Download className="size-4 text-white" /> Download QR Code</Button>
                                </div>
                                <div className="mt-6">
                                    <TextField className="w-full max-w-70" defaultValue="heroui.com" name="website">
                                        <InputGroup>
                                            <InputGroup.Prefix>
                                                <Globe className="size-4 text-muted" />
                                            </InputGroup.Prefix>
                                            <InputGroup.Input className="w-full max-w-70" />
                                            <InputGroup.Suffix className="pr-0">
                                                <Button isIconOnly aria-label="Copy" size="sm" variant="ghost">
                                                    <Copy className="size-4" />
                                                </Button>
                                            </InputGroup.Suffix>
                                        </InputGroup>
                                    </TextField>
                                </div>
                            </div>
                        </Tabs.Panel>
                    </Tabs>
                </div>
                 <div className="flex flex-col items-center justify-start gap-4 mt-4">
                        {/* Phone Frame */}
                        <div
                            className="relative w-[280px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
                            style={{
                                background: "linear-gradient(160deg, #0f172a 0%, #0d1526 60%, #0a1020 100%)",
                                boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
                            }}
                        >
                            {/* Notch */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-20 h-5 rounded-full bg-black/80" />
                            </div>

                            {/* Content */}
                            <div className="px-5 pb-8 pt-4 flex flex-col items-center gap-4">
                                {/* Logo */}
                                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-white/20">
                                    <span className="text-[10px] font-semibold text-gray-400 tracking-wide text-center leading-tight">
                                        Your<br />LOGO
                                    </span>
                                </div>

                                {/* Name & Subtitle */}
                                <div className="text-center">
                                    <h1 className="text-white text-xl font-bold tracking-tight">vikesh</h1>
                                    <p className="text-[10px] text-slate-400 tracking-[0.15em] uppercase mt-0.5 font-medium">
                                        Welcome! How can we help?
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="w-full flex flex-col gap-2.5 mt-1">
                                    {menuItems.map((item, idx) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={idx}
                                                onMouseEnter={() => setHovered(idx)}
                                                onMouseLeave={() => setHovered(null)}
                                                className={`
                    w-full flex items-center gap-3 px-3.5 py-3.5 rounded-2xl
                    border transition-all duration-200 cursor-pointer text-left
                    ${hovered === idx
                                                        ? "border-white/20 bg-white/10 scale-[1.02]"
                                                        : "border-white/5 bg-white/5"
                                                    }
                  `}
                                                style={{
                                                    backdropFilter: "blur(10px)",
                                                }}
                                            >
                                                {/* Icon Box */}
                                                <div
                                                    className={`
                      w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                      bg-gradient-to-br ${item.color}
                    `}
                                                >
                                                    <Icon size={16} className={item.iconColor} />
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
                                                    <p className="text-slate-400 text-[11px] mt-0.5 leading-tight">{item.subtitle}</p>
                                                </div>

                                                {/* Arrow */}
                                                <ArrowRight
                                                    size={14}
                                                    className={`flex-shrink-0 transition-all duration-200 ${hovered === idx ? "text-white translate-x-0.5" : "text-slate-500"
                                                        }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Verified Badge */}
                                <div className="flex items-center gap-1.5 mt-2">
                                    <CheckCircle2 size={10} className="text-emerald-400" />
                                    <span className="text-[9px] text-slate-500 tracking-[0.12em] uppercase font-medium">
                                        Presence1 Verified
                                    </span>
                                </div>
                            </div>

                            {/* Chat FAB */}
                            <div className="absolute bottom-6 right-5">
                                <button className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-300 transition-colors">
                                    <MessageCircle size={18} className="text-white" fill="white" />
                                </button>
                            </div>
                        </div>

                        {/* Caption */}
                        <p className="text-[11px] text-slate-400 tracking-wide">Interactive Mobile Preview</p>
                    </div>
            </div >
        </>
    )
}