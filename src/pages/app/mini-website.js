"use client";

import { useState, useEffect } from "react";
import {
  Globe, Eye, Save, CheckCircle2, Link, Plus, Trash2,
  ChevronDown, ChevronUp, Star, Phone, Award, Megaphone,
  ShoppingBag, Users, HelpCircle,
  MessageSquare, Briefcase, Palette, Smartphone,
  LayoutTemplate, Clock, Send, X, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

import TemplatePicker from "@/components/website-builder/TemplatePicker";
import TemplateRenderer from "@/components/website-builder/TemplateRenderer";
import { templates } from "@/components/website-builder/registry";
import { THEMES, getTheme } from "@/components/website-builder/theme";

const uid = () => Math.random().toString(36).slice(2, 8);

function getThemeLabel(name) {
  if (name === "blue") return "Royal Blue";
  if (name === "green") return "Emerald Green";
  if (name === "orange") return "Sunset Orange";
  if (name === "slate") return "Charcoal Dark";
  if (name === "gold") return "Rose Gold";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function PickerModal({ open, title, icon: Icon, iconColor, onClose, children }) {
  if (!open) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-[60] flex items-end">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-h-[88vh] bg-app-bg rounded-t-3xl border-t border-app-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-app-border bg-app-surface/80 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && <Icon size={20} className={`flex-shrink-0 ${iconColor || "text-primary-light"}`} />}
            <span className="text-base font-bold text-white truncate">{title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-app-bg border border-app-border text-app-text-muted hover:text-white transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function MobilePickerCard({ icon: Icon, label, value, iconColor, onClick, preview }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3.5 rounded-2xl border border-app-border bg-app-surface/30 px-4 py-4 min-h-[76px] text-left active:scale-[0.99] transition-all hover:border-app-text-muted/30 hover:bg-app-surface/50"
    >
      {preview || (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-app-surface border border-app-border ${iconColor || ""}`}>
          {Icon && <Icon size={22} className={iconColor || "text-primary-light"} />}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-app-text-dimmed font-medium">{label}</p>
        <p className="text-[15px] font-semibold text-white truncate mt-0.5 capitalize">{value}</p>
      </div>
      <div className="flex items-center gap-1 text-primary-light flex-shrink-0">
        <span className="text-sm font-bold">Change</span>
        <ChevronRight size={18} />
      </div>
    </button>
  );
}

function ThemeGrid({ selected, onSelect, inModal = false }) {
  return (
    <div className={`grid gap-3 ${inModal ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`}>
      {Object.entries(THEMES).map(([name, th]) => {
        const label = getThemeLabel(name);
        const active = selected === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            title={name}
            className={`relative flex items-center gap-3 lg:block h-14 rounded-2xl transition-all duration-200 active:scale-[0.98] border border-app-border px-3 lg:px-0 ${active
              ? "ring-2 ring-offset-2 ring-primary shadow-[0_0_15px_rgba(124,58,237,0.3)] border-primary"
              : "shadow-sm"
              }`}
            style={{ background: `linear-gradient(135deg,${th.grad[0]},${th.grad[1]})` }}
          >
            {active && (
              <div className="hidden lg:flex absolute inset-0 items-center justify-center">
                <CheckCircle2 size={16} className="text-white drop-shadow" />
              </div>
            )}
            {active && (
              <CheckCircle2 size={20} className="text-white drop-shadow flex-shrink-0 lg:hidden" />
            )}
            <span className="text-[15px] lg:absolute lg:bottom-1.5 lg:left-0 lg:right-0 lg:text-center lg:text-[10px] font-bold text-white capitalize tracking-wide">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StarRow({ count, onChange }) {
  return (
    <div className="flex gap-1.5 lg:gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={22}
          className={`lg:!w-[13px] lg:!h-[13px] cursor-pointer transition-transform hover:scale-110 ${i <= count ? "text-yellow-400" : "text-gray-300"}`}
          fill={i <= count ? "#facc15" : "none"}
          onClick={() => onChange?.(i)} />
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5 lg:py-1 gap-4 group">
      <span className="text-[15px] lg:text-xs text-app-text-muted group-hover:text-white transition-colors leading-snug flex-1 pr-2">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-[52px] h-[30px] lg:w-10 lg:h-[22px] rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${checked ? "bg-primary shadow-sm" : "bg-app-bg"
          }`}
      >
        <span className={`absolute top-[3px] w-[22px] h-[22px] lg:w-4 lg:h-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? "left-[27px] lg:left-[22px]" : "left-[3px]"
          }`} />
      </button>
    </div>
  );
}

function FInput({ label, type, value, onChange, placeholder, small }) {
  return (
    <div className="flex flex-col gap-2 lg:gap-1 w-full">
      {label && (
        <label className="text-sm lg:text-[10px] font-semibold text-app-text-dimmed uppercase tracking-wider">{label}</label>
      )}
      <input
        value={value || ""}
        type={type || "text"}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border border-app-border rounded-xl px-4 lg:px-3 bg-app-bg/60 text-white placeholder-app-text-dimmed 
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent 
          hover:border-app-text-muted/30 transition-all w-full
          ${small ? "py-3.5 text-[15px] lg:py-1.5 lg:text-xs min-h-[50px] lg:min-h-0" : "py-4 text-[15px] lg:py-2.5 lg:text-sm min-h-[52px] lg:min-h-0"}`}
      />
    </div>
  );
}

function FTA({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-2 lg:gap-1 w-full">
      {label && (
        <label className="text-sm lg:text-[10px] font-semibold text-app-text-dimmed uppercase tracking-wider">{label}</label>
      )}
      <textarea
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="border border-app-border rounded-xl px-4 lg:px-3 py-3.5 lg:py-2 text-[15px] lg:text-xs bg-app-bg/60 text-white placeholder-app-text-dimmed 
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent 
          hover:border-app-text-muted/30 transition-all resize-none w-full min-h-[96px] lg:min-h-0"
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
        className={`w-full flex items-center justify-between px-4 py-4 lg:py-3.5 transition-colors min-h-[60px] lg:min-h-0 ${open ? "bg-app-surface border-b border-app-border" : "bg-app-bg/40 hover:bg-app-surface"
          }`}
      >
        <div className="flex items-center gap-3 lg:gap-2.5 min-w-0">
          {Icon && <Icon size={22} className={`flex-shrink-0 lg:!w-[15px] lg:!h-[15px] ${color}`} />}
          <span className={`text-base lg:text-[13px] font-semibold leading-snug ${open ? "text-white" : "text-app-text-muted"}`}>{title}</span>
          {badge !== undefined && badge > 0 && (
            <span className="text-sm lg:text-[10px] bg-primary/20 text-primary-light px-2.5 py-0.5 rounded-full font-bold leading-none border border-primary/20 flex-shrink-0">
              {badge}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp size={20} className="text-app-text-dimmed flex-shrink-0 lg:!w-[14px] lg:!h-[14px]" />
          : <ChevronDown size={20} className="text-app-text-dimmed flex-shrink-0 lg:!w-[14px] lg:!h-[14px]" />
        }
      </button>
      {open && (
        <div className="px-4 py-4 flex flex-col gap-4 lg:gap-3">{children}</div>
      )}
    </div>
  );
}

function Card({ children, onDelete }) {
  return (
    <div className="relative border border-app-border rounded-xl p-4 lg:p-3 pr-14 lg:pr-3 bg-app-bg/40 flex flex-col gap-4 lg:gap-2.5 hover:border-app-text-muted/30 transition-colors">
      {children}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-3 right-3 lg:top-2.5 lg:right-2.5 w-10 h-10 lg:w-6 lg:h-6 flex items-center justify-center rounded-full bg-app-surface border border-app-border text-app-text-muted hover:text-red-450 hover:border-red-500/30 hover:bg-red-500/10 transition-all shadow-sm"
        >
          <Trash2 size={18} className="lg:!w-[11px] lg:!h-[11px]" />
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
      className="w-full flex items-center justify-center gap-2 py-4 lg:py-3 border-2 border-dashed border-app-border rounded-xl text-[15px] lg:text-xs font-semibold text-app-text-dimmed min-h-[56px] lg:min-h-0
        hover:border-primary/60 hover:text-primary-light hover:bg-primary/5 
        active:scale-[0.98] transition-all"
    >
      <Plus size={20} className="lg:!w-[13px] lg:!h-[13px]" /> {label}
    </button>
  );
}

function PhoneFrame({ children }) {
  return (
    <div className="relative mx-auto w-full max-w-[390px]">
      <div
        className="relative rounded-[2.2rem] sm:rounded-[2.8rem] overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
        style={{
          background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)",
          padding: "14px 12px 16px",
          border: "1.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex justify-center mb-2.5">
          <div className="w-[88px] h-[26px] rounded-full flex items-center justify-center gap-2 bg-black">
            <div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" />
            <div className="w-[10px] h-[10px] rounded-full bg-zinc-800 border border-zinc-650" />
          </div>
        </div>
        <div
          className="rounded-[1.75rem] sm:rounded-[2rem] overflow-y-auto overflow-x-hidden bg-white [&::-webkit-scrollbar]:hidden"
          style={{
            height: "min(72vh, 680px)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {children}
        </div>
        <div className="flex justify-center mt-3">
          <div className="w-20 h-[5px] rounded-full bg-white/20" />
        </div>
      </div>
      <div className="hidden sm:block absolute left-[-3px] top-20 w-[3px] h-8 rounded-l-full bg-app-border-light" />
      <div className="hidden sm:block absolute left-[-3px] top-32 w-[3px] h-12 rounded-l-full bg-app-border-light" />
      <div className="hidden sm:block absolute right-[-3px] top-24 w-[3px] h-16 rounded-l-full bg-app-border-light" />
    </div>
  );
}

function PreviewPanel({ t, selectedTemplate, data }) {
  const slug = data.customSlug || data.businessName.toLowerCase().replace(/\s+/g, "-");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vscan.biz";
  const displayDomain = baseUrl.replace(/^https?:\/\//, "");

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-center gap-2.5 bg-app-surface border border-app-border rounded-2xl px-4 py-2.5 shadow-sm backdrop-blur-md w-full max-w-[390px]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-app-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-app-success" />
        </span>
        <Eye size={16} className="text-app-text-muted flex-shrink-0" />
        <span className="text-xs sm:text-[10px] font-bold text-app-text-muted uppercase tracking-widest">Live Preview</span>
      </div>

      <PhoneFrame>
        <TemplateRenderer templateId={selectedTemplate} data={data} />
      </PhoneFrame>

      <div className="w-full max-w-[390px] bg-app-surface border border-app-border rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm backdrop-blur-md">
        <Link size={16} className="flex-shrink-0" style={{ color: t.primary }} />
        <span className="text-xs sm:text-[11px] text-app-text-muted truncate flex-1 font-mono">
          {displayDomain}/profile/<span className="font-bold not-italic" style={{ color: t.primary }}>{slug}</span>?tab=website
        </span>
        <button
          type="button"
          className="text-xs sm:text-[11px] font-bold flex-shrink-0 px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-700/50 min-h-[36px]"
          style={{ color: t.primary }}
          onClick={() => {
            navigator.clipboard?.writeText(`${baseUrl}/profile/${slug}?tab=website`);
            toast.success("Link copied!");
          }}
        >
          Copy
        </button>
      </div>

      <p className="text-xs sm:text-[10px] text-app-text-dimmed font-medium text-center px-2">
        Layout: <span className="font-bold text-app-text-muted capitalize">{selectedTemplate.replace("-", " ")}</span>
      </p>
    </div>
  );
}

export default function MiniWebsiteBuilder() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vscan.biz";
  const displayDomain = baseUrl.replace(/^https?:\/\//, "");

  const [mobileTab, setMobileTab] = useState("editor");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("it-company");
  const [isPublished, setIsPublished] = useState(false);
  const [pickerModal, setPickerModal] = useState(null);

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
    customSlug: "",
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
        const profileInfo = statusData.data;
        if (!profileInfo) return;

        if (profileInfo.isPublished !== undefined) {
          setIsPublished(profileInfo.isPublished);
        }
        if (profileInfo.selectedTemplate) {
          setSelectedTemplate(profileInfo.selectedTemplate);
        }

        setData(prev => {
          let showSecs = profileInfo.showSections;
          if (typeof showSecs === "string") {
            try {
              showSecs = JSON.parse(showSecs);
            } catch (e) { }
          }
          if (!showSecs) {
            let seoDesc = profileInfo.seoDescription;
            if (typeof seoDesc === "string") {
              try {
                seoDesc = JSON.parse(seoDesc);
              } catch (e) { }
            }
            showSecs = seoDesc || prev.showSections;
          }

          const themeName = profileInfo.theme || profileInfo.seoTitle || prev.theme;

          return {
            ...prev,
            ...profileInfo,
            theme: themeName,
            showSections: showSecs,
            businessName: profileInfo.businessName || prev.businessName,
            tagline: profileInfo.tagline || profileInfo.about || prev.tagline,
            logo: profileInfo.logo || profileInfo.BusinessLogo || prev.logo,
            phone: profileInfo.phone || profileInfo.whatsappNumber || profileInfo.contactNumber || prev.phone,
            email: profileInfo.email || prev.email,
            address: profileInfo.address || profileInfo.businessAddress || prev.address,
            website: profileInfo.website || prev.website,
            instagram: profileInfo.instagram || prev.instagram,
            facebook: profileInfo.facebook || prev.facebook,
            upiId: profileInfo.upiId || prev.upiId,
            customSlug: profileInfo.customSlug || prev.customSlug || "",
            services: profileInfo.services || prev.services,
            hours: profileInfo.hours || prev.hours,
            employees: profileInfo.employees || prev.employees,
            testimonials: profileInfo.testimonials || prev.testimonials,
            mediaLinks: profileInfo.mediaLinks || prev.mediaLinks,
            faqs: profileInfo.faqs || prev.faqs,
            amenities: profileInfo.amenities || prev.amenities,
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

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    set("selectedTemplate", template);
    setPickerModal(null);
  };

  const handleThemeSelect = (name) => {
    set("theme", name);
    setPickerModal(null);
  };

  const currentTemplate = templates.find(tmpl => tmpl.id === selectedTemplate);
  const currentTheme = getTheme(data.theme);

  return (
    <div className="min-h-0 w-full max-w-full bg-app-bg text-white font-sans relative overflow-x-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

      {/* Header bar */}
      <header className="sticky top-0 z-30 bg-app-bg/90 backdrop-blur-xl border-b border-app-border">
        <div className="px-4 md:px-6 lg:px-8 py-4 lg:py-0 lg:min-h-16 max-w-[1600px] mx-auto flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})` }}
            >
              <Globe size={20} className="text-white lg:!w-4 lg:!h-4" />
            </div>
             <div className="flex flex-col leading-tight min-w-0">
              <span className="font-extrabold text-white text-lg lg:text-sm truncate">Mini Website Builder</span>
              <span className="text-sm lg:text-[10px] text-app-text-dimmed font-medium truncate">{displayDomain}/profile/{data.customSlug || "slug"}?tab=website</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 lg:flex lg:items-center lg:gap-3 w-full lg:w-auto">
            <button
              onClick={handlePublishToggle}
              disabled={isPublishing}
              className={`flex items-center justify-center gap-2 px-4 py-3.5 lg:py-2 rounded-xl text-[15px] lg:text-xs font-bold transition-all border active:scale-95 min-h-[50px] lg:min-h-0 ${isPublished
                ? "bg-app-success/10 border-app-success/30 text-app-success hover:bg-app-success/20"
                : "bg-app-surface border-app-border text-app-text-muted hover:border-app-text-muted/30 hover:bg-app-surface/80"
                }`}
            >
              <Send size={18} className="flex-shrink-0 lg:!w-3 lg:!h-3" />
              <span>{isPublished ? "Unpublish" : "Publish Site"}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-4 py-3.5 lg:py-2 rounded-xl text-[15px] lg:text-xs font-bold text-white transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10 min-h-[50px] lg:min-h-0"
              style={{
                background: saved
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})`,
              }}
            >
              {saved ? (
                <><CheckCircle2 size={18} className="lg:!w-[13px] lg:!h-[13px]" /> <span>Saved!</span></>
              ) : isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 lg:h-3.5 lg:w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <><Save size={18} className="lg:!w-[13px] lg:!h-[13px]" /> <span>Save Changes</span></>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main body */}
      <div className="max-w-[1600px] mx-auto mt-4 lg:mt-6 px-4 md:px-6 lg:px-8 pb-32 xl:pb-12">
        <div className="flex flex-col xl:flex-row gap-5 xl:gap-8 items-start">
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">

            {/* Template — compact on mobile, full section on desktop */}
            <div className="lg:hidden">
              <MobilePickerCard
                icon={LayoutTemplate}
                label="Choose Template Style"
                value={currentTemplate?.name || selectedTemplate.replace("-", " ")}
                iconColor="text-primary-light"
                onClick={() => setPickerModal("template")}
                preview={
                  currentTemplate ? (
                    <div className={`h-12 w-12 rounded-xl flex-shrink-0 overflow-hidden border border-app-border ${currentTemplate.preview}`} />
                  ) : null
                }
              />
            </div>
            <div className="hidden lg:block">
              <Section icon={LayoutTemplate} title="Choose Template Style" color="text-primary-light" defaultOpen>
                <TemplatePicker layout="scroll" selected={selectedTemplate} onSelect={handleTemplateSelect} />
              </Section>
            </div>

            {/* Colors — compact on mobile, full section on desktop */}
            <div className="lg:hidden">
              <MobilePickerCard
                icon={Palette}
                label="Brand Color Scheme"
                value={getThemeLabel(data.theme)}
                iconColor="text-secondary-light"
                onClick={() => setPickerModal("theme")}
                preview={
                  <div
                    className="h-12 w-12 rounded-xl flex-shrink-0 border border-app-border shadow-sm"
                    style={{ background: `linear-gradient(135deg,${currentTheme.grad[0]},${currentTheme.grad[1]})` }}
                  />
                }
              />
            </div>
            <div className="hidden lg:block">
              <Section icon={Palette} title="Brand Color Scheme" color="text-secondary-light">
                <ThemeGrid selected={data.theme} onSelect={handleThemeSelect} />
              </Section>
            </div>

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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-2">
                      <FInput type="number" placeholder="Pricing (e.g. 1500)" value={s.price} onChange={v => updService(s.id, "price", v)} small />
                      <FInput placeholder="Thumbnail Image Link" value={s.image} onChange={v => updService(s.id, "image", v)} small />
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
              <div className="flex flex-wrap gap-2.5 lg:gap-1.5 my-2">
                {data.amenities.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-2 text-[15px] lg:text-xs bg-app-surface border border-app-border text-app-text-muted px-4 lg:px-3 py-2.5 lg:py-1 rounded-full font-medium hover:bg-app-surface/80 transition-colors">
                    {a}
                    <button type="button" onClick={() => delAmenity(i)} className="text-app-text-dimmed hover:text-red-450 font-bold text-xl lg:text-base leading-none w-6 h-6 flex items-center justify-center">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 lg:gap-2">
                <input
                  value={newAmenity}
                  onChange={e => setNewAmenity(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addAmenity()}
                  placeholder="e.g. Card Payments, Air Conditioned"
                  className="flex-1 border border-app-border bg-app-bg/60 rounded-xl px-4 lg:px-3 py-3.5 lg:py-2 text-[15px] lg:text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[52px] lg:min-h-0"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-6 lg:px-4 py-3.5 lg:py-2 rounded-xl text-white text-[15px] lg:text-xs font-bold transition-all hover:brightness-110 active:scale-95 flex-shrink-0 min-h-[52px] lg:min-h-0"
                  style={{ background: t.primary }}
                >
                  Add
                </button>
              </div>
            </Section>

            {/* Section 7: Hours */}
            <Section icon={Clock} title="Business Hours Settings" color="text-app-text-muted" defaultOpen={false}>
              <Toggle label="Show hours section" checked={data.showSections.hours} onChange={v => setShow("hours", v)} />
              <div className="flex flex-col gap-3 lg:gap-2">
                {data.hours.map((h, i) => (
                  <div key={i} className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:gap-2 p-3 lg:p-0 rounded-xl lg:rounded-none bg-app-bg/30 lg:bg-transparent border border-app-border/50 lg:border-0">
                    <input
                      value={h.day}
                      onChange={e => updHour(i, "day", e.target.value)}
                      className="w-full lg:w-28 border border-app-border bg-app-bg/60 rounded-xl px-4 lg:px-2.5 py-3.5 lg:py-1.5 text-[15px] lg:text-xs text-white min-h-[50px] lg:min-h-0"
                    />
                    <input
                      value={h.time}
                      onChange={e => updHour(i, "time", e.target.value)}
                      className="flex-1 border border-app-border bg-app-bg/60 rounded-xl px-4 lg:px-2.5 py-3.5 lg:py-1.5 text-[15px] lg:text-xs text-white min-w-0 min-h-[50px] lg:min-h-0"
                    />
                    <button
                      type="button"
                      onClick={() => updHour(i, "open", !h.open)}
                      className={`shrink-0 text-[15px] lg:text-[10px] font-bold px-5 lg:px-3 py-3 lg:py-1.5 rounded-full transition-all cursor-pointer min-h-[50px] lg:min-h-0 ${h.open
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-2">
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
                    <div className="flex items-center gap-3 py-1">
                      <span className="text-[15px] lg:text-xs text-app-text-muted">Rating:</span>
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

          {/* Desktop / large laptop — sticky side preview */}
          <div className="hidden xl:flex xl:sticky xl:top-[76px] xl:self-start w-full xl:w-[min(100%,400px)] 2xl:w-[420px] flex-shrink-0 flex-col items-center">
            <PreviewPanel t={t} selectedTemplate={selectedTemplate} data={data} />
          </div>
        </div>
      </div>

      {/* Floating preview FAB — mobile, tablet, small laptop */}
      {mobileTab !== "preview" && (
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className="xl:hidden fixed bottom-6 right-5 z-40 flex items-center gap-3 pl-5 pr-6 py-4 rounded-full text-white text-[15px] font-bold shadow-[0_8px_32px_rgba(0,0,0,0.45)] active:scale-95 transition-transform min-h-[56px]"
          style={{ background: `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})` }}
          aria-label="Open live preview"
        >
          <Smartphone size={22} className="sm:!w-[18px] sm:!h-[18px]" />
          <span>Preview</span>
        </button>
      )}

      {/* Preview slide-over panel */}
      {mobileTab === "preview" && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileTab("editor")}
            aria-hidden="true"
          />
          <div className="relative w-full sm:w-[min(100%,420px)] md:w-[440px] h-full bg-app-bg border-l border-app-border shadow-2xl flex flex-col transition-transform duration-300 ease-out">
            <div className="flex items-center justify-between px-4 py-4 sm:py-3 border-b border-app-border bg-app-surface/80 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Smartphone size={20} className="text-primary-light sm:!w-4 sm:!h-4" />
                <span className="text-base sm:text-sm font-bold text-white">Live Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileTab("editor")}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-app-bg border border-app-border text-app-text-muted hover:text-white hover:border-app-text-muted/40 transition-colors"
                aria-label="Close preview"
              >
                <X size={20} className="sm:!w-4 sm:!h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:py-6">
              <PreviewPanel t={t} selectedTemplate={selectedTemplate} data={data} />
            </div>
          </div>
        </div>
      )}

      {/* Template picker modal — mobile / tablet */}
      <PickerModal
        open={pickerModal === "template"}
        title="Choose Template"
        icon={LayoutTemplate}
        iconColor="text-primary-light"
        onClose={() => setPickerModal(null)}
      >
        <TemplatePicker layout="stack" selected={selectedTemplate} onSelect={handleTemplateSelect} />
      </PickerModal>

      {/* Theme picker modal — mobile / tablet */}
      <PickerModal
        open={pickerModal === "theme"}
        title="Brand Color Scheme"
        icon={Palette}
        iconColor="text-secondary-light"
        onClose={() => setPickerModal(null)}
      >
        <ThemeGrid selected={data.theme} onSelect={handleThemeSelect} inModal />
      </PickerModal>
    </div>
  );
}