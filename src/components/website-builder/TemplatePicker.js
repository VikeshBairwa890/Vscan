"use client";

import { LayoutTemplate } from "lucide-react";
import { templates } from "./registry";

function TemplateStack({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {templates.map((t) => {
        const active = selected === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`w-full flex items-center gap-4 rounded-xl border-2 bg-white text-left transition-all duration-200 overflow-hidden shadow-sm active:scale-[0.99] min-h-[72px] ${active ? "border-violet-500 ring-2 ring-violet-300/50" : "border-gray-100"
              }`}
          >
            <div className={`h-[72px] w-[72px] flex-shrink-0 relative overflow-hidden ${t.preview}`}>
              <div className="absolute inset-0 flex flex-col justify-end p-2 gap-1">
                <div className="w-10 h-1.5 rounded-full bg-white/60" />
                <div className="w-14 h-1.5 rounded-full bg-white/40" />
              </div>
              {active && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shadow">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 py-3 pr-4">
              <p className="font-bold text-gray-800 text-base truncate">{t.name}</p>
              <p className="text-sm text-gray-400 capitalize mt-0.5">{t.category}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TemplateScroll({ selected, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {templates.map((t) => {
        const active = selected === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={`flex-shrink-0 w-[200px] rounded-xl border bg-app-surface/40 hover:bg-app-surface/80 text-left transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 ${active ? "border-primary ring-2 ring-primary/20" : "border-app-border"
              }`}
          >
            <div className="px-3.5 py-3 flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-primary/20 text-primary-light" : "bg-app-bg border border-app-border text-app-text-dimmed"
                }`}>
                <LayoutTemplate size={14} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="font-bold text-white text-xs truncate leading-snug">{t.name}</p>
                <p className="text-[10px] text-app-text-dimmed capitalize font-medium mt-0.5">{t.category}</p>
              </div>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary-light flex-shrink-0 animate-pulse" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function TemplatePicker({ selected, onSelect, layout = "stack" }) {
  if (layout === "scroll") {
    return <TemplateScroll selected={selected} onSelect={onSelect} />;
  }
  return <TemplateStack selected={selected} onSelect={onSelect} />;
}
