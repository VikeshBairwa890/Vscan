"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  CreditCard, CheckCircle2, ShieldCheck, Building2, Sparkles,
  Crown, Zap, ArrowRight, QrCode, Lock, AlertCircle, RefreshCw, Calendar, Flame
} from "lucide-react";
import { toast } from "sonner";
import { load } from "@cashfreepayments/cashfree-js";

export default function BillingSubscription() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [subscription, setSubscription] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [txnId, setTxnId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const fetchBillingInfo = async () => {

    try {
      setError(null);
      const res = await fetch(`/api/business/billing`);
      if (!res.ok) {
        toast.error("Failed to load billing information");
        return;
      }
      const data = await res.json();
      if (data.success == false) {
        toast.error(data.message);
        return;
      }
      if (data.success) {
        setSubscription(data.subscription);
        setTransactions(data.transactions || []);
      } else {
        setError(data.message || "Failed to load billing information.");
      }

    } catch (e) {
      console.error(e);
      setError("An error occurred while loading billing data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchBillingInfo();

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

        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        await fetch("/api/business/billing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: "PREMIUM",
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            isActive: true,
            orderId: orderId
          })
        });

        fetchBillingInfo(); // Reload active subscription state
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

      const response = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  const handleManualVerify = async () => {
    if (!txnId.trim()) return;
    setVerifying(true);

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const orderId = `UTR_${txnId.trim()}`;

      const res = await fetch("/api/business/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: "PREMIUM",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          isActive: true,
          orderId: orderId
        })
      });
      if (!res.ok) {
        toast.error("Failed to verify manual payment");
        return;
      }

      if (res.ok) {
        setVerified(true);
        toast.success("Manual UTR submitted and activated!");
        setTxnId("");
        fetchBillingInfo();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to submit verification.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to verify manual payment");
    } finally {
      setVerifying(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-app-bg text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light"></div>
          <p className="text-xs text-app-text-muted">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-app-bg text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl max-w-md text-center flex flex-col items-center gap-2">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="font-bold">Failed to load billing data</p>
          <p className="text-xs text-app-text-muted mt-1">{error}</p>
        </div>
        <button
          onClick={fetchBillingInfo}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark px-6 py-2.5 rounded-xl text-xs font-bold text-white transition active:scale-95"
        >
          <RefreshCw size={12} /> Try Again
        </button>
      </div>
    );
  }

  const getPlanDetails = () => {
    if (!subscription || subscription.plan === "FREE") {
      return {
        name: "Free Starter Plan",
        status: "Inactive",
        duration: "Trial Plan",
        cycle: "Free Forever",
        expiryDate: "Never",
        remainingDaysText: "Lifetime Access",
        isPremium: false,
        isExpired: false
      };
    }

    const isPremium = subscription.plan !== "FREE";
    const status = subscription.isExpired ? "Expired" : (subscription.isActive ? "Active" : "Inactive");

    let duration = "Lifetime Free";
    let expiryDate = "Never";
    let remainingDaysText = "N/A";

    if (subscription.endDate) {
      const date = new Date(subscription.endDate);
      expiryDate = date.toLocaleDateString("en-IN", {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      duration = "Yearly Subscription";
      remainingDaysText = subscription.isExpired ? "Expired" : `${subscription.remainingDays} days left`;
    }

    let planName = "Free Starter Plan";
    if (subscription.plan === "BASIC") planName = "Basic Growth Plan";
    if (subscription.plan === "PREMIUM") planName = "Premium Pro Plan";
    if (subscription.plan === "ENTERPRISE") planName = "Enterprise Suite Plan";

    return {
      name: planName,
      status,
      duration,
      cycle: "One-time / Year",
      expiryDate,
      remainingDaysText,
      isPremium,
      isExpired: subscription.isExpired
    };
  };

  const planInfo = getPlanDetails();

  return (
    <div className="min-h-screen bg-app-bg text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="border-b border-app-border pb-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">
            Subscription Plan
          </h1>
          <p className="text-app-text-muted text-sm mt-1">Upgrade your features, generate high-res QR designs, and review transactions.</p>
        </div>
        <button
          onClick={fetchBillingInfo}
          className="flex items-center gap-1.5 bg-app-surface border border-app-border hover:bg-app-bg/60 px-4 py-2 rounded-xl text-xs font-bold text-white transition active:scale-95 cursor-pointer"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Current Plan & Features & Transaction History */}
        <div className="lg:col-span-2 space-y-6">

          {/* Plan Info Card */}
          <div className="bg-app-surface border border-app-border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/10 to-transparent blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                  {planInfo.isPremium ? <Crown className="w-7 h-7 text-white" /> : <CreditCard className="w-7 h-7 text-white" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {planInfo.name}
                  </h2>
                  <p className="text-sm text-app-text-muted mt-1">
                    {planInfo.isPremium ? "Full access to smart routing, styling, review and SEO generation tools." : "Basic digital storefront configurations."}
                  </p>
                </div>
              </div>

              <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${planInfo.status === "Active"
                ? "bg-app-success/10 border-app-success/20 text-app-success"
                : planInfo.status === "Expired"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-app-warning/10 border-app-warning/20 text-app-warning"
                }`}>
                {planInfo.status === "Active" ? "Active Account" : planInfo.status === "Expired" ? "Plan Expired" : "Trial / Upgrade Required"}
              </div>
            </div>

            {/* Status Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-app-bg/40 border border-app-border rounded-2xl p-5">
                <div className="flex items-center gap-1.5 text-app-text-dimmed">
                  <Calendar size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Plan Duration</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1.5">{planInfo.duration}</h3>
                <p className="text-xs text-app-text-muted mt-0.5">{planInfo.isPremium ? "Auto-renews next cycle" : "Upgrade below to keep features"}</p>
              </div>

              <div className="bg-app-bg/40 border border-app-border rounded-2xl p-5">
                <div className="flex items-center gap-1.5 text-app-text-dimmed">
                  <Flame size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Days Remaining</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1.5">{planInfo.remainingDaysText}</h3>
                <p className="text-xs text-app-text-muted mt-0.5">Expiry: {planInfo.expiryDate}</p>
              </div>

              <div className="bg-app-bg/40 border border-app-border rounded-2xl p-5">
                <div className="flex items-center gap-1.5 text-app-text-dimmed">
                  <CreditCard size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Billing Cycle</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1.5">{planInfo.cycle}</h3>
                <p className="text-xs text-app-text-muted mt-0.5">UPI / NetBanking via Cashfree</p>
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div className="bg-app-surface border border-app-border rounded-3xl p-6 backdrop-blur-md">
            <h3 className="font-bold text-base text-white mb-4">Included Pro Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Smart Gradient QR Customizer", desc: "Unlock premium aesthetic patterns" },
                { title: "AI Suggestions Studio Generator", desc: "Write professional SEO tags instantly" },
                { title: "Custom Review Routing Page", desc: "Capture Google Maps feedbacks directly" },
                { title: "Print-ready Counter Stand Flyers", desc: "Download high-res PDF print layouts" },
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-3 bg-app-bg/40 border border-app-border rounded-2xl p-4">
                  <div className="w-6 h-6 rounded-full bg-app-success/10 border border-app-success/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={12} className="text-app-success" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                    <p className="text-[10px] text-app-text-dimmed mt-0.5 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UTR Verification Card */}
          <div className="bg-app-surface border border-app-border rounded-3xl p-6 backdrop-blur-md space-y-4">
            <div>
              <h3 className="font-bold text-base text-white">Manual UPI Transfer Verification</h3>
              <p className="text-xs text-app-text-muted mt-0.5">Transferred directly via UPI QR code? Input the UTR code below to verify.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={txnId}
                onChange={(e) => { setTxnId(e.target.value); setVerified(false); }}
                placeholder="Enter 12-Digit UPI Ref / UTR Number"
                className="flex-1 border border-app-border bg-app-bg/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={handleManualVerify}
                disabled={verifying || !txnId.trim()}
                className="bg-primary hover:bg-primary-dark px-6 py-2.5 cursor-pointer rounded-xl text-xs font-bold text-white transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {verifying && <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>}
                <span>{verifying ? "Verifying..." : "Submit Verification"}</span>
              </button>
            </div>

            {verified && (
              <div className="flex items-center gap-2 text-xs text-app-success bg-app-success/10 p-3.5 rounded-xl border border-app-success/20">
                <CheckCircle2 size={14} /> Submission recorded! Your premium features have been successfully activated.
              </div>
            )}
          </div>

          {/* Transaction History Section */}
          <div className="bg-app-surface border border-app-border rounded-3xl p-6 backdrop-blur-md">
            <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-light" />
              <span>Transaction History</span>
            </h3>
            {transactions.length === 0 ? (
              <div className="text-center py-8 bg-app-bg/20 rounded-2xl border border-dashed border-app-border">
                <p className="text-xs text-app-text-dimmed">No payment transactions found</p>
                <p className="text-[10px] text-app-text-muted mt-1">Upgrade below or complete a payment to see invoices here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-app-border bg-app-bg/20">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-app-bg/60 border-b border-app-border text-app-text-dimmed font-bold">
                      <th className="p-4">Date</th>
                      <th className="p-4">Order / UTR ID</th>
                      <th className="p-4">Plan</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border/40 text-app-text-muted">
                    {transactions.map((txn) => {
                      const txnDate = new Date(txn.createdAt).toLocaleDateString("en-IN", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      });

                      return (
                        <tr key={txn.id} className="hover:bg-app-bg/40 transition-colors">
                          <td className="p-4 whitespace-nowrap">{txnDate}</td>
                          <td className="p-4 font-mono font-bold text-[10px] whitespace-nowrap text-white">{txn.orderId}</td>
                          <td className="p-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary-light">
                              {txn.planType}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap text-white font-bold">₹{txn.amount.toLocaleString("en-IN")}</td>
                          <td className="p-4 whitespace-nowrap capitalize text-[10px]">{txn.paymentMethod || "Cashfree Gate"}</td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${txn.status === "PAID"
                              ? "bg-app-success/10 border border-app-success/20 text-app-success"
                              : txn.status === "PENDING"
                                ? "bg-app-warning/10 border border-app-warning/20 text-app-warning"
                                : "bg-red-500/10 border border-red-500/20 text-red-400"
                              }`}>
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Price Card & UPI QR */}
        <div className="space-y-6">
          <div className="bg-app-surface border border-app-border rounded-3xl overflow-hidden backdrop-blur-md">

            {/* Upgrade header */}
            <div className="px-6 py-5 border-b border-app-border bg-app-bg/30">
              <div className="flex items-center gap-2 text-app-warning">
                <Crown size={18} />
                <span className="font-bold text-sm text-white">Pro Upgrade Offer</span>
              </div>
              <p className="text-[11px] text-app-text-muted mt-1">Instant digital activation in India.</p>
            </div>

            {/* Price section */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary-light bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Pro Annual
                </span>
                <span className="text-[10px] font-bold text-app-success bg-app-success/10 border border-app-success/20 px-2.5 py-1 rounded-full">
                  SAVE 30%
                </span>
              </div>

              <div className="pt-2">
                <span className="text-xs text-app-text-dimmed line-through">₹4,999/yr</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">₹3,499</span>
                  <span className="text-xs text-app-text-muted">/ year</span>
                </div>
                <p className="text-[11px] text-app-text-dimmed mt-1.5 leading-relaxed">Tax included. Unlimited scan analytics & templates.</p>
              </div>

              <button
                onClick={handleCashfreePayment}
                disabled={isCreatingOrder || planInfo.status === "Active"}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-extrabold text-xs py-3 rounded-2xl transition active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingOrder ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span>Initializing Cashfree...</span>
                  </>
                ) : planInfo.status === "Active" ? (
                  <>
                    <ShieldCheck size={14} />
                    <span>Your Pro Plan is Active</span>
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
            <div className="p-6 bg-app-bg/60 border-t border-app-border text-center space-y-4">
              <span className="text-[9px] font-bold text-app-text-muted uppercase tracking-widest">Or Pay Directly via QR</span>

              <div className="w-40 h-40 bg-white rounded-2xl p-2.5 mx-auto flex items-center justify-center shadow-lg border border-app-border">
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
                <p className="text-[10px] text-app-text-muted font-bold flex items-center justify-center gap-1">
                  <QrCode size={11} /> Scan using GPay, PhonePe, Paytm
                </p>
                <p className="text-[9px] text-app-text-dimmed font-mono">UPI ID: vscan@ybl</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}