"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AIFieldButtonProps {
  field: string;
  currentValue?: string;
  onSuggest: (value: string) => void;
  className?: string;
}

export default function AIFieldButton({
  field,
  currentValue,
  onSuggest,
  className = "",
}: AIFieldButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

  const runGenerate = async (prompt?: string) => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      toast.error("Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(userStr);
      const res = await fetch("/api/business/ai-generate-field", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          field,
          currentValue: currentValue || "",
          userPrompt: prompt || undefined,
        }),
      });

      const result = await res.json();
      if (result.success && result.suggestion) {
        onSuggest(result.suggestion);
        toast.success(
          result.usedFallback
            ? "Suggestion applied (add OPENAI_API_KEY for full AI)"
            : "AI suggestion applied"
        );
        setShowPrompt(false);
        setUserPrompt("");
      } else {
        toast.error(result.message || result.error || "Could not generate suggestion");
      }
    } catch {
      toast.error("AI suggestion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {showPrompt && (
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Tell AI what you want..."
            className="flex-1 min-w-0 border border-app-border rounded-lg px-2.5 py-1.5 text-xs bg-app-bg text-white placeholder-app-text-dimmed focus:outline-none focus:ring-1 focus:ring-primary/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") runGenerate(userPrompt);
            }}
          />
          <button
            type="button"
            onClick={() => runGenerate(userPrompt)}
            disabled={loading}
            className="text-[10px] font-bold text-primary-light px-2 py-1 rounded-lg border border-primary/30 hover:bg-primary/10 disabled:opacity-50"
          >
            Go
          </button>
        </div>
      )}
      <button
        type="button"
        title="AI suggest"
        disabled={loading}
        onClick={() => {
          if (showPrompt) {
            runGenerate(userPrompt);
          } else {
            runGenerate();
          }
        }}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide text-primary-light border border-primary/25 bg-primary/5 hover:bg-primary/15 transition-colors disabled:opacity-50 flex-shrink-0"
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Sparkles size={12} />
        )}
        <span className="hidden sm:inline">AI</span>
      </button>
      <button
        type="button"
        title="Custom AI prompt"
        disabled={loading}
        onClick={() => setShowPrompt((v) => !v)}
        className="text-[10px] font-semibold text-app-text-dimmed hover:text-white px-1.5 py-1 flex-shrink-0"
      >
        {showPrompt ? "×" : "Prompt"}
      </button>
    </div>
  );
}
