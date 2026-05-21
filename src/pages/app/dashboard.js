'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Clock, List, ChevronRight, CheckCircle2,
  AlertCircle, Sparkles, Globe, QrCode, MessageSquare,
  ArrowUpRight, Star, Eye, ShieldAlert, Award, UserCheck, Shield
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

// Mock Recharts Data for Bottom Analytics Section
const trafficData = {
  Today: [{ d: "Now", v: 3 }],
  "7 Days": [
    { d: "May 10", v: 4 }, { d: "May 11", v: 6 }, { d: "May 12", v: 2 },
    { d: "May 13", v: 8 }, { d: "May 14", v: 5 }, { d: "May 15", v: 11 }, { d: "May 16", v: 7 },
  ],
  "30 Days": [
    { d: "May 1", v: 10 }, { d: "May 3", v: 7 }, { d: "May 5", v: 14 },
    { d: "May 7", v: 9 }, { d: "May 9", v: 18 }, { d: "May 11", v: 6 },
    { d: "May 13", v: 20 }, { d: "May 15", v: 11 }, { d: "May 16", v: 7 },
  ],
};

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("30 Days");

  const fetchStatus = async () => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const res = await fetch(`/api/business/status?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error("Error loading status", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStatus();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
          <p className="text-xs text-slate-400">Loading your Control Center...</p>
        </div>
      </div>
    );
  }

  // Fallback defaults if profile doesn't exist yet
  const businessName = status?.businessName || "Valued Merchant";
  const checklist = status?.checklist || {
    hasLogo: false,
    hasServices: false,
    hasQr: false,
    hasReviewLink: false,
    isPublished: false
  };
  const stats = status?.stats || { views: 0, scans: 0, reviews: 0, leads: 0 };
  const isPremium = status?.subscription?.isActive || false;

  // Calculate completed steps
  const completedSteps = Object.values(checklist).filter(Boolean).length;
  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden font-sans">
      {/* Background gradients for premium glassmorphism aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Welcome, {businessName}!
            </span>
            {isPremium && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
                <Award size={10} /> Premium
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">Manage your digital presence, payments and smart routing.</p>
        </div>

        {/* Publication Status Badge */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-md ${checklist.isPublished
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}>
            <span className={`w-2 h-2 rounded-full ${checklist.isPublished ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {checklist.isPublished ? "Published Live" : "Draft Mode"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top-Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Website Views", value: stats.views, icon: Eye, color: "text-indigo-400", bg: "from-indigo-500/20 to-indigo-600/5", border: "border-indigo-500/20" },
          { label: "Smart QR Scans", value: stats.scans, icon: QrCode, color: "text-emerald-400", bg: "from-emerald-500/20 to-emerald-600/5", border: "border-emerald-500/20" },
          { label: "Google Reviews", value: stats.reviews, icon: Star, color: "text-amber-400", bg: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/20" },
          { label: "Total Bookings/Leads", value: stats.leads, icon: MessageSquare, color: "text-violet-400", bg: "from-violet-500/20 to-violet-600/5", border: "border-violet-500/20" },
        ].map((c) => (
          <div
            key={c.label}
            className={`relative overflow-hidden bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-5 backdrop-blur-md shadow-lg transition-transform duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{c.label}</span>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-3xl font-extrabold text-white mt-3">{c.value}</p>
          </div>
        ))}
      </div>

      {/* 3. Middle Section: Setup Checklist */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="w-40 h-40 text-indigo-500" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/30 pb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🚀 Smart QR Setup checklist
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Complete these configuration items to unlock full local SEO visibility.</p>
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
              {completedSteps} / {totalSteps} Completed
            </span>
          </div>
        </div>

        {/* Checklist List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {[
            {
              id: "logo",
              title: "Upload Business Logo",
              desc: "Represent your local storefront brand digitally.",
              checked: checklist.hasLogo,
              link: "/app/profile-settings"
            },
            {
              id: "services",
              title: "Add your Services/Products",
              desc: "Create beautiful interactive items for customers to see.",
              checked: checklist.hasServices,
              link: "/app/mini-website"
            },
            {
              id: "qr",
              title: "Generate Smart QR Code",
              desc: "Customize payment gradients and Google review redirect routing.",
              checked: checklist.hasQr,
              link: "/app/smart-qr"
            },
            {
              id: "reviews",
              title: "Connect Google Reviews",
              desc: "Provide feedback redirection routing link.",
              checked: checklist.hasReviewLink,
              link: "/app/profile-settings"
            },
            {
              id: "publish",
              title: "Publish Business Mini-Website",
              desc: "Publish drafts so your website and QR redirect links are live.",
              checked: checklist.isPublished,
              link: "/app/mini-website"
            }
          ].map((item, idx) => (
            <div
              key={item.id}
              onClick={() => router.push(item.link)}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${item.checked
                ? "bg-slate-900/20 border-slate-800 text-slate-400 hover:border-slate-700/60"
                : "bg-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/10"
                }`}
            >
              <div className="mt-0.5">
                {item.checked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className={`text-sm font-bold truncate ${item.checked ? "text-slate-400 line-through" : "text-white"}`}>
                    {item.title}
                  </h3>
                  {!item.checked && <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
                <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "My Website Builder", link: "/app/mini-website", desc: "Design pages & themes", bg: "bg-slate-800/40 hover:bg-slate-800 border-slate-700/50" },
            { label: "Configure Smart QR", link: "/app/smart-qr", desc: "Change flyers & shapes", bg: "bg-slate-800/40 hover:bg-slate-800 border-slate-700/50" },
            { label: "AI Suggestion Studio", link: "/app/ai-suggestions", desc: "Draft SEO keywords", bg: "bg-slate-800/40 hover:bg-slate-800 border-slate-700/50" },
            { label: "Premium Upgrades", link: "/app/billing", desc: "Manage subscription plans", bg: "bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-500/20 text-indigo-300" },
          ].map((act) => (
            <button
              key={act.label}
              onClick={() => router.push(act.link)}
              className={`flex flex-col items-start text-left p-5 rounded-2xl border transition-all duration-200 ${act.bg}`}
            >
              <span className="text-sm font-bold">{act.label}</span>
              <span className="text-[11px] text-slate-500 mt-1">{act.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Bottom Analytics Widget */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-700/30 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-400" />
            <span className="font-bold text-white text-sm">Traffic analytics overview</span>
          </div>
          <button
            onClick={() => router.push("/app/analytics")}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            Open Analytics page <ChevronRight size={14} />
          </button>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData["30 Days"]} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff", fontSize: 12 }}
                itemStyle={{ color: "#818cf8" }}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", r: 4 }}
                activeDot={{ r: 6, fill: "#818cf8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
