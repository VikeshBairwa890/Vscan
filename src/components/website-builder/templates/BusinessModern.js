"use client";

import { useState, useEffect, useRef } from "react";
import {
    Phone,
    MessageCircle,
    Share2,
    MapPin,
    Clock,
    Star,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Play,
    Image as ImageIcon,
    Globe,
    Mail,
    Award,
    Users,
    Briefcase,
    TrendingUp,
    X,
} from "lucide-react";
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
    FaYoutube,
    FaWhatsapp,
    FaTiktok,
    FaPinterest,
} from "react-icons/fa";
import { getTheme } from "../theme";

export default function BusinessModern({ data }) {
    const b = data;
    const ss = b.showSections;

    const th = getTheme(b.theme || "blue");

    function parseRGB(color = "") {
        const rgb = color.match(/\d+/g);
        if (rgb && rgb.length >= 3) return rgb.map(Number);
        if (color.startsWith("#")) {
            const hex = color.replace("#", "");
            return [
                parseInt(hex.slice(0, 2), 16),
                parseInt(hex.slice(2, 4), 16),
                parseInt(hex.slice(4, 6), 16),
            ];
        }
        return [99, 102, 241]; // indigo fallback
    }

    const [r, g, b_] = parseRGB(th.primary);
    const [cr, cg, cb] = parseRGB(th.cardBg || "#ffffff");

    const G = {
        primary: `rgb(${r},${g},${b_})`,
        soft: `rgba(${r},${g},${b_},0.08)`,
        medium: `rgba(${r},${g},${b_},0.15)`,
        border: `rgba(${r},${g},${b_},0.22)`,
        glow: `rgba(${r},${g},${b_},0.35)`,
        gradient: `linear-gradient(135deg, rgba(${r},${g},${b_},0.12) 0%, rgba(${r},${g},${b_},0.04) 100%)`,
        heroGrad: `linear-gradient(160deg, rgba(${r},${g},${b_},0.18) 0%, rgba(${r},${g},${b_},0.05) 60%, transparent 100%)`,
        pill: `rgba(${r},${g},${b_},0.1)`,
        glass: (alpha) => `rgba(${cr},${cg},${cb},${alpha})`,
    };

    /* ── State ──────────────────────────────────── */
    const [scrollY, setScrollY] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);
    const [imgErrors, setImgErrors] = useState({});

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── Helpers ────────────────────────────────── */
    const call = (num) => num && (window.location.href = `tel:${num}`);

    const whatsapp = (num) => {
        if (!num) return;
        const msg = encodeURIComponent(
            `Hi! I found you on ${b.businessName || "your website"} and would like to connect.`
        );
        window.open(`https://wa.me/${num.replace(/\D/g, "")}?text=${msg}`, "_blank");
    };

    const open = (url) => {
        if (!url) return;
        const href = url.startsWith("http") ? url : `https://${url}`;
        window.open(href, "_blank");
    };

    const share = async () => {
        try {
            await navigator.share({
                title: b.businessName || "Check this out",
                text: b.tagline || "",
                url: window.location.href,
            });
        } catch {
            navigator.clipboard?.writeText(window.location.href);
        }
    };

    const handleImgError = (key) =>
        setImgErrors((prev) => ({ ...prev, [key]: true }));

    /* ── Reusable sub-components ────────────────── */

    // Avatar/Image with letter fallback
    const Avatar = ({ src, name = "?", size = 56, imgKey = "", className = "", style = {} }) => {
        const letter = (name || "?").charAt(0).toUpperCase();
        const show = src && !imgErrors[imgKey];
        return show ? (
            <img
                src={src}
                alt={name}
                className={`object-cover rounded-2xl ${className}`}
                style={{ width: size, height: size, minWidth: size, ...style }}
                onError={() => handleImgError(imgKey)}
            />
        ) : (
            <div
                className={`flex items-center justify-center rounded-2xl font-bold text-white select-none ${className}`}
                style={{
                    width: size,
                    height: size,
                    minWidth: size,
                    background: G.primary,
                    fontSize: size * 0.4,
                    ...style,
                }}
            >
                {letter}
            </div>
        );
    };

    const GlassCard = ({ children, className = "", style = {} }) => (
        <div
            className={`rounded-3xl backdrop-blur-sm ${className}`}
            style={{
                background: G.glass(0.7),
                border: `1px solid ${G.border}`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`,
                ...style,
            }}
        >
            {children}
        </div>
    );

    // Section heading
    const SectionHead = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-3 mb-5">
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: G.soft }}
            >
                <Icon size={18} style={{ color: G.primary }} />
            </div>
            <h2 className="text-lg font-bold tracking-tight" style={{ color: th.text }}>
                {title}
            </h2>
            <div className="flex-1 h-px ml-1" style={{ background: G.border }} />
        </div>
    );

    // Star rating renderer
    const Stars = ({ count = 5 }) => (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    size={13}
                    fill={i < count ? "#f59e0b" : "transparent"}
                    stroke={i < count ? "#f59e0b" : "#d1d5db"}
                />
            ))}
        </div>
    );

    /* ── Social icon map ────────────────────────── */
    const SOCIAL_ICONS = {
        facebook: FaFacebook,
        instagram: FaInstagram,
        twitter: FaTwitter,
        linkedin: FaLinkedin,
        youtube: FaYoutube,
        whatsapp: FaWhatsapp,
        tiktok: FaTiktok,
        pinterest: FaPinterest,
    };

    const navScrolled = scrollY > 40;

    /* ══════════════════════════════════════════════
       RENDER
       ══════════════════════════════════════════════ */
    return (
        <div
            className="max-w-md mx-auto min-h-screen relative overflow-x-hidden"
            style={{ background: th.background, fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* Ambient background blobs */}
            <div
                className="pointer-events-none fixed top-0 left-0 w-full h-64 opacity-40"
                style={{ background: G.heroGrad, zIndex: 0 }}
            />
            <div
                className="pointer-events-none fixed bottom-0 right-0 w-72 h-72 rounded-full opacity-20"
                style={{
                    background: G.primary,
                    filter: "blur(80px)",
                    zIndex: 0,
                    transform: "translate(30%,30%)",
                }}
            />

            {/* ── Announcement Bar ──────────────────── */}
            {ss.announcement && b.announcement?.enabled && b.announcement?.text && (
                <div
                    className="relative z-20 text-center text-xs font-medium py-2 px-4 tracking-wide"
                    style={{ background: G.primary, color: "#fff" }}
                >
                    {b.announcement.text}
                </div>
            )}

            {/* ── Sticky Header ─────────────────────── */}
            <header
                className="sticky top-0 z-30 transition-all duration-300"
                style={{
                    background: navScrolled ? G.glass(0.88) : "transparent",
                    backdropFilter: navScrolled ? "blur(16px)" : "none",
                    borderBottom: navScrolled ? `1px solid ${G.border}` : "none",
                    boxShadow: navScrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
                }}
            >
                <div className="flex items-center gap-3 px-4 py-3">
                    {/* Logo / initials */}
                    <Avatar
                        src={b.logo}
                        name={b.businessName}
                        size={36}
                        imgKey="header-logo"
                        className="ring-2"
                        style={{ ringColor: G.border }}
                    />
                    <div className="flex-1 min-w-0">
                        <p
                            className="font-bold text-sm leading-tight truncate"
                            style={{ color: th.text }}
                        >
                            {b.businessName || "My Business"}
                        </p>
                        {b.category && (
                            <p className="text-xs opacity-50 truncate" style={{ color: th.text }}>
                                {b.category}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={share}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-95"
                        style={{ background: G.soft }}
                        aria-label="Share"
                    >
                        <Share2 size={16} style={{ color: G.primary }} />
                    </button>
                </div>
            </header>

            {/* ── Hero Section ──────────────────────── */}
            <section className="relative z-10 px-4 pt-6 pb-8">
                <div className="flex flex-col items-center text-center gap-4">
                    {/* Logo large */}
                    <div
                        className="relative"
                        style={{
                            filter: `drop-shadow(0 8px 24px ${G.glow})`,
                        }}
                    >
                        <Avatar
                            src={b.logo}
                            name={b.businessName}
                            size={88}
                            imgKey="hero-logo"
                            className="ring-4"
                            style={{ ringColor: `rgba(255,255,255,0.8)` }}
                        />
                        {b.verified && (
                            <div
                                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-white"
                                style={{ background: G.primary }}
                            >
                                <Award size={12} color="#fff" />
                            </div>
                        )}
                    </div>

                    {/* Name & tagline */}
                    <div>
                        <h1
                            className="text-3xl font-black tracking-tight leading-none mb-1"
                            style={{ color: th.text }}
                        >
                            {b.title || "Your Business"}
                        </h1>
                        {b.tagline && (
                            <p
                                className="text-sm font-medium opacity-60 mt-1 leading-relaxed max-w-xs mx-auto"
                                style={{ color: th.text }}
                            >
                                {b.tagline}
                            </p>
                        )}
                    </div>

                    {/* Stats pills */}
                    {(b.stats?.length > 0) && (
                        <div className="flex flex-wrap gap-2 justify-center">
                            {b.stats.map((stat, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center px-4 py-2 rounded-2xl"
                                    style={{
                                        background: G.soft,
                                        border: `1px solid ${G.border}`,
                                    }}
                                >
                                    <span
                                        className="text-xl font-black leading-none"
                                        style={{ color: G.primary }}
                                    >
                                        {stat.value}
                                    </span>
                                    <span
                                        className="text-xs opacity-60 mt-0.5"
                                        style={{ color: th.text }}
                                    >
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex gap-3 w-full max-w-xs">
                        {b.phone && (
                            <button
                                onClick={() => call(b.phone)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white transition-transform active:scale-95"
                                style={{
                                    background: G.primary,
                                    boxShadow: `0 4px 16px ${G.glow}`,
                                }}
                            >
                                <Phone size={16} />
                                Call Now
                            </button>
                        )}
                        {b.whatsapp && (
                            <button
                                onClick={() => whatsapp(b.whatsapp)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-transform active:scale-95"
                                style={{
                                    background: G.soft,
                                    color: G.primary,
                                    border: `1px solid ${G.border}`,
                                }}
                            >
                                <MessageCircle size={16} />
                                Chat
                            </button>
                        )}
                    </div>

                    {/* Address pill */}
                    {b.address && (
                        <div
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                            style={{ background: G.soft, color: th.text, opacity: 0.7 }}
                        >
                            <MapPin size={12} style={{ color: G.primary }} />
                            <span className="truncate max-w-xs">{b.address}</span>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Content Wrapper ───────────────────── */}
            <div className="relative z-10 flex flex-col gap-4 px-4 pb-32">

                {/* ── Services ────────────────────────── */}
                {ss.services && b.services?.length > 0 && (
                    <GlassCard className="p-5">
                        <SectionHead icon={Briefcase} title="Services" />
                        <div className="grid grid-cols-2 gap-3">
                            {b.services.map((svc, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl overflow-hidden flex flex-col"
                                    style={{
                                        background: G.gradient,
                                        border: `1px solid ${G.border}`,
                                    }}
                                >
                                    {/* Service image */}
                                    <div className="relative h-24 w-full overflow-hidden">
                                        {svc.image && !imgErrors[`svc-${i}`] ? (
                                            <img
                                                src={svc.image}
                                                alt={svc.name}
                                                className="w-full h-full object-cover"
                                                onError={() => handleImgError(`svc-${i}`)}
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center text-3xl font-black text-white"
                                                style={{ background: G.primary }}
                                            >
                                                {(svc.name || "S").charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p
                                            className="font-bold text-sm leading-tight"
                                            style={{ color: th.text }}
                                        >
                                            {svc.name}
                                        </p>
                                        {svc.price && (
                                            <p
                                                className="text-xs font-black mt-1"
                                                style={{ color: G.primary }}
                                            >
                                                {svc.price}
                                            </p>
                                        )}
                                        {svc.description && (
                                            <p
                                                className="text-xs mt-1 leading-snug line-clamp-2"
                                                style={{ color: th.text, opacity: 0.55 }}
                                            >
                                                {svc.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}

                {/* ── Team ────────────────────────────── */}
                {ss.employees && b.employees?.length > 0 && (
                    <GlassCard className="p-5">
                        <SectionHead icon={Users} title="Our Team" />
                        <div className="flex flex-col gap-3">
                            {b.employees.map((emp, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-2xl"
                                    style={{ background: G.soft, border: `1px solid ${G.border}` }}
                                >
                                    <Avatar
                                        src={emp.image}
                                        name={emp.name}
                                        size={48}
                                        imgKey={`emp-${i}`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="font-bold text-sm"
                                            style={{ color: th.text }}
                                        >
                                            {emp.name}
                                        </p>
                                        {emp.role && (
                                            <p
                                                className="text-xs mt-0.5 font-medium"
                                                style={{ color: G.primary }}
                                            >
                                                {emp.role}
                                            </p>
                                        )}
                                        {emp.bio && (
                                            <p
                                                className="text-xs mt-1 line-clamp-2 leading-snug"
                                                style={{ color: th.text, opacity: 0.55 }}
                                            >
                                                {emp.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}

                {/* ── Testimonials ────────────────────── */}
                {ss.testimonials && b.testimonials?.length > 0 && (
                    <GlassCard className="p-5">
                        <SectionHead icon={Star} title="Reviews" />
                        <div className="flex flex-col gap-3">
                            {b.testimonials.map((t, i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-2xl relative overflow-hidden"
                                    style={{ background: G.soft, border: `1px solid ${G.border}` }}
                                >
                                    {/* Decorative quote */}
                                    <span
                                        className="absolute top-2 right-3 text-5xl font-black leading-none select-none pointer-events-none"
                                        style={{ color: G.primary, opacity: 0.1 }}
                                    >
                                        "
                                    </span>
                                    <Stars count={t.rating || 5} />
                                    {t.text && (
                                        <p
                                            className="text-sm mt-2 leading-relaxed"
                                            style={{ color: th.text, opacity: 0.75 }}
                                        >
                                            {t.text}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-3">
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                            style={{ background: G.primary }}
                                        >
                                            {(t.name || "A").charAt(0)}
                                        </div>
                                        <p
                                            className="text-xs font-semibold"
                                            style={{ color: th.text, opacity: 0.65 }}
                                        >
                                            {t.name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}

                {/* ── Media & Links ───────────────────── */}
                {ss.mediaLinks && b.mediaLinks?.length > 0 && (
                    <GlassCard className="p-5">
                        <SectionHead icon={Play} title="Media & Links" />
                        <div className="flex flex-col gap-3">
                            {b.mediaLinks.map((ml, i) => (
                                <button
                                    key={i}
                                    onClick={() => open(ml.url)}
                                    className="flex items-center gap-3 p-3 rounded-2xl text-left w-full transition-transform active:scale-98"
                                    style={{ background: G.soft, border: `1px solid ${G.border}` }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: G.medium }}
                                    >
                                        {ml.type === "video" ? (
                                            <Play size={18} style={{ color: G.primary }} />
                                        ) : ml.type === "image" ? (
                                            <ImageIcon size={18} style={{ color: G.primary }} />
                                        ) : (
                                            <ExternalLink size={18} style={{ color: G.primary }} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="font-semibold text-sm truncate"
                                            style={{ color: th.text }}
                                        >
                                            {ml.title || ml.url}
                                        </p>
                                        {ml.description && (
                                            <p
                                                className="text-xs mt-0.5 truncate"
                                                style={{ color: th.text, opacity: 0.5 }}
                                            >
                                                {ml.description}
                                            </p>
                                        )}
                                    </div>
                                    <ExternalLink size={14} style={{ color: G.primary, opacity: 0.6 }} />
                                </button>
                            ))}
                        </div>
                    </GlassCard>
                )}

                {/* ── Business Hours ──────────────────── */}
                {ss.hours && b.hours?.length > 0 && (
                    <GlassCard className="p-5">
                        <SectionHead icon={Clock} title="Business Hours" />
                        <div className="flex flex-col gap-1.5">
                            {b.hours.map((h, i) => (
                                <div
                                    key={h.day || i}
                                    className="flex justify-between items-center py-2 px-3 rounded-xl"
                                    style={{ background: G.soft }}
                                >
                                    <span
                                        className="text-sm font-semibold capitalize"
                                        style={{ color: th.text }}
                                    >
                                        {h.day}
                                    </span>
                                    <span
                                        className="text-sm font-medium"
                                        style={{
                                            color: h.open ? G.primary : "#ef4444",
                                        }}
                                    >
                                        {h.time || "—"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}

                {/* ── Amenities ───────────────────────── */}
                {ss.amenities && b.amenities?.length > 0 && (
                    <GlassCard className="p-5">
                        <SectionHead icon={TrendingUp} title="Amenities" />
                        <div className="flex flex-wrap gap-2">
                            {b.amenities.map((am, i) => (
                                <span
                                    key={i}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                                    style={{
                                        background: G.soft,
                                        color: G.primary,
                                        border: `1px solid ${G.border}`,
                                    }}
                                >
                                    {typeof am === "string" ? am : am.name}
                                </span>
                            ))}
                        </div>
                    </GlassCard>
                )}

                {/* ── FAQs ─────────────────────────────── */}
                {ss.faqs && b.faqs?.length > 0 && (
                    <GlassCard className="p-5">
                        <SectionHead icon={ChevronDown} title="FAQs" />
                        <div className="flex flex-col gap-2">
                            {b.faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl overflow-hidden"
                                    style={{ border: `1px solid ${G.border}` }}
                                >
                                    <button
                                        className="w-full flex items-center justify-between p-4 text-left"
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        style={{ background: openFaq === i ? G.soft : "transparent" }}
                                    >
                                        <span
                                            className="font-semibold text-sm pr-4 leading-snug"
                                            style={{ color: th.text }}
                                        >
                                            {faq.question}
                                        </span>
                                        {openFaq === i ? (
                                            <ChevronUp size={16} style={{ color: G.primary, flexShrink: 0 }} />
                                        ) : (
                                            <ChevronDown
                                                size={16}
                                                style={{ color: th.text, opacity: 0.4, flexShrink: 0 }}
                                            />
                                        )}
                                    </button>
                                    {openFaq === i && (
                                        <div
                                            className="px-4 pb-4 text-sm leading-relaxed"
                                            style={{ color: th.text, opacity: 0.65 }}
                                        >
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                )}

                {/* ── Contact Info ─────────────────────── */}
                {ss.contact && (
                    <GlassCard className="p-5">
                        <SectionHead icon={MapPin} title="Contact" />
                        <div className="flex flex-col gap-3">
                            {b.address && (
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: G.soft }}
                                    >
                                        <MapPin size={16} style={{ color: G.primary }} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium opacity-50" style={{ color: th.text }}>
                                            Address
                                        </p>
                                        <p className="text-sm font-semibold mt-0.5" style={{ color: th.text }}>
                                            {b.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {b.phone && (
                                <button
                                    onClick={() => call(b.phone)}
                                    className="flex items-center gap-3 active:scale-95 transition-transform"
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: G.soft }}
                                    >
                                        <Phone size={16} style={{ color: G.primary }} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-medium opacity-50" style={{ color: th.text }}>
                                            Phone
                                        </p>
                                        <p className="text-sm font-semibold mt-0.5" style={{ color: G.primary }}>
                                            {b.phone}
                                        </p>
                                    </div>
                                </button>
                            )}
                            {b.email && (
                                <button
                                    onClick={() => open(`mailto:${b.email}`)}
                                    className="flex items-center gap-3 active:scale-95 transition-transform"
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: G.soft }}
                                    >
                                        <Mail size={16} style={{ color: G.primary }} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-medium opacity-50" style={{ color: th.text }}>
                                            Email
                                        </p>
                                        <p className="text-sm font-semibold mt-0.5" style={{ color: G.primary }}>
                                            {b.email}
                                        </p>
                                    </div>
                                </button>
                            )}
                            {b.website && (
                                <button
                                    onClick={() => open(b.website)}
                                    className="flex items-center gap-3 active:scale-95 transition-transform"
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: G.soft }}
                                    >
                                        <Globe size={16} style={{ color: G.primary }} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-medium opacity-50" style={{ color: th.text }}>
                                            Website
                                        </p>
                                        <p className="text-sm font-semibold mt-0.5" style={{ color: G.primary }}>
                                            {b.website}
                                        </p>
                                    </div>
                                </button>
                            )}
                        </div>
                    </GlassCard>
                )}

                {/* ── Social Media ─────────────────────── */}
                {ss.social && b.socialLinks && Object.keys(b.socialLinks).length > 0 && (
                    <GlassCard className="p-5">
                        <SectionHead icon={Globe} title="Follow Us" />
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(b.socialLinks).map(([platform, url]) => {
                                if (!url) return null;
                                const Icon = SOCIAL_ICONS[platform.toLowerCase()];
                                if (!Icon) return null;
                                return (
                                    <button
                                        key={platform}
                                        onClick={() => open(url)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-transform active:scale-95"
                                        style={{
                                            background: G.soft,
                                            color: G.primary,
                                            border: `1px solid ${G.border}`,
                                        }}
                                    >
                                        <Icon size={16} />
                                        <span className="capitalize">{platform}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </GlassCard>
                )}

                {/* ── Google Form ──────────────────────── */}
                {ss.googleForm && b.googleFormUrl && (
                    <GlassCard className="p-5">
                        <SectionHead icon={ExternalLink} title={b.googleFormTitle || "Get In Touch"} />
                        {b.googleFormDescription && (
                            <p
                                className="text-sm mb-4 leading-relaxed"
                                style={{ color: th.text, opacity: 0.6 }}
                            >
                                {b.googleFormDescription}
                            </p>
                        )}
                        <button
                            onClick={() => open(b.googleFormUrl)}
                            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-transform active:scale-95"
                            style={{
                                background: G.primary,
                                boxShadow: `0 4px 20px ${G.glow}`,
                            }}
                        >
                            <ExternalLink size={16} />
                            {b.googleFormButtonText || "Open Form"}
                        </button>
                    </GlassCard>
                )}

                {/* ── Footer ───────────────────────────── */}
                <div className="pt-2 pb-2 text-center">
                    <p className="text-xs opacity-30" style={{ color: th.text }}>
                        {b.businessName || "Business"} · All rights reserved
                    </p>
                    {b.poweredBy && (
                        <p className="text-xs opacity-20 mt-1" style={{ color: th.text }}>
                            Powered by {b.poweredBy}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Sticky Bottom CTA Bar ────────────── */}
            <div
                className="absolute bottom-0 left-1/2 w-full max-w-md z-40 px-4 pb-safe"
                style={{ transform: "translateX(-50%)" }}
            >
                <div
                    className="flex gap-3 p-3 rounded-3xl mb-3"
                    style={{
                        background: G.glass(0.9),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${G.border}`,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)`,
                    }}
                >
                    {b.phone && (
                        <button
                            onClick={() => call(b.phone)}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white transition-transform active:scale-95"
                            style={{
                                background: G.primary,
                                boxShadow: `0 4px 16px ${G.glow}`,
                            }}
                        >
                            <Phone size={16} />
                            Call Now
                        </button>
                    )}
                    {b.whatsapp && (
                        <button
                            onClick={() => whatsapp(b.whatsapp)}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-transform active:scale-95"
                            style={{
                                background: "#25D366",
                                color: "#fff",
                                boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
                            }}
                        >
                            <MessageCircle size={16} />
                            WhatsApp
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}