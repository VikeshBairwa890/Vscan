"use client";

import { useEffect, useRef, useState } from "react";

function Counter({ end, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let s = 0;
        const step = end / (duration / 16);
        const t = setInterval(() => {
          s += step;
          if (s >= end) {
            setCount(end);
            clearInterval(t);
          } else {
            setCount(Math.floor(s));
          }
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function Typewriter({ words }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const current = words[index % words.length];
    const speed = deleting ? 40 : 90;
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.substring(0, text.length + 1));
        if (text === current) setTimeout(() => setDeleting(true), 1800);
      } else {
        setText(current.substring(0, text.length - 1));
        if (text === "") {
          setDeleting(false);
          setIndex((i) => i + 1);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words, mounted]);

  if (!mounted) return <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Digital.</span>;

  return (
    <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
      {text}<span className="animate-pulse text-violet-400 ml-0.5">|</span>
    </span>
  );
}

const features = [
  { icon: "bi-globe2", title: "Mini Business Website", desc: "Fully responsive website with services, gallery, WhatsApp CTA & Google Maps. Live in 5 minutes, zero coding.", border: "border-violet-500/20", iconBg: "bg-violet-500/10 text-violet-400" },
  { icon: "bi-person-vcard-fill", title: "Digital Business Card", desc: "Shareable card with QR code. One-click call, WhatsApp & email. Save to contacts instantly.", border: "border-indigo-500/20", iconBg: "bg-indigo-500/10 text-indigo-400" },
  { icon: "bi-robot", title: "AI Content Generator", desc: "AI writes your business description, service details & SEO-optimized promotional content automatically.", border: "border-purple-500/20", iconBg: "bg-purple-500/10 text-purple-400" },
  { icon: "bi-stars", title: "AI Review Assistant", desc: "Smart Google review suggestions in multiple tones — professional, casual, enthusiastic. One-click redirect.", border: "border-blue-500/20", iconBg: "bg-blue-500/10 text-blue-400" },
  { icon: "bi-qr-code-scan", title: "UPI Payment Integration", desc: "Accept payments instantly via UPI. Auto-generate payment QR. Works with PhonePe, GPay, Paytm & more.", border: "border-violet-500/20", iconBg: "bg-violet-500/10 text-violet-400" },
  { icon: "bi-qr-code", title: "QR Code Management", desc: "Dynamic QR codes for profile, card & payment. Download, share & track scan analytics in real time.", border: "border-indigo-500/20", iconBg: "bg-indigo-500/10 text-indigo-400" },
  { icon: "bi-graph-up-arrow", title: "Business Dashboard", desc: "Centralized profile management with real-time analytics, content editor & review tracking.", border: "border-purple-500/20", iconBg: "bg-purple-500/10 text-purple-400" },
  { icon: "bi-shield-lock-fill", title: "Admin Control Panel", desc: "Manage all businesses, enable/disable profiles, monitor platform health & users at scale.", border: "border-blue-500/20", iconBg: "bg-blue-500/10 text-blue-400" },
];

const problems = [
  { icon: "bi-x-circle-fill", problem: "No professional website", solution: "Mini website auto-generated", sIcon: "bi-check-circle-fill" },
  { icon: "bi-x-circle-fill", problem: "No digital business card", solution: "QR-powered digital card ready", sIcon: "bi-check-circle-fill" },
  { icon: "bi-x-circle-fill", problem: "Cannot accept online payments", solution: "UPI integration, zero setup", sIcon: "bi-check-circle-fill" },
  { icon: "bi-x-circle-fill", problem: "Zero Google reviews", solution: "AI review assistant included", sIcon: "bi-check-circle-fill" },
  { icon: "bi-x-circle-fill", problem: "No professional content", solution: "AI writes it in seconds", sIcon: "bi-check-circle-fill" },
  { icon: "bi-x-circle-fill", problem: "Website costs ₹50,000+", solution: "Full suite at ₹499/month", sIcon: "bi-check-circle-fill" },
];

const plans = [
  {
    name: "Free", price: "₹0", period: "", tag: null, popular: false,
    desc: "Zero risk, start today",
    features: ["Basic Business Profile", "1 Service Listing", "QR Code Generation", "100 Views / Month", "WhatsApp Button"],
    icons: ["bi-person-circle", "bi-list-ul", "bi-qr-code", "bi-eye", "bi-whatsapp"],
    cta: "Start for Free",
  },
  {
    name: "Basic", price: "₹499", period: "/mo", tag: null, popular: false,
    desc: "Perfect for local shops",
    features: ["Mini Business Website", "Digital Business Card", "AI Content Generator", "UPI Payment Integration", "5 Service Listings", "QR Code Management"],
    icons: ["bi-globe2", "bi-person-vcard", "bi-robot", "bi-qr-code-scan", "bi-list-ul", "bi-qr-code"],
    cta: "Get Basic",
  },
  {
    name: "Pro", price: "₹999", period: "/mo", tag: "Most Popular", popular: true,
    desc: "For serious businesses",
    features: ["Everything in Basic", "AI Google Review Assistant", "Advanced Analytics", "20 Service Listings", "Priority Support", "Custom Domain Ready"],
    icons: ["bi-infinity", "bi-stars", "bi-graph-up-arrow", "bi-list-check", "bi-headset", "bi-link-45deg"],
    cta: "Go Pro Today",
  },
  {
    name: "Enterprise", price: "₹1,999", period: "/mo", tag: null, popular: false,
    desc: "Unlimited scale & power",
    features: ["Everything in Pro", "Unlimited Services", "Dedicated Account Manager", "White-label Option", "API Access", "24/7 Priority Support"],
    icons: ["bi-infinity", "bi-grid-fill", "bi-person-check", "bi-brush", "bi-code-slash", "bi-telephone-fill"],
    cta: "Contact Sales",
  },
];

const audience = [
  { icon: "bi-shop", label: "Kirana & Grocery" },
  { icon: "bi-scissors", label: "Salon & Beauty" },
  { icon: "bi-tools", label: "Plumber & Electrician" },
  { icon: "bi-camera", label: "Photographer" },
  { icon: "bi-bag-heart", label: "Home Food Business" },
  { icon: "bi-heart-pulse", label: "Doctor & Clinic" },
  { icon: "bi-house-door", label: "Real Estate Agent" },
  { icon: "bi-cake2", label: "Bakery & Boutique" },
  { icon: "bi-briefcase", label: "Lawyer & CA" },
  { icon: "bi-book", label: "Tutor & Trainer" },
  { icon: "bi-cup-hot", label: "Restaurant & Cafe" },
  { icon: "bi-phone", label: "Electronics Shop" },
];

const testimonials = [
  { name: "Ramesh Gupta", role: "Kirana Shop Owner, Jaipur", text: "I had zero online presence before BizPresence. In 10 minutes I had a live website. Customers now WhatsApp me directly for orders!", rating: 5 },
  { name: "Priya Sharma", role: "Freelance Photographer, Mumbai", text: "Sharing my digital card is effortless now. Clients scan the QR and see my full portfolio instantly. Looks incredibly professional!", rating: 5 },
  { name: "Suresh Electricals", role: "Electrician, Pune", text: "The AI wrote my entire service description — I typed nothing! UPI payment makes me look like a big brand to every customer.", rating: 5 },
];

const steps = [
  { icon: "bi-pencil-square", step: "01", title: "Sign Up & Fill Details", desc: "Add your business name, category, services and photos. Takes under 5 minutes." },
  { icon: "bi-cpu", step: "02", title: "AI Does the Heavy Lifting", desc: "AI automatically generates your website, content, digital card & QR code instantly." },
  { icon: "bi-rocket-takeoff", step: "03", title: "Share & Start Growing", desc: "Share your QR code, activate UPI payments and start attracting new customers." },
];

const stats = [
  { value: 10000, suffix: "+", label: "Businesses Online", icon: "bi-building" },
  { value: 200, suffix: "Cr+", label: "Payments Processed", icon: "bi-currency-rupee" },
  { value: 50000, suffix: "+", label: "QR Scans Daily", icon: "bi-qr-code-scan" },
  { value: 48, suffix: "★", label: "Average Rating", icon: "bi-star-fill" },
];

const faqs = [
  { q: "Do I need any technical knowledge?", a: "Absolutely not. BizPresence is a no-code platform. Just fill in your business details and your professional website is ready — no coding, no design skills required." },
  { q: "How does UPI payment integration work?", a: "Add your UPI ID or phone number and a payment QR code is auto-generated instantly. Customers pay you directly without any extra setup or gateway fees." },
  { q: "Is a credit card required for the Free plan?", a: "No! The Free plan is completely free — no credit card needed. Upgrade only when you're ready to scale." },
  { q: "What languages does AI content support?", a: "Currently Hindi and English. Regional language support (Tamil, Telugu, Marathi, Bengali) is coming soon." },
  { q: "Can I use it if I already have a website?", a: "Yes! Digital business card, UPI payment, QR management and AI Review Assistant all work as standalone tools even alongside your existing website." },
];

export default function HomePage() {
  const [activeAudience, setActiveAudience] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[#05050f] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#05050f] text-white min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="glow-pulse w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold">
              <i className="bi bi-lightning-charge-fill text-sm" />
            </div>
            <span className="font-syne text-lg font-bold">
              Biz<span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Presence</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-white/50">
            {["features", "how-it-works", "pricing", "faq"].map((id) => (
              <a key={id} href={`#${id}`} className="hover:text-violet-400 transition-colors">
                {id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="/auth/login" className="hidden sm:block text-sm text-white/40 hover:text-white transition-colors">Login</a>
            <a href="/auth/signup" className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-xl text-white flex items-center gap-1.5">
              <i className="bi bi-rocket-takeoff-fill" /> Get Started Free
            </a>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden grid-bg">
        <div className="blob absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="blob2 absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="scanline" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8 slide-up mt-5">
            <i className="bi bi-patch-check-fill text-xs" />
            India&apos;s Most Powerful Small Business Digital Platform
            <i className="bi bi-arrow-right text-xs" />
          </div>

          <h1 className="font-syne text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.02] tracking-tight mb-6 slide-up">
            Every Business<br />Deserves to Be{" "}
            <Typewriter words={["Digital.", "Powerful.", "Visible.", "AI-Driven.", "Professional."]} />
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Mini Website · Digital Card · AI Content · UPI Payments · QR Codes —
            everything your business needs online.{" "}
            <span className="text-white/80 font-semibold">Starting at ₹499/month.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="#pricing" className="btn-primary px-8 py-4 rounded-2xl font-bold text-base text-white flex items-center gap-2">
              <i className="bi bi-rocket-takeoff-fill" /> Launch Your Business Free
            </a>
            <a href="#features" className="px-8 py-4 rounded-2xl font-semibold text-base text-white/70 border border-white/10 hover:border-violet-500/40 hover:text-white flex items-center gap-2 transition-all">
              <i className="bi bi-play-circle-fill" /> See How It Works
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s, idx) => (
              <div key={idx} className="glass rounded-2xl p-5 card-hover text-center">
                <i className={`bi ${s.icon} text-violet-400 text-xl mb-2 block`} />
                <div className="font-syne text-2xl font-extrabold">
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-white/30 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <i className="bi bi-lightning-fill" /> Problem → Solution
            </p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold mb-4">
              Your Pain Points,{" "}
              <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Our Solutions
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">Every problem that kept your business offline — solved.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((p, i) => (
              <div key={i} className="glass rounded-2xl p-5 card-hover group cursor-default">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-3">
                  <i className={`bi ${p.icon} text-base`} /> {p.problem}
                </div>
                <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-3" />
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <i className={`bi ${p.sIcon} text-base`} /> {p.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-linear(ellipse at 50% 0%,rgba(99,102,241,.07) 0%,transparent 60%)" }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <i className="bi bi-grid-3x3-gap-fill" /> Features
            </p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold mb-4">
              8 AI-Powered Tools,{" "}
              <span className="shimmer-text">One Platform</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Makes your business look like a Fortune 500 company — for ₹499/month.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i}
                className={`card-hover group rounded-2xl border ${f.border} p-6 flex flex-col gap-4 cursor-default`}
                style={{ background: "linear-linear(135deg,rgba(124,58,237,.06),rgba(79,70,229,.02))" }}>
                <div className={`feature-icon ${f.iconBg}`}>
                  <i className={`bi ${f.icon}`} />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-auto text-xs font-semibold flex items-center gap-1 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Learn more <i className="bi bi-arrow-right" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <i className="bi bi-diagram-3-fill" /> How It Works
            </p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold">
              Go Live in{" "}
              <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative">
            <div className="hidden sm:block absolute top-12 left-[22%] right-[22%] h-px bg-linear-to-r from-violet-500/30 via-indigo-500/40 to-violet-500/30" />
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-5">
                <div className="relative float">
                  <div className="animated-border w-24 h-24 rounded-2xl flex items-center justify-center">
                    <i className={`bi ${s.icon} text-3xl text-violet-400`} />
                  </div>
                  <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold font-syne shadow-lg shadow-violet-500/40">
                    {s.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-linear(ellipse at 50% 100%,rgba(124,58,237,.05) 0%,transparent 60%)" }} />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <i className="bi bi-people-fill" /> Who It&apos;s For
            </p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold mb-4">
              Built for Every{" "}
              <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Local Business</span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {audience.map((a, i) => (
              <button key={i} onClick={() => setActiveAudience(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeAudience === i
                  ? "bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                  : "glass text-white/50 hover:text-white hover:border-violet-500/30"
                  }`}>
                <i className={`bi ${a.icon}`} /> {a.label}
              </button>
            ))}
          </div>

          <div className="animated-border rounded-2xl p-10 text-center max-w-md mx-auto">
            <i className={`bi ${audience[activeAudience].icon} text-5xl text-violet-400 mb-4 block float`} />
            <h3 className="font-syne text-2xl font-bold mb-3">{audience[activeAudience].label}</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Get a professional digital presence tailored for your business — website, digital card, QR code & AI content ready in minutes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <i className="bi bi-chat-quote-fill" /> Success Stories
            </p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold">
              Businesses That{" "}
              <span className="shimmer-text">Went Digital</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-7 flex flex-col gap-5 card-hover">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <i key={j} className="bi bi-star-fill text-amber-400 text-sm" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <i className="bi bi-person-fill text-sm" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-white/35">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-linear(ellipse at 50% 50%,rgba(99,102,241,.06) 0%,transparent 70%)" }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <i className="bi bi-tag-fill" /> Pricing
            </p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold mb-4">
              Transparent Pricing,{" "}
              <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Massive Value</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">Start free. Scale as you grow. No hidden charges. No contracts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {plans.map((plan, i) => (
              <div key={i}
                className={`relative rounded-2xl p-6 flex flex-col gap-5 card-hover ${plan.popular ? "animated-border shadow-2xl shadow-violet-500/20" : "glass"}`}>
                {plan.tag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white whitespace-nowrap shadow-lg shadow-violet-500/40 flex items-center gap-1">
                    <i className="bi bi-fire" /> {plan.tag}
                  </div>
                )}
                <div>
                  <div className="text-xs text-white/35 mb-1">{plan.desc}</div>
                  <div className="font-syne text-xl font-bold">{plan.name}</div>
                </div>
                <div className="flex items-end gap-1">
                  <span className="font-syne text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-white/35 text-sm mb-1.5">{plan.period}</span>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                      <i className={`bi ${plan.icons[j]} text-violet-400 shrink-0 text-xs`} /> {f}
                    </li>
                  ))}
                </ul>
                <a href="#"
                  className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${plan.popular
                    ? "btn-primary text-white"
                    : "border border-white/10 text-white/70 hover:border-violet-500/40 hover:text-violet-400"
                    }`}>
                  {plan.cta} <i className="bi bi-arrow-right" />
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-white/20 text-xs mt-6 flex items-center justify-center gap-4 flex-wrap">
            <span><i className="bi bi-shield-check text-violet-400 mr-1" />GST extra</span>
            <span><i className="bi bi-arrow-repeat text-violet-400 mr-1" />Cancel anytime</span>
            <span><i className="bi bi-lock-fill text-violet-400 mr-1" />Secure Indian gateway</span>
            <span><i className="bi bi-headset text-violet-400 mr-1" />Support included</span>
          </p>
        </div>
      </section>

      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <i className="bi bi-question-circle-fill" /> FAQ
            </p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold">Got Questions?</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i}
                className="glass rounded-2xl overflow-hidden transition-all duration-200"
                style={{ borderColor: openFaq === i ? "rgba(139,92,246,0.3)" : undefined, borderWidth: openFaq === i ? "1px" : undefined }}>
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/2 transition-colors"
                  onClick={() => setOpenFaq(openFaq == i ? null : i)}>
                  <span className="font-semibold text-sm sm:text-base flex items-center gap-3">
                    <i className="bi bi-chevron-right text-violet-400 text-xs transition-transform duration-200"
                      style={{ transform: openFaq === i ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }} />
                    {faq.q}
                  </span>
                  <i className={`bi bi-${openFaq === i ? "dash" : "plus"} text-violet-400 text-xl shrink-0 transition-all duration-200`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-white/55 leading-relaxed border-t border-white/5 pt-4 pl-14">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animated-border rounded-3xl overflow-hidden p-12 sm:p-20 text-center relative">
            <div className="blob absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="blob2 absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-violet-500/8 pointer-events-none" />
            <div className="relative">
              <i className="bi bi-rocket-takeoff-fill text-5xl text-violet-400 mb-6 block float" />
              <h2 className="font-syne text-4xl sm:text-6xl font-extrabold mb-5">
                Ready to{" "}
                <span className="shimmer-text">Go Digital?</span>
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                Join 10,000+ businesses that already levelled up their digital presence with BizPresence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/auth/signup" className="btn-primary px-10 py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2">
                  <i className="bi bi-lightning-charge-fill" /> Create Free Account
                </a>
                <a href="#features" className="px-10 py-4 rounded-2xl font-semibold text-white/70 border border-white/10 hover:border-violet-500/40 hover:text-white flex items-center justify-center gap-2 transition-all">
                  <i className="bi bi-play-circle" /> See Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="glow-pulse w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <i className="bi bi-lightning-charge-fill text-sm" />
                </div>
                <span className="font-syne text-lg font-bold">
                  Biz<span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Presence</span>
                </span>
              </div>
              <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-6">
                Empowering every small business with professional digital presence — affordable, instant, AI-powered.
              </p>
              <div className="flex gap-3">
                {["bi-facebook", "bi-instagram", "bi-twitter-x", "bi-linkedin", "bi-youtube"].map((icon) => (
                  <a key={icon} href="#"
                    className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-white/35 hover:text-violet-400 hover:border-violet-500/30 transition-all">
                    <i className={`bi ${icon} text-sm`} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-5 text-white/80">Product</div>
              <ul className="flex flex-col gap-3">
                {["Features", "Pricing", "Who It's For", "How It Works", "FAQ"].map((label) => (
                  <li key={label}>
                    <a href={`#${label.toLowerCase().replace(/ /g, '-').replace(/[^a-z-]/g, '')}`} className="text-sm text-white/35 hover:text-violet-400 transition-colors flex items-center gap-2">
                      <i className="bi bi-dot" /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold mb-5 text-white/80">Company</div>
              <ul className="flex flex-col gap-3">
                {["About Us", "Contact", "Privacy Policy", "Terms of Service", "Refund Policy"].map((label) => (
                  <li key={label}>
                    <a href="#" className="text-sm text-white/35 hover:text-violet-400 transition-colors flex items-center gap-2">
                      <i className="bi bi-dot" /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs flex items-center gap-2">
              <i className="bi bi-c-circle" /> 2024 BizPresence. All rights reserved.
            </p>
            <p className="text-white/20 text-xs flex items-center gap-2">
              <i className="bi bi-geo-alt-fill text-violet-400" /> Made with
              <i className="bi bi-heart-fill text-red-400 mx-0.5" /> in India
              <span className="mx-1">·</span> GST Registered
              <span className="mx-1">·</span> Secure Payments
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}