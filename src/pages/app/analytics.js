import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  TrendingUp, Clock, List, ChevronDown, Calendar, Star,
  MessageSquare, User, CheckCircle2, AlertCircle, ArrowUpRight
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from "recharts";
import { THEME_COLORS } from "@/config/theme";

// Mock Traffic Trends
const trafficTrends = [
  { date: "May 10", scans: 4, views: 12 },
  { date: "May 11", scans: 6, views: 18 },
  { date: "May 12", scans: 2, views: 9 },
  { date: "May 13", scans: 8, views: 24 },
  { date: "May 14", scans: 5, views: 15 },
  { date: "May 15", scans: 11, views: 35 },
  { date: "May 16", scans: 7, views: 22 },
  { date: "May 17", scans: 9, views: 28 },
  { date: "May 18", scans: 14, views: 42 },
  { date: "May 19", scans: 12, views: 38 },
  { date: "May 20", scans: 18, views: 56 },
];

const scanLog = [
  { date: "Wed, May 20, 2026", count: 18, type: "Payment QR" },
  { date: "Tue, May 19, 2026", count: 12, type: "Google Review" },
  { date: "Mon, May 18, 2026", count: 14, type: "Digital Biz Card" },
  { date: "Sun, May 17, 2026", count: 9, type: "Payment QR" },
  { date: "Sat, May 16, 2026", count: 7, type: "Google Review" },
  { date: "Fri, May 15, 2026", count: 11, type: "Digital Biz Card" },
];

const recentReviews = [
  { id: "1", date: "May 19, 2026", name: "Amit Sharma", rating: 5, comment: "Excellent services, the staff was extremely professional and the booking was instant!", source: "Google Maps" },
  { id: "2", date: "May 17, 2026", name: "Neha Verma", rating: 4, comment: "Loved the catalog design! Fast response via WhatsApp.", source: "Direct Feedback" },
  { id: "3", date: "May 14, 2026", name: "Rohan Gupta", rating: 5, comment: "Convenient payment options, direct bank transfer worked perfectly via QR.", source: "Google Maps" }
];

const heatmapAM = [5, 2, 0, 0, 0, 1, 3, 4, 8, 12, 16, 14];
const heatmapPM = [10, 8, 9, 6, 8, 12, 18, 20, 15, 12, 6, 2];
const hours = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM"];
const hoursPM = ["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

function HeatCell({ value }) {
  const max = 20;
  const intensity = value / max;
  const bg = value === 0
    ? "bg-app-bg"
    : intensity > 0.7
      ? "bg-primary shadow-[0_0_10px_rgba(124,58,237,0.4)]"
      : intensity > 0.4
        ? "bg-primary-light"
        : intensity > 0.2
          ? "bg-primary-light/70"
          : "bg-primary/20";
  return <div className={`${bg} rounded h-8 w-full transition-all`} title={`${value} scans/clicks`} />;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-app-bg text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[90px]" />
      
      {/* Header */}
      <div className="border-b border-app-border pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">
            Performance Analytics
          </h1>
          <p className="text-app-text-muted text-sm mt-1">Deep-dive insights on traffic trend, customer clicks, and review history.</p>
        </div>
        
        {/* Time Filter */}
        <button className="flex items-center gap-1.5 text-xs font-semibold text-app-text-muted border border-app-border bg-app-surface rounded-xl px-4 py-2 hover:border-app-text-muted/30 transition">
          <Calendar size={14} className="text-app-text-muted" />
          Last 30 Days <ChevronDown size={12} />
        </button>
      </div>

      {/* Grid: Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Traffic & Scan Trends */}
        <div className="bg-app-surface border border-app-border rounded-3xl p-6 backdrop-blur-md">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-light" /> Scans vs. Views Comparison
          </h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficTrends} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.border} opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: THEME_COLORS.text.muted }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: THEME_COLORS.text.muted }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: THEME_COLORS.surface, borderRadius: "12px", border: `1px solid ${THEME_COLORS.border}`, color: "#fff", fontSize: 12 }}
                />
                <Line type="monotone" dataKey="views" name="Page Views" stroke={THEME_COLORS.accent.DEFAULT} strokeWidth={3} dot={{ fill: THEME_COLORS.accent.DEFAULT, r: 3 }} />
                <Line type="monotone" dataKey="scans" name="QR Scans" stroke={THEME_COLORS.success} strokeWidth={3} dot={{ fill: THEME_COLORS.success, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Volume Breakdown */}
        <div className="bg-app-surface border border-app-border rounded-3xl p-6 backdrop-blur-md">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-primary-light" /> Scan Volume Breakdown
          </h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficTrends} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.border} opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: THEME_COLORS.text.muted }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: THEME_COLORS.text.muted }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: THEME_COLORS.surface, borderRadius: "12px", border: `1px solid ${THEME_COLORS.border}`, color: "#fff", fontSize: 12 }}
                />
                <Bar dataKey="scans" name="Scans" fill={THEME_COLORS.primary.light} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hourly Activity Heatmap */}
      <div className="bg-app-surface border border-app-border rounded-3xl p-6 backdrop-blur-md">
        <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
          🔥 Hourly Interaction Heatmap
        </h2>
        
        <div className="space-y-4">
          {/* AM Row */}
          <div>
            <div className="grid grid-cols-12 gap-1 mb-1.5">
              {heatmapAM.map((v, i) => <HeatCell key={i} value={v} />)}
            </div>
            <div className="grid grid-cols-12 gap-1">
              {hours.map((h) => (
                <span key={h} className="text-center text-[9px] text-app-text-dimmed font-medium truncate px-0.5">{h}</span>
              ))}
            </div>
          </div>
          
          {/* PM Row */}
          <div>
            <div className="grid grid-cols-12 gap-1 mb-1.5">
              {heatmapPM.map((v, i) => <HeatCell key={i} value={v} />)}
            </div>
            <div className="grid grid-cols-12 gap-1">
              {hoursPM.map((h) => (
                <span key={h} className="text-center text-[9px] text-app-text-dimmed font-medium truncate px-0.5">{h}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-5 justify-end">
          <span className="text-[10px] text-app-text-dimmed uppercase font-semibold tracking-wider mr-1">Intensity:</span>
          <span className="text-[10px] text-app-text-muted">Low</span>
          {["bg-app-bg", "bg-primary/20", "bg-primary-light/70", "bg-primary-light", "bg-primary"].map((c) => (
            <div key={c} className={`w-3.5 h-3.5 rounded ${c}`} />
          ))}
          <span className="text-[10px] text-app-text-muted font-medium">High</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Scan Log */}
        <div className="bg-app-surface border border-app-border rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="px-6 py-4 border-b border-app-border">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <List size={16} className="text-app-text-muted" /> Daily Scan Logs
            </span>
          </div>
          <div className="px-6 py-2 divide-y divide-app-border">
            {scanLog.map((row, index) => (
              <div key={index} className="flex justify-between items-center py-3.5">
                <div>
                  <p className="text-sm text-white font-medium">{row.date}</p>
                  <p className="text-[11px] text-app-text-dimmed mt-0.5 uppercase font-bold tracking-widest">{row.type}</p>
                </div>
                <span className="bg-primary/10 text-primary-light text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                  {row.count} Scans
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback List */}
        <div className="bg-app-surface border border-app-border rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="px-6 py-4 border-b border-app-border">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Star size={16} className="text-app-text-muted" /> Recent Google & Private Feedback
            </span>
          </div>
          <div className="px-6 py-2 divide-y divide-app-border">
            {recentReviews.map((rev) => (
              <div key={rev.id} className="py-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                    <p className="text-[10px] text-app-text-dimmed mt-0.5">{rev.date} · via {rev.source}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < rev.rating ? "#facc15" : "none"} className={i < rev.rating ? "text-yellow-400" : "text-white/10"} />
                    ))}
                  </div>
                </div>
                <p className="text-app-text-muted text-xs leading-relaxed italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
