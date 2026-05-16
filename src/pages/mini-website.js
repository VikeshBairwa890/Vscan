"use client";

import { useState } from "react";
import {
    Globe, Edit3, Eye, Save, CheckCircle2, Link, Plus, Trash2,
    ChevronDown, ChevronUp, Star, Phone, Mail, MapPin, Award, Megaphone, ShoppingBag, Users,
    Play, FileText, HelpCircle, MessageSquare, Briefcase,
    Palette, ExternalLink,
} from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";

const THEMES = {
    blue: { primary: "#2563eb", light: "#eff6ff", grad: ["#1d4ed8", "#3b82f6"] },
    purple: { primary: "#7c3aed", light: "#f5f3ff", grad: ["#6d28d9", "#a78bfa"] },
    green: { primary: "#16a34a", light: "#f0fdf4", grad: ["#15803d", "#4ade80"] },
    orange: { primary: "#ea580c", light: "#fff7ed", grad: ["#c2410c", "#fb923c"] },
    rose: { primary: "#e11d48", light: "#fff1f2", grad: ["#be123c", "#fb7185"] },
    teal: { primary: "#0d9488", light: "#f0fdfa", grad: ["#0f766e", "#2dd4bf"] },
    indigo: { primary: "#4338ca", light: "#eef2ff", grad: ["#3730a3", "#818cf8"] },
    amber: { primary: "#d97706", light: "#fffbeb", grad: ["#b45309", "#fcd34d"] },
    cyan: { primary: "#0891b2", light: "#ecfeff", grad: ["#0e7490", "#67e8f9"] },
    pink: { primary: "#db2777", light: "#fdf2f8", grad: ["#be185d", "#f472b6"] },
    slate: { primary: "#475569", light: "#f8fafc", grad: ["#1e293b", "#64748b"] },
    emerald: { primary: "#059669", light: "#ecfdf5", grad: ["#047857", "#34d399"] },
};

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

// ─── Atoms ────────────────────────────────────────────────────────────────────
function StarRow({ count, onChange }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={13}
                    fill={i <= count ? "#facc15" : "none"}
                    className={`cursor-pointer ${i <= count ? "text-yellow-400" : "text-gray-300"}`}
                    onClick={() => onChange && onChange(i)} />
            ))}
        </div>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <div className="flex items-center justify-between py-0.5">
            <span className="text-sm text-gray-600">{label}</span>
            <button onClick={() => onChange(!checked)}
                className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${checked ? "bg-blue-500" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-5" : "left-0.5"}`} />
            </button>
        </div>
    );
}

function FInput({ label, value, onChange, placeholder, small }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs text-gray-400 font-medium">{label}</label>}
            <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className={`border border-gray-200 rounded-sm px-3 ${small ? "py-1.5 text-xs" : "py-2 text-sm"} focus:outline-none focus:ring-2 focus:ring-blue-100 transition bg-white`} />
        </div>
    );
}

function FTA({ label, value, onChange, placeholder }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs text-gray-400 font-medium">{label}</label>}
            <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2}
                className="border border-gray-200 rounded-sm px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition bg-white resize-none" />
        </div>
    );
}

function CollapseSection({ icon: Icon, title, color = "text-gray-700", children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-100 rounded-sm overflow-hidden shadow-sm">
            <button onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={14} className={color} />}
                    <span className={`text-sm font-semibold ${color}`}>{title}</span>
                </div>
                {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            {open && <div className="p-4 flex flex-col gap-3 bg-white">{children}</div>}
        </div>
    );
}

function Card({ children, onDelete }) {
    return (
        <div className="border border-gray-100 rounded-sm p-3 bg-gray-50 flex flex-col gap-2 relative pr-7">
            {children}
            {onDelete && (
                <button onClick={onDelete} className="absolute top-2.5 right-2.5 text-red-300 hover:text-red-500 transition">
                    <Trash2 size={13} />
                </button>
            )}
        </div>
    );
}

function AddBtn({ onClick, label }) {
    return (
        <button onClick={onClick}
            className="flex items-center gap-1.5 text-xs font-semibold border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 rounded-sm px-3 py-2.5 transition w-full justify-center">
            <Plus size={13} /> {label}
        </button>
    );
}

// ─── Preview Helpers ──────────────────────────────────────────────────────────
function PHead({ icon: Icon, label, color }) {
    return (
        <div className="flex items-center gap-1.5 mb-2">
            {Icon && <Icon size={11} style={{ color }} />}
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color }}>{label}</span>
        </div>
    );
}

function PRow({ icon: Icon, text, color }) {
    return (
        <div className="flex items-start gap-2 text-xs text-gray-600">
            <Icon size={11} style={{ color }} className="flex-shrink-0 mt-0.5" />
            <span className="leading-tight">{text}</span>
        </div>
    );
}

// ─── Preview Component ────────────────────────────────────────────────────────
function Preview({ data }) {
    const t = THEMES[data.theme] || THEMES.blue;
    const [openFaq, setOpenFaq] = useState(null);

    const ytId = (url) => {
        const m = url?.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
        return m ? m[1] : null;
    };

    return (
        <div className="bg-white text-sm font-sans">

            {/* Announcement */}
            {data.showSections.announcement && data.announcement.enabled && data.announcement.text && (
                <div className="px-4 py-2 text-center text-[11px] font-bold text-white leading-snug"
                    style={{ background: `linear-gradient(90deg,${t.grad[0]},${t.grad[1]})` }}>
                    {data.announcement.text}
                </div>
            )}

            {/* Hero */}
            <div className="px-6 pt-8 pb-10 text-white text-center"
                style={{ background: `linear-gradient(145deg,${t.grad[0]},${t.grad[1]})` }}>
                <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {data.logo
                        ? <Image src={data.logo} alt="" className="w-full h-full object-cover" />
                        : <span className="text-3xl font-black text-white/90">{data.businessName.charAt(0)}</span>}
                </div>
                <h1 className="text-xl font-black">{data.businessName}</h1>
                <p className="text-white/75 text-xs mt-1">{data.tagline}</p>
                <button className="mt-4 bg-white text-xs font-black px-5 py-2 rounded-full shadow-lg"
                    style={{ color: t.primary }}>{data.buttonText}</button>
            </div>
            <svg viewBox="0 0 400 20" className="w-full -mt-px" preserveAspectRatio="none" height="25">
                <path d="M0,10 Q100,20 200,10 Q300,0 400,10 L400,0 L0,0 Z" fill={t.grad[0]} />
            </svg>

            <div className="px-4 pb-6 flex flex-col gap-5 mt-2">

                {/* Services */}
                {data.showSections.services && data.services.length > 0 && (
                    <div>
                        <PHead icon={ShoppingBag} label="Products & Services" color={t.primary} />
                        <div className="flex flex-col gap-2">
                            {data.services.map(s => (
                                <div key={s.id} className="rounded-xl overflow-hidden border-t border-gray-100 shadow-sm">
                                    {s.image && <Image src={s.image} alt={s.name} className="w-full h-24 object-cover" />}
                                    <div className="p-2.5" style={{ background: t.light }}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-gray-800 text-xs">{s.name}</p>
                                                {s.desc && <p className="text-gray-400 text-[10px] mt-0.5">{s.desc}</p>}
                                            </div>
                                            {s.price && (
                                                <span className="text-[10px] font-black shrink-0 px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                                                    style={{ background: t.primary }}>{s.price}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Amenities */}
                {data.showSections.amenities && data.amenities.length > 0 && (
                    <div>
                        <PHead icon={Award} label="Amenities" color={t.primary} />
                        <div className="flex flex-wrap gap-1.5">
                            {data.amenities.map((a, i) => (
                                <span key={i} className="text-[10px] font-semibold px-2 py-1 rounded-full border"
                                    style={{ color: t.primary, borderColor: t.primary + "50", background: t.light }}>
                                    ✓ {a}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hours */}
                {data.showSections.hours && (
                    <div>
                        <PHead icon={null} label="Business Hours" color={t.primary} />
                        <div className="flex flex-col gap-1.5">
                            {data.hours.map((h, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                    <span className="text-gray-600 font-medium">{h.day}</span>
                                    <span style={{ color: h.open ? t.primary : "#ef4444" }} className="font-semibold">{h.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Team */}
                {data.showSections.employees && data.employees.length > 0 && (
                    <div>
                        <PHead icon={Users} label="Our Team" color={t.primary} />
                        <div className="flex flex-col gap-2">
                            {data.employees.map(e => (
                                <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100" style={{ background: t.light }}>
                                    <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
                                        style={{ background: t.primary }}>
                                        {e.image
                                            ? <Image src={e.image} alt={e.name} className="w-full h-full object-cover" />
                                            : <span className="text-white text-base font-black">{e.name.charAt(0)}</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 text-xs">{e.name}</p>
                                        {e.bio && <p className="text-[10px] font-semibold" style={{ color: t.primary }}>{e.bio}</p>}
                                        {e.phone && <p className="text-gray-400 text-[10px] flex items-center gap-1 mt-0.5"><Phone size={8} />{e.phone}</p>}
                                        {e.email && <p className="text-gray-400 text-[10px] flex items-center gap-1"><Mail size={8} />{e.email}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact */}
                {data.showSections.contact && (
                    <div>
                        <PHead icon={Phone} label="Contact" color={t.primary} />
                        <div className="flex flex-col gap-1.5">
                            {data.phone && <PRow icon={Phone} text={data.phone} color={t.primary} />}
                            {data.email && <PRow icon={Mail} text={data.email} color={t.primary} />}
                            {data.address && <PRow icon={MapPin} text={data.address} color={t.primary} />}
                            {data.website && <PRow icon={Globe} text={data.website} color={t.primary} />}
                        </div>
                    </div>
                )}

                {/* Testimonials */}
                {data.showSections.testimonials && data.testimonials.length > 0 && (
                    <div>
                        <PHead icon={MessageSquare} label="Testimonials" color={t.primary} />
                        <div className="flex flex-col gap-2">
                            {data.testimonials.map(r => (
                                <div key={r.id} className="rounded-xl p-3 border border-gray-100 bg-gray-50">
                                    <StarRow count={r.stars} />
                                    <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed italic">{r.content}</p>
                                    <p className="text-xs font-bold text-gray-700 mt-1.5">{r.name}
                                        {r.company && <span className="text-gray-400 font-normal text-[10px]"> · {r.company}</span>}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Media */}
                {data.showSections.mediaLinks && data.mediaLinks.length > 0 && (
                    <div>
                        <PHead icon={Play} label="Media" color={t.primary} />
                        <div className="flex flex-col gap-2">
                            {data.mediaLinks.map(m => {
                                const vid = ytId(m.url);
                                return (
                                    <div key={m.id} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                        {vid ? (
                                            <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
                                                <iframe className="absolute top-0 left-0 w-full h-full"
                                                    src={`https://www.youtube.com/embed/${vid}`} title={m.title} frameBorder="0" allowFullScreen />
                                            </div>
                                        ) : (
                                            <a href={m.url} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-2 p-3 hover:bg-gray-50 transition" style={{ color: t.primary }}>
                                                <FaYoutube size={14} />
                                                <span className="text-xs font-semibold truncate">{m.title || m.url}</span>
                                                <ExternalLink size={10} className="ml-auto text-gray-300 shrink-0" />
                                            </a>
                                        )}
                                        {m.title && vid && <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-t border-gray-50">{m.title}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* FAQ */}
                {data.showSections.faqs && data.faqs.length > 0 && (
                    <div>
                        <PHead icon={HelpCircle} label="FAQ" color={t.primary} />
                        <div className="flex flex-col gap-1.5">
                            {data.faqs.map((f, i) => (
                                <div key={f.id} className="border border-gray-100 rounded-xl overflow-hidden">
                                    <button className="w-full flex items-center justify-between px-3 py-2.5 text-left transition"
                                        style={{ background: openFaq === i ? t.light : "white" }}
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        <span className="text-xs font-semibold text-gray-800 pr-2 leading-snug">{f.question}</span>
                                        {openFaq === i
                                            ? <ChevronUp size={12} style={{ color: t.primary }} className="shrink-0" />
                                            : <ChevronDown size={12} className="shrink-0 text-gray-400" />}
                                    </button>
                                    {openFaq === i && (
                                        <div className="px-3 pb-3">
                                            <p className="text-[11px] text-gray-500 leading-relaxed">{f.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Google Form */}
                {data.showSections.googleForm && data.googleFormLink && (
                    <div>
                        <PHead icon={FileText} label="Enquiry Form" color={t.primary} />
                        <a href={data.googleFormLink} target="_blank" rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-xs font-bold shadow transition hover:opacity-90"
                            style={{ background: `linear-gradient(90deg,${t.grad[0]},${t.grad[1]})` }}>
                            <FileText size={13} /> Fill Enquiry Form <ExternalLink size={10} />
                        </a>
                    </div>
                )}

                {/* Social */}
                {data.showSections.social && (data.instagram || data.facebook || data.youtube) && (
                    <div>
                        <PHead icon={Globe} label="Follow Us" color={t.primary} />
                        <div className="flex flex-wrap gap-2">
                            {data.instagram && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-bold"
                                    style={{ background: "linear-gradient(135deg,#e1306c,#fd1d1d,#fcb045)" }}>
                                    <FaInstagram size={10} /> {data.instagram}
                                </span>
                            )}
                            {data.facebook && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-bold bg-blue-600">
                                    <FaFacebook size={10} /> {data.facebook}
                                </span>
                            )}
                            {data.youtube && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-bold bg-red-600">
                                    <FaYoutube size={10} /> YouTube
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="text-center text-[10px] text-gray-300 pt-2 border-t border-gray-50">
                    Powered by <span className="font-bold" style={{ color: t.primary }}>Presence1</span>
                </div>
            </div>
        </div>
    );
}

export default function MiniWebsiteBuilder() {
    const [data, setData] = useState(DEFAULT);
    const [tab, setTab] = useState("editor");
    const [saved, setSaved] = useState(false);
    const [newAmenity, setNewAmenity] = useState("");

    const set = (k, v) => setData(d => ({ ...d, [k]: v }));
    const setShow = (k, v) => setData(d => ({ ...d, showSections: { ...d.showSections, [k]: v } }));

    const addService = () => set("services", [...data.services, { id: uid(), name: "", price: "", desc: "", image: "" }]);
    const delService = id => set("services", data.services.filter(s => s.id !== id));
    const updService = (id, f, v) => set("services", data.services.map(s => s.id === id ? { ...s, [f]: v } : s));

    const addEmployee = () => set("employees", [...data.employees, { id: uid(), name: "", bio: "", phone: "", email: "", image: "" }]);
    const delEmployee = id => set("employees", data.employees.filter(e => e.id !== id));
    const updEmployee = (id, f, v) => set("employees", data.employees.map(e => e.id === id ? { ...e, [f]: v } : e));

    const addTestimonial = () => set("testimonials", [...data.testimonials, { id: uid(), name: "", company: "", content: "", stars: 5 }]);
    const delTestimonial = id => set("testimonials", data.testimonials.filter(t => t.id !== id));
    const updTestimonial = (id, f, v) => set("testimonials", data.testimonials.map(t => t.id === id ? { ...t, [f]: v } : t));

    const addMedia = () => set("mediaLinks", [...data.mediaLinks, { id: uid(), title: "", url: "" }]);
    const delMedia = id => set("mediaLinks", data.mediaLinks.filter(m => m.id !== id));
    const updMedia = (id, f, v) => set("mediaLinks", data.mediaLinks.map(m => m.id === id ? { ...m, [f]: v } : m));

    const addFaq = () => set("faqs", [...data.faqs, { id: uid(), question: "", answer: "" }]);
    const delFaq = id => set("faqs", data.faqs.filter(f => f.id !== id));
    const updFaq = (id, f, v) => set("faqs", data.faqs.map(f => f.id === id ? { ...f, [f]: v } : f));
    const updFaqF = (id, field, v) => set("faqs", data.faqs.map(f => f.id === id ? { ...f, [field]: v } : f));

    const updHour = (i, f, v) => set("hours", data.hours.map((h, idx) => idx === i ? { ...h, [f]: v } : h));
    const addAmenity = () => { if (newAmenity.trim()) { set("amenities", [...data.amenities, newAmenity.trim()]); setNewAmenity(""); } };
    const delAmenity = i => set("amenities", data.amenities.filter((_, idx) => idx !== i));

    const t = THEMES[data.theme] || THEMES.blue;

    return (
        <div className="min-h-screen bg-gray-50 py-5 px-4 sm:px-6 lg:px-5">
            {/* Topbar */}
            <div className="flex justify-between items-center px-6 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.primary }}>
                        <Globe size={14} className="text-white" />
                    </div>
                    <span className="font-black text-gray-800 text-sm">Mini Website Builder</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex md:hidden border border-gray-200 rounded-lg overflow-hidden text-xs">
                        <button onClick={() => setTab("editor")} className={`px-3 py-1.5 flex items-center gap-1 font-semibold transition ${tab === "editor" ? "text-white" : "text-gray-500"}`}
                            style={tab === "editor" ? { background: t.primary } : {}}>
                            <Edit3 size={11} /> Edit
                        </button>
                        <button onClick={() => setTab("preview")} className={`px-3 py-1.5 flex items-center gap-1 font-semibold transition ${tab === "preview" ? "text-white" : "text-gray-500"}`}
                            style={tab === "preview" ? { background: t.primary } : {}}>
                            <Eye size={11} /> Preview
                        </button>
                    </div>
                    <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all"
                        style={{ background: saved ? "#22c55e" : t.primary }}>
                        {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save</>}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 mt-5">

                {/* Editor */}
                <div className={`flex-1 flex flex-col gap-3 min-w-0 ${tab === "preview" ? "hidden md:flex" : "flex"}`}>
                    <CollapseSection icon={Palette} title="🎨 Theme Color" color="text-purple-600">
                        <div className="grid grid-cols-6 gap-2">
                            {Object.entries(THEMES).map(([name, th]) => (
                                <button key={name} onClick={() => set("theme", name)} title={name}
                                    className={`w-full aspect-square rounded-xl border-4 transition-all ${data.theme === name ? "border-gray-800 scale-90 shadow-lg" : "border-transparent hover:scale-95"}`}
                                    style={{ background: `linear-gradient(135deg,${th.grad[0]},${th.grad[1]})` }} />
                            ))}
                        </div>
                        <p className="text-xs text-center text-gray-400">Selected: <span className="font-bold capitalize text-gray-700">{data.theme}</span></p>
                    </CollapseSection>

                    <CollapseSection icon={Megaphone} title="📢 Announcement Bar" color="text-orange-500" defaultOpen>
                        <Toggle label="Show Announcement Bar" checked={data.showSections.announcement} onChange={v => setShow("announcement", v)} />
                        <Toggle label="Active" checked={data.announcement.enabled} onChange={v => set("announcement", { ...data.announcement, enabled: v })} />
                        <FInput value={data.announcement.text} onChange={v => set("announcement", { ...data.announcement, text: v })} placeholder="🎉 Special offer this week!" />
                    </CollapseSection>

                    <CollapseSection icon={Briefcase} title="🏢 Business Info" color="text-blue-600">
                        <FInput label="Business Name" value={data.businessName} onChange={v => set("businessName", v)} placeholder="Your Business" />
                        <FInput label="Tagline" value={data.tagline} onChange={v => set("tagline", v)} placeholder="Short description" />
                        <FInput label="CTA Button Text" value={data.buttonText} onChange={v => set("buttonText", v)} placeholder="Contact Us" />
                        <FInput label="Logo URL" value={data.logo} onChange={v => set("logo", v)} placeholder="https://..." />
                    </CollapseSection>



                    <CollapseSection icon={ShoppingBag} title="🛍️ Products & Services" color="text-green-600">
                        <Toggle label="Show Section" checked={data.showSections.services} onChange={v => setShow("services", v)} />
                        {data.services.map(s => (
                            <Card key={s.id} onDelete={() => delService(s.id)}>
                                <FInput placeholder="Product / Service Name" value={s.name} onChange={v => updService(s.id, "name", v)} small />
                                <div className="grid grid-cols-2 gap-2">
                                    <FInput placeholder="Price e.g. ₹999" value={s.price} onChange={v => updService(s.id, "price", v)} small />
                                </div>
                                <FTA placeholder="Short description" value={s.desc} onChange={v => updService(s.id, "desc", v)} />
                                <FInput placeholder="Image URL (optional)" value={s.image} onChange={v => updService(s.id, "image", v)} small />
                            </Card>
                        ))}
                        <AddBtn onClick={addService} label="Add Product / Service" />
                    </CollapseSection>

                    <CollapseSection icon={Award} title="✅ Amenities" color="text-teal-600" defaultOpen={false}>
                        <Toggle label="Show Section" checked={data.showSections.amenities} onChange={v => setShow("amenities", v)} />
                        <div className="flex flex-wrap gap-1.5">
                            {data.amenities.map((a, i) => (
                                <span key={i} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                                    {a}
                                    <button onClick={() => delAmenity(i)} className="text-red-300 hover:text-red-500 ml-0.5 text-sm leading-none">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input value={newAmenity} onChange={e => setNewAmenity(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addAmenity()} placeholder="e.g. Free WiFi, Parking"
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            <button onClick={addAmenity} className="px-3 py-1.5 rounded-lg text-white text-xs font-bold" style={{ background: t.primary }}>Add</button>
                        </div>
                    </CollapseSection>

                    <CollapseSection icon={null} title="🕐 Business Hours" color="text-gray-600" defaultOpen={false}>
                        <Toggle label="Show Section" checked={data.showSections.hours} onChange={v => setShow("hours", v)} />
                        {data.hours.map((h, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <input value={h.day} onChange={e => updHour(i, "day", e.target.value)} className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none" />
                                <input value={h.time} onChange={e => updHour(i, "time", e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none" />
                                <button onClick={() => updHour(i, "open", !h.open)}
                                    className={`text-[10px] px-2 py-1 rounded-full font-bold shrink-0 ${h.open ? "bg-green-100 text-green-600" : "bg-red-100 text-red-400"}`}>
                                    {h.open ? "Open" : "Closed"}
                                </button>
                            </div>
                        ))}
                    </CollapseSection>

                    <CollapseSection icon={Users} title="👥 Team / Employees" color="text-indigo-600" defaultOpen={false}>
                        <Toggle label="Show Section" checked={data.showSections.employees} onChange={v => setShow("employees", v)} />
                        {data.employees.map(e => (
                            <Card key={e.id} onDelete={() => delEmployee(e.id)}>
                                <div className="grid grid-cols-2 gap-2">
                                    <FInput placeholder="Full Name" value={e.name} onChange={v => updEmployee(e.id, "name", v)} small />
                                    <FInput placeholder="Designation / Bio" value={e.bio} onChange={v => updEmployee(e.id, "bio", v)} small />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <FInput placeholder="Phone" value={e.phone} onChange={v => updEmployee(e.id, "phone", v)} small />
                                    <FInput placeholder="Email" value={e.email} onChange={v => updEmployee(e.id, "email", v)} small />
                                </div>
                                <FInput placeholder="Photo URL (optional)" value={e.image} onChange={v => updEmployee(e.id, "image", v)} small />
                            </Card>
                        ))}
                        <AddBtn onClick={addEmployee} label="Add Team Member" />
                    </CollapseSection>

                    <CollapseSection icon={Phone} title="📞 Contact Info" color="text-blue-500" defaultOpen={false}>
                        <Toggle label="Show Section" checked={data.showSections.contact} onChange={v => setShow("contact", v)} />
                        <FInput label="Phone" value={data.phone} onChange={v => set("phone", v)} placeholder="+91 00000 00000" />
                        <FInput label="Email" value={data.email} onChange={v => set("email", v)} placeholder="hello@business.com" />
                        <FInput label="Address" value={data.address} onChange={v => set("address", v)} placeholder="City, State" />
                        <FInput label="Website" value={data.website} onChange={v => set("website", v)} placeholder="www.business.com" />
                    </CollapseSection>

                    <CollapseSection icon={MessageSquare} title="⭐ Testimonials" color="text-yellow-600" defaultOpen={false}>
                        <Toggle label="Show Section" checked={data.showSections.testimonials} onChange={v => setShow("testimonials", v)} />
                        {data.testimonials.map(r => (
                            <Card key={r.id} onDelete={() => delTestimonial(r.id)}>
                                <div className="grid grid-cols-2 gap-2">
                                    <FInput placeholder="Person Name" value={r.name} onChange={v => updTestimonial(r.id, "name", v)} small />
                                    <FInput placeholder="Company (optional)" value={r.company} onChange={v => updTestimonial(r.id, "company", v)} small />
                                </div>
                                <FTA placeholder="What they said..." value={r.content} onChange={v => updTestimonial(r.id, "content", v)} />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Rating:</span>
                                    <StarRow count={r.stars} onChange={v => updTestimonial(r.id, "stars", v)} />
                                </div>
                            </Card>
                        ))}
                        <AddBtn onClick={addTestimonial} label="Add Testimonial" />
                    </CollapseSection>

                    <CollapseSection icon={FaYoutube} title="🎬 Media Links" color="text-red-600" defaultOpen={false}>
                        <Toggle label="Show Section" checked={data.showSections.mediaLinks} onChange={v => setShow("mediaLinks", v)} />
                        {data.mediaLinks.map(m => (
                            <Card key={m.id} onDelete={() => delMedia(m.id)}>
                                <FInput placeholder="Video Title" value={m.title} onChange={v => updMedia(m.id, "title", v)} small />
                                <FInput placeholder="YouTube URL e.g. https://youtube.com/watch?v=..." value={m.url} onChange={v => updMedia(m.id, "url", v)} small />
                            </Card>
                        ))}
                        <AddBtn onClick={addMedia} label="Add Video" />
                    </CollapseSection>

                    <CollapseSection icon={HelpCircle} title="❓ FAQ" color="text-cyan-600" defaultOpen={false}>
                        <Toggle label="Show Section" checked={data.showSections.faqs} onChange={v => setShow("faqs", v)} />
                        {data.faqs.map(f => (
                            <Card key={f.id} onDelete={() => delFaq(f.id)}>
                                <FInput placeholder="Question" value={f.question} onChange={v => updFaqF(f.id, "question", v)} small />
                                <FTA placeholder="Answer" value={f.answer} onChange={v => updFaqF(f.id, "answer", v)} />
                            </Card>
                        ))}
                        <AddBtn onClick={addFaq} label="Add FAQ" />
                    </CollapseSection>

                    <CollapseSection icon={FileText} title="📋 Google Form / Enquiry" color="text-emerald-600" defaultOpen={false}>
                        <Toggle label="Show Section" checked={data.showSections.googleForm} onChange={v => setShow("googleForm", v)} />
                        <FInput label="Google Form URL" value={data.googleFormLink} onChange={v => set("googleFormLink", v)} placeholder="https://forms.google.com/..." />
                    </CollapseSection>

                    <CollapseSection icon={FaInstagram} title="📱 Social Media" color="text-pink-600" defaultOpen={false}>
                        <Toggle label="Show Section" checked={data.showSections.social} onChange={v => setShow("social", v)} />
                        <FInput label="Instagram username" value={data.instagram} onChange={v => set("instagram", v)} placeholder="yourusername" />
                        <FInput label="Facebook page" value={data.facebook} onChange={v => set("facebook", v)} placeholder="yourpage" />
                        <FInput label="YouTube channel URL" value={data.youtube} onChange={v => set("youtube", v)} placeholder="https://youtube.com/@channel" />
                    </CollapseSection>
                </div>

                {/* Preview */}
                <div className={`md:w-[320px] shrink-0 ${tab === "editor" ? "hidden md:block" : "block"}`}>
                    <div className="sticky top-20">
                        <div className="flex items-center gap-2 mb-3 justify-center">
                            <Eye size={13} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</span>
                        </div>
                        <div className="mx-auto w-72.5">
                            <div className="rounded-[2.8rem] p-3 shadow-2xl" style={{ background: "#111827" }}>
                                <div className="flex justify-center py-2">
                                    <div className="w-16 h-4 rounded-full bg-black" />
                                </div>
                                <div
                                    className="rounded-[2rem] overflow-auto bg-white"
                                    style={{
                                        maxHeight: "68vh",
                                        overflowY: "auto",
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                    }}
                                >
                                    <Preview data={data} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 bg-white border border-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
                            <Link size={13} className="shrink-0" style={{ color: t.primary }} />
                            <span className="text-xs text-gray-400 truncate flex-1">
                                presence1.in/<span className="font-bold" style={{ color: t.primary }}>
                                    {data.businessName.toLowerCase().replace(/\s+/g, "-")}
                                </span>
                            </span>
                            <button className="text-xs font-bold hover:underline shrink-0" style={{ color: t.primary }}>Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}   