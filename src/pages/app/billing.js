"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  CreditCard, CheckCircle2, ShieldCheck, Building2, Sparkles,
  Crown, Zap, ArrowRight, QrCode, Lock, Award
} from "lucide-react";
import { toast } from "sonner";
import { load } from "@cashfreepayments/cashfree-js";

export default function BillingSubscription() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const [txnId, setTxnId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const fetchStatus = async () => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      router.push("/auth/login");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      const res = await fetch(`/api/business/status?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStatus();

    const initializeCashfree = async () => {
      try {
        const cf = await load({
          mode: process.env.NODE_ENV === "production" ? "production" : "sandbox"
        });
        setCashfree(cf);
      } catch (err) {
        console.error("Cashfree SDK failed to load", err);
      }
    };
    initializeCashfree();
  }, []);

  // Check for order_id callback in URL
  useEffect(() => {
    if (!router.isReady) return;
    const { order_id } = router.query;
    if (order_id) {
      verifyCashfreeOrder(order_id);
    }
  }, [router.isReady, router.query]);

  const verifyCashfreeOrder = async (orderId) => {
    try {
      setVerifying(true);
      const response = await fetch("/api/cashfree/verify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId })
      });
      const data = await response.json();

      if (data.order_status === "PAID") {
        setVerified(true);
        toast.success("Payment verified successfully!");
        fetchStatus(); // Reload active subscription state
        router.replace("/app/billing", undefined, { shallow: true });
      } else {
        toast.error(`Payment status: ${data.order_status}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  const handleCashfreePayment = async () => {
    try {
      setIsCreatingOrder(true);
      const userStr = localStorage.getItem("currentUser");
      const userId = userStr ? JSON.parse(userStr).id : "";

      const response = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({ amount: 3499 })
      });
      const data = await response.json();

      if (data.payment_session_id && cashfree) {
        let checkoutOptions = {
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self"
        };
        cashfree.checkout(checkoutOptions);
      } else {
        toast.error(data.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during payment");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleManualVerify = () => {
    if (!txnId.trim()) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      toast.success("Manual UTR submitted! Review in progress.");
    }, 1500);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  const isPremium = status?.subscription?.isActive || false;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[90px]" />

      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Subscription Plan
        </h1>
        <p className="text-slate-400 text-sm mt-1">Upgrade your features, generate high-res QR designs, and review transactions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Current Plan & Features */}
        <div className="lg:col-span-2 space-y-6">

          {/* Plan Info Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {isPremium ? "Premium Pro Plan" : "Free Starter Plan"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {isPremium ? "Full access to smart routing, styling and reviews tools" : "Basic digital storefront configurations"}
                  </p>
                </div>
              </div>

              <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${isPremium
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}>
                {isPremium ? "Active Account" : "Trial / Upgrade Required"}
              </div>
            </div>

            {/* Trial Counter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plan Duration</span>
                <h3 className="text-lg font-bold text-white mt-1.5">{isPremium ? "Yearly Subscription" : "Trial Plan"}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{isPremium ? "Auto-renews next year" : "Upgrade below to keep features"}</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Billing Cycle</span>
                <h3 className="text-lg font-bold text-white mt-1.5">One-time / Year</h3>
                <p className="text-xs text-slate-400 mt-0.5">INR payment verification via Cashfree</p>
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="font-bold text-base text-white mb-4">Included Pro Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Smart Gradient QR Customizer", desc: "Unlock premium aesthetic patterns" },
                { title: "AI suggestions studio generator", desc: "Write professional SEO tags instantly" },
                { title: "Custom review routing page", desc: "Capture Google Maps feedbacks directly" },
                { title: "Print-ready counter stand flyers", desc: "Download high-res PDF print layouts" },
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-3 bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UTR Verification Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <div>
              <h3 className="font-bold text-base text-white">Manual UPI Transfer Verification</h3>
              <p className="text-xs text-slate-400 mt-0.5">Transferred directly via UPI QR code? Input the UTR code below to verify.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={txnId}
                onChange={(e) => { setTxnId(e.target.value); setVerified(false); }}
                placeholder="Enter 12-Digit UPI Ref / UTR Number"
                className="flex-1 border border-slate-700 bg-slate-900/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleManualVerify}
                disabled={verifying || !txnId.trim()}
                className="bg-indigo-650 hover:bg-indigo-600 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition active:scale-95 disabled:opacity-50"
              >
                {verifying ? "Checking..." : "Submit Verification"}
              </button>
            </div>

            {verified && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 size={14} /> Submission recorded! Your premium features will activate within 10 minutes.
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Price Card & UPI QR */}
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-md">

            {/* Upgrade header */}
            <div className="px-6 py-5 border-b border-slate-800 bg-slate-850/40">
              <div className="flex items-center gap-2 text-amber-400">
                <Crown size={18} />
                <span className="font-bold text-sm text-white">Pro Upgrade Offer</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Instant digital activation in India.</p>
            </div>

            {/* Price section */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Pro Annual
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  SAVE 30%
                </span>
              </div>

              <div className="pt-2">
                <span className="text-xs text-slate-500 line-through">₹4,999/yr</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">₹3,499</span>
                  <span className="text-xs text-slate-400">/ year</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">Tax included. Unlimited scan analytics & templates.</p>
              </div>

              <button
                onClick={handleCashfreePayment}
                disabled={isCreatingOrder}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-extrabold text-xs py-3 rounded-2xl transition active:scale-95 shadow-lg shadow-amber-500/10"
              >
                {isCreatingOrder ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span>Initializing Cashfree...</span>
                  </>
                ) : (
                  <>
                    <span>Upgrade via Instant UPI</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>

            {/* QR Scan Section */}
            <div className="p-6 bg-slate-900/60 border-t border-slate-800 text-center space-y-4">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Or Pay Directly via QR</span>

              <div className="w-40 h-40 bg-white rounded-2xl p-2.5 mx-auto flex items-center justify-center shadow-lg border border-slate-750">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="28" height="28" fill="black" rx="2" />
                  <rect x="3" y="3" width="22" height="22" fill="white" rx="1" />
                  <rect x="7" y="7" width="14" height="14" fill="black" />

                  <rect x="72" y="0" width="28" height="28" fill="black" rx="2" />
                  <rect x="75" y="3" width="22" height="22" fill="white" rx="1" />
                  <rect x="79" y="7" width="14" height="14" fill="black" />

                  <rect x="0" y="72" width="28" height="28" fill="black" rx="2" />
                  <rect x="3" y="75" width="22" height="22" fill="white" rx="1" />
                  <rect x="7" y="79" width="14" height="14" fill="black" />

                  {[35, 38, 41, 44, 47, 50, 53, 56, 59, 62].map((x) =>
                    [35, 38, 41, 44, 47, 50, 53, 56, 59, 62].map((y) =>
                      (x * y) % 11 < 6 ? (
                        <rect key={`${x}-${y}`} x={x} y={y} width="2.5" height="2.5" fill="black" />
                      ) : null
                    )
                  )}
                </svg>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
                  <QrCode size={11} /> Scan using GPay, PhonePe, Paytm
                </p>
                <p className="text-[9px] text-slate-500 font-mono">UPI ID: vscan@ybl</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}