"use client";

import { useState, useEffect, useRef } from "react";
import {
    Phone, Mail, MapPin, Globe, Clock, MessageCircle,
    Share2, ChevronDown, ChevronUp, Star, Zap, BadgeCheck,
    ArrowRight, ExternalLink, PlayCircle, ChevronLeft, X, CheckCircle2,
    Users, Briefcase, ChevronRight, Volume2, Link2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

/* ─────────────────────────────
   THEME CONFIG
───────────────────────────── */
const THEMES = {
    blue: { primary: "#3b82f6", glow: "bg-blue-600/15", ring: "border-blue-500/30", grad: "from-blue-600 to-cyan-600", text: "text-blue-400", badge: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
    violet: { primary: "#8b5cf6", glow: "bg-violet-600/15", ring: "border-violet-500/30", grad: "from-violet-600 to-fuchsia-600", text: "text-violet-400", badge: "bg-violet-500/15 text-violet-400 border-violet-500/25" },
    green: { primary: "#10b981", glow: "bg-emerald-600/15", ring: "border-emerald-500/30", grad: "from-emerald-600 to-teal-600", text: "text-emerald-400", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
    orange: { primary: "#f97316", glow: "bg-orange-600/15", ring: "border-orange-500/30", grad: "from-orange-500 to-rose-500", text: "text-orange-400", badge: "bg-orange-500/15 text-orange-400 border-orange-500/25" },
    rose: { primary: "#f43f5e", glow: "bg-rose-600/15", ring: "border-rose-500/30", grad: "from-rose-500 to-pink-600", text: "text-rose-400", badge: "bg-rose-500/15 text-rose-400 border-rose-500/25" },
};

/* ─────────────────────────────
   HELPERS
───────────────────────────── */
function uid() { return Math.random().toString(36).slice(2, 9); }

function StarRow({ rating, size = "w-3.5 h-3.5" }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`${size} ${i < rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`} />
            ))}
        </div>
    );
}

function Divider({ label }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
            <div className="h-px flex-1 bg-white/5" />
        </div>
    );
}

function FAQItem({ q, a, theme }) {
    const [open, setOpen] = useState(false);
    const t = THEMES[theme] || THEMES.blue;
    return (
        <div className="bg-[#131320] border border-white/8 rounded-2xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
            >
                <span className="text-white text-sm font-medium pr-4 leading-snug">{q}</span>
                {open
                    ? <ChevronUp className={`w-4 h-4 ${t.text} flex-shrink-0`} />
                    : <ChevronDown className="w-4 h-4 text-zinc-600 flex-shrink-0" />}
            </button>
            {open && (
                <div className="px-5 pb-4 border-t border-white/5">
                    <p className="text-zinc-400 text-sm leading-relaxed pt-3">{a}</p>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────
   DEFAULT DATA
───────────────────────────── */
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

/* ─────────────────────────────
   MAIN PAGE
───────────────────────────── */
export default function MiniWebsitePage({ data = DEFAULT, params }) {
    const b = { ...DEFAULT, ...data };
    const t = THEMES[b.theme] || THEMES.blue;
    const ss = b.showSections;

    const [scrolled, setScrolled] = useState(false);
    const [announce, setAnnounce] = useState(true);
    const [activeTab, setActiveTab] = useState("services");

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveTab(id);
    };

    const call = () => (window.location.href = `tel:${b.phone}`);
    const whatsapp = () => window.open(`https://wa.me/${b.phone.replace(/\D/g, "")}?text=Hi, I want to enquire about your services`, "_blank");
    const openLink = (u) => window.open(u.startsWith("http") ? u : `https://${u}`, "_blank");

    /* tab list — only show enabled sections */
    const tabs = [
        ss.services && { id: "services", label: "Services" },
        ss.employees && { id: "team", label: "Team" },
        ss.testimonials && { id: "reviews", label: "Reviews" },
        ss.hours && { id: "hours", label: "Hours" },
        ss.amenities && { id: "amenities", label: "Amenities" },
        ss.faqs && { id: "faq", label: "FAQ" },
        ss.contact && { id: "contact", label: "Contact" },
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-[#0c0c14] text-white font-sans max-w-md mx-auto relative">

            {/* ambient glow */}
            <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-80 h-80 ${t.glow} rounded-full blur-[100px] pointer-events-none z-0`} />
            <div className="fixed bottom-0 right-0 w-56 h-56 bg-fuchsia-600/5 rounded-full blur-[80px] pointer-events-none z-0" />

            {/* ────── ANNOUNCEMENT BANNER ────── */}
            {ss.announcement && b.announcement.enabled && announce && (
                <div style={{ backgroundColor: t.primary + "22", borderColor: t.primary + "44" }}
                    className="relative z-30 border-b px-4 py-2.5 flex items-center gap-3">
                    <Volume2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.primary }} />
                    <p className="text-zinc-200 text-xs flex-1 leading-relaxed">{b.announcement.text}</p>
                    <button onClick={() => setAnnounce(false)} className="text-zinc-500 hover:text-white transition-colors flex-shrink-0">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* ────── STICKY NAV ────── */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0c0c14]/90 backdrop-blur-xl border-b border-white/5 shadow-xl" : "bg-transparent"}`}>
                <div className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: t.primary + "33", border: `1px solid ${t.primary}55` }}>
                            <Zap className="w-3.5 h-3.5" style={{ color: t.primary }} />
                        </div>
                        <span className="text-white text-sm font-bold tracking-tight truncate max-w-[140px]">{b.businessName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={whatsapp} className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-full"
                            style={{ background: `linear-gradient(135deg, #25D366, #128C7E)` }}>
                            <MessageCircle className="w-3 h-3" />
                            {b.buttonText}
                        </button>
                        <button onClick={async () => {
                            if (navigator.share) { try { await navigator.share({ title: b.businessName, url: window.location.href }); } catch { } }
                            else { navigator.clipboard.writeText(window.location.href); }
                        }} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                    </div>
                </div>

                {/* section tabs */}
                <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => scrollTo(tab.id)}
                            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${activeTab === tab.id ? "text-white shadow-lg" : "bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
                                }`}
                            style={activeTab === tab.id ? { background: `linear-gradient(135deg, ${t.primary}, ${t.primary}bb)`, boxShadow: `0 4px 12px ${t.primary}40` } : {}}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* ────── HERO ────── */}
            <section className="relative px-5 pt-6 pb-8 overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at top, ${t.primary}55, transparent 70%)` }} />
                {/* decorative ring */}
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-white/4 pointer-events-none" />
                <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full border border-white/4 pointer-events-none" />

                <div className="relative flex items-start gap-4 mb-6">
                    {/* Logo / Avatar */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl border-2"
                        style={{ borderColor: t.primary + "55" }}>
                        {b.logo
                            ? <Image src={b.logo} alt={b.businessName} width={80} height={80} className="object-cover w-full h-full" />
                            : (
                                <div className="w-full h-full flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.primary}88)` }}>
                                    <span className="text-white text-3xl font-black">{b.businessName.charAt(0)}</span>
                                </div>
                            )}
                    </div>

                    <div className="flex-1 pt-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            <h1 className="text-white text-xl font-black leading-tight truncate">{b.businessName}</h1>
                            <BadgeCheck className="w-5 h-5 flex-shrink-0" style={{ color: t.primary }} />
                        </div>
                        <p className="text-zinc-400 text-sm mb-3 leading-snug">{b.tagline}</p>
                        {b.website && (
                            <button onClick={() => openLink(b.website)}
                                className="flex items-center gap-1.5 text-xs font-medium hover:underline"
                                style={{ color: t.primary }}>
                                <Globe className="w-3 h-3" />
                                {b.website}
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick action buttons */}
                <div className="flex gap-2.5 mb-4">
                    <button onClick={whatsapp}
                        className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg active:scale-[0.98] transition-all"
                        style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", boxShadow: "0 6px 20px #25D36630" }}>
                        <MessageCircle className="w-4 h-4" />
                        {b.buttonText}
                    </button>
                    <button onClick={call}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border transition-all hover:bg-white/10"
                        style={{ background: t.primary + "18", borderColor: t.primary + "44", color: t.primary }}>
                        <Phone className="w-4 h-4" />
                        Call
                    </button>
                </div>

                {/* Amenity pill strip */}
                {ss.amenities && b.amenities.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
                        {b.amenities.map((a) => (
                            <div key={a} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/8">
                                <CheckCircle2 className="w-3 h-3" style={{ color: t.primary }} />
                                <span className="text-zinc-300 text-[11px] font-medium whitespace-nowrap">{a}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ────── SERVICES ────── */}
            {ss.services && b.services.length > 0 && (
                <section id="services" className="px-4 pt-6 pb-6 scroll-mt-28">
                    <Divider label="Services" />
                    <div className="space-y-3">
                        {b.services.map((svc) => (
                            <div key={svc.id} onClick={whatsapp}
                                className="flex items-center gap-4 bg-[#131320] border border-white/8 rounded-2xl p-4 cursor-pointer hover:border-white/15 active:scale-[0.99] transition-all"
                                style={{ '--hover-border': t.primary }}>
                                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/8"
                                    style={{ background: t.primary + "18" }}>
                                    {svc.image
                                        ? <Image src={svc.image} alt={svc.name} width={56} height={56} className="object-cover w-full h-full" />
                                        : <div className="w-full h-full flex items-center justify-center">
                                            <Briefcase className="w-6 h-6" style={{ color: t.primary }} />
                                        </div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm">{svc.name}</p>
                                    <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{svc.desc}</p>
                                    <p className="text-xs font-bold mt-1.5" style={{ color: t.primary }}>{svc.price}</p>
                                </div>
                                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ────── TEAM / EMPLOYEES ────── */}
            {ss.employees && b.employees.length > 0 && (
                <section id="team" className="px-4 pt-2 pb-6 scroll-mt-28">
                    <Divider label="Our Team" />
                    <div className="space-y-3">
                        {b.employees.map((emp) => (
                            <div key={emp.id} className="bg-[#131320] border border-white/8 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                                    {emp.image
                                        ? <Image src={emp.image} alt={emp.name} width={56} height={56} className="object-cover w-full h-full" />
                                        : <div className="w-full h-full flex items-center justify-center"
                                            style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.primary}88)` }}>
                                            <span className="text-white text-lg font-black">{emp.name.charAt(0)}</span>
                                        </div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm">{emp.name}</p>
                                    <p className="text-zinc-500 text-xs mt-0.5">{emp.bio}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        {emp.phone && (
                                            <button onClick={() => (window.location.href = `tel:${emp.phone}`)}
                                                className="flex items-center gap-1 text-xs font-medium"
                                                style={{ color: t.primary }}>
                                                <Phone className="w-3 h-3" /> Call
                                            </button>
                                        )}
                                        {emp.email && (
                                            <button onClick={() => window.open(`mailto:${emp.email}`)}
                                                className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                                                <Mail className="w-3 h-3" /> Email
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ────── TESTIMONIALS ────── */}
            {ss.testimonials && b.testimonials.length > 0 && (
                <section id="reviews" className="px-4 pt-2 pb-6 scroll-mt-28">
                    <Divider label="Reviews" />
                    <div className="space-y-3">
                        {b.testimonials.map((rv) => (
                            <div key={rv.id} className="bg-[#131320] border border-white/8 rounded-2xl p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.primary}88)` }}>
                                        <span className="text-white text-sm font-black">{rv.name.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-white text-sm font-bold">{rv.name}</p>
                                        </div>
                                        {rv.company && <p className="text-zinc-600 text-xs">{rv.company}</p>}
                                        <StarRow rating={rv.stars} size="w-3 h-3" />
                                    </div>
                                    <span className="text-xl">"</span>
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed italic">{rv.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ────── MEDIA LINKS ────── */}
            {ss.mediaLinks && b.mediaLinks.length > 0 && (
                <section className="px-4 pt-2 pb-6">
                    <Divider label="Media" />
                    <div className="space-y-2.5">
                        {b.mediaLinks.map((m) => {
                            const isYt = m.url.includes("youtube.com") || m.url.includes("youtu.be");
                            return (
                                <button key={m.id} onClick={() => openLink(m.url)}
                                    className="w-full flex items-center gap-3.5 bg-[#131320] border border-white/8 rounded-2xl px-4 py-3.5 hover:bg-white/5 active:scale-[0.99] transition-all">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: isYt ? "#ff000022" : t.primary + "22", border: isYt ? "1px solid #ff000044" : `1px solid ${t.primary}44` }}>
                                        {isYt
                                            ? <PlayCircle className="w-5 h-5 text-red-400" />
                                            : <Link2 className="w-5 h-5" style={{ color: t.primary }} />}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-white text-sm font-semibold truncate">{m.title}</p>
                                        <p className="text-zinc-600 text-xs truncate">{m.url}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ────── HOURS ────── */}
            {ss.hours && b.hours.length > 0 && (
                <section id="hours" className="px-4 pt-2 pb-6 scroll-mt-28">
                    <Divider label="Working Hours" />
                    <div className="bg-[#131320] border border-white/8 rounded-2xl overflow-hidden">
                        {b.hours.map((h, i) => (
                            <div key={h.day}
                                className={`flex items-center justify-between px-5 py-4 ${i < b.hours.length - 1 ? "border-b border-white/5" : ""}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${h.open ? "" : "bg-zinc-700"}`}
                                        style={h.open ? { background: t.primary } : {}} />
                                    <span className="text-zinc-300 text-sm">{h.day}</span>
                                </div>
                                <span className={`text-sm font-semibold ${h.open ? "text-white" : "text-zinc-600"}`}>{h.time}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ────── AMENITIES (full grid) ────── */}
            {ss.amenities && b.amenities.length > 0 && (
                <section id="amenities" className="px-4 pt-2 pb-6 scroll-mt-28">
                    <Divider label="What We Offer" />
                    <div className="grid grid-cols-2 gap-2.5">
                        {b.amenities.map((am) => (
                            <div key={am} className="flex items-center gap-3 bg-[#131320] border border-white/8 rounded-2xl px-4 py-3">
                                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: t.primary }} />
                                <span className="text-zinc-300 text-sm font-medium">{am}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ────── FAQ ────── */}
            {ss.faqs && b.faqs.length > 0 && (
                <section id="faq" className="px-4 pt-2 pb-6 scroll-mt-28">
                    <Divider label="FAQ" />
                    <div className="space-y-2.5">
                        {b.faqs.map((faq) => (
                            <FAQItem key={faq.id} q={faq.question} a={faq.answer} theme={b.theme} />
                        ))}
                    </div>
                </section>
            )}

            {/* ────── CONTACT ────── */}
            {ss.contact && (
                <section id="contact" className="px-4 pt-2 pb-6 scroll-mt-28">
                    <Divider label="Contact Us" />
                    <div className="bg-[#131320] border border-white/8 rounded-2xl overflow-hidden mb-3">
                        {[
                            b.phone && { icon: Phone, label: "Phone", value: b.phone, action: call, color: "sky" },
                            b.email && { icon: Mail, label: "Email", value: b.email, action: () => window.open(`mailto:${b.email}`), color: "violet" },
                            b.address && { icon: MapPin, label: "Address", value: b.address, action: () => openLink(`https://maps.google.com?q=${encodeURIComponent(b.address)}`), color: "amber" },
                            b.website && { icon: Globe, label: "Website", value: b.website, action: () => openLink(b.website), color: "emerald" },
                        ].filter(Boolean).map((row, i, arr) => (
                            <button key={row.label} onClick={row.action}
                                className={`w-full flex items-center gap-3.5 px-4 py-4 text-left hover:bg-white/3 transition-colors ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}>
                                <div className={`w-9 h-9 rounded-xl bg-${row.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                                    <row.icon className={`w-4 h-4 text-${row.color}-400`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-zinc-500 text-xs">{row.label}</p>
                                    <p className="text-zinc-200 text-sm font-medium truncate mt-0.5">{row.value}</p>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-zinc-700" />
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* ────── SOCIAL ────── */}
            {ss.social && (b.instagram || b.facebook || b.youtube) && (
                <section className="px-4 pt-0 pb-6">
                    <Divider label="Follow Us" />
                    <div className="flex gap-2.5">
                        {b.instagram && (
                            <button onClick={() => openLink(`https://instagram.com/${b.instagram}`)}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm border bg-pink-500/10 border-pink-500/20 text-pink-400 hover:bg-pink-500/20 transition-all">
                                <FaInstagram className="w-4 h-4" /> Instagram
                            </button>
                        )}
                        {b.facebook && (
                            <button onClick={() => openLink(`https://facebook.com/${b.facebook}`)}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm border bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all">
                                <FaFacebook className="w-4 h-4" /> Facebook
                            </button>
                        )}
                        {b.youtube && (
                            <button onClick={() => openLink(`https://youtube.com/@${b.youtube}`)}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm border bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                                <FaYoutube className="w-4 h-4" /> YouTube
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* ────── GOOGLE FORM ────── */}
            {ss.googleForm && b.googleFormLink && (
                <section className="px-4 pt-0 pb-6">
                    <Divider label="Book / Enquire" />
                    <button onClick={() => openLink(b.googleFormLink)}
                        className="w-full flex items-center justify-between rounded-2xl px-5 py-4 border transition-all hover:opacity-90"
                        style={{ background: t.primary + "18", borderColor: t.primary + "44" }}>
                        <div className="text-left">
                            <p className="text-white text-sm font-bold">Fill Enquiry Form</p>
                            <p className="text-zinc-500 text-xs mt-0.5">We'll get back within 2 hours</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: t.primary + "33", border: `1px solid ${t.primary}55` }}>
                            <ArrowRight className="w-4 h-4" style={{ color: t.primary }} />
                        </div>
                    </button>
                </section>
            )}

            {/* ────── FOOTER ────── */}
            <footer className="px-4 pt-2 pb-28 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: t.primary }}>
                        <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-zinc-500 text-xs">Powered by Presence1</span>
                </div>
                <p className="text-zinc-700 text-[10px]">© 2025 {b.businessName} · All rights reserved</p>
            </footer>

            {/* ────── STICKY BOTTOM BAR ────── */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 pb-6 pt-3 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/90 to-transparent">
                <div className="flex gap-2.5">
                    <button onClick={call}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border bg-white/5 border-white/10 text-white hover:bg-white/10 active:scale-[0.98] transition-all">
                        <Phone className="w-4 h-4" /> Call Now
                    </button>
                    <button onClick={whatsapp}
                        className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm text-white active:scale-[0.98] transition-all shadow-lg"
                        style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", boxShadow: "0 6px 20px #25D36630" }}>
                        <MessageCircle className="w-4 h-4" />
                        Chat on WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}