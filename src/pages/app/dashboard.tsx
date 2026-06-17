import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  TrendingUp, ChevronRight, CheckCircle2,
  Sparkles, QrCode, MessageSquare,
  ArrowUpRight, Star, Eye, Award
} from "lucide-react";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { THEME_COLORS } from "@/config/theme";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

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
  const [status, setStatus] = useState<Record<string, unknown> | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchStatus = async () => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const res = await fetch(`/api/business/dashboard-status?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);

        const needsOnboarding = data.onboardingCompleted !== true;
        setShowOnboarding(needsOnboarding);
      }
    } catch (e) {
      console.error("Error loading status", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    setLoading(true);
    await fetchStatus();
  };

  useEffect(() => {
    setMounted(true);
    fetchStatus();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-app-bg text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light"></div>
          <p className="text-xs text-app-text-muted">Loading your Control Center...</p>
        </div>
      </div>
    );
  }

  const businessName = (status?.businessName as string) || "Valued Merchant";
  const checklist = (status?.checklist as Record<string, boolean>) || {
    hasLogo: false,
    hasServices: false,
    hasQr: false,
    hasReviewLink: false,
    isPublished: false,
  };
  const stats = (status?.stats as Record<string, number>) || { views: 0, scans: 0, reviews: 0, leads: 0 };
  const isPremium = (status?.subscription as { isActive?: boolean })?.isActive || false;

  const completedSteps = Object.values(checklist).filter(Boolean).length;
  const totalSteps = 5;

  return (
    <>
    {showOnboarding && (
      <div className="fixed inset-0 z-[200] bg-app-bg">
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    )}
    <div className="min-h-screen bg-app-bg text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">
              Welcome, {businessName}!
            </span>
            {isPremium && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-app-warning bg-app-warning/10 px-2.5 py-1 rounded-full border border-app-warning/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
                <Award size={10} /> Premium
              </span>
            )}
          </div>
          <p className="text-app-text-muted text-sm mt-1">Manage your digital presence, payments and smart routing.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-md ${checklist.isPublished
            ? "bg-app-success/10 border-app-success/30 text-app-success"
            : "bg-app-warning/10 border-app-warning/30 text-app-warning"
            }`}>
            <span className={`w-2 h-2 rounded-full ${checklist.isPublished ? "bg-app-success" : "bg-app-warning animate-pulse"}`} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {checklist.isPublished ? "Published Live" : "Draft Mode"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Website Views", value: stats.views, icon: Eye, color: "text-secondary-light", bg: "from-secondary/20 to-secondary/5", border: "border-secondary/20" },
          { label: "Smart QR Scans", value: stats.scans, icon: QrCode, color: "text-app-success", bg: "from-app-success/20 to-app-success/5", border: "border-app-success/20" },
          { label: "Google Reviews", value: stats.reviews, icon: Star, color: "text-app-warning", bg: "from-app-warning/20 to-app-warning/5", border: "border-app-warning/20" },
          { label: "Total Bookings/Leads", value: stats.leads, icon: MessageSquare, color: "text-primary-light", bg: "from-primary/20 to-primary/5", border: "border-primary/20" },
        ].map((c) => (
          <div
            key={c.label}
            className={`relative overflow-hidden bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-5 backdrop-blur-md shadow-lg transition-transform duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-widest">{c.label}</span>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-3xl font-extrabold text-white mt-3">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-app-surface border border-app-border rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="w-40 h-40 text-primary" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-app-border pb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Smart QR Setup checklist
            </h2>
            <p className="text-app-text-muted text-xs mt-0.5">Complete these configuration items to unlock full local SEO visibility.</p>
          </div>
          <div>
            <span className="text-xs font-bold text-primary-light bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              {completedSteps} / {totalSteps} Completed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {[
            { id: "logo", title: "Upload Business Logo", desc: "Represent your local storefront brand digitally.", checked: checklist.hasLogo, link: "/app/profile-settings" },
            { id: "services", title: "Add your Services/Products", desc: "Create beautiful interactive items for customers to see.", checked: checklist.hasServices, link: "/app/mini-website" },
            { id: "qr", title: "Generate Smart QR Code", desc: "Customize payment gradients and Google review redirect routing.", checked: checklist.hasQr, link: "/app/smart-qr" },
            { id: "reviews", title: "Connect Google Reviews", desc: "Provide feedback redirection routing link.", checked: checklist.hasReviewLink, link: "/app/profile-settings" },
            { id: "publish", title: "Publish Business Mini-Website", desc: "Publish drafts so your website and QR redirect links are live.", checked: checklist.isPublished, link: "/app/mini-website" },
          ].map((item, idx) => (
            <div
              key={item.id}
              onClick={() => router.push(item.link)}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${item.checked
                ? "bg-app-surface/20 border-app-border text-app-text-muted hover:border-white/10"
                : "bg-primary/5 border-primary/20 hover:border-primary/45 hover:bg-primary/10"
                }`}
            >
              <div className="mt-0.5">
                {item.checked ? (
                  <CheckCircle2 className="w-5 h-5 text-app-success" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-primary/40 flex items-center justify-center text-xs font-bold text-primary-light">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-bold truncate ${item.checked ? "text-app-text-muted/60 line-through" : "text-white"}`}>
                  {item.title}
                </h3>
                <p className="text-app-text-dimmed text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-app-text-muted uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "My Website Builder", link: "/app/mini-website", desc: "Design pages & themes", bg: "bg-app-surface hover:bg-app-surface/80 border-app-border" },
            { label: "Configure Smart QR", link: "/app/smart-qr", desc: "Change flyers & shapes", bg: "bg-app-surface hover:bg-app-surface/80 border-app-border" },
            { label: "AI Suggestion Studio", link: "/app/ai-suggestions", desc: "Draft SEO keywords", bg: "bg-app-surface hover:bg-app-surface/80 border-app-border" },
            { label: "Premium Upgrades", link: "/app/billing", desc: "Manage subscription plans", bg: "bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary-light" },
          ].map((act) => (
            <button
              key={act.label}
              onClick={() => router.push(act.link)}
              className={`flex flex-col items-start text-left p-5 rounded-2xl border transition-all duration-200 ${act.bg}`}
            >
              <span className="text-sm font-bold">{act.label}</span>
              <span className="text-[11px] text-app-text-dimmed mt-1">{act.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-app-surface border border-app-border rounded-3xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-app-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-light" />
            <span className="font-bold text-white text-sm">Traffic analytics overview</span>
          </div>
          <button
            onClick={() => router.push("/app/analytics")}
            className="flex items-center gap-1 text-xs text-primary-light hover:text-primary font-semibold transition"
          >
            Open Analytics page <ChevronRight size={14} />
          </button>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData["30 Days"]} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.border} opacity={0.3} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: THEME_COLORS.text.muted }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: THEME_COLORS.text.muted }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: THEME_COLORS.surface, borderRadius: "12px", border: `1px solid ${THEME_COLORS.border}`, color: "#fff", fontSize: 12 }}
                itemStyle={{ color: THEME_COLORS.primary.light }}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke={THEME_COLORS.accent.DEFAULT}
                strokeWidth={3}
                dot={{ fill: THEME_COLORS.accent.DEFAULT, r: 4 }}
                activeDot={{ r: 6, fill: THEME_COLORS.secondary.light }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </>
  );
}
