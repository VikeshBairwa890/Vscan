"use client";

import { templates } from "./registry";

export default function TemplatePicker({ selected, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {templates
      .map((t) => {
        const active = selected === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`flex-shrink-0 w-[140px] rounded-2xl border-2 bg-white text-left transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
              active ? "border-violet-500 ring-2 ring-violet-200" : "border-gray-100"
            }`}
          >
            {/* Thumbnail */}
            <div className={`h-[88px] w-full relative overflow-hidden ${t.preview}`}>
              {/* Simulated phone UI lines */}
              <div className="absolute inset-0 flex flex-col justify-end p-2.5 gap-1.5">
                <div className="w-12 h-1.5 rounded-full bg-white/60" />
                <div className="w-20 h-1.5 rounded-full bg-white/40" />
                <div className="w-8  h-1.5 rounded-full bg-white/30" />
              </div>
              {/* Active checkmark */}
              {active && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shadow">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="px-3 py-2.5">
              <div className="flex items-center justify-between gap-1">
                <p className="font-bold text-gray-800 text-xs truncate">{t.name}</p>
                {active && (
                  <span className="text-[9px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 capitalize mt-0.5">{t.category}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}