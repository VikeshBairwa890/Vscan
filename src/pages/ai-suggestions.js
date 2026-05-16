"use client";

import { useState, useEffect } from "react";
import { Sparkles, Save, RefreshCw, AlertCircle, CheckCircle2, Zap, TrendingUp, Target, Globe } from "lucide-react";
import { toast, Toaster } from "sonner";

const TOTAL_KEYWORDS = 10;

export default function AISEOManager() {
    const [keywords, setKeywords] = useState(["Service", "Quality", "Professional", "Value", "", "", "", "", "", ""]);
    const [saved, setSaved] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [cacheStatus, setCacheStatus] = useState("empty");
    const [mounted, setMounted] = useState(false);
    const [generatedCount, setGeneratedCount] = useState(0);

    // useEffect(() => {
    //     if (!mounted) {
    //         setMounted(true);
    //     }
    // }, [mounted]);

    const handleKeywordChange = (index, value) => {
        const updated = [...keywords];
        updated[index] = value;
        setKeywords(updated);
        setSaved(false);
    };

    const handleSave = async () => {
        setSaved(true);
        toast.success("Keywords saved successfully!");
        setTimeout(() => setSaved(false), 2000);
    };

    const handleRegenerate = () => {
        setRegenerating(true);
        setTimeout(() => {
            setRegenerating(false);
            setCacheStatus("ready");
            setGeneratedCount(25);
            toast.success("Review cache generated successfully!");
        }, 2000);
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
                {/* Header Section - Same as other pages */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <h2 className="text-xl font-semibold text-gray-800"> AI SEO Manager</h2>
                                </div>

                                <p className="text-sm text-gray-500 mt-1">
                                    Configure keywords and manage AI-generated review templates
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-full bg-linear-to-r from-violet-50 to-purple-50 border border-violet-100">
                                    <span className="text-xs font-medium text-violet-600 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        AI Powered
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Keywords</p>
                                    <p className="text-2xl font-bold text-gray-900">{keywords.filter(k => k.trim()).length}/{TOTAL_KEYWORDS}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-violet-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Generated Reviews</p>
                                    <p className="text-2xl font-bold text-gray-900">{generatedCount}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Cache Status</p>
                                    <p className="text-2xl font-bold text-gray-900 capitalize">{cacheStatus}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 mb-8">
                        {/* Left: Keywords Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-linear-to-r from-violet-50 to-purple-50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-violet-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Your Keywords</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Add keywords that describe your business</p>
                            </div>

                            <div className="p-6">
                                {/* Keyword Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {Array.from({ length: TOTAL_KEYWORDS }).map((_, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={keywords[i]}
                                            onChange={(e) => handleKeywordChange(i, e.target.value)}
                                            placeholder={`Keyword ${i + 1}`}
                                            className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all"
                                        />
                                    ))}
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleSave}
                                    className={`
                                    w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 mt-6
                                    ${saved
                                            ? "bg-linear-to-r from-green-500 to-emerald-600 text-white"
                                            : "bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                                        }
                                `}
                                >
                                    {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                                    {saved ? "Keywords Saved!" : "Save Keywords"}
                                </button>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    Keywords help AI generate better review templates
                                </p>
                            </div>
                        </div>

                        {/* Right: Cache Status Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Review Cache Status</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Manage your AI-generated review templates</p>
                            </div>

                            <div className="p-6 flex flex-col items-center text-center">
                                {/* Icon */}
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${cacheStatus === "empty" ? "bg-yellow-50" : "bg-green-50"
                                    }`}>
                                    {cacheStatus === "empty" ? (
                                        <AlertCircle size={40} className="text-yellow-600" />
                                    ) : (
                                        <Sparkles size={40} className="text-green-600" />
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-900 mt-4">
                                    {cacheStatus === "empty" ? "Cache is Empty" : "Cache is Ready"}
                                </h3>

                                {/* Status Badge */}
                                {cacheStatus === "empty" ? (
                                    <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-600 text-sm font-semibold px-4 py-1.5 rounded-full mt-2">
                                        <AlertCircle size={14} />
                                        Cache Empty
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 text-sm font-semibold px-4 py-1.5 rounded-full mt-2">
                                        <Sparkles size={14} />
                                        Cache Ready - {generatedCount} templates available
                                    </div>
                                )}

                                {/* Sub-text */}
                                <p className="text-gray-500 text-sm max-w-xs leading-relaxed mt-4">
                                    {cacheStatus === "empty"
                                        ? "Customers may experience slower response times. Generate review cache for instant responses."
                                        : "Your review cache is fresh and ready. Customers will get instant AI-generated responses."}
                                </p>

                                {/* Regenerate Button */}
                                <button
                                    onClick={handleRegenerate}
                                    disabled={regenerating}
                                    className={`
                                    w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 mt-6
                                    ${regenerating
                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                            : "bg-linear-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-xl"
                                        }
                                `}
                                >
                                    <RefreshCw size={15} className={regenerating ? "animate-spin" : ""} />
                                    {regenerating ? "Generating Templates..." : "Generate Review Templates"}
                                </button>

                                {/* Footer Note */}
                                <div className="mt-6 p-3 bg-gray-50 rounded-xl w-full">
                                    <p className="text-gray-400 text-[11px] flex items-center justify-center gap-1">
                                        <RefreshCw size={10} />
                                        System automatically refreshes review cache every 24 hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Info Section */}
                <div className="mt-8 bg-linear-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-gray-800">How it works</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Add keywords related to your business, then generate review templates.
                                Our AI will create personalized review suggestions based on your keywords,
                                helping customers leave better reviews faster.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="text-xs bg-white px-2 py-1 rounded-lg text-violet-600">✨ Instant generation</span>
                                <span className="text-xs bg-white px-2 py-1 rounded-lg text-violet-600">🎯 Keyword based</span>
                                <span className="text-xs bg-white px-2 py-1 rounded-lg text-violet-600">🚀 24h auto-refresh</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}