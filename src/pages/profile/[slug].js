"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Star, User, LayoutGrid, QrCode,
    MessageCircle, CheckCircle2,
    Phone, Mail, MapPin, Globe, Share2,
    Wallet, Zap, Download, X, ChevronRight,
    Sparkles, BadgeCheck, ContactRound, Building2,
    Hash, Briefcase, ArrowDownToLine, ChevronLeft, ChevronUp,
    PlayCircle, Package, HeartHandshake, ExternalLink, ShieldAlert,
    Smartphone,
    CreditCard,
    IndianRupee
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import TemplateRenderer from "@/components/website-builder/TemplateRenderer";

export default function UnifiedPublicProfile() {
    const router = useRouter();
    const { slug, tab } = router.query;

    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentQr, setPaymentQr] = useState("");


    useEffect(() => {
        if (!slug) return;
        fetchBusinessData(slug);
    }, [slug]);

    const fetchBusinessData = async (businessSlug) => {
        try {
            const res = await fetch(`/api/business/public-profile?slug=${businessSlug}`);
            if (res.ok) {
                const result = await res.json();
                if (result.success && result.data) {
                    setBusiness(result.data);
                } else {
                    setError(result.message || "Failed to load profile.");
                }
            } else {
                setError("Failed to fetch settings from server.");
            }
        } catch (err) {
            console.error(err);
            setError("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    // Generate dynamic UPI QR Code when business UPI is loaded
    useEffect(() => {
        if (business?.upiId) {
            import("qrcode").then((QRCodeLib) => {
                const upiUrl = `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.businessName || business.name)}&cu=INR`;
                QRCodeLib.default.toDataURL(upiUrl, {
                    width: 250,
                    margin: 1,
                    color: {
                        dark: "#000000",
                        light: "#ffffff"
                    }
                })
                    .then(url => setPaymentQr(url))
                    .catch(e => console.error(e));
            });
        }
    }, [business]);

    const handleGoogleReview = () => {
        if (business?.googleReviewLink) window.open(business.googleReviewLink, "_blank");
    };

    const handleMiniWebsite = () => {
        router.push(`/profile/${slug}?tab=website`);
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${business.whatsapp || business.whatsappNumber || business.phone}?text=Hi, I want to connect`, "_blank");
    };

    const handleWhatsAppInquiry = (item) => {
        const text = item
            ? `Hi! I scanned your Smart Menu QR code and would like to order/inquire about *${item.name}* (Price: ${item.price}).`
            : `Hi! I scanned your Smart Menu QR code and would like to make an inquiry.`;
        window.open(`https://wa.me/${business.whatsapp || business.whatsappNumber || business.phone}?text=${encodeURIComponent(text)}`, "_blank");
    };

    const handleCall = () => {
        window.location.href = `tel:${business.phone}`;
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: business.businessName || business.name, text: "Check out this business!", url: shareUrl });
            } catch { }
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert("Digital business link copied to clipboard!");
        }
    };

    const saveBusinessCard = () => {
        const vCard = `BEGIN:VCARD\nVERSION:3.0\nFN:${business.businessName || business.name}\nTITLE:${business.tagline || ""}\nTEL:${business.phone}\nEMAIL:${business.email}\nURL:${business.website || window.location.origin + '/profile/' + business.customSlug}\nADR:${business.address}\nEND:VCARD`;
        navigator.clipboard.writeText(vCard);
        alert("Business card saved to clipboard!");
    };

    const downloadVCard = () => {
        const vCard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${business.businessName || business.name}`,
            `TITLE:${business.tagline || ""}`,
            `TEL;TYPE=CELL:${business.phone}`,
            `EMAIL:${business.email}`,
            `URL:${business.website || window.location.origin + '/profile/' + business.customSlug}`,
            `ADR;TYPE=WORK:;;${business.address}`,
            `ORG:${business.businessName || business.name}`,
            "END:VCARD",
        ].join("\n");
        const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${(business.businessName || business.name).replace(/\s+/g, "_")}_Contact.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading && !error) {
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

    if (error || !business) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center">
                    <X className="w-8 h-8" />
                </div>
                <h1 className="text-xl font-bold text-white">Profile Not Available</h1>
                <p className="text-zinc-400 text-sm max-w-xs">
                    {error || "The requested profile is either not available or has not been configured yet."}
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-2.5 bg-violet-650 hover:bg-violet-700 text-xs font-bold text-white rounded-xl transition shadow-lg shadow-violet-500/20"
                >
                    Return Home
                </button>
            </div>
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // MODE 1: FULL MINI WEBSITE
    // ────────────────────────────────────────────────────────────────────────
    if (tab === "website") {
        if (!business.isPublished) {
            return (
                <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
                        <ShieldAlert className="w-8 h-8 text-amber-400" />
                    </div>
                    <h1 className="text-xl font-bold text-white">Website Not Published</h1>
                    <p className="text-zinc-400 text-sm max-w-xs">
                        This business website is currently offline or not published.
                    </p>
                    <button
                        onClick={() => router.push(`/profile/${slug}`)}
                        className="px-6 py-2.5 bg-violet-650 hover:bg-violet-700 text-xs font-bold text-white rounded-xl transition"
                    >
                        View Business Card
                    </button>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-white text-black">
                <TemplateRenderer templateId={business.selectedTemplate} data={business} />
            </div>
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // MODE 2: SMART MENU (CATALOG & UPI LAUNCHPAD)
    // ────────────────────────────────────────────────────────────────────────
    if (tab === "menu") {
        const upiRedirect = business.upiId
            ? `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.businessName || business.name)}&cu=INR`
            : null;

        return (
            <div className="min-h-screen bg-[#07070b] text-white font-sans flex flex-col max-w-md mx-auto relative overflow-x-hidden pb-24">
                {/* Background glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-80 right-[-10%] w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none z-0" />

                {/* Header / Branding */}
                <header className="relative z-10 px-5 pt-8 pb-5 flex flex-col items-center text-center border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative mb-3 bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                        {business.logo ? (
                            <Image src={business.logo} alt={business.businessName} fill className="object-cover" />
                        ) : (
                            <span className="text-white text-3xl font-extrabold">{business.businessName.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                        <h1 className="text-white font-extrabold text-xl tracking-tight leading-tight">{business.businessName}</h1>
                        <BadgeCheck className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    </div>
                    <p className="text-zinc-400 text-xs mt-1.5 max-w-xs">{business.tagline || "Welcome to our digital storefront catalog."}</p>

                    {/* Quick Profile Links */}
                    <div className="flex gap-2 w-full mt-5">
                        <button
                            onClick={downloadVCard}
                            className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
                        >
                            <Download size={13} className="text-violet-400" /> Save Contact
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
                        >
                            <Share2 size={13} className="text-violet-400" /> Share Menu
                        </button>
                    </div>
                </header>

                {/* Catalog items */}
                <main className="relative z-10 px-4 pt-6 space-y-4 flex-1">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <span className="w-1.5 h-3 rounded bg-violet-600" /> Catalog & Menu
                        </h2>
                        <span className="text-xs bg-violet-600/10 text-violet-400 border border-violet-500/10 px-2.5 py-0.5 rounded-full font-bold">
                            {business.services?.length || 0} Items
                        </span>
                    </div>

                    <div className="space-y-3.5">
                        {business.services && business.services.length > 0 ? (
                            business.services.map((svc) => (
                                <div
                                    key={svc.id}
                                    className="bg-[#101018] border border-white/8 rounded-2xl p-4 flex gap-4 hover:border-violet-500/30 transition-all active:scale-[0.99]"
                                >
                                    {svc.image ? (
                                        <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-white/5 flex-shrink-0">
                                            <Image src={svc.image} alt={svc.name} fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 text-xl">
                                            🍽️
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-white font-bold text-sm truncate">{svc.name}</h3>
                                                <span className="text-violet-400 font-extrabold text-sm shrink-0">₹{svc.price}</span>
                                            </div>
                                            <p className="text-zinc-550 text-xs leading-relaxed mt-1 line-clamp-2">{svc.desc || "Inquire for specific catalog details."}</p>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={() => handleWhatsAppInquiry(svc)}
                                                className="px-3.5 py-1.5 rounded-lg cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 flex items-center gap-1 transition"
                                            >
                                                <MessageCircle size={10} /> Order on WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-[#101018] rounded-2xl border border-white/5">
                                <p className="text-zinc-500 text-xs">No catalog items published yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Google reviews */}
                    {business.googleReviewLink && (
                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/15 rounded-2xl p-4 flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-white text-sm font-bold flex items-center gap-1.5">
                                    <Star size={14} className="text-amber-400 fill-amber-400" /> Rate our Experience
                                </h3>
                                <p className="text-zinc-450 text-[11px]">Help us grow by leaving a Google review!</p>
                            </div>
                            <button
                                onClick={handleGoogleReview}
                                className="bg-amber-400 hover:bg-amber-500 text-black text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shrink-0"
                            >
                                Write Review <ChevronRight size={12} />
                            </button>
                        </div>
                    )}

                    {/* UPI Payments */}
                    {business.upiId && (
                        <div className="bg-[#101018] border border-white/8 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <Wallet size={16} className="text-emerald-400" />
                                <h3 className="text-white text-sm font-bold">Quick UPI Payments</h3>
                                <span className="ml-auto text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">Secure</span>
                            </div>

                            <p className="text-zinc-450 text-xs leading-relaxed">Pay instantly via any UPI app directly to the merchant. Touch the button below to pay or scan QR.</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push(`/profile/${slug}?tab=payment`)}
                                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 rounded-xl font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                                >
                                    <QrCode size={13} /> View QR Code
                                </button>
                                {upiRedirect && (
                                    <button
                                        onClick={() => window.open(upiRedirect, "_blank")}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 font-bold text-xs text-zinc-300 transition flex items-center justify-center gap-1"
                                    >
                                        Launch UPI App <ExternalLink size={11} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* Bottom sticky bar */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-[#07070b] via-[#07070b]/95 to-transparent">
                    <div className="flex gap-2">
                        <button
                            onClick={handleCall}
                            className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-xs text-zinc-300 transition flex items-center justify-center gap-1.5 active:scale-95"
                        >
                            <Phone size={13} /> Call Helpline
                        </button>
                        <button
                            onClick={() => router.push(`/profile/${slug}?tab=website`)}
                            className="flex-[2] py-3.5 bg-gradient-to-r from-violet-650 to-fuchsia-600 hover:brightness-105 rounded-xl font-extrabold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-violet-500/10 active:scale-95"
                        >
                            <Globe size={13} /> Browse Full Website
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // MODE 3: UPI PAYMENT PAGE (tab=payment)
    // ────────────────────────────────────────────────────────────────────────
    if (tab === "payment") {
        return (
            <div className="min-h-screen bg-[#07070b] text-white font-sans flex flex-col max-w-md mx-auto relative overflow-x-hidden pb-24">
                {/* Background glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-80 right-[-10%] w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none z-0" />

                <div className="flex justify-between items-center px-6 pt-8 pb-4 z-10">
                    <div>
                        <h3 className="text-white text-lg font-bold">Quick Pay</h3>
                        <p className="text-zinc-550 text-xs mt-0.5">UPI and QR pay gateway</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-zinc-400" />
                    </button>
                </div>

                <div className="px-5 space-y-4 pb-6 flex-1 z-10">
                    <div className="bg-[#101018] border border-white/8 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                <QrCode className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-white text-sm font-semibold">Scan QR Code</p>
                            <span className="ml-auto text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">UPI QR</span>
                        </div>
                        <div className="bg-white rounded-xl p-4 flex items-center justify-center mx-auto w-fit">
                            {paymentQr ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={paymentQr} alt="UPI QR" className="w-[180px] h-[180px]" />
                            ) : (
                                <QrCode className="w-40 h-40 text-gray-800" />
                            )}
                        </div>
                        <div className="mt-3 flex items-center justify-between bg-black/20 rounded-xl px-3 py-2.5 border border-white/5">
                            <div className="min-w-0 flex-1 mr-2">
                                <p className="text-zinc-550 text-xs">UPI ID</p>
                                <p className="text-white text-sm font-mono font-semibold truncate">{business.upiId}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(business.upiId);
                                    alert("UPI ID copied to clipboard!");
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 transition"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="text-white text-base font-bold mb-3 px-1">App Se Pay Karein 👇</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { name: "Google Pay", sub: "GPay", color: "from-blue-500/20 to-blue-600/10", border: "border-blue-400/30", icon: Wallet, iconColor: "text-blue-400", url: `gpay://upi/pay?pa=${business.upiId}&pn=${encodeURIComponent(business.businessName || business.name)}&cu=INR` },
                                { name: "PhonePe", sub: "PhonePe", color: "from-purple-500/20 to-purple-600/10", border: "border-purple-400/30", icon: Smartphone, iconColor: "text-purple-400", url: `phonepe://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.businessName || business.name)}&cu=INR` },
                                { name: "Paytm", sub: "Paytm", color: "from-sky-500/20 to-sky-600/10", border: "border-sky-400/30", icon: CreditCard, iconColor: "text-sky-400", url: `paytmmp://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.businessName || business.name)}&cu=INR` },
                                { name: "BHIM UPI", sub: "BHIM", color: "from-orange-500/20 to-orange-600/10", border: "border-orange-400/30", icon: IndianRupee, iconColor: "text-orange-400", url: `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.businessName || business.name)}&cu=INR` },
                                { name: "Amazon Pay", sub: "Amazon", color: "from-yellow-500/20 to-yellow-600/10", border: "border-yellow-400/30", icon: QrCode, iconColor: "text-yellow-400", url: `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.businessName || business.name)}&cu=INR` },
                                { name: "WhatsApp", sub: "WA Pay", color: "from-green-500/20 to-green-600/10", border: "border-green-400/30", icon: MessageCircle, iconColor: "text-green-400", url: `upi://pay?pa=${business.upiId}&pn=${encodeURIComponent(business.businessName || business.name)}&cu=INR` },
                            ].map((app) => (
                                <button
                                    key={app.name}
                                    onClick={() => window.open(app.url, "_blank")}
                                    className={`flex items-center gap-3 bg-gradient-to-br ${app.color} border ${app.border} rounded-2xl px-3.5 py-4 active:scale-95 transition-all`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <app.icon className={`w-5 h-5 ${app.iconColor}`} />
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="text-white text-sm font-bold truncate">{app.name}</p>
                                        <p className="text-zinc-400 text-xs truncate">{app.sub}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-[#07070b] via-[#07070b]/95 to-transparent">
                    <button
                        onClick={() => router.back()}
                        className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // MODE 4: DIGITAL BUSINESS CARD PAGE (tab=business-card)
    // ────────────────────────────────────────────────────────────────────────
    if (tab === "business-card") {
        return (
            <div className="min-h-screen bg-[#07070b] text-white font-sans flex flex-col max-w-md mx-auto relative overflow-x-hidden pb-24">
                {/* Background glow effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

                <div className="px-5 pt-8 pb-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02] backdrop-blur-md flex-shrink-0 z-10">
                    <div>
                        <h3 className="text-white font-semibold text-base">Business Card</h3>
                        <p className="text-zinc-550 text-xs">Contact card download</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-10">
                    <div className="relative bg-gradient-to-br from-violet-600 via-fuchsia-700 to-purple-900 rounded-3xl px-5 pt-5 pb-8 mt-4 overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />

                        <div className="relative flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-xl">
                                <span className="text-white text-3xl font-black">{business.businessName.charAt(0)}</span>
                            </div>
                            <div>
                                <h2 className="text-white text-xl font-bold">{business.businessName}</h2>
                                <p className="text-violet-200 text-sm mt-1">{business.tagline}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <BadgeCheck className="w-3.5 h-3.5 text-violet-300" />
                                    <span className="text-violet-300 text-xs">Verified Business</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#101018] border border-white/8 rounded-2xl overflow-hidden mt-4">
                        {[
                            { icon: Phone, label: "Phone", value: business.phone },
                            { icon: Mail, label: "Email", value: business.email },
                            { icon: Globe, label: "Website", value: business.website },
                            { icon: MapPin, label: "Address", value: business.address },
                        ].map((row, i, arr) => (
                            <div
                                key={row.label}
                                className={`flex gap-3 px-4 py-4 ${i !== arr.length - 1 ? "border-b border-white/5" : ""}`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                                    <row.icon className="w-4 h-4 text-violet-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-zinc-550 text-xs">{row.label}</p>
                                    <p className="text-white text-sm truncate">{row.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#101018] border border-white/8 rounded-2xl p-4 mt-4">
                        <p className="text-zinc-400 text-xs uppercase mb-2">About</p>
                        <p className="text-zinc-350 text-sm leading-6">{business.about || "Digital storefront information."}</p>
                    </div>
                </div>

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-[#07070b] via-[#07070b]/95 to-transparent flex gap-3">
                    <button
                        onClick={saveBusinessCard}
                        className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition active:scale-95"
                    >
                        Copy Card Info
                    </button>
                    <button
                        onClick={downloadVCard}
                        className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:brightness-105 transition active:scale-95"
                    >
                        Save Contact
                    </button>
                </div>
            </div>
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // MODE 5: DEFAULT (PUBLIC BUSINESS PROFILE CARD)
    // ────────────────────────────────────────────────────────────────────────
    const starRating = 4.8;
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
            action: () => router.push(`/profile/${slug}?tab=business-card`),
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
            {/* Ambient background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-32 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-[60px] pointer-events-none" />

            {/* Top Navigation */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-semibold tracking-tight">Vscan</span>
                </div>
                <button
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <Share2 className="w-4 h-4 text-zinc-400" />
                </button>
            </div>

            {/* Hero / Identity Branding */}
            <div className="relative z-10 mx-4 mb-6">
                <div className="rounded-3xl bg-gradient-to-br from-violet-600/30 via-violet-900/20 to-transparent border border-violet-500/20 backdrop-blur-sm p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl shadow-black/40 border border-white/10 relative">
                            {business.logo ? (
                                <Image src={business.logo} alt={business.businessName} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                                    <span className="text-white text-3xl font-black">{business.businessName.charAt(0)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h1 className="text-white font-bold text-lg leading-tight truncate">{business.businessName}</h1>
                                <BadgeCheck className="w-4 h-4 text-violet-400 flex-shrink-0" />
                            </div>
                            <p className="text-zinc-400 text-xs mb-2 truncate">{business.tagline}</p>
                            <div className="flex items-center gap-1.5">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(starRating) ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`} />
                                    ))}
                                </div>
                                <span className="text-amber-400 text-xs font-bold">{starRating}</span>
                                <span className="text-zinc-500 text-xs">({business.testimonials?.length || 0})</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCall}
                        className="mt-4 w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-violet-400" />
                            <span className="text-white text-sm font-medium">{business.phone}</span>
                        </div>
                        <span className="text-xs text-violet-400 font-semibold">Call Now</span>
                    </button>
                </div>
            </div>

            <div className="relative z-10 flex justify-center mb-5">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span className="text-zinc-400 text-xs tracking-widest uppercase font-medium">Welcome! How can we help?</span>
                </div>
            </div>

            {/* Action Cards Grid */}
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
                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-zinc-500" />
                        </div>
                    </button>
                ))}

                <div className="flex items-center justify-center gap-2 pt-2 pb-24">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-zinc-600 text-xs tracking-widest uppercase font-medium">Vscan Verified</span>
                </div>
            </div>

            {/* Bottom sticky footer tools */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent">
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push(`/profile/${slug}?tab=payment`)}
                        className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl py-4 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-105 active:scale-[0.98] transition-all duration-150"
                    >
                        <Wallet className="w-5 h-5 text-white" />
                        <span className="text-white font-bold text-sm">Pay</span>
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        className="flex-1 flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl py-4 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:brightness-105 active:scale-[0.98] transition-all duration-150"
                    >
                        <MessageCircle className="w-5 h-5 text-white" />
                        <span className="text-white font-bold text-sm">Chat</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
