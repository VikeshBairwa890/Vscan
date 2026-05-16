"use client";

import { useState } from "react";
import { Sparkles, Save, RefreshCw, AlertCircle } from "lucide-react";

const TOTAL_KEYWORDS = 10;

export default function AISEOManager() {
    const [keywords, setKeywords] = useState(["Service", "Quality", "Professional", "Value", "", "", "", "", "", ""]);
    const [saved, setSaved] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [cacheStatus, setCacheStatus] = useState("empty");

    const handleKeywordChange = (index, value) => {
        const updated = [...keywords];
        updated[index] = value;
        setKeywords(updated);
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleRegenerate = () => {
        setRegenerating(true);
        setTimeout(() => {
            setRegenerating(false);
            setCacheStatus("ready");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-5">
                <div
                    className="rounded-2xl px-7 py-6"
                    style={{
                        background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #8b5cf6 100%)",
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={20} className="text-yellow-300" />
                        <h1 className="text-white text-xl font-bold">AI SEO Manager</h1>
                    </div>
                    <p className="text-violet-200 text-sm leading-relaxed max-w-lg">
                        Configure keywords describing your business. We will pre-generate high-quality
                        review templates so your customers never wait.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
                        <h2 className="text-base font-bold text-gray-900">Your Keywords</h2>

                        {/* Keyword Grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {Array.from({ length: TOTAL_KEYWORDS }).map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={keywords[i]}
                                    onChange={(e) => handleKeywordChange(i, e.target.value)}
                                    placeholder={`Keyword ${i + 1}`}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
                                />
                            ))}
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className={`
                w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${saved
                                    ? "bg-green-500 text-white"
                                    : "bg-violet-600 hover:bg-violet-700 text-white"
                                }
              `}
                        >
                            <Save size={16} />
                            {saved ? "Keywords Saved!" : "Save Keywords"}
                        </button>
                    </div>

                    {/* Right: Cache Status Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 text-center">

                        {/* Icon */}
                        <div className="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center">
                            <Sparkles size={34} className="text-violet-600" />
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold text-gray-900">Review Cache Status</h2>

                        {/* Status Badge */}
                        {cacheStatus === "empty" ? (
                            <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-600 text-sm font-semibold px-4 py-1.5 rounded-full">
                                <AlertCircle size={14} />
                                Cache Empty
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 text-sm font-semibold px-4 py-1.5 rounded-full">
                                <Sparkles size={14} />
                                Cache Ready
                            </div>
                        )}

                        {/* Sub-text */}
                        <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                            {cacheStatus === "empty"
                                ? "Customers may face slow loading times. Please regenerate."
                                : "Your review cache is fresh. Customers will get instant responses."}
                        </p>

                        {/* Regenerate Button */}
                        <button
                            onClick={handleRegenerate}
                            disabled={regenerating}
                            className={`
                w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${regenerating
                                    ? "bg-gray-700 text-white cursor-wait"
                                    : "bg-gray-900 hover:bg-gray-700 text-white"
                                }
              `}
                        >
                            <RefreshCw size={15} className={regenerating ? "animate-spin" : ""} />
                            {regenerating ? "Regenerating..." : "Regenerate Reviews Now"}
                        </button>

                        {/* Footer Note */}
                        <p className="text-gray-400 text-[11px] italic">
                            System automatically refreshes review cache every 24 hours.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}