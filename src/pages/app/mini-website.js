"use client";

import { useState } from "react";
import {
    Globe, Edit3, Eye, Save, CheckCircle2, Link, Plus, Trash2,
    ChevronDown, ChevronUp, Star, Phone, Award, Megaphone,
    ShoppingBag, Users, Play, FileText, HelpCircle,
    MessageSquare, Briefcase, Palette, Smartphone,
    LayoutTemplate, MapPin, Mail, Clock,
} from "lucide-react";

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
        { id: uid(), name: "Web Design", price: "₹5,000", desc: "Beautiful responsive websites", image: "" },
        { id: uid(), name: "SEO Management", price: "₹3,000", desc: "Rank higher on Google", image: "" },
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

// ═══════════════════════════════════════════════════════════════

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
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-10 h-[22px] rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 ${checked ? "bg-blue-500 shadow-sm shadow-blue-200" : "bg-gray-200"
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
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
            )}
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`border border-gray-200 rounded-xl px-3 bg-white placeholder-gray-300 
          focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 
          hover:border-gray-300 transition-all
          ${small ? "py-1.5 text-xs" : "py-2.5 text-sm"}`}
            />
        </div>
    );
}

function FTA({ label, value, onChange, placeholder }) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
            )}
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={2}
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white placeholder-gray-300 
          focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 
          hover:border-gray-300 transition-all resize-none"
            />
        </div>
    );
}

function Section({ icon: Icon, title, color = "text-gray-700", badge, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className={`rounded-2xl border overflow-hidden transition-shadow hover:shadow-sm ${open ? "border-gray-200 shadow-sm" : "border-gray-100"
            }`}>
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors ${open ? "bg-white border-b border-gray-100" : "bg-gray-50/80 hover:bg-gray-100/60"
                    }`}
            >
                <div className="flex items-center gap-2.5">
                    {Icon && <Icon size={15} className={`flex-shrink-0 ${color}`} />}
                    <span className={`text-[13px] font-semibold ${color}`}>{title}</span>
                    {badge !== undefined && badge > 0 && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold leading-none">
                            {badge}
                        </span>
                    )}
                </div>
                {open
                    ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={14} className="text-gray-300 flex-shrink-0" />
                }
            </button>
            {open && (
                <div className="px-4 py-4 flex flex-col gap-3 bg-white">{children}</div>
            )}
        </div>
    );
}

function Card({ children, onDelete }) {
    return (
        <div className="relative border border-gray-100 rounded-xl p-3 bg-gray-50/50 flex flex-col gap-2.5 hover:border-gray-200 transition-colors">
            {children}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-200 text-red-300 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
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
            onClick={onClick}
            className="w-full flex items-center justify-center gap-1.5 py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs font-semibold text-gray-400 
        hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/40 
        active:scale-[0.98] transition-all"
        >
            <Plus size={13} /> {label}
        </button>
    );
}

function PhoneFrame({ children }) {
    return (
        <div className="relative mx-auto" style={{ width: 375 }}>
            {/* Body */}
            <div
                className="relative rounded-[2.8rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.28)]"
                style={{
                    background: "linear-gradient(160deg, #1c1c1e 0%, #000 100%)",
                    padding: "14px 10px 16px",
                    border: "1.5px solid rgba(255,255,255,0.08)",
                }}
            >
                {/* Dynamic island */}
                <div className="flex justify-center mb-2.5">
                    <div className="w-[88px] h-[26px] rounded-full flex items-center justify-center gap-2"
                        style={{ background: "#000" }}>
                        <div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" />
                        <div className="w-[10px] h-[10px] rounded-full bg-zinc-800 border border-zinc-600" />
                    </div>
                </div>
                {/* Screen */}
                <div
                    className="rounded-[2rem] overflow-hidden bg-white"
                    style={{
                        height: "75vh",
                        minHeight: 600,
                        maxHeight: 812,
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
            <div className="absolute left-[-3px] top-24 w-[3px] h-8 rounded-l-full" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="absolute left-[-3px] top-36 w-[3px] h-12 rounded-l-full" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="absolute right-[-3px] top-28 w-[3px] h-16 rounded-l-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>
    );
}

export default function MiniWebsiteBuilder() {
    const [data, setData] = useState(DEFAULT);
    const [mobileTab, setMobileTab] = useState("editor");
    const [saved, setSaved] = useState(false);
    const [newAmenity, setNewAmenity] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("it-company");

    const t = getTheme(data.theme);
    const set = (k, v) => setData(d => ({ ...d, [k]: v }));
    const setShow = (k, v) => setData(d => ({ ...d, showSections: { ...d.showSections, [k]: v } }));

    // CRUD
    const addService = () => set("services", [...data.services, { id: uid(), name: "", price: "", desc: "", image: "" }]);
    const delService = id => set("services", data.services.filter(s => s.id !== id));
    const updService = (id, f, v) => set("services", data.services.map(s => s.id === id ? { ...s, [f]: v } : s));

    const addEmployee = () => set("employees", [...data.employees, { id: uid(), name: "", bio: "", phone: "", email: "", image: "" }]);
    const delEmployee = id => set("employees", data.employees.filter(e => e.id !== id));
    const updEmployee = (id, f, v) => set("employees", data.employees.map(e => e.id === id ? { ...e, [f]: v } : e));

    const addTestimonial = () => set("testimonials", [...data.testimonials, { id: uid(), name: "", company: "", content: "", stars: 5 }]);
    const delTestimonial = id => set("testimonials", data.testimonials.filter(r => r.id !== id));
    const updTestimonial = (id, f, v) => set("testimonials", data.testimonials.map(r => r.id === id ? { ...r, [f]: v } : r));

    const addMedia = () => set("mediaLinks", [...data.mediaLinks, { id: uid(), title: "", url: "" }]);
    const delMedia = id => set("mediaLinks", data.mediaLinks.filter(m => m.id !== id));
    const updMedia = (id, f, v) => set("mediaLinks", data.mediaLinks.map(m => m.id === id ? { ...m, [f]: v } : m));

    const addFaq = () => set("faqs", [...data.faqs, { id: uid(), question: "", answer: "" }]);
    const delFaq = id => set("faqs", data.faqs.filter(f => f.id !== id));
    const updFaq = (id, fl, v) => set("faqs", data.faqs.map(f => f.id === id ? { ...f, [fl]: v } : f));

    const updHour = (i, f, v) => set("hours", data.hours.map((h, idx) => idx === i ? { ...h, [f]: v } : h));

    const addAmenity = () => {
        if (newAmenity.trim()) { set("amenities", [...data.amenities, newAmenity.trim()]); setNewAmenity(""); }
    };
    const delAmenity = i => set("amenities", data.amenities.filter((_, idx) => idx !== i));

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-40 backdrop-blur-xl border-b">
                <div className="h-14 flex items-center justify-between gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                            style={{ background: `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})` }}>
                            <Globe size={15} className="text-white" />
                        </div>
                        <div className="hidden sm:flex flex-col leading-none">
                            <span className="font-black text-gray-900 text-[13px]">Website Builder</span>
                            <span className="text-[10px] text-gray-400 font-medium">presence1.in</span>
                        </div>
                    </div>

                    {/* Mobile tab switcher */}
                    <div className="flex lg:hidden items-center bg-gray-100 rounded-2xl p-1 gap-0.5">
                        <button
                            onClick={() => setMobileTab("editor")}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 ${mobileTab === "editor"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <Edit3 size={11} /> Edit
                        </button>
                        <button
                            onClick={() => setMobileTab("preview")}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-200 ${mobileTab === "preview"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <Smartphone size={11} /> Preview
                        </button>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all duration-300 active:scale-95 shadow-sm"
                        style={{
                            background: saved
                                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                                : `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})`,
                            boxShadow: saved
                                ? "0 4px 12px rgba(34,197,94,0.3)"
                                : `0 4px 12px ${t.grad[0]}40`,
                        }}
                    >
                        {saved
                            ? <><CheckCircle2 size={14} /> <span className="hidden sm:inline">Saved!</span></>
                            : <><Save size={14} /> <span className="hidden sm:inline">Save</span></>
                        }
                    </button>
                </div>
            </header>
            <div className="max-w-screen-xl mx-auto mt-5">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    <div className={`flex-1 min-w-0 flex flex-col gap-2.5 ${mobileTab === "preview" ? "hidden lg:flex" : "flex"} `}>

                        <Section icon={LayoutTemplate} title="Choose Template" color="text-violet-600" defaultOpen>
                            <TemplatePicker selected={selectedTemplate} onSelect={setSelectedTemplate} />
                        </Section>

                        <Section icon={Palette} title="Theme Color" color="text-purple-600">
                            <div className="grid grid-cols-5 gap-2.5">
                                {Object.entries(THEMES).map(([name, th]) => (
                                    <button
                                        key={name}
                                        onClick={() => set("theme", name)}
                                        title={name}
                                        className={`relative h-11 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${data.theme === name
                                            ? "ring-2 ring-offset-2 ring-gray-800 scale-95 shadow-lg"
                                            : "shadow-sm hover:shadow-md"
                                            }`}
                                        style={{ background: `linear-gradient(135deg,${th.grad[0]},${th.grad[1]})` }}
                                    >
                                        {data.theme === name && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <CheckCircle2 size={16} className="text-white drop-shadow" />
                                            </div>
                                        )}
                                        <span className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-bold text-white/80 capitalize tracking-wide">
                                            {name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </Section>

                        <Section icon={Megaphone} title="Announcement Bar" color="text-orange-500">
                            <Toggle label="Show announcement bar" checked={data.showSections.announcement} onChange={v => setShow("announcement", v)} />
                            <Toggle label="Mark as active" checked={data.announcement.enabled} onChange={v => set("announcement", { ...data.announcement, enabled: v })} />
                            <FInput value={data.announcement.text} onChange={v => set("announcement", { ...data.announcement, text: v })} placeholder="🎉 Special offer this week!" />
                        </Section>

                        <Section icon={Briefcase} title="Business Info" color="text-blue-600">
                            <FInput label="Business Name" value={data.businessName} onChange={v => set("businessName", v)} placeholder="Your Business Name" />
                            <FInput label="Tagline" value={data.tagline} onChange={v => set("tagline", v)} placeholder="Short catchy description" />
                            <FInput label="CTA Button" value={data.buttonText} onChange={v => set("buttonText", v)} placeholder="Contact Us" />
                            <FInput label="Logo URL" value={data.logo} onChange={v => set("logo", v)} placeholder="https://example.com/logo.png" />
                        </Section>

                        <Section icon={ShoppingBag} title="Products & Services" color="text-green-600" badge={data.services.length}>
                            <Toggle label="Show this section" checked={data.showSections.services} onChange={v => setShow("services", v)} />
                            {data.services.map(s => (
                                <Card key={s.id} onDelete={() => delService(s.id)}>
                                    <FInput placeholder="Service / Product Name" value={s.name} onChange={v => updService(s.id, "name", v)} small />
                                    <div className="grid grid-cols-2 gap-2">
                                        <FInput placeholder="Price e.g. ₹5,000" value={s.price} onChange={v => updService(s.id, "price", v)} small />
                                        <FInput placeholder="Image URL (optional)" value={s.image} onChange={v => updService(s.id, "image", v)} small />
                                    </div>
                                    <FTA placeholder="Short description..." value={s.desc} onChange={v => updService(s.id, "desc", v)} />
                                </Card>
                            ))}
                            <AddBtn onClick={addService} label="Add Service / Product" />
                        </Section>

                        <Section icon={Award} title="Amenities & Features" color="text-teal-600" defaultOpen={false}
                            badge={data.amenities.length}>
                            <Toggle label="Show this section" checked={data.showSections.amenities} onChange={v => setShow("amenities", v)} />
                            <div className="flex flex-wrap gap-1.5">
                                {data.amenities.map((a, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                        {a}
                                        <button onClick={() => delAmenity(i)} className="text-gray-400 hover:text-red-500 transition-colors ml-0.5 leading-none font-bold">&times;</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={newAmenity}
                                    onChange={e => setNewAmenity(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addAmenity()}
                                    placeholder="e.g. Free WiFi, Parking"
                                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder-gray-300"
                                />
                                <button
                                    onClick={addAmenity}
                                    className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 active:scale-95 flex-shrink-0"
                                    style={{ background: t.primary }}
                                >
                                    Add
                                </button>
                            </div>
                        </Section>

                        {/* Business Hours */}
                        <Section icon={Clock} title="Business Hours" color="text-gray-600" defaultOpen={false}>
                            <Toggle label="Show this section" checked={data.showSections.hours} onChange={v => setShow("hours", v)} />
                            <div className="flex flex-col gap-2">
                                {data.hours.map((h, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <input
                                            value={h.day}
                                            onChange={e => updHour(i, "day", e.target.value)}
                                            className="w-24 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                        <input
                                            value={h.time}
                                            onChange={e => updHour(i, "time", e.target.value)}
                                            className="flex-1 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                        <button
                                            onClick={() => updHour(i, "open", !h.open)}
                                            className={`shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${h.open ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-500 hover:bg-red-200"
                                                }`}
                                        >
                                            {h.open ? "Open" : "Closed"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Team */}
                        <Section icon={Users} title="Team / Employees" color="text-indigo-600" defaultOpen={false}
                            badge={data.employees.length}>
                            <Toggle label="Show this section" checked={data.showSections.employees} onChange={v => setShow("employees", v)} />
                            {data.employees.map(e => (
                                <Card key={e.id} onDelete={() => delEmployee(e.id)}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <FInput placeholder="Full Name" value={e.name} onChange={v => updEmployee(e.id, "name", v)} small />
                                        <FInput placeholder="Designation" value={e.bio} onChange={v => updEmployee(e.id, "bio", v)} small />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <FInput placeholder="Phone" value={e.phone} onChange={v => updEmployee(e.id, "phone", v)} small />
                                        <FInput placeholder="Email" value={e.email} onChange={v => updEmployee(e.id, "email", v)} small />
                                    </div>
                                    <FInput placeholder="Photo URL (optional)" value={e.image} onChange={v => updEmployee(e.id, "image", v)} small />
                                </Card>
                            ))}
                            <AddBtn onClick={addEmployee} label="Add Team Member" />
                        </Section>

                        {/* Contact */}
                        <Section icon={Phone} title="Contact Info" color="text-blue-500" defaultOpen={false}>
                            <Toggle label="Show this section" checked={data.showSections.contact} onChange={v => setShow("contact", v)} />
                            <FInput label="Phone" value={data.phone} onChange={v => set("phone", v)} placeholder="+91 00000 00000" />
                            <FInput label="Email" value={data.email} onChange={v => set("email", v)} placeholder="hello@business.com" />
                            <FInput label="Address" value={data.address} onChange={v => set("address", v)} placeholder="City, State, India" />
                            <FInput label="Website" value={data.website} onChange={v => set("website", v)} placeholder="www.business.com" />
                        </Section>

                        {/* Testimonials */}
                        <Section icon={MessageSquare} title="Testimonials" color="text-yellow-600" defaultOpen={false}
                            badge={data.testimonials.length}>
                            <Toggle label="Show this section" checked={data.showSections.testimonials} onChange={v => setShow("testimonials", v)} />
                            {data.testimonials.map(r => (
                                <Card key={r.id} onDelete={() => delTestimonial(r.id)}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <FInput placeholder="Person Name" value={r.name} onChange={v => updTestimonial(r.id, "name", v)} small />
                                        <FInput placeholder="Company name" value={r.company} onChange={v => updTestimonial(r.id, "company", v)} small />
                                    </div>
                                    <FTA placeholder="What they said about you..." value={r.content} onChange={v => updTestimonial(r.id, "content", v)} />
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-gray-400 font-medium">Rating:</span>
                                        <StarRow count={r.stars} onChange={v => updTestimonial(r.id, "stars", v)} />
                                    </div>
                                </Card>
                            ))}
                            <AddBtn onClick={addTestimonial} label="Add Testimonial" />
                        </Section>

                        {/* Media Links */}
                        <Section icon={Play} title="Media / Videos" color="text-red-500" defaultOpen={false}
                            badge={data.mediaLinks.length}>
                            <Toggle label="Show this section" checked={data.showSections.mediaLinks} onChange={v => setShow("mediaLinks", v)} />
                            {data.mediaLinks.map(m => (
                                <Card key={m.id} onDelete={() => delMedia(m.id)}>
                                    <FInput placeholder="Video / Link Title" value={m.title} onChange={v => updMedia(m.id, "title", v)} small />
                                    <FInput placeholder="YouTube or any URL" value={m.url} onChange={v => updMedia(m.id, "url", v)} small />
                                </Card>
                            ))}
                            <AddBtn onClick={addMedia} label="Add Media Link" />
                        </Section>

                        {/* FAQ */}
                        <Section icon={HelpCircle} title="FAQ" color="text-cyan-600" defaultOpen={false}
                            badge={data.faqs.length}>
                            <Toggle label="Show this section" checked={data.showSections.faqs} onChange={v => setShow("faqs", v)} />
                            {data.faqs.map(f => (
                                <Card key={f.id} onDelete={() => delFaq(f.id)}>
                                    <FInput placeholder="Question" value={f.question} onChange={v => updFaq(f.id, "question", v)} small />
                                    <FTA placeholder="Answer" value={f.answer} onChange={v => updFaq(f.id, "answer", v)} />
                                </Card>
                            ))}
                            <AddBtn onClick={addFaq} label="Add FAQ" />
                        </Section>

                        {/* Google Form */}
                        <Section icon={FileText} title="Enquiry Form" color="text-emerald-600" defaultOpen={false}>
                            <Toggle label="Show this section" checked={data.showSections.googleForm} onChange={v => setShow("googleForm", v)} />
                            <FInput label="Google Form URL" value={data.googleFormLink} onChange={v => set("googleFormLink", v)} placeholder="https://forms.google.com/..." />
                        </Section>

                        {/* Social */}
                        <Section icon={FaInstagram} title="Social Media" color="text-pink-600" defaultOpen={false}>
                            <Toggle label="Show this section" checked={data.showSections.social} onChange={v => setShow("social", v)} />
                            <FInput label="Instagram username" value={data.instagram} onChange={v => set("instagram", v)} placeholder="yourusername" />
                            <FInput label="Facebook page" value={data.facebook} onChange={v => set("facebook", v)} placeholder="yourpage" />
                            <FInput label="YouTube channel URL" value={data.youtube} onChange={v => set("youtube", v)} placeholder="https://youtube.com/@channel" />
                        </Section>

                    </div>

                    <div className={`lg:sticky lg:top-[72px] lg:self-start w-full lg:w-auto flex-shrink-0 ${mobileTab === "editor" ? "hidden lg:flex" : "flex"} flex-col items-center gap-4`}>

                        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100/80">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <Eye size={12} className="text-gray-400" />
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Live Preview</span>
                        </div>

                        <PhoneFrame>
                            <TemplateRenderer templateId={selectedTemplate} data={data} />
                        </PhoneFrame>

                        <div className="w-[375px] bg-white rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm border border-gray-100">
                            <Link size={12} className="flex-shrink-0" style={{ color: t.primary }} />
                            <span className="text-[11px] text-gray-400 truncate flex-1 font-mono">
                                presence1.in/<span className="font-bold not-italic" style={{ color: t.primary }}>
                                    {data.businessName.toLowerCase().replace(/\s+/g, "-")}
                                </span>
                            </span>
                            <button
                                className="text-[11px] font-bold flex-shrink-0 px-2 py-0.5 rounded-lg transition-colors hover:bg-gray-100"
                                style={{ color: t.primary }}
                                onClick={() => navigator.clipboard?.writeText(`https://presence1.in/${data.businessName.toLowerCase().replace(/\s+/g, "-")}`)}
                            >
                                Copy
                            </button>
                        </div>

                        <p className="text-[11px] text-gray-400 font-medium">
                            Template: <span className="font-bold text-gray-600">{selectedTemplate}</span>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}