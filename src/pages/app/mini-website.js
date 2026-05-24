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

const uid = () => Math.random().toString(36).slice(2, 8);

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
      <span className="text-xs text-app-text-muted group-hover:text-white transition-colors">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-[22px] rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${checked ? "bg-primary shadow-sm" : "bg-app-bg"
          }`}
      >
        <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? "left-[22px]" : "left-[3px]"
          }`} />
      </button>
    </div>
  );
}

function FInput({ label, type, value, onChange, placeholder, small }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[10px] font-semibold text-app-text-dimmed uppercase tracking-wider">{label}</label>
      )}
      <input
        value={value || ""}
        type={type || "text"}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border border-app-border rounded-xl px-3 bg-app-bg/60 text-white placeholder-app-text-dimmed 
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent 
          hover:border-app-text-muted/30 transition-all w-full
          ${small ? "py-1.5 text-xs" : "py-2.5 text-sm"}`}
      />
    </div>
  );
}

function FTA({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[10px] font-semibold text-app-text-dimmed uppercase tracking-wider">{label}</label>
      )}
      <textarea
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="border border-app-border rounded-xl px-3 py-2 text-xs bg-app-bg/60 text-white placeholder-app-text-dimmed 
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent 
          hover:border-app-text-muted/30 transition-all resize-none w-full"
      />
    </div>
  );
}

function Section({ icon: Icon, title, color = "text-app-text-muted", badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border overflow-hidden transition-shadow ${open ? "border-app-border bg-app-surface/20" : "border-app-border bg-app-bg/30"
      }`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors ${open ? "bg-app-surface border-b border-app-border" : "bg-app-bg/40 hover:bg-app-surface"
          }`}
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={15} className={`flex-shrink-0 ${color}`} />}
          <span className={`text-[13px] font-semibold ${open ? "text-white" : "text-app-text-muted"}`}>{title}</span>
          {badge !== undefined && badge > 0 && (
            <span className="text-[10px] bg-primary/20 text-primary-light px-2 py-0.5 rounded-full font-bold leading-none border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp size={14} className="text-app-text-dimmed flex-shrink-0" />
          : <ChevronDown size={14} className="text-app-text-dimmed flex-shrink-0" />
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
    <div className="relative border border-app-border rounded-xl p-3 bg-app-bg/40 flex flex-col gap-2.5 hover:border-app-text-muted/30 transition-colors">
      {children}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-app-surface border border-app-border text-app-text-muted hover:text-red-450 hover:border-red-500/30 hover:bg-red-500/10 transition-all shadow-sm"
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
      className="w-full flex items-center justify-center gap-1.5 py-3 border-2 border-dashed border-app-border rounded-xl text-xs font-semibold text-app-text-dimmed 
        hover:border-primary/60 hover:text-primary-light hover:bg-primary/5 
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
      <div className="absolute left-[-3px] top-24 w-[3px] h-8 rounded-l-full bg-app-border-light" />
      <div className="absolute left-[-3px] top-36 w-[3px] h-12 rounded-l-full bg-app-border-light" />
      <div className="absolute right-[-3px] top-28 w-[3px] h-16 rounded-l-full bg-app-border-light" />
    </div>
  );
}

export default function MiniWebsiteBuilder() {

  const [mobileTab, setMobileTab] = useState("editor");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("it-company");
  const [isPublished, setIsPublished] = useState(false);

  const [data, setData] = useState({
    businessName: "Add your business name",
    title: "Add your title",
    tagline: "Add your tagline",
    logo: "",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "[EMAIL_ADDRESS]",
    address: "Add your address",
    website: "www.yourwebsite.com",
    instagram: "yourinstagram",
    facebook: "yourfacebook",
    youtube: "",
    theme: "blue",
    selectedTemplate: "it-company",
    buttonText: "Contact Us",
    googleFormLink: "",
    googleReviewLink: "",
    announcement: { enabled: true, text: "🎉Add your annoucement here" },
    services: [
      { id: uid(), name: "Service name", price: "₹5000", desc: "Add your service description here", image: "" },
      { id: uid(), name: "Service name", price: "₹5000", desc: "Add your service description here", image: "" },
    ],
    hours: [
      { day: "Mon-Fri", time: "9:00 AM - 7:00 PM", open: true },
      { day: "Saturday", time: "10:00 AM - 5:00 PM", open: true },
      { day: "Sunday", time: "Closed", open: false },
    ],
    employees: [
      { id: uid(), name: "Team Member Name", bio: "Team Member Bio", phone: "+91 98765 43210", email: "[EMAIL_ADDRESS]", image: "" },
    ],
    testimonials: [
      { id: uid(), name: "Testimonial Name", company: "Testimonial Company", content: "Testimonial Content", stars: 5 },
      { id: uid(), name: "Testimonial Name", company: "Testimonial Company", content: "Testimonial Content", stars: 5 },
    ],
    mediaLinks: [
      { id: uid(), title: "Our Work Showcase", url: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
    faqs: [
      { id: uid(), question: "Frequently Asked Question", answer: "Answer to the frequently asked question" },
      { id: uid(), question: "Frequently Asked Question", answer: "Answer to the frequently asked question" },
    ],
    amenities: ["Amenity name", "Amenity name", "Amenity name", "Amenity name", "Amenity name", "Amenity name"],
    showSections: {
      announcement: true, services: true, hours: true, contact: true,
      showWhatsapp: true,
      social: true, employees: true, testimonials: true, mediaLinks: true,
      faqs: true, amenities: true, googleForm: true,
    },
  });

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
        const res = await fetch(`/api/business/mini-website-get?userId=${user.id}`);
        if (!res.ok) {
          toast.error("Failed to load business profile");
          return;
        }
        const statusData = await res.json();
        if (statusData.success == false) {
          toast.error(statusData.message);
          return;
        }
        if (statusData.isPublished !== undefined) {
          setIsPublished(statusData.isPublished);
        }
        if (statusData.selectedTemplate) {
          setSelectedTemplate(statusData.selectedTemplate);
        }
        setData(prev => {
          let showSecs = statusData.showSections;
          if (typeof showSecs === "string") {
            try {
              showSecs = JSON.parse(showSecs);
            } catch (e) { }
          }
          if (!showSecs) {
            let seoDesc = statusData.seoDescription;
            if (typeof seoDesc === "string") {
              try {
                seoDesc = JSON.parse(seoDesc);
              } catch (e) { }
            }
            showSecs = seoDesc || prev.showSections;
          }

          const themeName = statusData.theme || statusData.seoTitle || prev.theme;

          return {
            ...prev,
            ...statusData,
            theme: themeName,
            showSections: showSecs,
            businessName: statusData.businessName || prev.businessName,
            tagline: statusData.tagline || statusData.about || prev.tagline,
            logo: statusData.logo || statusData.BusinessLogo || prev.logo,
            phone: statusData.phone || statusData.whatsappNumber || statusData.contactNumber || prev.phone,
            email: statusData.email || prev.email,
            address: statusData.address || statusData.businessAddress || prev.address,
            website: statusData.website || prev.website,
            instagram: statusData.instagram || prev.instagram,
            facebook: statusData.facebook || prev.facebook,
            upiId: statusData.upiId || prev.upiId,
            services: statusData.services || prev.services,
            hours: statusData.hours || prev.hours,
            employees: statusData.employees || prev.employees,
            testimonials: statusData.testimonials || prev.testimonials,
            mediaLinks: statusData.mediaLinks || prev.mediaLinks,
            faqs: statusData.faqs || prev.faqs,
            amenities: statusData.amenities || prev.amenities,
          };
        });
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
      const res = await fetch("/api/business/mini-website-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id
        },
        body: JSON.stringify({ tamplateData: data })
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
    <div className="min-h-screen bg-app-bg text-white font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

      {/* Header bar */}
      <header className="bg-app-bg/85 backdrop-blur-xl border-b border-app-border">
        <div className="h-16 px-4 md:px-8 flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})` }}>
              <Globe size={16} className="text-white" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-extrabold text-white text-sm">Mini Website Builder</span>
              <span className="text-[10px] text-app-text-dimmed font-medium">vscan.biz/slug</span>
            </div>
          </div>

          {/* Mobile tab switcher */}
          <div className="flex lg:hidden items-center bg-app-surface rounded-2xl p-1 gap-0.5 border border-app-border">
            <button
              onClick={() => setMobileTab("editor")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 ${mobileTab === "editor"
                ? "bg-app-bg/80 text-white shadow-sm"
                : "text-app-text-muted hover:text-white"
                }`}
            >
              <Edit3 size={11} /> Edit
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 ${mobileTab === "preview"
                ? "bg-app-bg/80 text-white shadow-sm"
                : "text-app-text-muted hover:text-white"
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
                ? "bg-app-success/10 border-app-success/30 text-app-success hover:bg-app-success/20"
                : "bg-app-surface border-app-border text-app-text-muted hover:border-app-text-muted/30 hover:bg-app-surface/80"
                }`}
            >
              <Send size={12} />
              <span>{isPublished ? "Go Live (Unpublish)" : "Publish Site"}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0 transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10"
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
            <Section icon={LayoutTemplate} title="Choose Template Style" color="text-primary-light" defaultOpen>
              <TemplatePicker selected={selectedTemplate} onSelect={(template) => {
                console.log("Selected template:", template);
                setSelectedTemplate(template);
                set("selectedTemplate", template);
              }} />
            </Section>

            {/* Section 2: Color selector */}
            <Section icon={Palette} title="Brand Color Scheme" color="text-secondary-light">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(THEMES).map(([name, th]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => set("theme", name)}
                    title={name}
                    className={`relative h-14 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-app-border ${data.theme === name
                      ? "ring-2 ring-offset-2 ring-primary scale-95 shadow-[0_0_15px_rgba(124,58,237,0.3)] border-primary"
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
            <Section icon={Megaphone} title="Announcement Ribbon" color="text-app-warning" defaultOpen={false}>
              <Toggle label="Display ribbon at top of website" checked={data.showSections.announcement} onChange={v => setShow("announcement", v)} />
              <Toggle label="Enable pulse animations" checked={data.announcement.enabled} onChange={v => set("announcement", { ...data.announcement, enabled: v })} />
              <FInput value={data.announcement.text} onChange={v => set("announcement", { ...data.announcement, text: v })} placeholder="🎉 20% off on all reservations this weekend!" />
            </Section>

            {/* Section 4: Business Details */}
            <Section icon={Briefcase} title="Business Information" color="text-primary-light">
              <FInput label="Title" value={data.title} onChange={v => set("title", v)} placeholder="e.g. Vikesh Studio" />
              <FInput label="Tagline" value={data.tagline} onChange={v => set("tagline", v)} placeholder="Best local professional photography" />
              <FInput label="Button Text" value={data.buttonText} onChange={v => set("buttonText", v)} placeholder="Call to Book" />
              <FInput label="Logo URL" value={data.logo} onChange={v => set("logo", v)} placeholder="https://unsplash.com/logo-image-url.png" />
            </Section>

            {/* Section 5: Products & Services */}
            <Section icon={ShoppingBag} title="Products & Services Catalog" color="text-app-success" badge={data.services.length}>
              <Toggle label="Show catalog page" checked={data.showSections.services} onChange={v => setShow("services", v)} />
              <div className="space-y-3">
                {data.services.map(s => (
                  <Card key={s.id} onDelete={() => delService(s.id)}>
                    <FInput placeholder="Product Name" value={s.name} onChange={v => updService(s.id, "name", v)} small />
                    <div className="grid grid-cols-2 gap-2">
                      <FInput type="number" placeholder="Pricing (e.g. 1500)" value={s.price} onChange={v => updService(s.id, "price", v)} small />
                      <FInput type="file" placeholder="Thumbnail Image Link" value={s.image} onChange={v => updService(s.id, "image", v)} small />
                    </div>
                    <FTA placeholder="Catalog item description..." value={s.desc} onChange={v => updService(s.id, "desc", v)} />
                  </Card>
                ))}
              </div>
              <AddBtn onClick={addService} label="Insert Catalog Service" />
            </Section>

            {/* Section 6: Amenities */}
            <Section icon={Award} title="Facilities & Amenities" color="text-primary-light" defaultOpen={false} badge={data.amenities.length}>
              <Toggle label="Display features list" checked={data.showSections.amenities} onChange={v => setShow("amenities", v)} />
              <div className="flex flex-wrap gap-1.5 my-2">
                {data.amenities.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-app-surface border border-app-border text-app-text-muted px-3 py-1 rounded-full font-medium hover:bg-app-surface/80 transition-colors">
                    {a}
                    <button type="button" onClick={() => delAmenity(i)} className="text-app-text-dimmed hover:text-red-450 font-bold">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newAmenity}
                  onChange={e => setNewAmenity(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addAmenity()}
                  placeholder="e.g. Card Payments, Air Conditioned"
                  className="flex-1 border border-app-border bg-app-bg/60 rounded-xl px-3 py-2 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary/40"
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
            <Section icon={Clock} title="Business Hours Settings" color="text-app-text-muted" defaultOpen={false}>
              <Toggle label="Show hours section" checked={data.showSections.hours} onChange={v => setShow("hours", v)} />
              <div className="flex flex-col gap-2">
                {data.hours.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={h.day}
                      onChange={e => updHour(i, "day", e.target.value)}
                      className="w-24 border border-app-border bg-app-bg/60 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      value={h.time}
                      onChange={e => updHour(i, "time", e.target.value)}
                      className="flex-1 border border-app-border bg-app-bg/60 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => updHour(i, "open", !h.open)}
                      className={`shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${h.open
                        ? "bg-app-success/10 border border-app-success/20 text-app-success"
                        : "bg-app-error/10 border border-app-error/20 text-app-error"
                        }`}
                    >
                      {h.open ? "Open" : "Closed"}
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section 8: Social Contacts */}
            <Section icon={Phone} title="Contact & Social Channels" color="text-secondary-light" defaultOpen={false}>
              <Toggle label="Show social contacts strip" checked={data.showSections.contact} onChange={v => setShow("contact", v)} />
              <FInput label="Phone Call Helpline" value={data.phone} onChange={v => set("phone", v)} placeholder="+91 98765 43210" />
              <FInput label="Inquiry Email Address" value={data.email} onChange={v => set("email", v)} placeholder="hello@store.com" />
              <FInput label="Physical Store Address" value={data.address} onChange={v => set("address", v)} placeholder="Jaipur, Rajasthan" />
              <FInput label="Official Website URL" value={data.website} onChange={v => set("website", v)} placeholder="www.domain.com" />

              <div className="border-t border-app-border pt-3 mt-2">
                <Toggle label="Show media pages" checked={data.showSections.social} onChange={v => setShow("social", v)} />
                <div className="grid grid-cols-2 gap-4">
                  <FInput label="Instagram Handle" value={data.instagram} onChange={v => set("instagram", v)} placeholder="e.g. user" />
                  <FInput label="Facebook Page Slug" value={data.facebook} onChange={v => set("facebook", v)} placeholder="e.g. page" />
                </div>
              </div>
            </Section>

            {/* Section 9: Our Team */}
            <Section icon={Users} title="Our Team" color="text-primary-light" defaultOpen={false} badge={data.employees?.length}>
              <Toggle label="Show team section" checked={data.showSections.employees} onChange={v => setShow("employees", v)} />
              <div className="space-y-3">
                {data.employees?.map(e => (
                  <Card key={e.id} onDelete={() => delEmployee(e.id)}>
                    <FInput placeholder="Name" value={e.name} onChange={v => updEmployee(e.id, "name", v)} small />
                    <FInput placeholder="Role / Bio" value={e.bio} onChange={v => updEmployee(e.id, "bio", v)} small />
                    <div className="grid grid-cols-2 gap-2">
                      <FInput placeholder="Phone" value={e.phone} onChange={v => updEmployee(e.id, "phone", v)} small />
                      <FInput placeholder="Email" value={e.email} onChange={v => updEmployee(e.id, "email", v)} small />
                    </div>
                    <FInput placeholder="Photo URL" value={e.image} onChange={v => updEmployee(e.id, "image", v)} small />
                  </Card>
                ))}
              </div>
              <AddBtn onClick={addEmployee} label="Add Team Member" />
            </Section>

            {/* Section 10: Customer Testimonials */}
            <Section icon={MessageSquare} title="Customer Testimonials" color="text-secondary-light" defaultOpen={false} badge={data.testimonials?.length}>
              <Toggle label="Show testimonials section" checked={data.showSections.testimonials} onChange={v => setShow("testimonials", v)} />
              <div className="space-y-3">
                {data.testimonials?.map(t => (
                  <Card key={t.id} onDelete={() => delTestimonial(t.id)}>
                    <FInput placeholder="Customer Name" value={t.name} onChange={v => updTestimonial(t.id, "name", v)} small />
                    <FInput placeholder="Company / Role (Optional)" value={t.company} onChange={v => updTestimonial(t.id, "company", v)} small />
                    <div className="flex items-center gap-2 py-1">
                      <span className="text-xs text-app-text-muted">Rating:</span>
                      <StarRow count={t.stars} onChange={val => updTestimonial(t.id, "stars", val)} />
                    </div>
                    <FTA placeholder="Testimonial content..." value={t.content} onChange={v => updTestimonial(t.id, "content", v)} />
                  </Card>
                ))}
              </div>
              <AddBtn onClick={addTestimonial} label="Add Testimonial" />
            </Section>

            {/* Section 11: Media Links */}
            <Section icon={Link} title="Media Links & Showcase" color="text-primary-light" defaultOpen={false} badge={data.mediaLinks?.length}>
              <Toggle label="Show media links section" checked={data.showSections.mediaLinks} onChange={v => setShow("mediaLinks", v)} />
              <div className="space-y-3">
                {data.mediaLinks?.map(m => (
                  <Card key={m.id} onDelete={() => delMedia(m.id)}>
                    <FInput placeholder="Link Title" value={m.title} onChange={v => updMedia(m.id, "title", v)} small />
                    <FInput placeholder="URL (e.g. YouTube, PDF, Gallery)" value={m.url} onChange={v => updMedia(m.id, "url", v)} small />
                  </Card>
                ))}
              </div>
              <AddBtn onClick={addMedia} label="Add Media Link" />
            </Section>

            {/* Section 12: FAQ */}
            <Section icon={HelpCircle} title="Frequently Asked Questions" color="text-app-warning" defaultOpen={false} badge={data.faqs?.length}>
              <Toggle label="Show FAQ section" checked={data.showSections.faqs} onChange={v => setShow("faqs", v)} />
              <div className="space-y-3">
                {data.faqs?.map(f => (
                  <Card key={f.id} onDelete={() => delFaq(f.id)}>
                    <FInput placeholder="Question" value={f.question} onChange={v => updFaq(f.id, "question", v)} small />
                    <FTA placeholder="Answer..." value={f.answer} onChange={v => updFaq(f.id, "answer", v)} />
                  </Card>
                ))}
              </div>
              <AddBtn onClick={addFaq} label="Add FAQ" />
            </Section>

          </div>

          {/* Right panel: Device Live Preview */}
          <div className={`lg:sticky lg:top-[88px] lg:self-start w-full lg:w-auto flex-shrink-0 relative ${mobileTab === "editor" ? "hidden lg:flex" : "flex"} flex-col items-center gap-4`}>

            <div className="flex items-center gap-2 bg-app-surface border border-app-border rounded-2xl px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-app-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-app-success" />
              </span>
              <Eye size={12} className="text-app-text-muted" />
              <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">Interactive Preview</span>
            </div>

            <PhoneFrame>
              <TemplateRenderer templateId={selectedTemplate} data={data} />
            </PhoneFrame>

            <div className="w-[375px] bg-app-surface border border-app-border rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm backdrop-blur-md">
              <Link size={12} className="flex-shrink-0" style={{ color: t.primary }} />
              <span className="text-[11px] text-app-text-muted truncate flex-1 font-mono">
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

            <p className="text-[10px] text-app-text-dimmed font-medium">
              Layout Style: <span className="font-bold text-app-text-muted capitalize">{selectedTemplate.replace("-", " ")}</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}