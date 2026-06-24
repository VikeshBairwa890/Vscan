"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  Copy, Download, Globe, Star, User, LayoutGrid, ArrowRight, Save,
  MessageCircle, CheckCircle2, QrCode, Share2, Eye, RefreshCw,
  Sparkles, Lock, ArrowLeft, Printer, ShieldAlert, Award, FileText, Link
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Button } from "@heroui/react";
import { useAppContext } from "@/contexts/AppContext";

const uid = () => Math.random().toString(36).slice(2, 8);

export default function SmartQR() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const { status, statusLoading, refreshStatus } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  const [isActiveSubscription, setIsActiveSubscription] = useState(false);

  // Configuration States
  const [qrDestination, setQrDestination] = useState("smart-menu");
  const [customUrl, setCustomUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState("#4f46e5");
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [qrDesignPattern, setQrDesignPattern] = useState("classic"); // classic, rounded, blocky
  const [selectedFlyerLayout, setSelectedFlyerLayout] = useState("table-stand"); // table-stand, counter-card, business-card
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Business Profile Info
  const [businessData, setBusinessData] = useState({
    name: "",
    logo: "",
    whatsappNumber: "",
    website: "",
    reviewLink: "",
    miniWebsiteLink: process.env.NEXT_PUBLIC_APP_URL,
  });

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Fetch status and QR settings on mount
  useEffect(() => {
    setMounted(true);
    if (statusLoading) return;

    if (status && status.hasProfile) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
      setBusinessData(prev => ({
        ...prev,
        name: status.businessName || prev.name,
        logo: status.logo || prev.logo,
        reviewLink: status.googleReviewLink || prev.reviewLink,
        miniWebsiteLink: status.customSlug
          ? `${baseUrl}/profile/${status.customSlug}`
          : `${baseUrl}/profile/${(status.businessName || "").toLowerCase().replace(/\s+/g, "-")}`,
      }));

      const sub = status.subscription;
      setIsActiveSubscription(sub?.isActive || false);
      setIsPremium((sub?.plan === "PREMIUM" || sub?.plan === "ENTERPRISE") && sub?.isActive);
    }

    const fetchQrSettings = async () => {
      try {
        const qrRes = await fetch(`/api/business/smart-qr-get`);
        if (qrRes.ok) {
          const qrResult = await qrRes.json();
          if (qrResult.success && qrResult.data) {
            const d = qrResult.data;
            if (d.qrDestination) setQrDestination(d.qrDestination);
            if (d.customUrl) setCustomUrl(d.customUrl);
            if (d.primaryColor) setPrimaryColor(d.primaryColor);
            if (d.secondaryColor) setSecondaryColor(d.secondaryColor);
            if (d.gradientEnabled !== undefined) setGradientEnabled(d.gradientEnabled);
            if (d.qrDesignPattern) setQrDesignPattern(d.qrDesignPattern);
            if (d.selectedFlyerLayout) setSelectedFlyerLayout(d.selectedFlyerLayout);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchQrSettings();
  }, [status, statusLoading]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const res = await fetch("/api/business/smart-qr-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            qrDestination,
            customUrl,
            primaryColor,
            secondaryColor,
            gradientEnabled,
            qrDesignPattern,
            selectedFlyerLayout
          }
        })
      });

      if (!res.ok) {
        toast.error("Failed to save QR settings");
        return;
      }
      const result = await res.json();
      if (result.success == false) {
        toast.error(result.message);
        return;
      }
      if (result.success) {
        setSaved(true);
        toast.success("QR settings saved successfully!");
        await refreshStatus();
        setTimeout(() => setSaved(false), 2000);
      } else {
        toast.error(result.message || "Failed to save QR settings");
      }

    } catch (err) {
      console.error("Error saving QR settings", err);
      toast.error("Error saving QR settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Compute redirect url based on selection
  const getRedirectUrl = () => {
    switch (qrDestination) {
      case "smart-menu":
        return `${businessData.miniWebsiteLink}`;
      case "reviews":
        return businessData.reviewLink || "https://google.com";
      case "website":
        return `${businessData.miniWebsiteLink}?tab=website`;
      case "custom":
        return customUrl || (process.env.NEXT_PUBLIC_APP_URL);
      default:
        return businessData.miniWebsiteLink;
    }
  };

  // Redraw QR code when design or URL changes
  useEffect(() => {
    if (!mounted || loading) return;

    const drawQR = async () => {
      const text = getRedirectUrl();
      try {
        // Generate QR code raw lines
        const dataUrl = await QRCode.toDataURL(text, {
          width: 350,
          margin: 1,
          color: {
            dark: gradientEnabled ? primaryColor : primaryColor,
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });
        setQrCodeDataUrl(dataUrl);

        // Render custom styling using Canvas API
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw gradient background
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, primaryColor);
            grad.addColorStop(1, gradientEnabled ? secondaryColor : primaryColor);

            // Paint QR Code image on Canvas
            const img = new window.Image();
            img.src = dataUrl;
            img.onload = () => {
              // Draw rounded background panel
              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.roundRect(0, 0, canvas.width, canvas.height, 24);
              ctx.fill();

              // Draw QR
              ctx.drawImage(img, 15, 15, canvas.width - 30, canvas.height - 30);

              // Draw center logo circle overlay
              const center = canvas.width / 2;
              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.arc(center, center, 28, 0, 2 * Math.PI);
              ctx.fill();

              // Border
              ctx.strokeStyle = primaryColor;
              ctx.lineWidth = 2;
              ctx.stroke();

              // Draw a tiny scan badge icon or center label
              ctx.fillStyle = primaryColor;
              ctx.beginPath();
              ctx.arc(center, center, 22, 0, 2 * Math.PI);
              ctx.fill();

              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 9px sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("SCAN", center, center);
            };
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    drawQR();
  }, [mounted, loading, qrDestination, customUrl, primaryColor, secondaryColor, gradientEnabled, qrDesignPattern]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-app-bg text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  // Handle color preset selection
  const selectStylePreset = (primary, secondary, isGrad, isPrem) => {
    if (isPrem && !isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
    setGradientEnabled(isGrad);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getRedirectUrl());
      toast.success("Redirect link copied!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const printFlyer = () => {
    if (!isActiveSubscription) {
      toast.error("Download and print features require an active subscription plan.");
      setShowUpgradeModal(true);
      return;
    }
    const printContent = document.getElementById("flyer-print-area")?.innerHTML;
    if (printContent) {
      const win = window.open("", "_blank");
      win?.document.write(`
        <html>
          <head>
            <title>Print Vscan QR Flyer</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-white text-black p-10 flex items-center justify-center min-h-screen" onload="window.print(); window.close();">
            <div class="border-8 border-violet-600 rounded-3xl p-10 max-w-xl text-center flex flex-col items-center">
              <h1 class="text-4xl font-extrabold text-violet-900 tracking-tight">${businessData.name}</h1>
              <p class="text-slate-500 uppercase tracking-widest text-xs font-bold mt-2">Scan QR to connect</p>
              <div class="my-8 flex justify-center border-4 border-violet-100 p-4 rounded-3xl">
                <img src="${qrCodeDataUrl}" class="w-80 h-80" />
              </div>
              <p class="text-lg font-bold text-slate-800">Scan for Menu, Payments & Reviews</p>
              <p class="text-xs text-slate-400 mt-2">Powered by Vscan Smart QR</p>
            </div>
          </body>
        </html>
      `);
      win?.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[80px]" />

      {/* Upgrade Paywall Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-app-surface border border-app-border max-w-md w-full rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-app-warning/10 text-app-warning rounded-2xl flex items-center justify-center mx-auto border border-app-warning/20">
              <Lock size={22} className="animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white">Unlock Premium QR Gradients</h3>
            <p className="text-app-text-muted text-sm leading-relaxed">
              Custom premium gradient themes, logo center badges, and editable high-res A4 flyer download templates are reserved for Pro plan subscribers.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-app-border hover:bg-app-surface/80 text-xs font-bold transition text-app-text-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  router.push("/app/billing");
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
              >
                <Sparkles size={13} /> Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )
      }

      {/* Header & Step Tracker */}
      <div className="border-b border-app-border pb-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">
              Smart QR Customizer
            </h1>
            <p className="text-app-text-muted text-sm mt-1">Configure routing rules, styles, and printable customer flyers.</p>
          </div>

          {/* Stepper Progress bar & Save Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-app-surface border border-app-border rounded-2xl p-1.5">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${currentStep === step
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-app-text-muted hover:text-white"
                    }`}
                >
                  Step {step}
                </button>
              ))}
            </div>

            <Button
              onClick={handleSave}
              isDisabled={isSaving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10 text-white`}
              style={{
                background: saved
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : "linear-gradient(135deg,#7c3aed,#4f46e5)",
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
                <><Save className="w-3.5 h-3.5" /> <span>Save Settings</span></>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Wizard Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Setup Panel */}
        <div className="lg:col-span-7 space-y-6">

          {/* STEP 1: DESTINATION SETUP */}
          {currentStep === 1 && (
            <div className="bg-app-surface border border-app-border rounded-3xl p-6 space-y-5 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                1. Select QR Code Destination
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "smart-menu", title: "Smart Menu", desc: "Show interactive digital services menu", icon: LayoutGrid },
                  { id: "reviews", title: "Reviews Page", desc: "Redirect to Google Maps review page", icon: Star },
                  { id: "website", title: "Mini Website", desc: "Store home page with contact & hours", icon: Globe },
                  { id: "custom", title: "Custom URL Link", desc: "Enter custom destination url", icon: Link },
                ].map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => setQrDestination(dest.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${qrDestination === dest.id
                      ? "bg-primary/10 border-primary text-primary-light"
                      : "bg-app-bg/30 border-app-border hover:border-app-text-muted/30 text-app-text-muted"
                      }`}
                  >
                    <dest.icon size={18} className="mb-2" />
                    <h3 className="font-bold text-sm text-white">{dest.title}</h3>
                    <p className="text-[11px] text-app-text-dimmed mt-1">{dest.desc}</p>
                  </div >
                ))}
              </div >

              {/* Form Input fields depending on destination selection */}
              < div className="space-y-4 pt-2" >
                {qrDestination === "custom" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">Custom redirect URL</label>
                    <input
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://mywebsite.com/offer"
                      className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2.5 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div >
                )}
                {
                  qrDestination === "reviews" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">Google Review Link</label>
                      <input
                        value={businessData.reviewLink}
                        onChange={(e) => setBusinessData({ ...businessData, reviewLink: e.target.value })}
                        placeholder="https://g.page/r/..."
                        className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2.5 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div >
                  )
                }
              </div >

              {/* Action Button */}
              < div className="flex justify-end pt-4 border-t border-app-border" >
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-primary/20 active:scale-95"
                >
                  Continue to Styling <ArrowRight size={13} />
                </button>
              </div >
            </div >
          )}

          {/* STEP 2: STYLING & CUSTOMIZATION */}
          {
            currentStep === 2 && (
              <div className="bg-app-surface border border-app-border rounded-3xl p-6 space-y-6 backdrop-blur-md">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  2. Styling & Custom Design
                </h2>

                {/* Style Presets */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">Theme Schemes</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Classic Violet", p: "#7c3aed", s: "#7c3aed", isG: false, isP: false },
                      { label: "Forest Green", p: "#059669", s: "#059669", isG: false, isP: false },
                      { label: "Dark Charcoal", p: "#1e293b", s: "#1e293b", isG: false, isP: false },
                      { label: "Electric Sunset (Pro)", p: "#7c3aed", s: "#4f46e5", isG: true, isP: true },
                      { label: "Gold Marble (Pro)", p: "#d97706", s: "#eab308", isG: true, isP: true },
                      { label: "Royal Emerald (Pro)", p: "#059669", s: "#10b981", isG: true, isP: true },
                    ].map((preset) => (
                      <div
                        key={preset.label}
                        onClick={() => selectStylePreset(preset.p, preset.s, preset.isG, preset.isP)}
                        className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${primaryColor === preset.p && gradientEnabled === preset.isG
                          ? "bg-primary/10 border-primary text-primary-light"
                          : "bg-app-bg/30 border-app-border hover:border-app-text-muted/30 text-app-text-muted"
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-white truncate flex-1 pr-1">{preset.label}</span>
                          {preset.isP && <Lock size={10} className="text-app-warning" />}
                        </div >
                        <div className="flex gap-1 h-3 rounded-md overflow-hidden">
                          <div className="flex-1" style={{ backgroundColor: preset.p }} />
                          {preset.isG && <div className="flex-1" style={{ backgroundColor: preset.s }} />}
                        </div>
                      </div >
                    ))
                    }
                  </div >
                </div >

                {/* Design Pattern selectors */}
                < div className="space-y-3 pt-2" >
                  <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">Pattern Dot Shape</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "classic", label: "Classic Block" },
                      { id: "rounded", label: "Smooth Dot" },
                      { id: "blocky", label: "Stylized Grid" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setQrDesignPattern(p.id)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${qrDesignPattern === p.id
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                          : "bg-app-bg/30 border-app-border text-app-text-muted hover:border-app-text-muted/30"
                          }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div >

                {/* Navigation Actions */}
                < div className="flex justify-between pt-4 border-t border-app-border" >
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1 border border-app-border hover:bg-app-surface/80 text-xs font-bold px-4 py-2.5 rounded-xl transition text-app-text-muted"
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-primary/20 active:scale-95"
                  >
                    Continue to Flyers <ArrowRight size={13} />
                  </button>
                </div >
              </div >
            )}

          {/* STEP 3: PRINTABLE FLYER GENERATOR */}
          {
            currentStep === 3 && (
              <div className="bg-app-surface border border-app-border rounded-3xl p-6 space-y-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    3. Export & Printable Flyers
                  </h2>
                  {isPremium ? (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-app-success bg-app-success/10 px-2 py-0.5 rounded-full border border-app-success/20">
                      Pro Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-app-warning bg-app-warning/10 px-2 py-0.5 rounded-full border border-app-warning/20">
                      <Lock size={9} /> Pro Feature
                    </span>
                  )}
                </div>

                {/* Flyer Selection */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "table-stand", label: "A4 Table Stand", desc: "Ideal for billing desk" },
                    { id: "counter-card", label: "Counter Card", desc: "Perfect for door entryway" },
                    { id: "business-card", label: "Pocket Cards", desc: "Small hand-outs" },
                  ].map((flyer) => (
                    <div
                      key={flyer.id}
                      onClick={() => {
                        if (!isPremium && flyer.id !== "table-stand") {
                          setShowUpgradeModal(true);
                          return;
                        }
                        setSelectedFlyerLayout(flyer.id);
                      }}
                      className={`p-3 rounded-2xl border transition cursor-pointer text-center flex flex-col justify-between ${selectedFlyerLayout === flyer.id
                        ? "bg-primary/10 border-primary text-primary-light"
                        : "bg-app-bg/30 border-app-border hover:border-app-text-muted/30 text-app-text-muted"
                        }`}
                    >
                      <FileText size={16} className="mx-auto mb-1.5" />
                      <h3 className="font-bold text-xs text-white leading-tight">{flyer.label}</h3>
                      <p className="text-[9px] text-app-text-dimmed mt-1 leading-relaxed">{flyer.desc}</p>
                    </div >
                  ))
                  }
                </div >

                {/* Printable Canvas Mock Layout preview */}
                < div className="border border-app-border rounded-2xl p-4 bg-app-bg/60 relative overflow-hidden flex flex-col items-center" >

                  <div id="flyer-print-area" className="bg-white rounded-xl p-6 text-black max-w-[280px] w-full text-center space-y-4 shadow-xl">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-violet-600" />
                      <h4 className="font-extrabold text-sm text-violet-900 tracking-tight">{businessData.name}</h4>
                    </div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Scan QR for Smart Menu</p>
                    <div className="flex justify-center p-2.5 border-2 border-violet-100 rounded-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCodeDataUrl} className="w-40 h-40" alt="Print preview QR" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-extrabold text-slate-800">Scan to View, Rate & Pay</p>
                      <p className="text-[8px] text-slate-400 leading-none">Powered by vscan.biz</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3 w-full">
                    <button
                      onClick={printFlyer}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-app-surface hover:bg-app-surface/80 text-xs font-bold py-2.5 rounded-xl border border-app-border text-app-text-muted transition"
                    >
                      <Printer size={13} /> Print Flyer
                    </button>
                    <button
                      onClick={() => {
                        if (!isActiveSubscription) {
                          toast.error("Download and print features require an active subscription plan.");
                          setShowUpgradeModal(true);
                          return;
                        }
                        const link = document.createElement("a");
                        link.download = `${selectedFlyerLayout}-flyer.png`;
                        link.href = qrCodeDataUrl;
                        link.click();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-xs font-bold py-2.5 rounded-xl text-white transition active:scale-95 shadow-lg shadow-primary/20"
                    >
                      <Download size={13} /> High-Res PNG
                    </button>
                  </div>
                </div>

                {/* Navigation Actions */}
                <div className="flex justify-between pt-4 border-t border-app-border">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1 border border-app-border hover:bg-app-surface/80 text-xs font-bold px-4 py-2.5 rounded-xl transition text-app-text-muted"
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                </div>
              </div >
            )}

        </div >

        {/* Right Side: QR Visual Device Mock & Details preview */}
        < div className="lg:col-span-5 flex flex-col items-center gap-6" >
          <div className="sticky top-6 w-full max-w-sm space-y-4">

            {/* Live QR Design Card */}
            <div className="bg-app-surface border border-app-border rounded-3xl p-6 flex flex-col items-center backdrop-blur-md">
              <div className="text-center mb-4">
                <h3 className="font-bold text-sm text-white">Interactive QR Code</h3>
                <p className="text-[10px] text-app-text-dimmed mt-0.5">Real-time design changes are painted below</p>
              </div>

              {/* Canvas element for custom rendering */}
              <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center">
                <canvas ref={canvasRef} width={260} height={260} className="w-[220px] h-[220px]" />
              </div>

              <div className="mt-5 w-full flex items-center justify-between border border-app-border bg-app-bg/40 p-2.5 rounded-xl">
                <span className="text-[10px] text-app-text-dimmed font-mono truncate flex-1 pr-2">
                  {getRedirectUrl()}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 hover:bg-app-surface/80 rounded-lg text-primary-light transition"
                  title="Copy link"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>

            {/* Smart QR Info Stats Widget */}
            <div className="bg-app-surface border border-app-border rounded-3xl p-5 backdrop-blur-md grid grid-cols-2 gap-3 text-center">
              <div className="bg-app-bg/40 rounded-xl p-3.5 border border-app-border">
                <Eye size={16} className="text-primary-light mx-auto mb-1" />
                <p className="text-lg font-bold text-white">4</p>
                <p className="text-[9px] text-app-text-dimmed uppercase tracking-wider font-semibold">Weekly Scans</p>
              </div>
              <div className="bg-app-bg/40 rounded-xl p-3.5 border border-app-border">
                <Share2 size={16} className="text-primary-light mx-auto mb-1" />
                <p className="text-lg font-bold text-white">2</p>
                <p className="text-[9px] text-app-text-dimmed uppercase tracking-wider font-semibold">Total Shares</p>
              </div>
            </div>

          </div>
        </div>

      </div >
    </div >
  );
}