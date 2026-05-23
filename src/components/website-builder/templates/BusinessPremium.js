"use client";
import { useState, useEffect, useRef } from "react";
import {
  Phone, Mail, MapPin, Globe, MessageCircle, Share2,
  ChevronDown, ChevronUp, Star, Zap, BadgeCheck,
  ExternalLink, PlayCircle, CheckCircle2, Users, Volume2, Link2, X, Award, Quote,
  ArrowUpRight, Sparkles, Clock
} from "lucide-react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { getTheme } from "../theme";


function Stars({ n = 5, size = "w-3 h-3" }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${size} ${i < n ? "fill-amber-400 text-amber-400" : "text-zinc-800"}`} />
      ))}
    </div>
  );
}

function GoldLine({ G }) {
  return (
    <div className="flex items-center gap-3 my-7">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${G.gold}55)` }} />
      <Sparkles className="w-3 h-3" style={{ color: G.gold }} />
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${G.gold}55)` }} />
    </div>
  );
}

function SectionTitle({ label, sub, G }) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="w-5 h-px" style={{ background: G.gold }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: G.gold }}>{label}</span>
      </div>
      {sub && <p className="text-zinc-500 text-sm">{sub}</p>}
    </div>
  );
}

function FAQItem({ q, a, G }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-zinc-200 text-sm font-medium leading-snug">{q}</span>
        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border"
          style={{ borderColor: open ? G.gold : "rgba(255,255,255,0.1)", background: open ? G.goldBg : "transparent" }}>
          {open
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: G.gold }} />
            : <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />}
        </div>
      </button>
      {open && (
        <div className="pb-4 -mt-1">
          <p className="text-zinc-500 text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: G.goldDim }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function BusinessPremium({ data }) {
  const b = data;
  const th = getTheme(b.theme || "gold");
  const ss = b.showSections;

  const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '201,168,76';
  };
  const rgb = hexToRgb(th.primary);

  const G = {
    gold: th.primary,
    goldLight: th.light,
    goldDim: th.grad[0],
    goldBg: `rgba(${rgb},0.08)`,
    goldBorder: `rgba(${rgb},0.22)`,
  };

  const [scrollY, setScrollY] = useState(0);
  const [announce, setAnnounce] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrolled = scrollY > 80;

  const call = () => (window.location.href = `tel:${b.phone}`);
  const whatsapp = () => window.open(`https://wa.me/${b.phone.replace(/\D/g, "")}?text=Hi, I want to enquire`, "_blank");
  const open = (u) => window.open(u?.startsWith("http") ? u : `https://${u}`, "_blank");
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: b.businessName, url: window.location.href }); } catch { } }
    else navigator.clipboard.writeText(window.location.href);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTab(id);
  };

  const NAV_TABS = [
    ss.services && { id: "services", label: "Services" },
    ss.employees && { id: "team", label: "Team" },
    ss.testimonials && { id: "testimonials", label: "Reviews" },
    ss.hours && { id: "hours", label: "Hours" },
    ss.faqs && { id: "faq", label: "FAQ" },
    ss.contact && { id: "contact", label: "Contact" },
  ].filter(Boolean);

  return (
    <div className="min-h-screen max-w-md mx-auto relative overflow-x-hidden" style={{ background: th.background || "#080808", color: th.text || "#ffffff", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none z-0 blur-[80px]" />

      {/* ── ANNOUNCEMENT ──────────────────────────────── */}
      {ss.announcement && b.announcement?.enabled && announce && (
        <div className="relative z-30 px-5 py-2.5 flex items-center gap-3 text-xs"
          style={{ background: G.goldBg, borderBottom: `1px solid ${G.goldBorder}` }}>
          <Volume2 className="w-3.5 h-3.5 shrink-0" style={{ color: G.gold }} />
          <p className="flex-1 leading-relaxed" style={{ color: G.goldLight }}>{b.announcement.text}</p>
          <button onClick={() => setAnnounce(false)}
            className="shrink-0 text-zinc-600 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── STICKY NAV ────────────────────────────────── */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "backdrop-blur-2xl" : "bg-transparent"}`}
        style={scrolled ? { background: `${th.background || "#080808"}f2`, borderBottom: `1px solid ${G.goldBorder}` } : {}}>
        <div className="flex items-center justify-between px-5 py-3.5">
          {/* wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden border flex items-center justify-center"
              style={{ borderColor: G.goldBorder, background: G.goldBg }}>
              {b.logo
                ? <Image src={b.logo} alt="" width={32} height={32} className="object-cover" />
                : <span className="text-sm font-black" style={{ color: G.gold, fontFamily: "'DM Serif Display', serif" }}>{b.businessName.charAt(0)}</span>}
            </div>
            <span className="text-sm font-bold tracking-tight text-white truncate max-w-[130px]">{b.businessName}</span>
          </div>
          {/* actions */}
          <div className="flex items-center gap-2">
            <button onClick={whatsapp}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldDim})`, color: "#080808" }}>
              <MessageCircle className="w-3.5 h-3.5" />
              {b.buttonText}
            </button>
            <button onClick={share}
              className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <Share2 className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* tab strip */}
        {NAV_TABS.length > 0 && (
          <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => scrollTo(tab.id)}
                  className="shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                  style={isActive
                    ? { background: G.gold, color: "#080808", boxShadow: `0 0 16px ${G.gold}55` }
                    : { background: "rgba(255,255,255,0.05)", color: "#71717a" }}>
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* ── HERO ──────────────────────────────────────── */}
      <section ref={heroRef} className="relative px-5 pt-8 pb-10 overflow-hidden">
        {/* diagonal accent bar */}
        <div className="absolute -top-4 -right-8 w-48 h-64 rotate-12 opacity-5 pointer-events-none rounded-3xl"
          style={{ background: `linear-gradient(180deg, ${G.gold}, transparent)` }} />

        {/* logo + name */}
        <div className="flex items-start gap-4 mb-8">
          <div className="relative shrink-0">
            <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden border-2"
              style={{ borderColor: G.goldBorder }}>
              {b.logo
                ? <Image src={b.logo} alt={b.businessName} width={72} height={72} className="object-cover w-full h-full" />
                : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, #1a1500, #2e2200)` }}>
                    <span className="text-3xl font-black" style={{ color: G.gold, fontFamily: "'DM Serif Display', serif" }}>
                      {b.businessName.charAt(0)}
                    </span>
                  </div>
                )}
            </div>
            {/* verified dot */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#080808] flex items-center justify-center"
              style={{ background: G.gold }}>
              <BadgeCheck className="w-3 h-3 text-black" />
            </div>
          </div>

          <div className="flex-1 pt-1">
            <h1 className="text-white text-[22px] font-black leading-tight mb-1"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}>
              {b.businessName}
            </h1>
            <p className="text-zinc-500 text-sm leading-snug">{b.tagline}</p>
            {b.website && (
              <button onClick={() => open(b.website)}
                className="flex items-center gap-1 text-xs mt-2 hover:underline transition-opacity hover:opacity-80"
                style={{ color: G.gold }}>
                <Globe className="w-3 h-3" />
                {b.website.replace(/^https?:\/\//, "")}
              </button>
            )}
          </div>
        </div>

        {/* stat trio */}
        <div className="grid grid-cols-3 gap-2 mb-7">
          {[
            { val: `${b.services?.length || 0}+`, label: "Services" },
            { val: `${b.employees?.length || 1}+`, label: "Experts" },
            { val: `${b.testimonials?.length || 0}+`, label: "Reviews" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl py-4 text-center border"
              style={{ background: G.goldBg, borderColor: G.goldBorder }}>
              <p className="text-xl font-black" style={{ color: G.gold, fontFamily: "'DM Serif Display', serif" }}>{s.val}</p>
              <p className="text-zinc-600 text-xs mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex gap-2.5 mb-6">
          <button onClick={whatsapp}
            className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldDim})`, color: "#080808" }}>
            <MessageCircle className="w-4 h-4" />
            {b.buttonText}
          </button>
          <button onClick={call}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold border transition-all hover:bg-white/5"
            style={{ borderColor: G.goldBorder, color: G.goldLight }}>
            <Phone className="w-4 h-4" />
            Call
          </button>
        </div>

        {/* amenity pills */}
        {ss.amenities && b.amenities?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {b.amenities.map((a) => (
              <div key={a}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium whitespace-nowrap"
                style={{ background: G.goldBg, borderColor: G.goldBorder, color: G.goldLight }}>
                <CheckCircle2 className="w-3 h-3" style={{ color: G.gold }} />
                {a}
              </div>
            ))}
          </div>
        )}
      </section>

      <GoldLine G={G} />

      {/* ── SERVICES ──────────────────────────────────── */}
      {ss.services && b.services?.length > 0 && (
        <section id="services" className="px-5 pb-10 scroll-mt-28">
          <SectionTitle label="Our Services" sub="Click to enquire on WhatsApp" G={G} />
          <div className="space-y-3">
            {b.services.map((svc, i) => (
              <button key={svc.id} onClick={whatsapp}
                className="w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all hover:border-[#c9a84c44] hover:bg-[rgba(201,168,76,0.04)] active:scale-[0.99]"
                style={{ background: th.cardBg || "#0f0f0f", borderColor: th.border || "rgba(255,255,255,0.07)" }}>
                {/* number badge */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border"
                  style={{ borderColor: G.goldBorder, background: G.goldBg }}>
                  {svc.image
                    ? <Image src={svc.image} alt={svc.name} width={48} height={48} className="object-cover w-full h-full" />
                    : <div className="w-full h-full flex items-center justify-center">
                      <span className="font-black text-base" style={{ color: G.gold, fontFamily: "'DM Serif Display', serif" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm leading-tight">{svc.name}</p>
                  <p className="text-zinc-600 text-xs mt-0.5 line-clamp-1">{svc.desc}</p>
                  <p className="text-xs font-bold mt-1.5" style={{ color: G.gold }}>{svc.price}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 shrink-0" style={{ color: G.goldDim }} />
              </button>
            ))}
          </div>
        </section>
      )}

      <GoldLine G={G} />

      {/* ── TEAM ──────────────────────────────────────── */}
      {ss.employees && b.employees?.length > 0 && (
        <section id="team" className="px-5 pb-10 scroll-mt-28">
          <SectionTitle label="Our Team" G={G} />
          <div className="space-y-3">
            {b.employees.map((emp) => (
              <div key={emp.id}
                className="flex items-center gap-4 p-4 rounded-2xl border"
                style={{ background: th.cardBg || "#0f0f0f", borderColor: th.border || "rgba(255,255,255,0.07)" }}>
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border"
                  style={{ borderColor: G.goldBorder }}>
                  {emp.image
                    ? <Image src={emp.image} alt={emp.name} width={56} height={56} className="object-cover w-full h-full" />
                    : <div className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${G.goldDim}, #1a1000)` }}>
                      <span className="text-white text-xl font-black" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        {emp.name.charAt(0)}
                      </span>
                    </div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{emp.name}</p>
                  <p className="text-zinc-600 text-xs mt-0.5">{emp.bio}</p>
                  <div className="flex gap-3 mt-2">
                    {emp.phone && (
                      <button onClick={() => (window.location.href = `tel:${emp.phone}`)}
                        className="text-xs font-semibold flex items-center gap-1 hover:underline"
                        style={{ color: G.gold }}>
                        <Phone className="w-3 h-3" /> Call
                      </button>
                    )}
                    {emp.email && (
                      <button onClick={() => window.open(`mailto:${emp.email}`)}
                        className="text-xs font-semibold text-zinc-500 flex items-center gap-1 hover:text-white transition-colors">
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

      <GoldLine G={G} />

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      {ss.testimonials && b.testimonials?.length > 0 && (
        <section id="testimonials" className="px-5 pb-10 scroll-mt-28">
          <SectionTitle label="Client Reviews" G={G} />
          <div className="space-y-4">
            {b.testimonials.map((rv) => (
              <div key={rv.id} className="relative p-5 rounded-2xl border overflow-hidden"
                style={{ background: "#0d0d0d", borderColor: G.goldBorder }}>
                {/* quote mark */}
                <Quote className="absolute top-3 right-4 w-8 h-8 opacity-10" style={{ color: G.gold }} />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${G.goldDim}, #1a1000)` }}>
                    <span className="text-white text-sm font-black" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {rv.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{rv.name}</p>
                    {rv.company && <p className="text-zinc-600 text-xs">{rv.company}</p>}
                    <Stars n={rv.stars} size="w-2.5 h-2.5" />
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed italic">{rv.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <GoldLine G={G} />

      {/* ── MEDIA LINKS ───────────────────────────────── */}
      {ss.mediaLinks && b.mediaLinks?.length > 0 && (
        <section className="px-5 pb-10">
          <SectionTitle label="Media & Links" G={G} />
          <div className="space-y-2.5">
            {b.mediaLinks.map((m) => {
              const isYt = m.url?.includes("youtube") || m.url?.includes("youtu.be");
              return (
                <button key={m.id} onClick={() => open(m.url)}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all hover:bg-white/3 active:scale-[0.99]"
                  style={{ background: th.cardBg || "#0f0f0f", borderColor: th.border || "rgba(255,255,255,0.07)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{ background: isYt ? "rgba(239,68,68,0.1)" : G.goldBg, borderColor: isYt ? "rgba(239,68,68,0.3)" : G.goldBorder }}>
                    {isYt ? <PlayCircle className="w-5 h-5 text-red-400" /> : <Link2 className="w-5 h-5" style={{ color: G.gold }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{m.title}</p>
                    <p className="text-zinc-700 text-xs truncate mt-0.5">{m.url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0" style={{ color: G.goldDim }} />
                </button>
              );
            })}
          </div>
        </section>
      )}

      <GoldLine G={G} />

      {/* ── HOURS ─────────────────────────────────────── */}
      {ss.hours && b.hours?.length > 0 && (
        <section id="hours" className="px-5 pb-10 scroll-mt-28">
          <SectionTitle label="Business Hours" G={G} />
          <div className="rounded-2xl border overflow-hidden" style={{ background: th.cardBg || "#0f0f0f", borderColor: G.goldBorder }}>
            {b.hours.map((h, i) => (
              <div key={h.day}
                className={`flex items-center justify-between px-5 py-4 ${i < b.hours.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: h.open ? G.gold : "#3f3f46" }} />
                  <span className="text-zinc-400 text-sm">{h.day}</span>
                </div>
                <span className={`text-sm font-semibold ${h.open ? "text-white" : "text-zinc-700"}`}>{h.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" }}>
            <span className="text-base">🚨</span>
            <div>
              <p className="text-red-400 text-sm font-semibold">Emergency Available 24/7</p>
              <p className="text-zinc-600 text-xs">Surcharge may apply on holidays</p>
            </div>
          </div>
        </section>
      )}

      <GoldLine G={G} />

      {/* ── AMENITIES ─────────────────────────────────── */}
      {ss.amenities && b.amenities?.length > 0 && (
        <section id="amenities" className="px-5 pb-10 scroll-mt-28">
          <SectionTitle label="What We Offer" G={G} />
          <div className="grid grid-cols-2 gap-2">
            {b.amenities.map((am) => (
              <div key={am} className="flex items-center gap-3 p-3.5 rounded-xl border"
                style={{ background: G.goldBg, borderColor: G.goldBorder }}>
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: G.gold }} />
                <span className="text-zinc-300 text-sm font-medium leading-tight">{am}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <GoldLine G={G} />

      {/* ── FAQ ───────────────────────────────────────── */}
      {ss.faqs && b.faqs?.length > 0 && (
        <section id="faq" className="px-5 pb-10 scroll-mt-28">
          <SectionTitle label="Frequently Asked" G={G} />
          <div className="rounded-2xl border px-5" style={{ background: th.cardBg || "#0f0f0f", borderColor: G.goldBorder }}>
            {b.faqs.map((faq) => <FAQItem key={faq.id} q={faq.question} a={faq.answer} G={G} />)}
          </div>
        </section>
      )}

      <GoldLine G={G} />

      {/* ── CONTACT ───────────────────────────────────── */}
      {ss.contact && (
        <section id="contact" className="px-5 pb-10 scroll-mt-28">
          <SectionTitle label="Get In Touch" G={G} />
          <div className="space-y-2">
            {[
              b.phone && { icon: Phone, label: "Phone", value: b.phone, fn: call },
              b.email && { icon: Mail, label: "Email", value: b.email, fn: () => window.open(`mailto:${b.email}`) },
              b.address && { icon: MapPin, label: "Address", value: b.address, fn: () => open(`https://maps.google.com?q=${encodeURIComponent(b.address)}`) },
              b.website && { icon: Globe, label: "Website", value: b.website, fn: () => open(b.website) },
            ].filter(Boolean).map((row) => (
              <button key={row.label} onClick={row.fn}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl border text-left transition-all hover:bg-white/3"
                style={{ background: th.cardBg || "#0f0f0f", borderColor: th.border || "rgba(255,255,255,0.07)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ background: G.goldBg, borderColor: G.goldBorder }}>
                  <row.icon className="w-4 h-4" style={{ color: G.gold }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-600 text-xs">{row.label}</p>
                  <p className="text-zinc-200 text-sm font-medium truncate mt-0.5">{row.value}</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" style={{ color: G.goldDim }} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── SOCIAL ────────────────────────────────────── */}
      {ss.social && (b.instagram || b.facebook || b.youtube) && (
        <section className="px-5 pb-8">
          <SectionTitle label="Follow Us" G={G} />
          <div className="flex gap-2.5">
            {b.instagram && (
              <button onClick={() => open(`https://instagram.com/${b.instagram}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border text-sm font-semibold transition-all hover:bg-pink-500/10"
                style={{ background: "rgba(219,39,119,0.07)", borderColor: "rgba(219,39,119,0.2)", color: "#f472b6" }}>
                <FaInstagram className="w-4 h-4" />
                <span className="text-xs">Instagram</span>
              </button>
            )}
            {b.facebook && (
              <button onClick={() => open(`https://facebook.com/${b.facebook}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border text-sm font-semibold transition-all hover:bg-blue-500/10"
                style={{ background: "rgba(59,130,246,0.07)", borderColor: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>
                <FaFacebook className="w-4 h-4" />
                <span className="text-xs">Facebook</span>
              </button>
            )}
            {b.youtube && (
              <button onClick={() => open(`https://youtube.com/@${b.youtube}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border text-sm font-semibold transition-all hover:bg-red-500/10"
                style={{ background: "rgba(239,68,68,0.07)", borderColor: "rgba(239,68,68,0.2)", color: "#f87171" }}>
                <FaYoutube className="w-4 h-4" />
                <span className="text-xs">YouTube</span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── GOOGLE FORM ───────────────────────────────── */}
      {ss.googleForm && b.googleFormLink && (
        <section className="px-5 pb-8">
          <button onClick={() => open(b.googleFormLink)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all hover:opacity-90"
            style={{ background: G.goldBg, borderColor: G.goldBorder }}>
            <div className="text-left">
              <p className="text-white text-sm font-bold">Fill Enquiry Form</p>
              <p className="text-zinc-600 text-xs mt-0.5">We respond within 2 hours</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldDim})`, borderColor: G.gold }}>
              <ArrowUpRight className="w-4 h-4 text-black" />
            </div>
          </button>
        </section>
      )}

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="px-5 pt-4 pb-28 text-center">
        <div className="w-full h-px mb-6" style={{ background: `linear-gradient(to right, transparent, ${G.gold}44, transparent)` }} />
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: G.gold }}>
            <Zap className="w-3 h-3 text-black" />
          </div>
          <span className="text-zinc-600 text-xs">Powered by Vscan</span>
        </div>
        <p className="text-zinc-800 text-[10px]">© 2025 {b.businessName} · All rights reserved</p>
      </footer>

      {/* ── STICKY BOTTOM BAR ─────────────────────────── */}
      <div className="sticky bottom-0 w-full z-50 px-4 pb-6 pt-3"
        style={{ background: `linear-gradient(to top, ${th.background || "#080808"} 60%, transparent)` }}>
        <div className="flex gap-2.5">
          <button onClick={call}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold border transition-all hover:bg-white/5 active:scale-[0.98]"
            style={{ borderColor: G.goldBorder, color: G.goldLight, background: G.goldBg }}>
            <Phone className="w-4 h-4" />
            Call Now
          </button>
          <button onClick={whatsapp}
            className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black text-black transition-all hover:opacity-90 active:scale-[0.98] shadow-xl"
            style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldDim})`, boxShadow: `0 8px 24px ${G.gold}40` }}>
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}