import { CreditCard, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function BillingSubscription() {
    const [txnId, setTxnId] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const handleVerify = () => {
        if (!txnId.trim()) return;
        setVerifying(true);
        setTimeout(() => {
            setVerifying(false);
            setVerified(true);
        }, 1500);
    };
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-start justify-start w-full p-2 border-b">
                    <h1 className="text-2xl font-bold">Billing & Subscription</h1>
                    <p className="text-lg text-gray-600">Manage your billing and subscription details.</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-5 mt-10">
                    <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 " />

                    <div className="flex flex-col items-center pt-8 pb-6 px-6">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                            <CreditCard size={28} className="text-blue-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Premium Plan</h2>
                        <p className="text-gray-500 text-sm mt-1">Smart QR &amp; AI Reputation Management</p>
                    </div>

                    <div className="mx-6 mb-6 border border-gray-100 rounded-xl divide-y divide-gray-100">
                        <div className="flex items-center justify-between px-4 py-3.5">
                            <span className="text-sm text-gray-500 font-medium">Status</span>
                            <span className="text-xs font-bold bg-red-100 text-red-500 px-3 py-1 rounded-full tracking-wide uppercase">
                                Trial
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3.5">
                            <span className="text-sm text-gray-500 font-medium">Expires</span>
                            <span className="text-sm font-bold text-gray-800">5/22/2026</span>
                        </div>
                    </div>

                    <div className="mx-6 mb-6 bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-1">
                            <span className="text-blue-700 font-bold text-base">Yearly Subscription</span>
                            <div className="text-right">
                                <p className="text-gray-400 text-xs line-through">₹ 4999.00</p>
                                <p className="text-blue-600 font-extrabold text-xl leading-tight">₹ 3499.00</p>
                            </div>
                        </div>
                        <p className="text-blue-500 text-xs mb-4">
                            Includes all features: Smart QR, AI Reviews, Unlimited Scans, Custom Branding.
                        </p>

                        <div className="bg-white border border-gray-100 rounded-xl flex flex-col items-center py-5 px-4 shadow-sm">
                            <p className="text-xs text-gray-400 tracking-widest uppercase mb-3 font-medium">
                                Scan to Pay
                            </p>

                            <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg p-1.5 mb-3">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <rect x="0" y="0" width="30" height="30" fill="black" rx="3" />
                                    <rect x="4" y="4" width="22" height="22" fill="white" rx="2" />
                                    <rect x="8" y="8" width="14" height="14" fill="black" rx="1" />

                                    <rect x="70" y="0" width="30" height="30" fill="black" rx="3" />
                                    <rect x="74" y="4" width="22" height="22" fill="white" rx="2" />
                                    <rect x="78" y="8" width="14" height="14" fill="black" rx="1" />

                                    <rect x="0" y="70" width="30" height="30" fill="black" rx="3" />
                                    <rect x="4" y="74" width="22" height="22" fill="white" rx="2" />
                                    <rect x="8" y="78" width="14" height="14" fill="black" rx="1" />

                                    {[35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65].map((x) =>
                                        [0, 3, 6, 9, 12, 15, 18, 21, 24, 27].map((y) =>
                                            (x + y) % 9 < 5 ? (
                                                <rect key={`${x}-${y}`} x={x} y={y} width="2.5" height="2.5" fill="black" />
                                            ) : null
                                        )
                                    )}
                                    {[0, 3, 6, 9, 12, 15, 18, 21, 24, 27].map((x) =>
                                        [35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65].map((y) =>
                                            (x + y) % 7 < 4 ? (
                                                <rect key={`${x}-${y}`} x={x} y={y} width="2.5" height="2.5" fill="black" />
                                            ) : null
                                        )
                                    )}
                                    {[35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68].map((x) =>
                                        [35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68].map((y) =>
                                            (x * y) % 11 < 6 ? (
                                                <rect key={`${x}-${y}`} x={x} y={y} width="2.5" height="2.5" fill="black" />
                                            ) : null
                                        )
                                    )}

                                    <circle cx="50" cy="50" r="7" fill="white" stroke="black" strokeWidth="1" />
                                    <circle cx="50" cy="50" r="4.5" fill="#5f259f" />
                                    <path d="M48 48 L52 50 L48 52 Z" fill="white" />
                                </svg>
                            </div>

                            <p className="text-xs text-gray-400">Scan using any UPI App</p>
                        </div>
                    </div>

                    <div className="mx-6 mb-8">
                        <label className="block text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">
                            Enter Transaction ID / UTR
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={txnId}
                                onChange={(e) => { setTxnId(e.target.value); setVerified(false); }}
                                placeholder="e.g. UPI12345678"
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition bg-white"
                            />
                            <button
                                onClick={handleVerify}
                                disabled={verifying || !txnId.trim()}
                                className={` px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5
                                        ${verified
                                        ? "bg-green-500 text-white"
                                        : verifying
                                            ? "bg-blue-300 text-white cursor-wait"
                                            : txnId.trim()
                                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                                : "bg-blue-200 text-blue-300 cursor-not-allowed"
                                    }`}
                            >
                                {verified ? (
                                    <><CheckCircle2 size={14} /> Done</>
                                ) : verifying ? (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Checking
                                    </span>
                                ) : "Verify"}
                            </button>
                        </div>
                        <p className="text-xs text-blue-400 mt-2">
                            Your account will be activated instantly upon admin verification.
                        </p>
                        {verified && (
                            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Transaction submitted successfully!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
