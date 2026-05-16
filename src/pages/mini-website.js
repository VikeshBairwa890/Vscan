"use client";

import { useState } from "react";
import {
    Globe, Save, Eye, Edit3, Link, Mail, Phone, MapPin,
    Plus, Trash2, ChevronDown, ChevronUp, Star,
    Clock, Image as ImageIcon, Users,
    MessageSquare, HelpCircle, Sparkles, Megaphone, Grid, ExternalLink,
    Wifi, Coffee, Utensils, Dumbbell, Wind, Shield, Tv, Music, Leaf,
    Baby, Car, X, CheckCircle2,
    ImagesIcon,
} from "lucide-react";

// ─── THEMES (12 colours) ─────────────────────────────────────────────────────
const THEMES = {
    ocean: { p: "#0ea5e9", d: "#0369a1", l: "#f0f9ff", g: "from-sky-500 to-blue-600" },
    violet: { p: "#7c3aed", d: "#5b21b6", l: "#f5f3ff", g: "from-violet-600 to-purple-500" },
    emerald: { p: "#059669", d: "#065f46", l: "#ecfdf5", g: "from-emerald-500 to-teal-600" },
    rose: { p: "#e11d48", d: "#9f1239", l: "#fff1f2", g: "from-rose-500 to-pink-600" },
    amber: { p: "#d97706", d: "#92400e", l: "#fffbeb", g: "from-amber-500 to-orange-500" },
    slate: { p: "#475569", d: "#1e293b", l: "#f8fafc", g: "from-slate-600 to-gray-700" },
    indigo: { p: "#4f46e5", d: "#3730a3", l: "#eef2ff", g: "from-indigo-500 to-blue-600" },
    fuchsia: { p: "#a21caf", d: "#701a75", l: "#fdf4ff", g: "from-fuchsia-600 to-purple-600" },
    lime: { p: "#65a30d", d: "#3f6212", l: "#f7fee7", g: "from-lime-500 to-green-500" },
    cyan: { p: "#0891b2", d: "#164e63", l: "#ecfeff", g: "from-cyan-500 to-sky-600" },
    crimson: { p: "#dc2626", d: "#991b1b", l: "#fef2f2", g: "from-red-600 to-rose-500" },
    gold: { p: "#b45309", d: "#78350f", l: "#fefce8", g: "from-yellow-500 to-amber-600" },
};

const AMENITIES = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Car, label: "Parking" },
    { icon: Coffee, label: "Coffee" },
    { icon: Utensils, label: "Food" },
    { icon: Dumbbell, label: "Gym" },
    { icon: Wind, label: "AC" },
    { icon: Shield, label: "Security" },
    { icon: Tv, label: "TV" },
    { icon: Music, label: "Music" },
    { icon: Leaf, label: "Garden" },
    { icon: Baby, label: "Kid Friendly" },
];

const uid = () => Math.random().toString(36).slice(2, 8);

const DEF = {
    name: "Vikesh Studio", tagline: "Professional Services You Can Trust",
    logo: "", phone: "+91 98765 43210", email: "hello@vikesh.in",
    address: "123 MG Road, Jaipur, Rajasthan", website: "www.vikesh.in",
    cta: "Contact Us", theme: "violet",
    announcement: { on: true, text: "🎉 Special 20% off this month! Book now.", color: "#7c3aed", link: "" },
    products: [
        { id: uid(), name: "Web Design Package", price: "₹5,000", desc: "Responsive modern website for your brand.", image: "" },
        { id: uid(), name: "SEO Management", price: "₹3,000", desc: "Rank higher and grow organic traffic.", image: "" },
    ],
    employees: [
        { id: uid(), name: "Vikesh Sharma", bio: "Founder & CEO", phone: "+91 98765 43210", email: "vikesh@studio.in", photo: "" },
        { id: uid(), name: "Priya Mehta", bio: "Lead Designer", phone: "+91 91234 56789", email: "priya@studio.in", photo: "" },
    ],
    testimonials: [
        { id: uid(), name: "Ravi Kumar", company: "TechMart Pvt Ltd", content: "Brilliant service! Our traffic doubled.", stars: 5 },
        { id: uid(), name: "Sonal Joshi", company: "", content: "Professional team, delivered on time. 👏", stars: 5 },
    ],
    media: [
        { id: uid(), title: "Studio Tour 2024", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
    faqs: [
        { id: uid(), q: "How long does a website take?", a: "Typically 5–10 business days depending on scope." },
        { id: uid(), q: "Do you offer support after launch?", a: "Yes! 30 days of free support post-launch." },
    ],
    amenities: ["Free WiFi", "Parking", "AC", "Coffee"],
    formUrl: "",
    social: { instagram: "vikesh.studio", facebook: "vikeshstudio", youtube: "", twitter: "", linkedin: "" },
    hours: [
        { day: "Mon – Fri", time: "9:00 AM – 7:00 PM", open: true },
        { day: "Saturday", time: "10:00 AM – 5:00 PM", open: true },
        { day: "Sunday", time: "Closed", open: false },
    ],
    show: {
        announcement: true, products: true, employees: true, amenities: true,
        testimonials: true, media: true, faq: true, form: false, contact: true, social: true, hours: true,
    },
};

// ─── Atoms ────────────────────────────────────────────────────────────────────
function Stars({ n, onSet }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={onSet ? 18 : 11}
                    fill={i <= n ? "#facc15" : "none"}
                    className={`${i <= n ? "text-yellow-400" : "text-gray-300"} ${onSet ? "cursor-pointer" : ""}`}
                    onClick={() => onSet && onSet(i)} />
            ))}
        </div>
    );
}

function getYtId(url) { const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/); return m ? m[1] : null; }

function Sec({ icon, title, children, open: initOpen = true }) {
    const [open, setOpen] = useState(initOpen);
    return (
        <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <button onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-700 transition">
                <span className="flex items-center gap-2 text-left">{icon}{title}</span>
                {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {open && <div className="p-4 bg-white flex flex-col gap-3">{children}</div>}
        </div>
    );
}

function Inp({ label, value, onChange, placeholder, type = "text" }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{label}</label>}
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" />
        </div>
    );
}

function Tgl({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between cursor-pointer select-none">
            <span className="text-sm text-gray-600 font-medium">{label}</span>
            <div onClick={() => onChange(!checked)}
                className={`w-11 h-6 rounded-full relative transition-colors ${checked ? "bg-blue-500" : "bg-gray-200"}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-6" : "left-1"}`} />
            </div>
        </label>
    );
}

function Card({ children, onDel }) {
    return (
        <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 relative flex flex-col gap-2">
            <button onClick={onDel} className="absolute top-2 right-2 text-gray-300 hover:text-red-400 transition"><Trash2 size={13} /></button>
            {children}
        </div>
    );
}

function AddBtn({ label, onClick }) {
    return (
        <button onClick={onClick}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 border border-dashed border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 transition w-fit">
            <Plus size={12} />{label}
        </button>
    );
}

function SHead({ color, icon, label }) {
    return (
        <div className="flex items-center gap-1.5 mb-1">
            <span style={{ color }}>{icon}</span>
            <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">{label}</span>
        </div>
    );
}

// ─── PREVIEW ─────────────────────────────────────────────────────────────────
function Preview({ d }) {
    const t = THEMES[d.theme];
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="bg-white" style={{ fontFamily: "'Segoe UI',sans-serif", fontSize: 13 }}>

            {/* Announcement */}
            {d.show.announcement && d.announcement.on && d.announcement.text && (
                <div className="text-white text-center text-[11px] py-2 px-3 font-semibold leading-snug"
                    style={{ background: d.announcement.color }}>{d.announcement.text}</div>
            )}

            {/* Hero */}
            <div className={`bg-linear-to-br ${t.g} px-5 pt-7 pb-10 text-white text-center`}>
                <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {d.logo
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={d.logo} alt="" className="w-full h-full object-cover" />
                        : <span className="text-2xl font-black text-white/90">{d.name.charAt(0)}</span>}
                </div>
                <h1 className="text-[20px] font-black tracking-tight leading-tight">{d.name}</h1>
                <p className="text-white/75 text-xs mt-1">{d.tagline}</p>
                <button className="mt-4 bg-white text-xs font-bold px-6 py-2.5 rounded-full shadow-lg"
                    style={{ color: t.d }}>{d.cta}</button>
            </div>
            <svg viewBox="0 0 400 22" className="w-full" preserveAspectRatio="none" height="22">
                <path d="M0,11 Q100,22 200,11 Q300,0 400,11 L400,0 L0,0 Z" fill={t.p} />
            </svg>

            <div className="px-4 pb-8 flex flex-col gap-5 mt-2">

                {/* Products */}
                {d.show.products && d.products.length > 0 && (
                    <div>
                        <SHead color={t.p} icon={<Grid size={12} />} label="Products & Services" />
                        <div className="flex flex-col gap-2.5">
                            {d.products.map(p => (
                                <div key={p.id} className="rounded-xl border border-gray-100 overflow-hidden">
                                    {p.image
                                        // eslint-disable-next-line @next/next/no-img-element
                                        ? <img src={p.image} alt={p.name} className="w-full h-28 object-cover" />
                                        : <div className="w-full h-16 flex items-center justify-center" style={{ background: t.l }}>
                                            <ImageIcon size={20} style={{ color: t.p, opacity: .3 }} />
                                        </div>}
                                    <div className="p-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="font-bold text-gray-800 text-xs leading-tight">{p.name || "Product Name"}</span>
                                            {p.price && <span className="text-xs font-black shrink-0" style={{ color: t.p }}>{p.price}</span>}
                                        </div>
                                        {p.desc && <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{p.desc}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Team */}
                {d.show.employees && d.employees.length > 0 && (
                    <div>
                        <SHead color={t.p} icon={<Users size={12} />} label="Our Team" />
                        <div className="flex flex-col gap-2">
                            {d.employees.map(e => (
                                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100" style={{ background: t.l }}>
                                    <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden border-2 border-white shadow" style={{ background: t.p }}>
                                        {e.photo
                                            // eslint-disable-next-line @next/next/no-img-element
                                            ? <img src={e.photo} alt={e.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-white font-black text-sm">{e.name.charAt(0) || "?"}</div>}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-800 text-xs truncate">{e.name || "Name"}</p>
                                        <p className="text-[11px] text-gray-400">{e.bio}</p>
                                        {e.phone && <p className="text-[11px] font-semibold mt-0.5" style={{ color: t.p }}>{e.phone}</p>}
                                        {e.email && <p className="text-[11px] text-gray-400 truncate">{e.email}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Amenities */}
                {d.show.amenities && d.amenities.length > 0 && (
                    <div>
                        <SHead color={t.p} icon={<Sparkles size={12} />} label="Amenities" />
                        <div className="flex flex-wrap gap-1.5">
                            {d.amenities.map(a => {
                                const opt = AMENITIES.find(o => o.label === a);
                                const Icon = opt?.icon || Sparkles;
                                return (
                                    <div key={a} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border"
                                        style={{ background: t.l, color: t.p, borderColor: t.p + "33" }}>
                                        <Icon size={10} />{a}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Testimonials */}
                {d.show.testimonials && d.testimonials.length > 0 && (
                    <div>
                        <SHead color={t.p} icon={<MessageSquare size={12} />} label="What Clients Say" />
                        <div className="flex flex-col gap-2">
                            {d.testimonials.map(r => (
                                <div key={r.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                                    <Stars n={r.stars} />
                                    <p className="text-[11px] text-gray-500 mt-1 italic leading-relaxed">{r.content}</p>
                                    <p className="text-[11px] font-bold text-gray-700 mt-1.5">
                                        — {r.name}{r.company && <span className="font-normal text-gray-400">, {r.company}</span>}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Media */}
                {d.show.media && d.media.length > 0 && (
                    <div>
                        <SHead color={t.p} icon={<ImagesIcon size={12} />} label="Media" />
                        <div className="flex flex-col gap-2">
                            {d.media.map(m => {
                                const ytId = getYtId(m.url);
                                return (
                                    <div key={m.id} className="rounded-xl overflow-hidden border border-gray-100">
                                        {ytId
                                            ? <iframe width="100%" height="155" src={`https://www.youtube.com/embed/${ytId}`}
                                                title={m.title} frameBorder="0" allowFullScreen />
                                            : <a href={m.url} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-2 px-3 py-3 text-xs font-semibold text-blue-600 bg-gray-50 hover:underline">
                                                <ExternalLink size={11} />{m.title || m.url}
                                            </a>}
                                        {m.title && ytId && <p className="px-3 py-2 text-[11px] font-semibold text-gray-600">{m.title}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* FAQ */}
                {d.show.faq && d.faqs.length > 0 && (
                    <div>
                        <SHead color={t.p} icon={<HelpCircle size={12} />} label="FAQ" />
                        <div className="flex flex-col gap-1.5">
                            {d.faqs.map((f, i) => (
                                <div key={f.id} className="border border-gray-100 rounded-xl overflow-hidden">
                                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full text-left px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-gray-700">
                                        <span className="pr-2">{f.q || "Question"}</span>
                                        {openFaq === i ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                    </button>
                                    {openFaq === i && <div className="px-3 pb-3 text-[11px] text-gray-500 leading-relaxed border-t border-gray-50 pt-2">{f.a}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form */}
                {d.show.form && d.formUrl && (
                    <div>
                        <SHead color={t.p} icon={<ExternalLink size={12} />} label="Quick Form" />
                        <a href={d.formUrl} target="_blank" rel="noreferrer"
                            className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-xs font-bold w-full"
                            style={{ background: t.p }}>
                            <ExternalLink size={12} /> Fill Our Form
                        </a>
                    </div>
                )}

                {/* Hours */}
                {d.show.hours && (
                    <div>
                        <SHead color={t.p} icon={<Clock size={12} />} label="Business Hours" />
                        <div className="flex flex-col gap-1.5">
                            {d.hours.map((h, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                    <span className="text-gray-500">{h.day}</span>
                                    <span className="font-semibold" style={h.open ? { color: t.p } : { color: "#f87171" }}>{h.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact */}
                {d.show.contact && (
                    <div>
                        <SHead color={t.p} icon={<Phone size={12} />} label="Contact" />
                        <div className="flex flex-col gap-1.5">
                            {[{ I: Phone, v: d.phone }, { I: Mail, v: d.email }, { I: MapPin, v: d.address }, { I: Globe, v: d.website }]
                                .filter(r => r.v).map(({ I, v }) => (
                                    <div key={v} className="flex items-center gap-2 text-[11px] text-gray-600">
                                        <I size={10} style={{ color: t.p, flexShrink: 0 }} />{v}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Social */}
                {d.show.social && Object.values(d.social).some(Boolean) && (
                    <div>
                        <SHead color={t.p} icon={<ImagesIcon size={12} />} label="Follow Us" />
                        <div className="flex flex-wrap gap-1.5">
                            {d.social.instagram && <Chip icon={ImagesIcon} label={d.social.instagram} cls="bg-gradient-to-r from-pink-500 to-orange-400" />}
                            {d.social.facebook && <Chip icon={ImagesIcon} label={d.social.facebook} cls="bg-blue-600" />}
                            {d.social.youtube && <Chip icon={ImagesIcon} label={d.social.youtube} cls="bg-red-600" />}
                            {d.social.twitter && <Chip icon={ImagesIcon} label={d.social.twitter} cls="bg-sky-500" />}
                            {d.social.linkedin && <Chip icon={ImagesIcon} label={d.social.linkedin} cls="bg-blue-700" />}
                        </div>
                    </div>
                )}

                <p className="text-center text-[10px] text-gray-300 pt-2 border-t border-gray-50">
                    Powered by <span className="font-black" style={{ color: t.p }}>Presence1</span>
                </p>
            </div>
        </div>
    );
}

function Chip({ icon: Icon, label, cls }) {
    return (
        <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-white text-[11px] font-semibold ${cls}`}>
            <Icon size={10} />{label}
        </div>
    );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function MiniWebsiteBuilder() {
    const [d, setD] = useState(DEF);
    const [tab, setTab] = useState("editor");
    const [saved, setSaved] = useState(false);

    const upd = (k, v) => setD(p => ({ ...p, [k]: v }));
    const updN = (k, s, v) => setD(p => ({ ...p, [k]: { ...p[k], [s]: v } }));
    const show = (k, v) => setD(p => ({ ...p, show: { ...p.show, [k]: v } }));

    const updArr = (key, id, f, v) => upd(key, d[key].map(x => x.id === id ? { ...x, [f]: v } : x));
    const delArr = (key, id) => upd(key, d[key].filter(x => x.id !== id));

    const t = THEMES[d.theme];

    const QUICK_SHOWS = [
        ["announcement", "📢 Announcement"], ["products", "💼 Products"],
        ["employees", "👥 Team"], ["amenities", "✨ Amenities"],
        ["testimonials", "⭐ Reviews"], ["media", "🎬 Media"],
        ["faq", "❓ FAQ"], ["form", "📋 Form"], ["hours", "🕐 Hours"],
        ["contact", "📞 Contact"], ["social", "📱 Social"],
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="flex items-center justify-between  w-full p-2 border-b h-19 z-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: t.p }}>
                        <Globe size={14} className="text-white" />
                    </div>
                    <span className="font-black text-gray-800 text-sm">Mini Website Builder</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex md:hidden border border-gray-200 rounded-lg overflow-hidden text-xs">
                        {["editor", "preview"].map(tb => (
                            <button key={tb} onClick={() => setTab(tb)}
                                className={`px-3 py-1.5 flex items-center gap-1 font-semibold capitalize transition ${tab === tb ? "text-white" : "text-gray-400"}`}
                                style={tab === tb ? { background: t.p } : {}}>
                                {tb === "editor" ? <Edit3 size={11} /> : <Eye size={11} />}{tb}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all ${saved ? "bg-green-500" : ""}`}
                        style={!saved ? { background: t.p } : {}}>
                        {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save</>}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 p-4 md:p-6">

                {/* ── EDITOR ── */}
                <div className={`flex-1 flex flex-col gap-3 min-w-0 ${tab === "preview" ? "hidden md:flex" : "flex"}`}>

                    <Sec icon={<Globe size={14} />} title="🏢 Business Info">
                        <Inp label="Business Name" value={d.name} onChange={v => upd("name", v)} placeholder="Your Business" />
                        <Inp label="Tagline" value={d.tagline} onChange={v => upd("tagline", v)} placeholder="Short tagline" />
                        <Inp label="CTA Button" value={d.cta} onChange={v => upd("cta", v)} placeholder="Contact Us" />
                        <Inp label="Logo URL" value={d.logo} onChange={v => upd("logo", v)} placeholder="https://..." />
                    </Sec>

                    <Sec icon={<Sparkles size={14} />} title="🎨 Theme Color">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(THEMES).map(([name, th]) => (
                                <button key={name} onClick={() => upd("theme", name)} title={name}
                                    className={`w-9 h-9 rounded-full border-4 transition-all hover:scale-110 ${d.theme === name ? "border-gray-800 scale-110 shadow-lg" : "border-transparent"}`}
                                    style={{ background: th.p }} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 capitalize">Selected: <strong>{d.theme}</strong></p>
                    </Sec>

                    <Sec icon={<Megaphone size={14} />} title="📢 Announcement Bar">
                        <Tgl label="Show Announcement Bar" checked={d.show.announcement} onChange={v => show("announcement", v)} />
                        <Tgl label="Enable Banner" checked={d.announcement.on} onChange={v => updN("announcement", "on", v)} />
                        <Inp label="Announcement Text" value={d.announcement.text} onChange={v => updN("announcement", "text", v)} placeholder="🎉 Special offer!" />
                        <Inp label="Link (optional)" value={d.announcement.link} onChange={v => updN("announcement", "link", v)} placeholder="https://..." />
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">Background Colour</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={d.announcement.color} onChange={e => updN("announcement", "color", e.target.value)}
                                    className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-0.5" />
                                <span className="text-xs text-gray-400 font-mono">{d.announcement.color}</span>
                            </div>
                        </div>
                    </Sec>

                    <Sec icon={<Grid size={14} />} title="💼 Products & Services">
                        <Tgl label="Show Section" checked={d.show.products} onChange={v => show("products", v)} />
                        {d.products.map(p => (
                            <Card key={p.id} onDel={() => delArr("products", p.id)}>
                                <Inp label="Product Name" value={p.name} onChange={v => updArr("products", p.id, "name", v)} placeholder="Service name" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Inp label="Price" value={p.price} onChange={v => updArr("products", p.id, "price", v)} placeholder="₹999" />
                                </div>
                                <Inp label="Description" value={p.desc} onChange={v => updArr("products", p.id, "desc", v)} placeholder="Short description..." />
                                <Inp label="Image URL" value={p.image} onChange={v => updArr("products", p.id, "image", v)} placeholder="https://image.jpg" />
                            </Card>
                        ))}
                        <AddBtn label="Add Product / Service" onClick={() => upd("products", [...d.products, { id: uid(), name: "", price: "", desc: "", image: "" }])} />
                    </Sec>

                    <Sec icon={<Users size={14} />} title="👥 Team / Employees">
                        <Tgl label="Show Section" checked={d.show.employees} onChange={v => show("employees", v)} />
                        {d.employees.map(e => (
                            <Card key={e.id} onDel={() => delArr("employees", e.id)}>
                                <div className="grid grid-cols-2 gap-2">
                                    <Inp label="Name" value={e.name} onChange={v => updArr("employees", e.id, "name", v)} placeholder="Full Name" />
                                    <Inp label="Bio/Designation" value={e.bio} onChange={v => updArr("employees", e.id, "bio", v)} placeholder="CEO / Manager" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Inp label="Phone" value={e.phone} onChange={v => updArr("employees", e.id, "phone", v)} placeholder="+91..." />
                                    <Inp label="Email" value={e.email} onChange={v => updArr("employees", e.id, "email", v)} placeholder="email@..." />
                                </div>
                                <Inp label="Photo URL" value={e.photo} onChange={v => updArr("employees", e.id, "photo", v)} placeholder="https://photo.jpg" />
                            </Card>
                        ))}
                        <AddBtn label="Add Team Member" onClick={() => upd("employees", [...d.employees, { id: uid(), name: "", bio: "", phone: "", email: "", photo: "" }])} />
                    </Sec>

                    <Sec icon={<Sparkles size={14} />} title="✨ Amenities" open={false}>
                        <Tgl label="Show Section" checked={d.show.amenities} onChange={v => show("amenities", v)} />
                        <div className="flex flex-wrap gap-2">
                            {AMENITIES.map(({ icon: Icon, label }) => {
                                const active = d.amenities.includes(label);
                                return (
                                    <button key={label} onClick={() => upd("amenities", active ? d.amenities.filter(a => a !== label) : [...d.amenities, label])}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${active ? "text-white border-transparent" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                                        style={active ? { background: t.p } : {}}>
                                        <Icon size={11} />{label}
                                    </button>
                                );
                            })}
                        </div>
                    </Sec>

                    <Sec icon={<MessageSquare size={14} />} title="⭐ Testimonials" open={false}>
                        <Tgl label="Show Section" checked={d.show.testimonials} onChange={v => show("testimonials", v)} />
                        {d.testimonials.map(r => (
                            <Card key={r.id} onDel={() => delArr("testimonials", r.id)}>
                                <div className="grid grid-cols-2 gap-2">
                                    <Inp label="Person Name" value={r.name} onChange={v => updArr("testimonials", r.id, "name", v)} placeholder="Ravi Kumar" />
                                    <Inp label="Company (optional)" value={r.company} onChange={v => updArr("testimonials", r.id, "company", v)} placeholder="ABC Ltd." />
                                </div>
                                <Inp label="Review Content" value={r.content} onChange={v => updArr("testimonials", r.id, "content", v)} placeholder="Great service..." />
                                <div className="flex items-center gap-2">
                                    <label className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">Stars</label>
                                    <Stars n={r.stars} onSet={v => updArr("testimonials", r.id, "stars", v)} />
                                </div>
                            </Card>
                        ))}
                        <AddBtn label="Add Testimonial" onClick={() => upd("testimonials", [...d.testimonials, { id: uid(), name: "", company: "", content: "", stars: 5 }])} />
                    </Sec>

                    <Sec icon={<ImagesIcon size={14} />} title="🎬 Media Links" open={false}>
                        <Tgl label="Show Section" checked={d.show.media} onChange={v => show("media", v)} />
                        {d.media.map(m => (
                            <Card key={m.id} onDel={() => delArr("media", m.id)}>
                                <Inp label="Title" value={m.title} onChange={v => updArr("media", m.id, "title", v)} placeholder="Video title" />
                                <Inp label="URL (YouTube or any)" value={m.url} onChange={v => updArr("media", m.id, "url", v)} placeholder="https://youtube.com/..." />
                            </Card>
                        ))}
                        <AddBtn label="Add Media Link" onClick={() => upd("media", [...d.media, { id: uid(), title: "", url: "" }])} />
                    </Sec>

                    <Sec icon={<HelpCircle size={14} />} title="❓ FAQ" open={false}>
                        <Tgl label="Show Section" checked={d.show.faq} onChange={v => show("faq", v)} />
                        {d.faqs.map(f => (
                            <Card key={f.id} onDel={() => delArr("faqs", f.id)}>
                                <Inp label="Question" value={f.q} onChange={v => updArr("faqs", f.id, "q", v)} placeholder="Frequently asked question?" />
                                <Inp label="Answer" value={f.a} onChange={v => updArr("faqs", f.id, "a", v)} placeholder="Clear helpful answer..." />
                            </Card>
                        ))}
                        <AddBtn label="Add FAQ" onClick={() => upd("faqs", [...d.faqs, { id: uid(), q: "", a: "" }])} />
                    </Sec>

                    <Sec icon={<Clock size={14} />} title="🕐 Business Hours" open={false}>
                        <Tgl label="Show Section" checked={d.show.hours} onChange={v => show("hours", v)} />
                        {d.hours.map((h, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input value={h.day} onChange={e => upd("hours", d.hours.map((r, idx) => idx === i ? { ...r, day: e.target.value } : r))}
                                    className="w-24 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none" />
                                <input value={h.time} onChange={e => upd("hours", d.hours.map((r, idx) => idx === i ? { ...r, time: e.target.value } : r))}
                                    className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none" />
                                <button onClick={() => upd("hours", d.hours.map((r, idx) => idx === i ? { ...r, open: !r.open } : r))}
                                    className={`text-[11px] px-2 py-1.5 rounded-full font-bold flex-shrink-0 transition ${h.open ? "bg-green-100 text-green-600" : "bg-red-100 text-red-400"}`}>
                                    {h.open ? "Open" : "Closed"}
                                </button>
                                <button onClick={() => upd("hours", d.hours.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400"><X size={13} /></button>
                            </div>
                        ))}
                        <AddBtn label="Add Day" onClick={() => upd("hours", [...d.hours, { day: "New Day", time: "9 AM – 5 PM", open: true }])} />
                    </Sec>

                    <Sec icon={<Phone size={14} />} title="📞 Contact Info" open={false}>
                        <Tgl label="Show Section" checked={d.show.contact} onChange={v => show("contact", v)} />
                        <Inp label="Phone" value={d.phone} onChange={v => upd("phone", v)} placeholder="+91 00000 00000" />
                        <Inp label="Email" value={d.email} onChange={v => upd("email", v)} placeholder="hello@business.com" />
                        <Inp label="Address" value={d.address} onChange={v => upd("address", v)} placeholder="City, State" />
                        <Inp label="Website" value={d.website} onChange={v => upd("website", v)} placeholder="www.business.com" />
                    </Sec>

                    <Sec icon={<ImagesIcon size={14} />} title="📱 Social Media" open={false}>
                        <Tgl label="Show Section" checked={d.show.social} onChange={v => show("social", v)} />
                        {[["instagram", "Instagram"], ["facebook", "Facebook"], ["youtube", "YouTube"], ["twitter", "Twitter / X"], ["linkedin", "LinkedIn"]].map(([k, l]) => (
                            <Inp key={k} label={l} value={d.social[k]} onChange={v => updN("social", k, v)} placeholder="username" />
                        ))}
                    </Sec>

                    <Sec icon={<ExternalLink size={14} />} title="📋 Google Form" open={false}>
                        <Tgl label="Show Section" checked={d.show.form} onChange={v => show("form", v)} />
                        <Inp label="Google Form URL" value={d.formUrl} onChange={v => upd("formUrl", v)} placeholder="https://forms.gle/..." />
                        <p className="text-xs text-gray-400">Customers can tap to fill your Google Form directly from the mini site.</p>
                    </Sec>
                </div>

                {/* ── PREVIEW ── */}
                <div className={`md:w-85 shrink-0 ${tab === "editor" ? "hidden md:block" : "block"}`}>
                    <div className="sticky top-20 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Eye size={13} className="text-gray-400" />
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Live Preview</span>
                        </div>

                        {/* Phone */}
                        <div className="mx-auto w-75">
                            <div className="rounded-[2.8rem] p-3 shadow-2xl" style={{ background: "#111" }}>
                                <div className="flex justify-center pt-1 pb-2">
                                    <div className="w-20 h-5 rounded-full bg-black" />
                                </div>
                                <div className="rounded-[2rem] overflow-hidden bg-white" style={{ maxHeight: "68vh", overflowY: "auto" }}>
                                    <Preview d={d} />
                                </div>
                                <div className="flex justify-center pt-2 pb-1">
                                    <div className="w-16 h-1 rounded-full bg-gray-700" />
                                </div>
                            </div>
                        </div>

                        {/* Share URL */}
                        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2 shadow-sm">
                            <Link size={13} style={{ color: t.p, flexShrink: 0 }} />
                            <span className="text-xs text-gray-400 truncate flex-1 font-mono">
                                presence1.in/<span className="font-black" style={{ color: t.p }}>
                                    {d.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "your-business"}
                                </span>
                            </span>
                            <button className="text-xs font-bold shrink-0 hover:underline" style={{ color: t.p }}>Copy</button>
                        </div>

                        {/* Quick Toggles */}
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Quick Toggles</p>
                            <div className="flex flex-col gap-2">
                                {QUICK_SHOWS.map(([k, l]) => (
                                    <div key={k} className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">{l}</span>
                                        <div onClick={() => show(k, !d.show[k])}
                                            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${d.show[k] ? "" : "bg-gray-200"}`}
                                            style={d.show[k] ? { background: t.p } : {}}>
                                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${d.show[k] ? "left-4" : "left-0.5"}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}