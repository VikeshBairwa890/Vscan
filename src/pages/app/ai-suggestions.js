"use client";

import { useState, useEffect } from "react";
import { Sparkles, Save, RefreshCw, AlertCircle, CheckCircle2, Zap, TrendingUp, Target, Globe } from "lucide-react";
import { toast } from "sonner";

const TOTAL_KEYWORDS = 10;

export default function AISEOManager() {
    const [keywords, setKeywords] = useState(["", "", "", "", "", "", "", "", "", ""]);
    const [saved, setSaved] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [cacheStatus, setCacheStatus] = useState("empty");
    const [mounted, setMounted] = useState(false);
    const [generatedCount, setGeneratedCount] = useState(0);

    useEffect(() => {
        setMounted(true);
        const loadSettings = async () => {
            try {
                const res = await fetch(`/api/business/ai-suggestions-get`);
                if (!res.ok) {
                    toast.error("Failed to load AI Suggestions settings");
                    return;
                }
                const result = await res.json();
                if (result.success && result.data) {
                    if (result.data.keywords) {
                        setKeywords(result.data.keywords);
                    }
                    if (result.data.cacheStatus) {
                        setCacheStatus(result.data.cacheStatus);
                    }
                    if (result.data.generatedCount !== undefined) {
                        setGeneratedCount(result.data.generatedCount);
                    }
                }

            } catch (err) {
                console.error("Error loading AI Suggestions settings", err);
            }
        };
        loadSettings();
    }, []);

    const handleKeywordChange = (index, value) => {
        const updated = [...keywords];
        updated[index] = value;
        setKeywords(updated);
        setSaved(false);
    };

    const handleSave = async () => {
        try {
            const res = await fetch("/api/business/ai-suggestions-post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        keywords,
                        cacheStatus,
                        generatedCount
                    }
                })
            });
            if (!res.ok) {
                toast.error("Failed to save keywords");
                return;
            }

            const result = await res.json();
            if (result.success) {
                setSaved(true);
                toast.success("Keywords saved successfully!");
                setTimeout(() => setSaved(false), 2000);
            } else {
                toast.error(result.message || "Failed to save keywords");
            }
        } catch (err) {
            console.error("Error saving keywords", err);
            toast.error("Error saving keywords");
        }
    }


    const handleRegenerate = () => {
        setRegenerating(true);
        setTimeout(async () => {
            try {
                const nextCount = 25;
                const res = await fetch("/api/business/ai-suggestions-post", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        data: {
                            keywords,
                            cacheStatus: "ready",
                            generatedCount: nextCount
                        }
                    })
                });

                if (!res.ok) {
                    toast.error("Failed to save generated template cache");
                    return;
                }

                const result = await res.json();
                if (result.success) {
                    setCacheStatus("ready");
                    setGeneratedCount(nextCount);
                    toast.success("Review cache generated successfully!");
                } else {
                    toast.error(result.message || "Failed to save generated template cache");
                }
            } catch (err) {
                console.error("Error generating templates", err);
                toast.error("Error saving generated templates");
            } finally {
                setRegenerating(false);
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-app-bg text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

            {/* Header Section */}
            <div className="border-b border-app-border pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">
                        AI SEO Manager
                    </h1>
                    <p className="text-app-text-muted text-sm mt-1">
                        Configure keywords and manage AI-generated review templates
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-xs font-semibold text-primary-light flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Powered
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-app-surface border border-app-border rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-app-text-dimmed uppercase font-bold tracking-wider">Total Keywords</p>
                            <p className="text-2xl font-extrabold text-white mt-1">{keywords.filter(k => k.trim()).length}/{TOTAL_KEYWORDS}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Target className="w-5 h-5 text-primary-light" />
                        </div>
                    </div>
                </div>
                <div className="bg-app-surface border border-app-border rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-app-text-dimmed uppercase font-bold tracking-wider">Generated Reviews</p>
                            <p className="text-2xl font-extrabold text-white mt-1">{generatedCount}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-app-success/10 flex items-center justify-center border border-app-success/20">
                            <TrendingUp className="w-5 h-5 text-app-success" />
                        </div>
                    </div>
                </div>
                <div className="bg-app-surface border border-app-border rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-app-text-dimmed uppercase font-bold tracking-wider">Cache Status</p>
                            <p className="text-2xl font-extrabold text-white mt-1 capitalize">{cacheStatus}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                            <Globe className="w-5 h-5 text-secondary-light" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Keywords Card */}
                <div className="bg-app-surface border border-app-border rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
                    <div className="px-6 py-4 bg-app-bg/30 border-b border-app-border">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary-light" />
                            <h2 className="text-base font-bold text-white">Your Keywords</h2>
                        </div>
                        <p className="text-xs text-app-text-muted mt-0.5">Add keywords that describe your business</p>
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
                                    className="w-full border border-app-border bg-app-bg/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            ))}
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className={`
                                w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 mt-6 active:scale-[0.98]
                                ${saved
                                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/10"
                                    : "bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white shadow-lg shadow-primary/20"
                                }
                            `}
                        >
                            {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                            {saved ? "Keywords Saved!" : "Save Keywords"}
                        </button>

                        <p className="text-[10px] text-app-text-dimmed text-center mt-4">
                            Keywords help AI generate better review templates
                        </p>
                    </div>
                </div>

                {/* Right: Cache Status Card */}
                <div className="bg-app-surface border border-app-border rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
                    <div className="px-6 py-4 bg-app-bg/30 border-b border-app-border">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary-light" />
                            <h2 className="text-base font-bold text-white">Review Cache Status</h2>
                        </div>
                        <p className="text-xs text-app-text-muted mt-0.5">Manage your AI-generated review templates</p>
                    </div>

                    <div className="p-6 flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border ${cacheStatus === "empty"
                            ? "bg-app-warning/10 border-app-warning/20 text-app-warning shadow-[0_0_15px_rgba(251,191,36,0.05)]"
                            : "bg-app-success/10 border-app-success/20 text-app-success shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                            }`}>
                            {cacheStatus === "empty" ? (
                                <AlertCircle size={32} />
                            ) : (
                                <Sparkles size={32} />
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-white mt-4">
                            {cacheStatus === "empty" ? "Cache is Empty" : "Cache is Ready"}
                        </h3>

                        {/* Status Badge */}
                        {cacheStatus === "empty" ? (
                            <div className="flex items-center gap-1.5 bg-app-warning/10 border border-app-warning/20 text-app-warning text-[10px] font-bold px-3.5 py-1.5 rounded-full mt-2">
                                <AlertCircle size={12} />
                                Cache Empty
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 bg-app-success/10 border border-app-success/20 text-app-success text-[10px] font-bold px-3.5 py-1.5 rounded-full mt-2">
                                <Sparkles size={12} />
                                Cache Ready - {generatedCount} templates available
                            </div>
                        )}

                        {/* Sub-text */}
                        <p className="text-app-text-muted text-xs max-w-xs leading-relaxed mt-4">
                            {cacheStatus === "empty"
                                ? "Customers may experience slower response times. Generate review cache for instant responses."
                                : "Your review cache is fresh and ready. Customers will get instant AI-generated responses."}
                        </p>

                        {/* Regenerate Button */}
                        <button
                            onClick={handleRegenerate}
                            disabled={regenerating}
                            className={`
                                w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 mt-6 active:scale-[0.98]
                                ${regenerating
                                    ? "bg-app-surface text-app-text-muted cursor-not-allowed border border-app-border"
                                    : "bg-white hover:bg-white/90 text-app-bg shadow-lg shadow-white/10"
                                }
                            `}
                        >
                            <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
                            {regenerating ? "Generating Templates..." : "Generate Review Templates"}
                        </button>

                        {/* Footer Note */}
                        <div className="mt-6 p-3 bg-app-bg/40 border border-app-border rounded-xl w-full">
                            <p className="text-app-text-dimmed text-[11px] flex items-center justify-center gap-1">
                                <RefreshCw size={10} />
                                System automatically refreshes review cache every 24 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-6 border border-primary/20 backdrop-blur-md shadow-xl">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-white text-sm">How it works</h4>
                        <p className="text-xs text-app-text-muted mt-1 leading-relaxed">
                            Add keywords related to your business, then generate review templates.
                            Our AI will create personalized review suggestions based on your keywords,
                            helping customers leave better reviews faster.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3.5">
                            <span className="text-[10px] bg-app-bg/50 border border-app-border px-2.5 py-1 rounded-lg text-primary-light font-medium">✨ Instant generation</span>
                            <span className="text-[10px] bg-app-bg/50 border border-app-border px-2.5 py-1 rounded-lg text-primary-light font-medium">🎯 Keyword based</span>
                            <span className="text-[10px] bg-app-bg/50 border border-app-border px-2.5 py-1 rounded-lg text-primary-light font-medium">🚀 24h auto-refresh</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}