"use client";

import { useState, useEffect } from "react";
import {
    Star, User, LayoutGrid, QrCode,
    MessageCircle, CheckCircle2,
    Phone, Mail, MapPin, Globe, Share2,
    Wallet, Zap, Download, X, ChevronRight,
    Sparkles, BadgeCheck, ContactRound, Building2,
    Hash, Briefcase, ArrowDownToLine
} from "lucide-react";
import Image from "next/image";

export default function PublicProfile() {
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [showBusinessCard, setShowBusinessCard] = useState(false);
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        fetchBusinessData();
    }, []);

    const fetchBusinessData = async () => {
        setTimeout(() => {
            setBusiness({
                id: "manas-services",
                name: "Manas Services",
                tagline: "Your Trusted Service Partner",
                logo: null,
                description: "Professional services with 10+ years of experience. Quality work guaranteed at affordable prices.",
                rating: 4.8,
                totalReviews: 156,
                contact: "+91 98765 43210",
                whatsapp: "+91 98765 43210",
                email: "manas@services.com",
                address: "123 Business Park, Andheri East, Mumbai - 400093",
                website: "https://manasservices.com",
                googleReviewLink: "https://g.page/r/example-review-link",
                miniWebsiteUrl: "https://manasservices.presence1.com",
                upiId: "manas@okhdfcbank",
                upiQR: null,
                businessCard: {
                    name: "Manas Services",
                    title: "Service Provider",
                    phone: "+91 98765 43210",
                    email: "manas@services.com",
                    website: "manasservices.com",
                    address: "Mumbai, India",
                },
            });
            setLoading(false);
        }, 500);
    };

    const handleGoogleReview = () => {
        if (business?.googleReviewLink) window.open(business.googleReviewLink, "_blank");
    };

    const handleMiniWebsite = () => {
        if (business?.miniWebsiteUrl) window.open(business.miniWebsiteUrl, "_blank");
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${business.whatsapp}`, "_blank");
    };

    const handleCall = () => {
        window.location.href = `tel:${business.contact}`;
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: business.name, text: "Check out this business!", url: window.location.href });
            } catch { }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
        }
    };

    const saveBusinessCard = () => {
        const vCard = `BEGIN:VCARD\nVERSION:3.0\nFN:${business.businessCard.name}\nTITLE:${business.businessCard.title}\nTEL:${business.businessCard.phone}\nEMAIL:${business.businessCard.email}\nURL:${business.businessCard.website}\nADR:${business.businessCard.address}\nEND:VCARD`;
        navigator.clipboard.writeText(vCard);
        alert("Business card saved to clipboard!");
    };

    const downloadVCard = () => {
        const vCard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${business.businessCard.name}`,
            `TITLE:${business.businessCard.title}`,
            `TEL;TYPE=CELL:${business.businessCard.phone}`,
            `EMAIL:${business.businessCard.email}`,
            `URL:${business.businessCard.website}`,
            `ADR;TYPE=WORK:;;${business.businessCard.address}`,
            `ORG:${business.businessCard.name}`,
            "END:VCARD",
        ].join("\n");
        const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${business.businessCard.name.replace(/\s+/g, "_")}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-14 h-14">
                        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full bg-violet-500/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-violet-400" />
                        </div>
                    </div>
                    <p className="text-zinc-500 text-sm tracking-widest uppercase">Loading</p>
                </div>
            </div>
        );
    }

    const menuItems = [
        {
            id: "review",
            icon: Star,
            label: "Leave a Review",
            sub: "Rate your experience",
            gradient: "from-amber-400 to-orange-500",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            iconColor: "text-amber-400",
            action: handleGoogleReview,
        },
        {
            id: "card",
            icon: User,
            label: "Business Card",
            sub: "Save contact info",
            gradient: "from-sky-400 to-blue-600",
            bg: "bg-sky-500/10",
            border: "border-sky-500/20",
            iconColor: "text-sky-400",
            action: () => setShowBusinessCard(true),
        },
        {
            id: "website",
            icon: LayoutGrid,
            label: "Mini Website",
            sub: "Services, Hours & More",
            gradient: "from-violet-400 to-fuchsia-500",
            bg: "bg-violet-500/10",
            border: "border-violet-500/20",
            iconColor: "text-violet-400",
            action: handleMiniWebsite,
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] font-sans flex flex-col max-w-md mx-auto relative overflow-hidden">

            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-32 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-[60px] pointer-events-none" />

            {/* ── TOP NAV ── */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-semibold tracking-tight">Presence1</span>
                </div>
                <button
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <Share2 className="w-4 h-4 text-zinc-400" />
                </button>
            </div>

            {/* ── HERO CARD ── */}
            <div className="relative z-10 mx-4 mb-6">
                <div className="rounded-3xl bg-gradient-to-br from-violet-600/30 via-violet-900/20 to-transparent border border-violet-500/20 backdrop-blur-sm p-5">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl shadow-black/40 border border-white/10">
                            {business.logo ? (
                                <Image src={business.logo} alt={business.name} width={80} height={80} className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                                    <span className="text-white text-3xl font-black">{business.name.charAt(0)}</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h1 className="text-white font-bold text-lg leading-tight truncate">{business.name}</h1>
                                <BadgeCheck className="w-4 h-4 text-violet-400 flex-shrink-0" />
                            </div>
                            <p className="text-zinc-400 text-xs mb-2 truncate">{business.tagline}</p>
                            <div className="flex items-center gap-1.5">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(business.rating) ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`} />
                                    ))}
                                </div>
                                <span className="text-amber-400 text-xs font-bold">{business.rating}</span>
                                <span className="text-zinc-500 text-xs">({business.totalReviews})</span>
                            </div>
                        </div>
                    </div>

                    {/* Call strip inside hero */}
                    <button
                        onClick={handleCall}
                        className="mt-4 w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-violet-400" />
                            <span className="text-white text-sm font-medium">{business.contact}</span>
                        </div>
                        <span className="text-xs text-violet-400 font-semibold">Call Now</span>
                    </button>
                </div>
            </div>

            {/* ── WELCOME CHIP ── */}
            <div className="relative z-10 flex justify-center mb-5">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span className="text-zinc-400 text-xs tracking-widest uppercase font-medium">Welcome! How can we help?</span>
                </div>
            </div>

            {/* ── MENU CARDS ── */}
            <div className="relative z-10 px-4 space-y-3 flex-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={item.action}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl ${item.bg} border ${item.border} hover:brightness-110 active:scale-[0.98] transition-all duration-150`}
                    >
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-white font-semibold text-sm">{item.label}</p>
                            <p className={`${item.iconColor} text-xs mt-0.5 opacity-80`}>{item.sub}</p>
                        </div>
                        <div className={`w-7 h-7 rounded-full bg-white/5 flex items-center justify-center`}>
                            <ChevronRight className="w-4 h-4 text-zinc-500" />
                        </div>
                    </button>
                ))}

                {/* Verified badge */}
                <div className="flex items-center justify-center gap-2 pt-2 pb-24">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-zinc-600 text-xs tracking-widest uppercase font-medium">Presence1 Verified</span>
                </div>
            </div>

            {/* ── BOTTOM ACTION BAR ── */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent">
                <div className="flex gap-3">
                    {/* Pay Button */}
                    <button
                        onClick={() => setShowPayment(true)}
                        className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl py-4 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105 active:scale-[0.98] transition-all duration-150"
                    >
                        <Wallet className="w-5 h-5 text-white" />
                        <span className="text-white font-bold text-sm">Pay</span>
                    </button>

                    {/* WhatsApp / Chat Button */}
                    <button
                        onClick={handleWhatsApp}
                        className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl py-4 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:brightness-105 active:scale-[0.98] transition-all duration-150"
                    >
                        <MessageCircle className="w-5 h-5 text-white" />
                        <span className="text-white font-bold text-sm">Chat</span>
                    </button>
                </div>
            </div>

            {/* ── PAYMENT MODAL ── */}
            {showPayment && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center"
                    onClick={() => setShowPayment(false)}
                >
                    <div
                        className="bg-[#111118] border border-white/10 rounded-t-3xl w-full max-w-md max-h-[92vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drag handle */}
                        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
                            <div className="w-10 h-1 bg-white/20 rounded-full" />
                        </div>

                        {/* Scrollable body */}
                        <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                            {/* Header */}
                            <div className="flex justify-between items-center px-6 pt-5 pb-4">
                                <div>
                                    <h3 className="text-white text-lg font-bold">Quick Pay</h3>
                                    <p className="text-zinc-500 text-xs mt-0.5">Choose any payment method</p>
                                </div>
                                <button
                                    onClick={() => setShowPayment(false)}
                                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4 text-zinc-400" />
                                </button>
                            </div>

                            <div className="px-5 space-y-4 pb-6">

                                {/* QR Code Section */}
                                <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                            <QrCode className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <p className="text-white text-sm font-semibold">Scan QR Code</p>
                                        <span className="ml-auto text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Any UPI App</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 flex items-center justify-center mx-auto w-fit">
                                        {business.upiQR
                                            ? <Image src={business.upiQR} alt="UPI QR" width={180} height={180} />
                                            : <QrCode className="w-40 h-40 text-gray-800" />
                                        }
                                    </div>
                                    <div className="mt-3 flex items-center justify-between bg-black/20 rounded-xl px-3 py-2.5 border border-white/5">
                                        <div>
                                            <p className="text-zinc-500 text-xs">UPI ID</p>
                                            <p className="text-white text-sm font-mono font-semibold">{business.upiId}</p>
                                        </div>
                                        <Wallet className="w-4 h-4 text-emerald-400" />
                                    </div>
                                </div>

                                {/* UPI Apps */}
                                <div>
                                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3 px-1">Pay via UPI App</p>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {[
                                            {
                                                name: "GPay",
                                                sub: "Google Pay",
                                                color: "from-blue-500/20 to-blue-600/10",
                                                border: "border-blue-500/20",
                                                dot: "bg-blue-400",
                                                url: `gpay://upi/pay?pa=${business.upiId}&pn=${encodeURIComponent(business.name)}&cu=INR`,
                                            },
                                            {
                                                name: "PhonePe",
                                                sub: "PhonePe UPI",
                                                color: "from-purple-500/20 to-purple-600/10",
                                                border: "border-purple-500/20",
                                                dot: "bg-purple-400",
                                                url: `phonepe://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.name)}&cu=INR`,
                                            },
                                            {
                                                name: "Paytm",
                                                sub: "Paytm Wallet",
                                                color: "from-sky-500/20 to-sky-600/10",
                                                border: "border-sky-500/20",
                                                dot: "bg-sky-400",
                                                url: `paytmmp://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.name)}&cu=INR`,
                                            },
                                            {
                                                name: "BHIM",
                                                sub: "BHIM UPI",
                                                color: "from-orange-500/20 to-orange-600/10",
                                                border: "border-orange-500/20",
                                                dot: "bg-orange-400",
                                                url: `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.name)}&cu=INR`,
                                            },
                                            {
                                                name: "Amazon Pay",
                                                sub: "Amazon",
                                                color: "from-yellow-500/20 to-yellow-600/10",
                                                border: "border-yellow-500/20",
                                                dot: "bg-yellow-400",
                                                url: `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.name)}&cu=INR`,
                                            },
                                            {
                                                name: "WhatsApp",
                                                sub: "WA Pay",
                                                color: "from-green-500/20 to-green-600/10",
                                                border: "border-green-500/20",
                                                dot: "bg-green-400",
                                                url: `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.name)}&cu=INR`,
                                            },
                                        ].map((app) => (
                                            <button
                                                key={app.name}
                                                onClick={() => window.open(app.url, "_blank")}
                                                className={`flex items-center gap-3 bg-gradient-to-br ${app.color} border ${app.border} rounded-2xl px-3.5 py-3 hover:brightness-125 active:scale-[0.97] transition-all duration-150`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${app.dot} flex-shrink-0`} />
                                                <div className="text-left min-w-0">
                                                    <p className="text-white text-sm font-bold truncate">{app.name}</p>
                                                    <p className="text-zinc-500 text-xs truncate">{app.sub}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Net Banking / Cards */}
                                <div>
                                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3 px-1">Other Options</p>
                                    <div className="space-y-2">
                                        {[
                                            {
                                                label: "Net Banking",
                                                desc: "All major banks supported",
                                                icon: "🏦",
                                                url: `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.name)}&cu=INR`,
                                            },
                                            {
                                                label: "Credit / Debit Card",
                                                desc: "Visa, Mastercard, RuPay",
                                                icon: "💳",
                                                url: `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.name)}&cu=INR`,
                                            },
                                        ].map((opt) => (
                                            <button
                                                key={opt.label}
                                                onClick={() => window.open(opt.url, "_blank")}
                                                className="w-full flex items-center gap-3.5 bg-[#1a1a24] border border-white/10 rounded-2xl px-4 py-3.5 hover:bg-white/5 active:scale-[0.99] transition-all duration-150"
                                            >
                                                <span className="text-xl">{opt.icon}</span>
                                                <div className="text-left flex-1">
                                                    <p className="text-white text-sm font-semibold">{opt.label}</p>
                                                    <p className="text-zinc-500 text-xs mt-0.5">{opt.desc}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Safety note */}
                                <div className="flex items-center justify-center gap-2 py-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <p className="text-zinc-600 text-xs">100% Secure · Powered by UPI</p>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                </div>

                            </div>
                        </div>

                        {/* Sticky close */}
                        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-white/5 bg-[#111118]">
                            <button
                                onClick={() => setShowPayment(false)}
                                className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-medium hover:bg-white/10 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── BUSINESS CARD MODAL ── */}
            {showBusinessCard && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center" onClick={() => setShowBusinessCard(false)} >
                    <div onClick={(e) => e.stopPropagation()} className="  w-full max-w-md h-[90dvh] bg-[#111118] rounded-t-3xl border border-white/10 overflow-hiddenflex flex-col " >
                        {/* ───── Sticky Top Navbar ───── */}
                        <div className="sticky top-0 z-20 bg-[#111118]/95 backdrop-blur-xl border-b border-white/5 flex-shrink-0">
                            {/* Drag */}
                            <div className="flex justify-center pt-3">
                                <div className="w-10 h-1 bg-white/20 rounded-full" />
                            </div>

                            <div className="px-5 py-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-semibold text-base">
                                        Business Card
                                    </h3>
                                    <p className="text-zinc-500 text-xs">
                                        Contact information
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowBusinessCard(false)}
                                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* ───── Scrollable Content ───── */}
                        <div className=" flex-1 overflow-y-auto  px-5 pb-28  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] " >
                            {/* Hero */}
                            <div className="relative bg-gradient-to-br from-violet-600 via-fuchsia-700 to-purple-900 rounded-3xl px-5 pt-5 pb-8 mt-4 overflow-hidden">
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />

                                <div className="relative flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-xl">
                                        <span className="text-white text-3xl font-black">
                                            {business.businessCard.name.charAt(0)}
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className="text-white text-xl font-bold">
                                            {business.businessCard.name}
                                        </h2>

                                        <p className="text-violet-200 text-sm mt-1">
                                            {business.businessCard.title}
                                        </p>

                                        <div className="flex items-center gap-1 mt-2">
                                            <BadgeCheck className="w-3.5 h-3.5 text-violet-300" />
                                            <span className="text-violet-300 text-xs">
                                                Verified Business
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-[#1a1a24] border border-white/10 rounded-2xl overflow-hidden mt-4">
                                {[
                                    {
                                        icon: Phone,
                                        label: "Phone",
                                        value: business.businessCard.phone,
                                    },
                                    {
                                        icon: Mail,
                                        label: "Email",
                                        value: business.businessCard.email,
                                    },
                                    {
                                        icon: Globe,
                                        label: "Website",
                                        value: business.businessCard.website,
                                    },
                                    {
                                        icon: MapPin,
                                        label: "Address",
                                        value: business.businessCard.address,
                                    },
                                ].map((row, i, arr) => (
                                    <div
                                        key={row.label}
                                        className={`flex gap-3 px-4 py-4 ${i !== arr.length - 1
                                            ? "border-b border-white/5"
                                            : ""
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                                            <row.icon className="w-4 h-4 text-violet-400" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-zinc-500 text-xs">
                                                {row.label}
                                            </p>
                                            <p className="text-white text-sm truncate">
                                                {row.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* About */}
                            <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-4 mt-4">
                                <p className="text-zinc-400 text-xs uppercase mb-2">
                                    About
                                </p>

                                <p className="text-zinc-300 text-sm leading-6">
                                    {business.description}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-4 text-center">
                                    <p className="text-amber-400 text-2xl font-bold">
                                        {business.rating}
                                    </p>
                                    <p className="text-zinc-500 text-xs mt-1">
                                        Rating
                                    </p>
                                </div>

                                <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-4 text-center">
                                    <p className="text-violet-400 text-2xl font-bold">
                                        {business.totalReviews}
                                    </p>
                                    <p className="text-zinc-500 text-xs mt-1">
                                        Reviews
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ───── Sticky Bottom Actions ───── */}
                        <div className="sticky bottom-0 z-20 bg-[#111118]/95 backdrop-blur-xl border-t border-white/5 p-4 flex gap-3 flex-shrink-0">
                            <button
                                onClick={saveBusinessCard}
                                className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium"
                            >
                                Save Card
                            </button>

                            <button
                                onClick={downloadVCard}
                                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}