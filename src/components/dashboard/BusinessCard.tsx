import React from "react";
import { Mail, Phone, Globe, MapPin, Building2, User, Sparkles, QrCode } from "lucide-react";

export interface BusinessCardData {
  businessName: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  gradientEnabled: boolean;
  upiId?: string;
  googleReviewLink?: string;
}

interface BusinessCardProps {
  data: BusinessCardData;
  template: "classic" | "minimal" | "luxury" | "tech" | "creative";
  isFlipped: boolean;
  onClick?: () => void;
  qrCodeDataUrl?: string;
}

export default function BusinessCard({ data, template, isFlipped, onClick, qrCodeDataUrl, }: BusinessCardProps) {
  const {
    businessName,
    name,
    role,
    email,
    phone,
    website,
    address,
    logo,
    primaryColor,
    secondaryColor,
    gradientEnabled,
  } = data;

  // Compute theme background style
  const getBackgroundStyle = (isBack: boolean = false) => {
    switch (template) {
      case "minimal":
        return { background: "#ffffff", color: "#1f2937", border: "1px solid #e5e7eb" };
      case "luxury":
        return { background: "#0c0c12", color: "#f3f4f6", border: "1px solid rgba(212, 175, 55, 0.3)" };
      case "tech":
        return { background: "#05050f", color: "#e0e7ff", border: `1px solid ${primaryColor}` };
      case "creative":
        return {
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || primaryColor})`,
          color: "#ffffff",
          border: "none",
        };
      case "classic":
      default:
        if (isBack) {
          return {
            background: gradientEnabled
              ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
              : primaryColor,
            color: "#ffffff",
            border: "none",
          };
        }
        return { background: "#111827", color: "#f9fafb", border: "1px solid rgba(255,255,255,0.08)" };
    }
  };

  // 1. CLASSIC CARD LAYOUT
  const renderClassicFront = () => (
    <div className="relative w-full h-full p-6 flex flex-col justify-between select-none">
      {/* Decorative colored strip on left */}
      <div
        className="absolute top-0 left-0 w-3 h-full"
        style={{
          background: gradientEnabled
            ? `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`
            : primaryColor,
        }}
      />
      <div className="pl-2 flex justify-between items-start">
        <div>
          <h3 className="font-syne text-lg font-bold tracking-tight text-white leading-tight uppercase">
            {businessName || "Business Name"}
          </h3>
          <p
            className="text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: primaryColor }}
          >
            {role || "Job Title"}
          </p>
        </div>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-white/5 p-1" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>

      <div className="pl-2 mt-2">
        <h2 className="text-xl font-extrabold text-white tracking-tight">{name || "Your Name"}</h2>
      </div>

      <div className="pl-2 grid grid-cols-2 gap-x-4 gap-y-1.5 pt-4 border-t border-white/5 text-[10px] text-gray-300">
        {phone && (
          <div className="flex items-center gap-1.5 truncate">
            <Phone className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <span>{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <span>{email}</span>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-1.5 truncate">
            <Globe className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <span>{website}</span>
          </div>
        )}
        {address && (
          <div className="flex items-center gap-1.5 truncate col-span-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <span className="truncate">{address}</span>
          </div>
        )}
      </div>
    </div>
  );

  // 2. MINIMALIST CARD LAYOUT
  const renderMinimalFront = () => (
    <div className="relative w-full h-full p-6 flex flex-col justify-between select-none">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight leading-tight">{name || "Your Name"}</h2>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mt-0.5">{role || "Job Title"}</p>
        </div>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain rounded-md" />
        ) : (
          <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center border border-gray-200">
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      <div className="space-y-1 text-[10px] text-gray-500 mt-auto border-t border-gray-100 pt-4">
        <h3 className="font-bold text-gray-700 uppercase tracking-widest text-[9px] mb-2">{businessName || "Business Name"}</h3>
        <div className="grid grid-cols-2 gap-2">
          {phone && (
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span>{email}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span>{website}</span>
            </div>
          )}
          {address && (
            <div className="flex items-center gap-1.5 truncate col-span-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              <span>{address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 3. LUXURY GOLD CARD LAYOUT
  const renderLuxuryFront = () => (
    <div className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden select-none">
      {/* Decorative Gold Border Frame */}
      <div className="absolute inset-2.5 border border-[#d4af37]/30 rounded-lg pointer-events-none" />
      <div className="absolute inset-3 border border-[#d4af37]/10 rounded-md pointer-events-none" />

      <div className="z-10 flex justify-between items-start mt-2 px-2">
        <div>
          <h3 className="font-serif text-sm tracking-widest text-[#d4af37] uppercase font-bold">
            {businessName || "BUSINESS PROFILE"}
          </h3>
          <p className="text-[8px] uppercase tracking-widest text-gray-400 font-semibold mt-0.5">
            {role || "Job Title"}
          </p>
        </div>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Logo" className="w-9 h-9 object-contain rounded bg-[#161622] p-1 border border-[#d4af37]/20" />
        ) : (
          <div className="w-9 h-9 rounded bg-[#161622] flex items-center justify-center border border-[#d4af37]/20">
            <Building2 className="w-4 h-4 text-[#d4af37]" />
          </div>
        )}
      </div>

      <div className="z-10 px-2 my-2">
        <h2 className="font-serif text-2xl text-white tracking-wide font-normal italic">
          {name || "Your Name"}
        </h2>
      </div>

      <div className="z-10 px-2 pb-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] text-gray-300 font-sans tracking-wide">
        {phone && (
          <div className="flex items-center gap-1.5 truncate">
            <Phone className="w-3 h-3 text-[#d4af37] shrink-0" />
            <span>{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3 h-3 text-[#d4af37] shrink-0" />
            <span>{email}</span>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-1.5 truncate">
            <Globe className="w-3 h-3 text-[#d4af37] shrink-0" />
            <span>{website}</span>
          </div>
        )}
        {address && (
          <div className="flex items-center gap-1.5 truncate col-span-2">
            <MapPin className="w-3 h-3 text-[#d4af37] shrink-0" />
            <span className="truncate">{address}</span>
          </div>
        )}
      </div>
    </div>
  );

  // 4. TECH / CYBERPUNK CARD LAYOUT
  const renderTechFront = () => (
    <div className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden select-none font-mono">
      {/* Tech Grid Background lines */}
      <div className="absolute inset-0 bg-grid-bg opacity-10 pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[35px] pointer-events-none"
        style={{ backgroundColor: `${primaryColor}22` }}
      />
      <div
        className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-[35px] pointer-events-none"
        style={{ backgroundColor: `${secondaryColor || primaryColor}22` }}
      />

      <div className="z-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">
              {businessName || "SYSTEM.INIT"}
            </h3>
          </div>
          <p className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold mt-0.5">
            {`// ROLE: `}
            <span className="text-white">{role || "Job Title"}</span>
          </p>
        </div>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Logo" className="w-9 h-9 object-contain rounded border border-white/10 bg-black/40" />
        ) : (
          <div className="w-9 h-9 rounded border border-white/10 bg-black/40 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      <div className="z-10 my-2">
        <h2 className="text-lg font-bold tracking-tight text-white uppercase">
          {name || "User ID"}
        </h2>
      </div>

      <div className="z-10 space-y-1 text-[9px] text-gray-400 pt-3 border-t border-white/10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {phone && (
            <div className="flex items-center gap-1 truncate">
              <span className="text-gray-500 font-bold">TEL:</span>
              <span className="text-gray-300 truncate">{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-1 truncate">
              <span className="text-gray-500 font-bold">NET:</span>
              <span className="text-gray-300 truncate">{email}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-1 truncate">
              <span className="text-gray-500 font-bold">URL:</span>
              <span className="text-gray-300 truncate">{website}</span>
            </div>
          )}
          {address && (
            <div className="flex items-center gap-1 truncate col-span-2">
              <span className="text-gray-500 font-bold">LOC:</span>
              <span className="text-gray-300 truncate">{address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 5. CREATIVE VIBRANT CARD LAYOUT
  const renderCreativeFront = () => (
    <div className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden select-none">
      {/* Curved geometric abstract shape in the background */}
      <div className="absolute top-[-30%] right-[-10%] w-[180px] h-[180px] rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[120px] h-[120px] rounded-full bg-black/10 pointer-events-none" />

      <div className="z-10 flex justify-between items-start">
        <div className="bg-white/15 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          <h3 className="font-syne text-[10px] font-extrabold tracking-wider text-white uppercase">
            {businessName || "Creator"}
          </h3>
        </div>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Logo" className="w-9 h-9 object-contain rounded-full bg-white/20 p-1 border border-white/30" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="z-10 my-3">
        <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none">
          {name || "Creator Name"}
        </h2>
        <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">
          {role || "Creative Director"}
        </p>
      </div>

      <div className="z-10 grid grid-cols-2 gap-x-3 gap-y-1 pt-3 border-t border-white/20 text-[9px] text-white/90 font-medium">
        {phone && (
          <div className="flex items-center gap-1.5 truncate">
            <Phone className="w-3 h-3 text-white/70 shrink-0" />
            <span>{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3 h-3 text-white/70 shrink-0" />
            <span>{email}</span>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-1.5 truncate">
            <Globe className="w-3 h-3 text-white/70 shrink-0" />
            <span>{website}</span>
          </div>
        )}
        {address && (
          <div className="flex items-center gap-1.5 truncate col-span-2">
            <MapPin className="w-3 h-3 text-white/70 shrink-0" />
            <span>{address}</span>
          </div>
        )}
      </div>
    </div>
  );

  // RENDER CARD BACK SIDE (Always centered QR Code with template aesthetic)
  const renderCardBack = () => {
    const isLuxury = template === "luxury";
    const isMinimal = template === "minimal";
    const isTech = template === "tech";
    const isCreative = template === "creative";

    return (
      <div className="w-full h-full p-6 flex flex-col items-center justify-center select-none relative overflow-hidden">
        {isLuxury && (
          <>
            <div className="absolute inset-2.5 border border-[#d4af37]/30 rounded-lg pointer-events-none" />
            <div className="absolute inset-3 border border-[#d4af37]/10 rounded-md pointer-events-none" />
          </>
        )}
        {isTech && (
          <>
            <div className="absolute inset-0 bg-grid-bg opacity-10 pointer-events-none" />
            {/* Tech scanner animated line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400 opacity-30 animate-pulse" />
          </>
        )}
        {isCreative && (
          <div className="absolute top-[-20%] left-[-20%] w-[180px] h-[180px] rounded-full bg-white/10 blur-xl pointer-events-none" />
        )}

        <div className="flex flex-col items-center gap-3.5 z-10">
          {/* Cardholder Company Label */}
          <div className="text-center">
            <h4
              className={`text-xs font-bold uppercase tracking-widest ${isMinimal ? "text-gray-700" : isLuxury ? "text-[#d4af37] font-serif" : "text-white"
                }`}
            >
              {businessName || "Vscan Connected"}
            </h4>
            <p className={`text-[8px] uppercase tracking-wider mt-0.5 ${isMinimal ? "text-gray-400" : "text-white/60"}`}>
              {isTech ? "// ROUTING.ACTIVE" : "Scan to connect & pay"}
            </p>
          </div>

          {/* QR Code Container */}
          <div
            className={`p-2 rounded-xl shadow-xl flex items-center justify-center ${isMinimal
              ? "bg-white border border-gray-200"
              : isLuxury
                ? "bg-[#161622] border border-[#d4af37]/30"
                : isTech
                  ? "bg-black/60 border border-cyan-400/40"
                  : "bg-white"
              }`}
          >
            {qrCodeDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeDataUrl}
                alt="Business QR"
                className="w-24 h-24 object-contain rounded"
              />
            ) : (
              <div className="w-24 h-24 rounded flex flex-col items-center justify-center bg-gray-100">
                <QrCode className="w-8 h-8 text-gray-400" />
                <span className="text-[7px] text-gray-400 mt-1">Generating QR</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <p
              className={`text-[8px] font-bold tracking-widest uppercase ${isMinimal ? "text-gray-400" : isLuxury ? "text-[#d4af37]/80" : "text-white/70"
                }`}
            >
              Powered by Vscan
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`w-full aspect-[1.75] cursor-pointer relative transition-all duration-500 rounded-2xl shadow-xl overflow-hidden`}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="w-full h-full relative transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* CARD FRONT SIDE */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl"
          style={{
            backfaceVisibility: "hidden",
            ...getBackgroundStyle(false),
          }}
        >
          {template === "classic" && renderClassicFront()}
          {template === "minimal" && renderMinimalFront()}
          {template === "luxury" && renderLuxuryFront()}
          {template === "tech" && renderTechFront()}
          {template === "creative" && renderCreativeFront()}
        </div>

        {/* CARD BACK SIDE */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            ...getBackgroundStyle(true),
          }}
        >
          {renderCardBack()}
        </div>
      </div>
    </div>
  );
}
