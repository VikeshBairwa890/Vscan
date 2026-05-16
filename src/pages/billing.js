"use client";

import { CreditCard, CheckCircle2, ShieldCheck, Building2, Sparkles, Crown, Zap, ArrowRight, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";

export default function BillingSubscription() {
    const [txnId, setTxnId] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [mounted, setMounted] = useState(false);

    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    const handleVerify = () => {
        if (!txnId.trim()) return;

        setVerifying(true);

        setTimeout(() => {
            setVerifying(false);
            setVerified(true);
            toast.success("Payment verified successfully!");
        }, 1500);
    };

    // if (!mounted) {
    //     return (
    //         <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
    //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
            <Toaster position="top-right" richColors />
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT SIDE - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Plan Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Current Plan</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Your active subscription details</p>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex items-start justify-between flex-wrap gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                                            <CreditCard className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Premium Plan
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Smart QR & AI Reputation Management
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-full bg-linear-to-r from-red-50 to-orange-50 border border-red-100">
                                        <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            Trial Active
                                        </span>
                                    </div>
                                </div>

                                {/* Plan Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                    <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-100">
                                        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                                            Plan Expires
                                        </p>
                                        <h3 className="text-xl font-bold text-gray-900 mt-2">
                                            22 May 2026
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">12 days remaining</p>
                                    </div>
                                    <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-100">
                                        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                                            Billing Cycle
                                        </p>
                                        <h3 className="text-xl font-bold text-gray-900 mt-2">
                                            Yearly
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">Auto-renew on 22 May 2026</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-linear-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Included Features
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Everything included in your premium subscription
                                        </p>
                                    </div>
                                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        "Smart QR Generator",
                                        "AI Review Management",
                                        "Unlimited QR Scans",
                                        "Custom Branding",
                                        "Analytics Dashboard",
                                        "Priority Support",
                                        "Business Website",
                                        "Digital Business Card",
                                    ].map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 hover:border-emerald-200 transition-all duration-200 group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Verify Payment Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Verify Payment
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter your UTR / transaction ID after payment
                                </p>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-1">
                                        <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={txnId}
                                            onChange={(e) => {
                                                setTxnId(e.target.value);
                                                setVerified(false);
                                            }}
                                            placeholder="Enter UTR / Transaction ID"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleVerify}
                                        disabled={verifying || !txnId.trim()}
                                        className={`px-8 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 min-w-[160px]
                                            ${verified
                                                ? "bg-linear-to-r from-emerald-500 to-green-600 text-white"
                                                : verifying
                                                    ? "bg-linear-to-r from-blue-400 to-blue-500 text-white"
                                                    : txnId.trim()
                                                        ? "bg-linear-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-xl"
                                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        {verified ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                Verified
                                            </>
                                        ) : verifying ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                                </svg>
                                                Checking
                                            </>
                                        ) : (
                                            "Verify Payment"
                                        )}
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    Account activation usually takes a few minutes after verification
                                </p>

                                {verified && (
                                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50 p-3 rounded-xl">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Transaction submitted successfully. Your account will be activated shortly.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Pricing Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Header */}
                                <div className="px-6 py-4 bg-linear-to-r from-amber-50 to-yellow-50 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-amber-600" />
                                        <h3 className="font-semibold text-gray-800">Upgrade Plan</h3>
                                    </div>
                                     <p className="text-sm text-gray-500 mt-1">Unlock advanced tools and priority support</p>
                                </div>

                                {/* Pricing */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                            Premium Yearly
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-linear-to-r from-green-50 to-emerald-50 text-xs font-semibold text-green-600">
                                            SAVE 30%
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-400 line-through">₹4,999/year</p>
                                        <h2 className="text-4xl font-bold text-gray-900 mt-1">
                                            ₹3,499
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-2">One-time yearly payment</p>
                                    </div>
                                    <button className="w-full mt-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                                        Upgrade Now
                                    </button>
                                </div>

                                {/* QR Code */}
                                <div className="p-6 flex flex-col items-center bg-linear-to-br from-gray-50 to-white">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium">
                                        Scan to Pay
                                    </p>
                                    <div className="w-48 h-48 bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-center shadow-md">
                                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                            <rect x="0" y="0" width="30" height="30" fill="black" rx="3" />
                                            <rect x="4" y="4" width="22" height="22" fill="white" rx="2" />
                                            <rect x="8" y="8" width="14" height="14" fill="black" rx="1" />
                                            <rect x="70" y="0" width="30" height="30" fill="black" rx="3" />
                                            <rect x="74" y="4" width="22" height="22" fill="white" rx="2" />
                                            <rect x="78" y="8" width="14" height="14" fill="black" rx="1" />
                                            <rect x="0" y="70" width="30" height="30" fill="black" rx="3" />
                                            <rect x="4" y="74" width="22" height="22" fill="white" rx="2" />
                                            <rect x="8" y="78" width="14" height="14" fill="black" rx="1" />
                                            {[35, 38, 41, 44, 47, 50, 53, 56, 59, 62].map((x) =>
                                                [35, 38, 41, 44, 47, 50, 53, 56, 59, 62].map((y) =>
                                                    (x * y) % 11 < 6 ? (
                                                        <rect key={`${x}-${y}`} x={x} y={y} width="2.5" height="2.5" fill="black"/>
                                                    ) : null
                                                )
                                            )}
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-4 flex items-center gap-1">
                                        <QrCode className="w-4 h-4" />
                                        Scan using any UPI app
                                    </p>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-xl w-full">
                                        <p className="text-xs text-blue-600 text-center">
                                            UPI ID: business@presence1
                                        </p>
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="p-6 border-t border-gray-100 bg-gray-50">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                        What&apos;s included:
                                    </p>
                                    <div className="space-y-2">
                                        {[
                                            "Full access to all features",
                                            "AI content generation",
                                            "Analytics dashboard",
                                            "Priority email support"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                <span className="text-xs text-gray-600">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}