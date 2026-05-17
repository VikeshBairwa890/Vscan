"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TrendingUp, Clock, List, ChevronDown } from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
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
  "All Time": [
    { d: "Jan", v: 5 }, { d: "Feb", v: 12 }, { d: "Mar", v: 8 }, { d: "Apr", v: 22 },
    { d: "May", v: 31 },
  ],
};

const statsByRange = {
  Today: { scans: 7, stars: 0, contacts: 0, feedback: 0 },
  "7 Days": { scans: 18, stars: 2, contacts: 1, feedback: 0 },
  "30 Days": { scans: 31, stars: 0, contacts: 0, feedback: 0 },
  "All Time": { scans: 31, stars: 0, contacts: 0, feedback: 0 },
};

const scanLog = [
  { date: "Sat, May 16, 2026", count: 7 },
  { date: "Fri, May 15, 2026", count: 11 },
];

const heatmapAM = [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const heatmapPM = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7];
const hours = ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h"];
const hoursPM = ["12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h"];

function HeatCell({ value }) {
  const max = 9;
  const intensity = value / max;
  const bg = value === 0
    ? "bg-gray-100"
    : intensity > 0.7
      ? "bg-blue-700"
      : intensity > 0.3
        ? "bg-blue-400"
        : "bg-blue-200";
  return <div className={`${bg} rounded h-10 w-full transition-all`} title={`${value} scans`} />;
}

const TABS = ["Today", "7 Days", "30 Days", "All Time"];

export default function PerformanceDashboard() {
  const [activeTab, setActiveTab] = useState("30 Days");
  const stats = statsByRange[activeTab];

  return (
    <>

      <div className="flex flex-col gap-3 mb-5">
        <h1 className="text-xl font-bold text-gray-900">Performance</h1>
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${activeTab === tab ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"}`} >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl px-6 py-5 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#2251cc 0%,#3b6df7 100%)" }}>
          <div>
            <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mb-1">Est. Value Generated</p>
            <p className="text-white text-4xl font-bold">₹ 0</p>
            <p className="text-blue-200 text-xs mt-1">Based on 5-star clicks &amp; contacts</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
            <TrendingUp size={22} className="text-white" />
          </div>
        </div>

        <div className="rounded-xl px-6 py-5 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#16a34a 0%,#22c55e 100%)" }}>
          <div>
            <p className="text-green-100 text-xs font-semibold tracking-widest uppercase mb-1">Time Saved</p>
            <p className="text-white text-4xl font-bold">0 mins</p>
            <p className="text-green-100 text-xs mt-1">via AI suggestions &amp; instant links</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
            <Clock size={22} className="text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Scans", value: stats.scans, color: "text-blue-600" },
          { label: "5-Star Clicks", value: stats.stars, color: "text-yellow-500" },
          { label: "Contacts Saved", value: stats.contacts, color: "text-green-500" },
          { label: "Private Feedback", value: stats.feedback, color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
            <p className="text-[11px] text-gray-400 font-semibold tracking-widest uppercase">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-bold text-gray-700 mb-4">Traffic Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trafficData[activeTab]} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} itemStyle={{ color: "#2251cc" }} />
              <Line
                type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2.5}
                dot={{ fill: "#2563eb", r: 3 }}
                activeDot={{ r: 5, fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Activity Heatmap */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-bold text-gray-700 mb-4">Hourly Activity Heatmap</p>
          <div className="flex flex-col gap-1.5">
            {/* AM Row */}
            <div className="grid grid-cols-12 gap-1">
              {heatmapAM.map((v, i) => <HeatCell key={i} value={v} />)}
            </div>
            {/* AM Labels */}
            <div className="grid grid-cols-12 gap-1 mb-1">
              {hours.map((h) => (
                <span key={h} className="text-center text-[9px] text-gray-400">{h}</span>
              ))}
            </div>
            {/* PM Row */}
            <div className="grid grid-cols-12 gap-1">
              {heatmapPM.map((v, i) => <HeatCell key={i} value={v} />)}
            </div>
            {/* PM Labels */}
            <div className="grid grid-cols-12 gap-1">
              {hoursPM.map((h) => (
                <span key={h} className="text-center text-[9px] text-gray-400">{h}</span>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[10px] text-gray-400">Low</span>
            {["bg-gray-100", "bg-blue-200", "bg-blue-400", "bg-blue-700"].map((c) => (
              <div key={c} className={`w-4 h-4 rounded ${c}`} />
            ))}
            <span className="text-[10px] text-gray-400">High</span>
          </div>
        </div>
      </div>

      {/* Daily Scan Log */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-5">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <List size={16} className="text-gray-500" />
            <span className="font-bold text-gray-800 text-sm">Daily Scan Log</span>
          </div>
          <button className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-blue-300 transition">
            Last 30 Days <ChevronDown size={12} />
          </button>
        </div>
        <div className="px-6 py-2">
          <div className="grid grid-cols-2 pb-2 pt-2 border-b border-gray-50">
            <span className="text-[11px] text-gray-400 font-semibold tracking-widest uppercase">Date</span>
            <span className="text-[11px] text-gray-400 font-semibold tracking-widest uppercase text-right">Scan Count</span>
          </div>
          {scanLog.map((row) => (
            <div key={row.date} className="grid grid-cols-2 py-3.5 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{row.date}</span>
              <div className="flex justify-end">
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full min-w-7 text-center">
                  {row.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <span className="font-bold text-gray-800 text-sm">Recent Feedback</span>
          <button className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-blue-300 transition">
            Last 30 Days <ChevronDown size={12} />
          </button>
        </div>
        <div className="px-6 py-2">
          <div className="grid grid-cols-5 pb-2 pt-2 border-b border-gray-50">
            {["Date", "Rating", "Customer", "Message", "Status"].map((h) => (
              <span key={h} className="text-[11px] text-gray-400 font-semibold tracking-widest uppercase">{h}</span>
            ))}
          </div>
          <div className="py-10 text-center text-sm text-gray-400 italic">
            No feedback received.
          </div>
        </div>
      </div>

    </>
  );
}