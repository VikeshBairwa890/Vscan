import { Button, Input, InputGroup, Tabs, TextField } from "@heroui/react";
import { Copy, Download, Globe, Star, User, LayoutGrid, ArrowRight, MessageCircle, CheckCircle2, QrCode, Share2, Eye, RefreshCw, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "sonner";
import QRCode from "qrcode";

const menuItems = [
    {
        id: "review",
        icon: Star,
        title: "Leave a Review",
        subtitle: "How was your experience?",
        color: "from-emerald-700/60 to-emerald-900/40",
        iconColor: "text-emerald-400",
        link: "/review",
    },
    {
        id: "business-card",
        icon: User,
        title: "Business Card",
        subtitle: "Save contact info",
        color: "from-slate-700/60 to-slate-800/40",
        iconColor: "text-slate-300",
        link: "/business-card",
    },
    {
        id: "website",
        icon: LayoutGrid,
        title: "Mini Website",
        subtitle: "Services, Hours & More",
        color: "from-slate-700/60 to-slate-800/40",
        iconColor: "text-slate-300",
        link: "/website",
    },
];

export default function SmartQR() {
    const [activeTab, setActiveTab] = useState("smart-menu");
    const [hovered, setHovered] = useState(null);
    const [qrCodes, setQrCodes] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");
    const [businessData, setBusinessData] = useState({
        name: "vikesh",
        logo: null,
        whatsappNumber: "+919876543210",
        website: "https://business.example.com",
        reviewLink: "https://g.page/r/example",
        miniWebsiteLink: "https://business.example.com/website",
    });

    // useEffect(() => {
    //     setMounted(true);
    //     setBaseUrl(window.location.origin);
    //     fetchBusinessData();
    // }, []);

    const fetchBusinessData = async () => {
        try {
            const response = await fetch('/api/business/profile');
            if (response.ok) {
                const data = await response.json();
                setBusinessData(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            toast.error('Failed to fetch business data');
            console.error('Error fetching business data:', error);
        }
    };

    const generateQRCode = async (type, url) => {
        try {
            const qrDataUrl = await QRCode.toDataURL(url, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
                errorCorrectionLevel: 'H',
            });
            return qrDataUrl;
        } catch (error) {
            console.error('Error generating QR code:', error);
            toast.error('Failed to generate QR code');
            return null;
        }
    };

    const handleGenerateQR = async (type) => {
        setIsGenerating(true);
        try {
            let url = "";
            switch (type) {
                case "smart-menu":
                    url = `${baseUrl}/smart-menu/${businessData.name}`;
                    break;
                case "reviews":
                    url = businessData.reviewLink;
                    break;
                case "contact-info":
                    url = `${baseUrl}/contact/${businessData.name}`;
                    break;
                case "website":
                    url = businessData.miniWebsiteLink;
                    break;
                default:
                    url = businessData.website;
            }

            const qrDataUrl = await generateQRCode(type, url);

            if (qrDataUrl) {
                setQrCodes(prev => ({
                    ...prev,
                    [type]: { type, url, qrCode: qrDataUrl }
                }));
                toast.success(`${type} QR code generated successfully!`);
            }
        } catch (error) {
            console.error('Error generating QR:', error);
            toast.error('Failed to generate QR code');
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadQRCode = async (type) => {
        const qrData = qrCodes[type];
        if (!qrData?.qrCode) {
            toast.error('Please generate QR code first');
            return;
        }

        try {
            const link = document.createElement('a');
            link.download = `${type}-qr-code.png`;
            link.href = qrData.qrCode;
            link.click();
            toast.success('QR code downloaded successfully!');
        } catch (error) {
            console.error('Error downloading QR:', error);
            toast.error('Failed to download QR code');
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Link copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const shareQRCode = async (type) => {
        const qrData = qrCodes[type];
        if (!qrData?.qrCode) {
            toast.error('Please generate QR code first');
            return;
        }

        try {
            const response = await fetch(qrData.qrCode);
            const blob = await response.blob();
            const file = new File([blob], `${type}-qr.png`, { type: 'image/png' });

            if (navigator.share) {
                await navigator.share({
                    title: `${type} QR Code`,
                    text: `Scan this QR code to access ${type}`,
                    files: [file],
                });
                toast.success('Shared successfully!');
            } else {
                toast.info('Share not supported on this device');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const getQRUrl = (type) => {
        if (!mounted) return "";

        switch (type) {
            case "smart-menu":
                return `${baseUrl}/smart-menu/${businessData.name}`;
            case "reviews":
                return businessData.reviewLink;
            case "contact-info":
                return `${baseUrl}/contact/${businessData.name}`;
            case "website":
                return businessData.miniWebsiteLink;
            default:
                return businessData.website;
        }
    };

    const renderQRPanel = (type, title, description) => (
        <div className="flex flex-col items-center justify-center p-6">
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>

            <div className="relative group">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                    {qrCodes[type]?.qrCode ? (
                        <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={qrCodes[type].qrCode}
                                alt={`${type} QR Code`}
                                width={250}
                                height={250}
                                className="rounded-lg w-62.5 h-62.5"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                <button
                                    onClick={() => downloadQRCode(type)}
                                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <Download className="w-5 h-5 text-gray-800" />
                                </button>
                                <button
                                    onClick={() => shareQRCode(type)}
                                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <Share2 className="w-5 h-5 text-gray-800" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-62.5 h-62.5 bg-gray-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                            <QrCode className="w-16 h-16 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">No QR generated</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <Button
                    onPress={() => handleGenerateQR(type)}
                    isLoading={isGenerating}
                    className="bg-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 "
                    variant="tertiary"
                    startContent={!isGenerating && <RefreshCw className="w-4 h-4" />}
                >
                    Generate QR
                </Button>
                {qrCodes[type]?.qrCode && (
                    <Button
                        onPress={() => downloadQRCode(type)}
                        variant="primary-outline"
                        className="bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6"
                        startContent={<Download className="w-4 h-4" />}
                    >
                        Download
                    </Button>
                )}
            </div>

            {mounted && (
                <div className="mt-6 w-full max-w-md">
                    <div className="flex items-center h-12 border border-gray-200 rounded-sm bg-white overflow-hidden shadow-sm">

                        <div className="px-4 text-gray-400">
                            <Globe className="w-4 h-4" />
                        </div>

                        <input type="text" readOnly value={getQRUrl(type)} className="  flex-1   h-full bg-transparent text-sm   text-gray-700  outline-none  border-0  px-2 " />

                        <button onClick={() => copyToClipboard(getQRUrl(type))} className=" h-full px-4  border-l border-gray-200  hover:bg-gray-50  transition-colors flex items-center  justify-center cursor-pointer  " >
                            <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
                    <Eye className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-800">0</p>
                    <p className="text-xs text-gray-600">Total Scans</p>
                </div>
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center">
                    <Share2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-800">0</p>
                    <p className="text-xs text-gray-600">Total Shares</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
            <Toaster position="top-right" richColors />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-5">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">QR Code Generator</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Generate dynamic QR codes for different purposes</p>
                            </div>

                            <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab} className="w-full" >
                                <div className="px-6 pt-4 border-b border-gray-100">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setActiveTab("smart-menu")}
                                            className={`pb-2 px-1 text-sm font-medium transition-colors relative ${activeTab === "smart-menu" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            Smart Menu
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("reviews")}
                                            className={`pb-2 px-1 text-sm font-medium transition-colors relative ${activeTab === "reviews" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            Reviews
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("contact-info")}
                                            className={`pb-2 px-1 text-sm font-medium transition-colors relative ${activeTab === "contact-info" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            Contact Info
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("website")}
                                            className={`pb-2 px-1 text-sm font-medium transition-colors relative ${activeTab === "website" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            Website
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {activeTab === "smart-menu" && renderQRPanel("smart-menu", "Smart Menu QR Code", "Scan to access interactive smart menu")}
                                    {activeTab === "reviews" && renderQRPanel("reviews", "Reviews QR Code", "Scan to leave a Google review")}
                                    {activeTab === "contact-info" && renderQRPanel("contact-info", "Contact Info QR Code", "Scan to save contact details")}
                                    {activeTab === "website" && renderQRPanel("website", "Website QR Code", "Scan to visit mini website")}
                                </div>
                            </Tabs>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-start gap-4">
                        <div className="sticky top-6">
                            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-4 shadow-2xl">
                                <div className="text-center mb-4">
                                    <h3 className="text-white font-semibold">Live Preview</h3>
                                    <p className="text-gray-400 text-xs">How customers see your smart menu</p>
                                </div>

                                {/* Phone Frame */}
                                <div
                                    className="relative w-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 mx-auto"
                                    style={{
                                        background: "linear-linear(160deg, #0f172a 0%, #0d1526 60%, #0a1020 100%)",
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
                                        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-white/20 overflow-hidden">
                                            {businessData.logo ? (
                                                <Image
                                                    src={businessData.logo}
                                                    alt="Business Logo"
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-[10px] font-semibold text-gray-400 tracking-wide text-center leading-tight">
                                                    Your<br />LOGO
                                                </span>
                                            )}
                                        </div>

                                        {/* Name & Subtitle */}
                                        <div className="text-center">
                                            <h1 className="text-white text-xl font-bold tracking-tight">{businessData.name}</h1>
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
                                                        <div className={`
                                                            w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                                                            bg-linear-to-br ${item.color}
                                                        `}>
                                                            <Icon size={16} className={item.iconColor} />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
                                                            <p className="text-slate-400 text-[11px] mt-0.5 leading-tight">{item.subtitle}</p>
                                                        </div>

                                                        <ArrowRight
                                                            size={14}
                                                            className={`flex-shrink-0 transition-all duration-200 ${hovered === idx ? "text-white translate-x-0.5" : "text-slate-500"}`}
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
                                        <a
                                            href={`https://wa.me/${businessData.whatsappNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-300 transition-colors"
                                        >
                                            <MessageCircle size={18} className="text-white" fill="white" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 tracking-wide text-center mt-4">
                                Interactive Mobile Preview
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}