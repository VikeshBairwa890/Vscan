"use client";

import { useState, useEffect } from "react";
import {
  Globe, Edit3, Eye, Save, CheckCircle2, Link, Plus, Trash2,
  ChevronDown, ChevronUp, Star, Phone, Award, Megaphone,
  ShoppingBag, Users, Play, FileText, HelpCircle,
  MessageSquare, Briefcase, Palette, Smartphone,
  LayoutTemplate, MapPin, Mail, Clock, Send
} from "lucide-react";
import { toast } from "sonner";

import TemplatePicker from "@/components/website-builder/TemplatePicker";
import TemplateRenderer from "@/components/website-builder/TemplateRenderer";
import { THEMES, getTheme } from "@/components/website-builder/theme";
import { FaInstagram } from "react-icons/fa";

const uid = () => Math.random().toString(36).slice(2, 8);

const DEFAULT = {
  businessName: "Vikesh Studio",
  tagline: "Professional Services You Can Trust",
  logo: "",
  phone: "+91 98765 43210",
  email: "hello@vikesh.in",
  address: "123 MG Road, Jaipur, Rajasthan",
  website: "www.vikesh.in",
  instagram: "vikesh.studio",
  facebook: "vikeshstudio",
  youtube: "",
  theme: "blue",
  buttonText: "Contact Us",
  googleFormLink: "",
  announcement: { enabled: true, text: "🎉 Special offer: 20% off this week! Call now." },
  services: [
    { id: uid(), name: "Web Design", price: "5000", desc: "Beautiful responsive websites", image: "" },
    { id: uid(), name: "SEO Management", price: "3000", desc: "Rank higher on Google", image: "" },
  ],
  hours: [
    { day: "Mon – Fri", time: "9:00 AM – 7:00 PM", open: true },
    { day: "Saturday", time: "10:00 AM – 5:00 PM", open: true },
    { day: "Sunday", time: "Closed", open: false },
  ],
  employees: [
    { id: uid(), name: "Vikesh Sharma", bio: "Founder & CEO", phone: "+91 98765 43210", email: "vikesh@vikesh.in", image: "" },
  ],
  testimonials: [
    { id: uid(), name: "Ravi Kumar", company: "TechCorp India", content: "Excellent service, very professional! Highly recommended.", stars: 5 },
    { id: uid(), name: "Priya Singh", company: "", content: "Great results within a week. Will use again!", stars: 5 },
  ],
  mediaLinks: [
    { id: uid(), title: "Our Work Showcase", url: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
  ],
  faqs: [
    { id: uid(), question: "How long does a project take?", answer: "Most projects are completed within 7-14 business days depending on scope." },
    { id: uid(), question: "Do you offer refunds?", answer: "Yes, we offer a 7-day satisfaction guarantee on all services." },
  ],
  amenities: ["Free Consultation", "24/7 Support", "Home Delivery", "Online Payment", "Certified Team", "Instant Response"],
  showSections: {
    announcement: true, services: true, hours: true, contact: true,
    social: true, employees: true, testimonials: true, mediaLinks: true,
    faqs: true, amenities: true, googleForm: true,
  },
};

function StarRow({ count, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13}
          fill={i <= count ? "#facc15" : "none"}
          className={`cursor-pointer transition-transform hover:scale-110 ${i <= count ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => onChange?.(i)} />
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-1 group">
      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-[22px] rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${checked ? "bg-indigo-500 shadow-sm" : "bg-slate-700"
          }`}
      >
        <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? "left-[22px]" : "left-[3px]"
          }`} />
      </button>
    </div>
  );
}

function FInput({ label, value, onChange, placeholder, small }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      )}
      <input
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border border-slate-700 rounded-xl px-3 bg-slate-900/60 text-white placeholder-slate-500 
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent 
          hover:border-slate-600 transition-all w-full
          ${small ? "py-1.5 text-xs" : "py-2.5 text-sm"}`}
      />
    </div>
  );
}

function FTA({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      )}
      <textarea
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900/60 text-white placeholder-slate-500 
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent 
          hover:border-slate-600 transition-all resize-none w-full"
      />
    </div>
  );
}

function Section({ icon: Icon, title, color = "text-slate-400", badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border overflow-hidden transition-shadow ${open ? "border-slate-700/80 bg-slate-800/20" : "border-slate-800 bg-slate-900/30"
      }`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors ${open ? "bg-slate-800/40 border-b border-slate-700/50" : "bg-slate-900/40 hover:bg-slate-850"
          }`}
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={15} className={`flex-shrink-0 ${color}`} />}
          <span className={`text-[13px] font-semibold ${open ? "text-white" : "text-slate-400"}`}>{title}</span>
          {badge !== undefined && badge > 0 && (
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold leading-none border border-indigo-500/20">
              {badge}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp size={14} className="text-slate-500 flex-shrink-0" />
          : <ChevronDown size={14} className="text-slate-500 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-4 py-4 flex flex-col gap-3">{children}</div>
      )}
    </div>
  );
}

function Card({ children, onDelete }) {
  return (
    <div className="relative border border-slate-700/50 rounded-xl p-3 bg-slate-900/40 flex flex-col gap-2.5 hover:border-slate-650 transition-colors">
      {children}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all shadow-sm"
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-1.5 py-3 border-2 border-dashed border-slate-700 rounded-xl text-xs font-semibold text-slate-500 
        hover:border-indigo-500/60 hover:text-indigo-400 hover:bg-indigo-500/5 
        active:scale-[0.98] transition-all"
    >
      <Plus size={13} /> {label}
    </button>
  );
}

function PhoneFrame({ children }) {
  return (
    <div className="relative mx-auto scale-90 sm:scale-100 origin-top" style={{ width: 375 }}>
      {/* Body */}
      <div
        className="relative rounded-[2.8rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
        style={{
          background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)",
          padding: "14px 10px 16px",
          border: "1.5px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Dynamic island */}
        <div className="flex justify-center mb-2.5">
          <div className="w-[88px] h-[26px] rounded-full flex items-center justify-center gap-2"
            style={{ background: "#000" }}>
            <div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" />
            <div className="w-[10px] h-[10px] rounded-full bg-zinc-800 border border-zinc-650" />
          </div>
        </div>
        {/* Screen */}
        <div
          className="rounded-[2rem] overflow-hidden bg-white"
          style={{
            height: "70vh",
            minHeight: 520,
            maxHeight: 740,
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {children}
        </div>
        {/* Home indicator */}
        <div className="flex justify-center mt-3">
          <div className="w-20 h-[5px] rounded-full bg-white/20" />
        </div>
      </div>
      {/* Side buttons */}
      <div className="absolute left-[-3px] top-24 w-[3px] h-8 rounded-l-full bg-slate-700" />
      <div className="absolute left-[-3px] top-36 w-[3px] h-12 rounded-l-full bg-slate-700" />
      <div className="absolute right-[-3px] top-28 w-[3px] h-16 rounded-l-full bg-slate-700" />
    </div>
  );
}

export default function MiniWebsiteBuilder() {
  const [data, setData] = useState(DEFAULT);
  const [mobileTab, setMobileTab] = useState("editor");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("it-company");
  const [isPublished, setIsPublished] = useState(false);

  const t = getTheme(data.theme);
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const setShow = (k, v) => setData(d => ({ ...d, showSections: { ...d.showSections, [k]: v } }));

  // Load profile from database on mount
  useEffect(() => {
    const loadProfile = async () => {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) return;

      try {
        const user = JSON.parse(userStr);
        const res = await fetch(`/api/business/status?userId=${user.id}`);
        if (res.ok) {
          const statusData = await res.json();
          setIsPublished(statusData.checklist?.isPublished || false);

          // Now fetch full profile to edit
          const profileRes = await fetch(`/api/business/onboard`, {
            method: "POST", // Simple trick to get profile or we can reuse onboarding endpoint or fetch status
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user.id
            },
            body: JSON.stringify({ getProfileOnly: true }) // We will ensure onboard API tolerates partial/empty bodies
          });

          // Wait! Since status API returned profile details already, let's load what is in statusData if it exists
          if (statusData.hasProfile) {
            // Let's populate editor data state
            setData(prev => {
              const showSecs = statusData.seoDescription ? JSON.parse(statusData.seoDescription) : prev.showSections;
              const themeName = statusData.seoTitle || prev.theme;
              return {
                ...prev,
                businessName: statusData.businessName || prev.businessName,
                tagline: statusData.about || prev.tagline,
                logo: statusData.logo || prev.logo,
                phone: statusData.whatsappNumber || statusData.contactNumber || prev.phone,
                email: statusData.email || prev.email,
                address: statusData.businessAddress || prev.address,
                website: statusData.website || prev.website,
                instagram: statusData.instagram || prev.instagram,
                facebook: statusData.facebook || prev.facebook,
                upiId: statusData.upiId || prev.upiId,
                theme: themeName,
                showSections: showSecs
              };
            });
          }
        }
      } catch (err) {
        console.error("Error loading builder profile", err);
      }
    };

    loadProfile();
  }, []);

  // CRUD for Services
  const addService = () => set("services", [...data.services, { id: uid(), name: "", price: "", desc: "", image: "" }]);
  const delService = id => set("services", data.services.filter(s => s.id !== id));
  const updService = (id, f, v) => set("services", data.services.map(s => s.id === id ? { ...s, [f]: v } : s));

  // CRUD for Employees
  const addEmployee = () => set("employees", [...data.employees, { id: uid(), name: "", bio: "", phone: "", email: "", image: "" }]);
  const delEmployee = id => set("employees", data.employees.filter(e => e.id !== id));
  const updEmployee = (id, f, v) => set("employees", data.employees.map(e => e.id === id ? { ...e, [f]: v } : e));

  // CRUD for Testimonials
  const addTestimonial = () => set("testimonials", [...data.testimonials, { id: uid(), name: "", company: "", content: "", stars: 5 }]);
  const delTestimonial = id => set("testimonials", data.testimonials.filter(r => r.id !== id));
  const updTestimonial = (id, f, v) => set("testimonials", data.testimonials.map(r => r.id === id ? { ...r, [f]: v } : r));

  // CRUD for Media
  const addMedia = () => set("mediaLinks", [...data.mediaLinks, { id: uid(), title: "", url: "" }]);
  const delMedia = id => set("mediaLinks", data.mediaLinks.filter(m => m.id !== id));
  const updMedia = (id, f, v) => set("mediaLinks", data.mediaLinks.map(m => m.id === id ? { ...m, [f]: v } : m));

  // CRUD for FAQ
  const addFaq = () => set("faqs", [...data.faqs, { id: uid(), question: "", answer: "" }]);
  const delFaq = id => set("faqs", data.faqs.filter(f => f.id !== id));
  const updFaq = (id, fl, v) => set("faqs", data.faqs.map(f => f.id === id ? { ...f, [fl]: v } : f));

  const updHour = (i, f, v) => set("hours", data.hours.map((h, idx) => idx === i ? { ...h, [f]: v } : h));

  const addAmenity = () => {
    if (newAmenity.trim()) { set("amenities", [...data.amenities, newAmenity.trim()]); setNewAmenity(""); }
  };
  const delAmenity = i => set("amenities", data.amenities.filter((_, idx) => idx !== i));

  // Save changes to database
  const handleSave = async () => {
    setIsSaving(true);
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      toast.error("User session expired. Please login again.");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const res = await fetch("/api/business/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id
        },
        body: JSON.stringify({
          ...data,
          phone: data.phone || "",
          address: data.address || "",
          upiId: data.upiId || ""
        })
      });

      if (res.ok) {
        setSaved(true);
        toast.success("Changes saved successfully!");
        setTimeout(() => setSaved(false), 2200);
      } else {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }
    } catch (e) {
      toast.error(e.message || "Error saving database profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Publish Status
  const handlePublishToggle = async () => {
    setIsPublishing(true);
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      const res = await fetch("/api/business/publish", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id
        },
        body: JSON.stringify({ isPublished: !isPublished })
      });

      if (res.ok) {
        const updated = await res.json();
        setIsPublished(updated.isPublished);
        toast.success(updated.message);
      } else {
        toast.error("Failed to toggle publish status");
      }
    } catch (e) {
      toast.error("Error connecting to server");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="h-16 px-4 md:px-8 flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})` }}>
              <Globe size={16} className="text-white" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-extrabold text-white text-sm">Mini Website Builder</span>
              <span className="text-[10px] text-slate-500 font-medium">presence1.in/slug</span>
            </div>
          </div>

          {/* Mobile tab switcher */}
          <div className="flex lg:hidden items-center bg-slate-850 rounded-2xl p-1 gap-0.5 border border-slate-800">
            <button
              onClick={() => setMobileTab("editor")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 ${mobileTab === "editor"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-300"
                }`}
            >
              <Edit3 size={11} /> Edit
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 ${mobileTab === "preview"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-300"
                }`}
            >
              <Smartphone size={11} /> Preview
            </button>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* Publish Status Toggle */}
            <button
              onClick={handlePublishToggle}
              disabled={isPublishing}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border active:scale-95 ${isPublished
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-750"
                }`}
            >
              <Send size={12} />
              <span>{isPublished ? "Go Live (Unpublish)" : "Publish Site"}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0 transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-500/10"
              style={{
                background: saved
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})`,
              }}
            >
              {saved ? (
                <><CheckCircle2 size={13} /> <span>Saved!</span></>
              ) : isSaving ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <><Save size={13} /> <span>Save Changes</span></>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main body wrapper */}
      <div className="max-w-7xl mx-auto mt-6 px-4 md:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left panel: Editors */}
          <div className={`flex-1 min-w-0 flex flex-col gap-4 ${mobileTab === "preview" ? "hidden lg:flex" : "flex"} w-full`}>

            {/* Section 1: Template selection */}
            <Section icon={LayoutTemplate} title="Choose Template Style" color="text-violet-400" defaultOpen>
              <TemplatePicker selected={selectedTemplate} onSelect={setSelectedTemplate} />
            </Section>

            {/* Section 2: Color selector */}
            <Section icon={Palette} title="Brand Color Scheme" color="text-indigo-400">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(THEMES).map(([name, th]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => set("theme", name)}
                    title={name}
                    className={`relative h-14 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-slate-700/50 ${data.theme === name
                      ? "ring-2 ring-offset-2 ring-indigo-500 scale-95 shadow-[0_0_15px_rgba(99,102,241,0.3)] border-indigo-500"
                      : "shadow-sm"
                      }`}
                    style={{ background: `linear-gradient(135deg,${th.grad[0]},${th.grad[1]})` }}
                  >
                    {data.theme === name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-white drop-shadow" />
                      </div>
                    )}
                    <span className="absolute bottom-1.5 left-0 right-0 text-center text-[10px] font-bold text-white/90 capitalize tracking-wide">
                      {name === "blue" ? "Royal Blue" : name === "green" ? "Emerald Green" : name === "orange" ? "Sunset Orange" : name === "slate" ? "Charcoal Dark" : name === "gold" ? "Rose Gold" : name}
                    </span>
                  </button>
                ))}
              </div>
            </Section>

            {/* Section 3: Announcement */}
            <Section icon={Megaphone} title="Announcement Ribbon" color="text-orange-400" defaultOpen={false}>
              <Toggle label="Display ribbon at top of website" checked={data.showSections.announcement} onChange={v => setShow("announcement", v)} />
              <Toggle label="Enable pulse animations" checked={data.announcement.enabled} onChange={v => set("announcement", { ...data.announcement, enabled: v })} />
              <FInput value={data.announcement.text} onChange={v => set("announcement", { ...data.announcement, text: v })} placeholder="🎉 20% off on all reservations this weekend!" />
            </Section>

            {/* Section 4: Business Details */}
            <Section icon={Briefcase} title="Business Information" color="text-sky-400">
              <FInput label="Store Name" value={data.businessName} onChange={v => set("businessName", v)} placeholder="e.g. Vikesh Studio" />
              <FInput label="Sub-title / Tagline" value={data.tagline} onChange={v => set("tagline", v)} placeholder="Best local professional photography" />
              <FInput label="Primary Action Button Text" value={data.buttonText} onChange={v => set("buttonText", v)} placeholder="Call to Book" />
              <FInput label="Brand Logo Image URL" value={data.logo} onChange={v => set("logo", v)} placeholder="https://unsplash.com/logo-image-url.png" />
            </Section>

            {/* Section 5: Products & Services */}
            <Section icon={ShoppingBag} title="Products & Services Catalog" color="text-emerald-400" badge={data.services.length}>
              <Toggle label="Show catalog page" checked={data.showSections.services} onChange={v => setShow("services", v)} />
              <div className="space-y-3">
                {data.services.map(s => (
                  <Card key={s.id} onDelete={() => delService(s.id)}>
                    <FInput placeholder="Product Name" value={s.name} onChange={v => updService(s.id, "name", v)} small />
                    <div className="grid grid-cols-2 gap-2">
                      <FInput placeholder="Pricing (e.g. 1500)" value={s.price} onChange={v => updService(s.id, "price", v)} small />
                      <FInput placeholder="Thumbnail Image Link" value={s.image} onChange={v => updService(s.id, "image", v)} small />
                    </div>
                    <FTA placeholder="Catalog item description..." value={s.desc} onChange={v => updService(s.id, "desc", v)} />
                  </Card>
                ))}
              </div>
              <AddBtn onClick={addService} label="Insert Catalog Service" />
            </Section>

            {/* Section 6: Amenities */}
            <Section icon={Award} title="Facilities & Amenities" color="text-teal-400" defaultOpen={false} badge={data.amenities.length}>
              <Toggle label="Display features list" checked={data.showSections.amenities} onChange={v => setShow("amenities", v)} />
              <div className="flex flex-wrap gap-1.5 my-2">
                {data.amenities.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-slate-800 border border-slate-700/80 text-slate-300 px-3 py-1 rounded-full font-medium hover:bg-slate-750 transition-colors">
                    {a}
                    <button type="button" onClick={() => delAmenity(i)} className="text-slate-500 hover:text-red-400 font-bold">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newAmenity}
                  onChange={e => setNewAmenity(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addAmenity()}
                  placeholder="e.g. Card Payments, Air Conditioned"
                  className="flex-1 border border-slate-700 bg-slate-900/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:brightness-110 active:scale-95 flex-shrink-0"
                  style={{ background: t.primary }}
                >
                  Add
                </button>
              </div>
            </Section>

            {/* Section 7: Hours */}
            <Section icon={Clock} title="Business Hours Settings" color="text-slate-400" defaultOpen={false}>
              <Toggle label="Show hours section" checked={data.showSections.hours} onChange={v => setShow("hours", v)} />
              <div className="flex flex-col gap-2">
                {data.hours.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={h.day}
                      onChange={e => updHour(i, "day", e.target.value)}
                      className="w-24 border border-slate-700 bg-slate-900/60 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      value={h.time}
                      onChange={e => updHour(i, "time", e.target.value)}
                      className="flex-1 border border-slate-700 bg-slate-900/60 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => updHour(i, "open", !h.open)}
                      className={`shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${h.open
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/10 border border-red-500/20 text-red-450"
                        }`}
                    >
                      {h.open ? "Open" : "Closed"}
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section 8: Social Contacts */}
            <Section icon={Phone} title="Contact & Social Channels" color="text-indigo-400" defaultOpen={false}>
              <Toggle label="Show social contacts strip" checked={data.showSections.contact} onChange={v => setShow("contact", v)} />
              <FInput label="Phone Call Helpline" value={data.phone} onChange={v => set("phone", v)} placeholder="+91 98765 43210" />
              <FInput label="Inquiry Email Address" value={data.email} onChange={v => set("email", v)} placeholder="hello@store.com" />
              <FInput label="Physical Store Address" value={data.address} onChange={v => set("address", v)} placeholder="Jaipur, Rajasthan" />
              <FInput label="Official Website URL" value={data.website} onChange={v => set("website", v)} placeholder="www.domain.com" />

              <div className="border-t border-slate-800/80 pt-3 mt-2">
                <Toggle label="Show media pages" checked={data.showSections.social} onChange={v => setShow("social", v)} />
                <div className="grid grid-cols-2 gap-4">
                  <FInput label="Instagram Handle" value={data.instagram} onChange={v => set("instagram", v)} placeholder="e.g. user" />
                  <FInput label="Facebook Page Slug" value={data.facebook} onChange={v => set("facebook", v)} placeholder="e.g. page" />
                </div>
              </div>
            </Section>

          </div>

          {/* Right panel: Device Live Preview */}
          <div className={`lg:sticky lg:top-[88px] lg:self-start w-full lg:w-auto flex-shrink-0 ${mobileTab === "editor" ? "hidden lg:flex" : "flex"} flex-col items-center gap-4`}>

            <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Eye size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Interactive Preview</span>
            </div>

            <PhoneFrame>
              <TemplateRenderer templateId={selectedTemplate} data={data} />
            </PhoneFrame>

            <div className="w-[375px] bg-slate-800/40 border border-slate-700/50 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm backdrop-blur-md">
              <Link size={12} className="flex-shrink-0" style={{ color: t.primary }} />
              <span className="text-[11px] text-slate-400 truncate flex-1 font-mono">
                vscan.biz/<span className="font-bold not-italic" style={{ color: t.primary }}>
                  {data.businessName.toLowerCase().replace(/\s+/g, "-")}
                </span>
              </span>
              <button
                type="button"
                className="text-[11px] font-bold flex-shrink-0 px-2.5 py-1 rounded-lg transition-colors hover:bg-slate-700/50"
                style={{ color: t.primary }}
                onClick={() => {
                  navigator.clipboard?.writeText(`https://vscan.biz/${data.businessName.toLowerCase().replace(/\s+/g, "-")}`);
                  toast.success("Link copied!");
                }}
              >
                Copy Link
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-medium">
              Layout Style: <span className="font-bold text-slate-350 capitalize">{selectedTemplate.replace("-", " ")}</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}