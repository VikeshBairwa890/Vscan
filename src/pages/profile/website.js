"use client";

import { useState, useEffect, useRef } from "react";
import {
    Star, Phone, Mail, MapPin, Globe, Clock,
    MessageCircle, Share2, ChevronDown, ChevronUp,
    CheckCircle2, Zap, BadgeCheck, ArrowRight,
    Wrench, Sparkles, Users, Award, Calendar, ExternalLink,
    ChevronLeft, PlayCircle, Package, HeartHandshake
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

/* ─────────────────────────────────────────
   MOCK DATA  (replace with real API fetch)
───────────────────────────────────────── */
const BUSINESS = {
    name: "Manas Services",
    tagline: "Trusted. Professional. Affordable.",
    description:
        "With over 10 years of hands-on expertise, Manas Services delivers premium home & office solutions across Mumbai. We are committed to quality craftsmanship, transparent pricing, and 100% customer satisfaction.",
    logo: null,
    coverColor: "from-violet-700 via-fuchsia-800 to-purple-900",
    rating: 4.8,
    totalReviews: 156,
    totalClients: "2,000+",
    yearsExp: "10+",
    contact: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "manas@services.com",
    address: "123 Business Park, Andheri East, Mumbai – 400093",
    website: "https://manasservices.com",
    googleReviewLink: "https://g.page/r/example",
    upiId: "manas@okhdfcbank",
    social: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
    },
    hours: [
        { day: "Monday – Friday", time: "9:00 AM – 7:00 PM", open: true },
        { day: "Saturday", time: "9:00 AM – 5:00 PM", open: true },
        { day: "Sunday", time: "Closed", open: false },
    ],
    services: [
        {
            id: 1,
            icon: "🔧",
            title: "Plumbing",
            desc: "Pipe repairs, installations, leak fixing, drainage cleaning & more.",
            price: "₹299 onwards",
            tag: "Popular",
            tagColor: "bg-amber-500/15 text-amber-400 border-amber-500/20",
        },
        {
            id: 2,
            icon: "⚡",
            title: "Electrical",
            desc: "Wiring, switchboards, fixture installation, safety audits.",
            price: "₹399 onwards",
            tag: "Trending",
            tagColor: "bg-sky-500/15 text-sky-400 border-sky-500/20",
        },
        {
            id: 3,
            icon: "❄️",
            title: "AC Service",
            desc: "Gas refill, deep cleaning, repair & annual maintenance contracts.",
            price: "₹499 onwards",
            tag: "Summer Special",
            tagColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
        },
        {
            id: 4,
            icon: "🎨",
            title: "Painting",
            desc: "Interior & exterior wall painting with premium quality paints.",
            price: "₹8/sq.ft onwards",
            tag: null,
            tagColor: "",
        },
        {
            id: 5,
            icon: "🪟",
            title: "Carpentry",
            desc: "Custom furniture, door & window repairs, modular installations.",
            price: "₹599 onwards",
            tag: null,
            tagColor: "",
        },
        {
            id: 6,
            icon: "🧹",
            title: "Deep Cleaning",
            desc: "Full home sanitisation, bathroom & kitchen deep cleaning.",
            price: "₹1,499 onwards",
            tag: "New",
            tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
        },
    ],
    reviews: [
        {
            id: 1,
            name: "Rahul Sharma",
            avatar: "R",
            rating: 5,
            date: "2 days ago",
            text: "Excellent service! The team arrived on time and fixed the plumbing issue quickly. Very professional and clean work.",
        },
        {
            id: 2,
            name: "Priya Mehta",
            avatar: "P",
            rating: 5,
            date: "1 week ago",
            text: "Got my AC serviced before summer. Technician was knowledgeable and explained everything clearly. Highly recommend!",
        },
        {
            id: 3,
            name: "Ankit Joshi",
            avatar: "A",
            rating: 4,
            date: "2 weeks ago",
            text: "Good service, reasonable pricing. Painting job looks great. Will definitely call them again.",
        },
    ],
    faqs: [
        {
            q: "Do you provide services on weekends?",
            a: "We are available on Saturdays from 9 AM to 5 PM. Sundays are closed unless for emergency bookings.",
        },
        {
            q: "Is there a warranty on services?",
            a: "Yes! We provide 30-day service warranty on all repair work and 1-year warranty on installation services.",
        },
        {
            q: "How do I book a service?",
            a: "You can book via WhatsApp, call us directly, or fill the contact form. We confirm within 2 hours.",
        },
        {
            q: "Do you charge for inspection visits?",
            a: "Inspection is completely free within a 5km radius. Minimal travel charge beyond that.",
        },
    ],
};

/* ─────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────── */

function StarRow({ rating, size = "w-4 h-4" }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`${size} ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`}
                />
            ))}
        </div>
    );
}

function SectionLabel({ children }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">{children}</span>
            <div className="h-px flex-1 bg-white/5" />
        </div>
    );
}

function FAQItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-white/8 rounded-2xl overflow-hidden bg-[#141420]">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
            >
                <span className="text-white text-sm font-medium pr-4">{q}</span>
                {open
                    ? <ChevronUp className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />}
            </button>
            {open && (
                <div className="px-5 pb-4 border-t border-white/5">
                    <p className="text-zinc-400 text-sm leading-relaxed pt-3">{a}</p>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function MiniWebsite({ params }) {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const b = BUSINESS;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(id);
    };

    const handleWhatsApp = () => window.open(`https://wa.me/${b.whatsapp}?text=Hi, I want to book a service`, "_blank");
    const handleCall = () => (window.location.href = `tel:${b.contact}`);
    const handleShare = async () => {
        if (navigator.share) {
            try { await navigator.share({ title: b.name, url: window.location.href }); } catch { }
        } else { navigator.clipboard.writeText(window.location.href); }
    };

    return (
        <div className="min-h-screen bg-[#0c0c14] text-white font-sans max-w-md mx-auto relative">

            {/* ── Ambient glows ── */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-700/15 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="fixed top-60 right-0 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-[80px] pointer-events-none z-0" />

            {/* ── STICKY NAV ── */}
            <nav className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 transition-all duration-300 ${scrolled ? "bg-[#0c0c14]/90 backdrop-blur-xl border-b border-white/5 shadow-xl" : "bg-transparent"}`}>
                <div className="flex items-center justify-between px-5 py-3.5">
                    <Link href={`/profile/${params?.slug}`} className="flex items-center gap-2 group">
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <ChevronLeft className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-violet-500 rounded-md flex items-center justify-center">
                                <Zap className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-white text-sm font-bold tracking-tight">{b.name}</span>
                        </div>
                    </Link>
                    <button onClick={handleShare} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                </div>

                {/* Tab pills */}
                <div className="flex gap-1 px-4 pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {[
                        { id: "services", label: "Services" },
                        { id: "about", label: "About" },
                        { id: "reviews", label: "Reviews" },
                        { id: "hours", label: "Hours" },
                        { id: "faq", label: "FAQ" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => scrollTo(tab.id)}
                            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${activeSection === tab.id
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* ── HERO ── */}
            <section id="home" className="relative pt-28 pb-0 overflow-hidden">
                {/* Cover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${b.coverColor} opacity-40`} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c0c14]" />

                {/* Decorative rings */}
                <div className="absolute top-8 right-4 w-32 h-32 rounded-full border border-white/5" />
                <div className="absolute top-16 right-12 w-16 h-16 rounded-full border border-white/5" />

                <div className="relative px-5 pb-8">
                    {/* Logo + verified */}
                    <div className="flex items-start gap-4 mb-5">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl flex-shrink-0">
                            {b.logo
                                ? <Image src={b.logo} alt={b.name} width={80} height={80} className="object-cover" />
                                : (
                                    <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                                        <span className="text-white text-3xl font-black">{b.name.charAt(0)}</span>
                                    </div>
                                )}
                        </div>
                        <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-white text-xl font-black leading-tight">{b.name}</h1>
                                <BadgeCheck className="w-5 h-5 text-violet-400 flex-shrink-0" />
                            </div>
                            <p className="text-zinc-300 text-sm mb-2">{b.tagline}</p>
                            <div className="flex items-center gap-2">
                                <StarRow rating={b.rating} size="w-3.5 h-3.5" />
                                <span className="text-amber-400 text-sm font-bold">{b.rating}</span>
                                <span className="text-zinc-500 text-xs">({b.totalReviews})</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {[
                            { val: b.yearsExp, label: "Experience", icon: Award },
                            { val: b.totalClients, label: "Clients", icon: Users },
                            { val: b.services.length + "+", label: "Services", icon: Package },
                        ].map((s) => (
                            <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl py-3 text-center">
                                <p className="text-white text-lg font-black">{s.val}</p>
                                <p className="text-zinc-500 text-xs mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex gap-2.5">
                        <button
                            onClick={handleWhatsApp}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl py-3.5 font-bold text-sm shadow-lg shadow-green-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Book via WhatsApp
                        </button>
                        <button
                            onClick={handleCall}
                            className="w-12 h-12 flex-shrink-0 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
                        >
                            <Phone className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── SERVICES ── */}
            <section id="services" className="relative z-10 px-4 pt-8 pb-6 scroll-mt-32">
                <SectionLabel>Our Services</SectionLabel>
                <div className="space-y-3">
                    {b.services.map((svc) => (
                        <div
                            key={svc.id}
                            className="bg-[#141420] border border-white/8 rounded-2xl p-4 flex items-center gap-4 hover:border-violet-500/30 hover:bg-[#17172a] active:scale-[0.99] transition-all duration-150 cursor-pointer"
                            onClick={handleWhatsApp}
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-2xl flex-shrink-0">
                                {svc.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-white font-semibold text-sm">{svc.title}</p>
                                    {svc.tag && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${svc.tagColor}`}>{svc.tag}</span>
                                    )}
                                </div>
                                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-1">{svc.desc}</p>
                                <p className="text-violet-400 text-xs font-semibold mt-1">{svc.price}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                        </div>
                    ))}
                </div>

                {/* Book all services banner */}
                <button
                    onClick={handleWhatsApp}
                    className="w-full mt-4 flex items-center justify-between bg-gradient-to-r from-violet-600/20 to-fuchsia-600/15 border border-violet-500/25 rounded-2xl px-5 py-4 hover:from-violet-600/30 hover:to-fuchsia-600/25 transition-all"
                >
                    <div className="text-left">
                        <p className="text-white text-sm font-bold">Need a custom quote?</p>
                        <p className="text-zinc-400 text-xs mt-0.5">Chat with us for bundled discounts</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-violet-400" />
                    </div>
                </button>
            </section>

            {/* ── ABOUT ── */}
            <section id="about" className="relative z-10 px-4 pt-4 pb-6 scroll-mt-32">
                <SectionLabel>About Us</SectionLabel>
                <div className="bg-[#141420] border border-white/8 rounded-2xl p-5 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                        <HeartHandshake className="w-4 h-4 text-violet-400" />
                        <p className="text-white text-sm font-semibold">Our Story</p>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{b.description}</p>
                </div>

                {/* Why us grid */}
                <div className="grid grid-cols-2 gap-2.5">
                    {[
                        { icon: "⏱️", title: "On-Time Arrival", desc: "We value your time" },
                        { icon: "🛡️", title: "30-Day Warranty", desc: "On all repair work" },
                        { icon: "💰", title: "Transparent Pricing", desc: "No hidden charges" },
                        { icon: "👨‍🔧", title: "Certified Techs", desc: "Background verified" },
                    ].map((item) => (
                        <div key={item.title} className="bg-[#141420] border border-white/8 rounded-2xl p-4">
                            <span className="text-2xl mb-2 block">{item.icon}</span>
                            <p className="text-white text-sm font-semibold leading-tight">{item.title}</p>
                            <p className="text-zinc-500 text-xs mt-1">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Contact info */}
                <div className="mt-3 bg-[#141420] border border-white/8 rounded-2xl overflow-hidden">
                    {[
                        { icon: Phone, label: b.contact, color: "text-sky-400", bg: "bg-sky-500/10", action: handleCall },
                        { icon: Mail, label: b.email, color: "text-violet-400", bg: "bg-violet-500/10", action: () => window.open(`mailto:${b.email}`) },
                        { icon: MapPin, label: b.address, color: "text-amber-400", bg: "bg-amber-500/10", action: () => window.open(`https://maps.google.com?q=${encodeURIComponent(b.address)}`, "_blank") },
                        { icon: Globe, label: b.website.replace("https://", ""), color: "text-emerald-400", bg: "bg-emerald-500/10", action: () => window.open(b.website, "_blank") },
                    ].map((row, i, arr) => (
                        <button
                            key={row.label}
                            onClick={row.action}
                            className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-white/3 transition-colors ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
                        >
                            <div className={`w-8 h-8 rounded-xl ${row.bg} flex items-center justify-center flex-shrink-0`}>
                                <row.icon className={`w-4 h-4 ${row.color}`} />
                            </div>
                            <p className="text-zinc-300 text-sm truncate flex-1">{row.label}</p>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />
                        </button>
                    ))}
                </div>

                {/* Social links */}
                <div className="flex gap-2.5 mt-3">
                    {[
                        { icon: FaInstagram, label: "Instagram", url: b.social.instagram, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
                        { icon: FaFacebook, label: "Facebook", url: b.social.facebook, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                        { icon: FaTwitter, label: "Twitter", url: b.social.twitter, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
                    ].map((s) => (
                        <button
                            key={s.label}
                            onClick={() => window.open(s.url, "_blank")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border ${s.bg} hover:brightness-125 transition-all`}
                        >
                            <s.icon className={`w-4 h-4 ${s.color}`} />
                            <span className={`text-xs font-semibold ${s.color}`}>{s.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── REVIEWS ── */}
            <section id="reviews" className="relative z-10 px-4 pt-4 pb-6 scroll-mt-32">
                <SectionLabel>Customer Reviews</SectionLabel>

                {/* Rating summary */}
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-5 mb-4 flex items-center gap-5">
                    <div className="text-center">
                        <p className="text-amber-400 text-5xl font-black leading-none">{b.rating}</p>
                        <StarRow rating={b.rating} size="w-3.5 h-3.5" />
                        <p className="text-zinc-500 text-xs mt-1">{b.totalReviews} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        {[
                            { stars: 5, pct: 82 },
                            { stars: 4, pct: 12 },
                            { stars: 3, pct: 4 },
                            { stars: 2, pct: 1 },
                            { stars: 1, pct: 1 },
                        ].map((r) => (
                            <div key={r.stars} className="flex items-center gap-2">
                                <span className="text-zinc-500 text-xs w-3">{r.stars}</span>
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review cards */}
                <div className="space-y-3">
                    {b.reviews.map((rev) => (
                        <div key={rev.id} className="bg-[#141420] border border-white/8 rounded-2xl p-4">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm font-bold">{rev.avatar}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white text-sm font-semibold">{rev.name}</p>
                                        <span className="text-zinc-600 text-xs">{rev.date}</span>
                                    </div>
                                    <StarRow rating={rev.rating} size="w-3 h-3" />
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed">{rev.text}</p>
                        </div>
                    ))}
                </div>

                {/* Leave review CTA */}
                <button
                    onClick={() => window.open(b.googleReviewLink, "_blank")}
                    className="w-full mt-4 flex items-center justify-center gap-2.5 border border-amber-500/25 bg-amber-500/8 rounded-2xl py-4 hover:bg-amber-500/15 transition-all"
                >
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-amber-400 font-semibold text-sm">Leave a Google Review</span>
                </button>
            </section>

            {/* ── HOURS ── */}
            <section id="hours" className="relative z-10 px-4 pt-4 pb-6 scroll-mt-32">
                <SectionLabel>Working Hours</SectionLabel>
                <div className="bg-[#141420] border border-white/8 rounded-2xl overflow-hidden">
                    {b.hours.map((h, i) => (
                        <div
                            key={h.day}
                            className={`flex items-center justify-between px-5 py-4 ${i < b.hours.length - 1 ? "border-b border-white/5" : ""}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${h.open ? "bg-emerald-400" : "bg-zinc-600"}`} />
                                <span className="text-zinc-300 text-sm font-medium">{h.day}</span>
                            </div>
                            <span className={`text-sm font-semibold ${h.open ? "text-white" : "text-zinc-600"}`}>{h.time}</span>
                        </div>
                    ))}
                </div>

                {/* Emergency tag */}
                <div className="mt-3 flex items-center justify-center gap-2 bg-red-500/8 border border-red-500/20 rounded-2xl py-3.5">
                    <span className="text-lg">🚨</span>
                    <div>
                        <p className="text-red-400 text-sm font-semibold">24/7 Emergency Support</p>
                        <p className="text-zinc-500 text-xs">Extra charges may apply on holidays</p>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="relative z-10 px-4 pt-4 pb-6 scroll-mt-32">
                <SectionLabel>Frequently Asked</SectionLabel>
                <div className="space-y-2.5">
                    {b.faqs.map((faq) => (
                        <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                    ))}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 px-4 pt-2 pb-28">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-violet-500 rounded-md flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-zinc-400 text-sm font-semibold">Powered by Presence1</span>
                    </div>
                    <p className="text-zinc-700 text-xs">© 2025 {b.name} · All rights reserved</p>
                </div>
            </footer>

            {/* ── STICKY BOTTOM CTA ── */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 pb-6 pt-3 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/95 to-transparent">
                <div className="flex gap-2.5">
                    <button
                        onClick={handleCall}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/8 border border-white/12 rounded-2xl py-4 font-bold text-sm text-white hover:bg-white/15 active:scale-[0.98] transition-all"
                    >
                        <Phone className="w-4 h-4" />
                        Call Now
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl py-4 font-bold text-sm shadow-lg shadow-green-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Book on WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}