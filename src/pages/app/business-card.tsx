import React, { useState, useEffect, } from "react";
import { useRouter } from "next/router";
import {
  Building2,
  User,
  Sparkles,
  QrCode,
  Download,
  Printer,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Sparkle,
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import BusinessCard, { BusinessCardData } from "@/components/dashboard/BusinessCard";
import { Button } from "@heroui/react";

export default function BusinessCardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    "classic" | "minimal" | "luxury" | "tech" | "creative"
  >("classic");

  // Customization State
  const [cardData, setCardData] = useState<BusinessCardData>({
    businessName: "",
    name: "",
    role: "Founder & Owner",
    email: "",
    phone: "",
    website: "",
    address: "",
    logo: "",
    primaryColor: "#7c3aed",
    secondaryColor: "#4f46e5",
    gradientEnabled: true,
    upiId: "",
    googleReviewLink: "",
  });

  const [qrDestination, setQrDestination] = useState<"website" | "reviews" | "custom">("website");
  const [customQrUrl, setCustomQrUrl] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    setMounted(true);
    const loadProfileData = async () => {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) {
        router.push("/auth/login");
        return;
      }

      try {
        const user = JSON.parse(userStr);
        // Call the dashboard status API to fetch profile details
        const res = await fetch(`/api/business/status?userId=${user.id}`);
        if (res.ok) {
          const statusData = await res.json();
          if (statusData.hasProfile) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vscan.biz";
            setHasProfile(true);
            setCardData((prev) => ({
              ...prev,
              businessName: statusData.businessName || "",
              name: user.name || statusData.businessName || "Your Name",
              email: statusData.email || user.email || "",
              phone: statusData.contactNumber || statusData.whatsappNumber || "",
              website: statusData.website || (statusData.customSlug 
                ? `${baseUrl}/profile/${statusData.customSlug}?tab=website`
                : `${baseUrl}/profile/${(statusData.businessName || "").toLowerCase().replace(/\s+/g, "-")}?tab=website`),
              address: statusData.businessAddress || "",
              logo: statusData.logo || "",
              googleReviewLink: statusData.googleReviewLink || "",
              upiId: statusData.upiId || "",
            }));
          }
        }
      } catch (err) {
        console.error("Error loading profile settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [router]);

  // Compute QR Code URL Destination
  const getQrRedirectUrl = () => {
    if (qrDestination === "reviews") {
      return cardData.googleReviewLink || "https://google.com";
    }
    if (qrDestination === "custom") {
      return customQrUrl || (process.env.NEXT_PUBLIC_APP_URL || "https://vscan.biz");
    }
    return cardData.website || (process.env.NEXT_PUBLIC_APP_URL || "https://vscan.biz");
  };

  // Generate QR Code data URL dynamically when destination changes
  useEffect(() => {
    if (!mounted || loading) return;

    const generateQR = async () => {
      const url = getQrRedirectUrl();
      try {
        const qrUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });
        setQrCodeDataUrl(qrUrl);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };

    generateQR();
  }, [mounted, loading, qrDestination, customQrUrl, cardData.website, cardData.googleReviewLink]);

  const handleInputChange = (field: keyof BusinessCardData, value: any) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  // Preset Colors selection
  const handlePresetSelect = (primary: string, secondary: string, gradient: boolean) => {
    setCardData((prev) => ({
      ...prev,
      primaryColor: primary,
      secondaryColor: secondary,
      gradientEnabled: gradient,
    }));
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      toast.error("Session expired, please login again.");
      setIsSaving(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      // Persist changes in the profile database using the save API
      const response = await fetch("/api/business/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          businessName: cardData.businessName,
          tagline: cardData.role,
          logo: cardData.logo,
          phone: cardData.phone,
          email: cardData.email,
          address: cardData.address,
          website: cardData.website,
          googleReviewLink: cardData.googleReviewLink,
          upiId: cardData.upiId,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to save changes.");
        setIsSaving(false);
        return;
      }
      const result = await response.json();
      if (result.success == false) {
        toast.error(result.message);
        setIsSaving(false);
        return;
      }
      setSaved(true);
      toast.success(result.message);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Error saving details.");
    } finally {
      setIsSaving(false);
    }
  };

  // Download high-resolution PNG using HTML5 Canvas drawing
  const downloadCardImage = async (side: "front" | "back") => {
    const canvas = document.createElement("canvas");
    // Standard credit card aspect ratio 3.5:2 (DPI-optimized 1050x600 px)
    canvas.width = 1050;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper for loading images
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = src;
      });
    };

    try {
      // FRONT SIDE DRAWING
      if (side === "front") {
        if (selectedTemplate === "minimal") {
          // White minimalist card
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 4;
          ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

          // Business Logo
          if (cardData.logo) {
            try {
              const logoImg = await loadImage(cardData.logo);
              ctx.drawImage(logoImg, 80, 80, 80, 80);
            } catch (e) {
              // fallback placeholder icon
              ctx.fillStyle = "#f3f4f6";
              ctx.fillRect(80, 80, 80, 80);
              ctx.fillStyle = "#9ca3af";
              ctx.font = "bold 24px sans-serif";
              ctx.fillText("B", 108, 128);
            }
          }

          // User Name
          ctx.fillStyle = "#1f2937";
          ctx.font = "bold 44px sans-serif";
          ctx.fillText(cardData.name || "Your Name", 80, 240);

          // Job Title
          ctx.fillStyle = "#9ca3af";
          ctx.font = "bold 20px sans-serif";
          ctx.fillText((cardData.role || "Job Title").toUpperCase(), 80, 280);

          // Divider Line
          ctx.strokeStyle = "#f3f4f6";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(80, 320);
          ctx.lineTo(970, 320);
          ctx.stroke();

          // Business Name
          ctx.fillStyle = "#4b5563";
          ctx.font = "bold 26px sans-serif";
          ctx.fillText(cardData.businessName || "Business Name", 80, 380);

          // Contact Details
          ctx.fillStyle = "#4b5563";
          ctx.font = "normal 20px sans-serif";
          let currentY = 440;

          if (cardData.phone) {
            ctx.fillText(`Phone: ${cardData.phone}`, 80, currentY);
          }
          if (cardData.email) {
            ctx.fillText(`Email: ${cardData.email}`, 500, currentY);
          }
          currentY += 45;
          if (cardData.website) {
            ctx.fillText(`Website: ${cardData.website}`, 80, currentY);
          }
          if (cardData.address) {
            ctx.fillText(`Address: ${cardData.address}`, 500, currentY);
          }

        } else if (selectedTemplate === "luxury") {
          // Luxury Gold & Black card
          ctx.fillStyle = "#0c0c12";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Gold frame border
          ctx.strokeStyle = "#d4af37";
          ctx.lineWidth = 3;
          ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
          ctx.strokeStyle = "rgba(212, 175, 55, 0.2)";
          ctx.lineWidth = 1;
          ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

          // Logo
          if (cardData.logo) {
            try {
              const logoImg = await loadImage(cardData.logo);
              ctx.drawImage(logoImg, 80, 80, 80, 80);
            } catch (e) {
              ctx.fillStyle = "#161622";
              ctx.fillRect(80, 80, 80, 80);
              ctx.strokeStyle = "#d4af37";
              ctx.strokeRect(80, 80, 80, 80);
            }
          }

          // Business Name
          ctx.fillStyle = "#d4af37";
          ctx.font = "bold 32px Georgia, serif";
          ctx.fillText((cardData.businessName || "Business Name").toUpperCase(), 80, 220);

          // Job Title
          ctx.fillStyle = "#9ca3af";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText((cardData.role || "Job Title").toUpperCase(), 80, 255);

          // Name
          ctx.fillStyle = "#ffffff";
          ctx.font = "italic 52px Georgia, serif";
          ctx.fillText(cardData.name || "Your Name", 80, 335);

          // Divider line
          ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(80, 380);
          ctx.lineTo(970, 380);
          ctx.stroke();

          // Contacts
          ctx.fillStyle = "#d1d5db";
          ctx.font = "18px Georgia, serif";
          let currentY = 430;

          if (cardData.phone) ctx.fillText(`Tel: ${cardData.phone}`, 80, currentY);
          if (cardData.email) ctx.fillText(`Net: ${cardData.email}`, 500, currentY);
          currentY += 45;
          if (cardData.website) ctx.fillText(`Web: ${cardData.website}`, 80, currentY);
          if (cardData.address) ctx.fillText(`Loc: ${cardData.address}`, 500, currentY);

        } else if (selectedTemplate === "tech") {
          // Cyberpunk / Tech card
          ctx.fillStyle = "#05050f";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw neon accent border
          ctx.strokeStyle = cardData.primaryColor;
          ctx.lineWidth = 4;
          ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

          // Draw some cyber lines
          ctx.strokeStyle = `${cardData.secondaryColor}44`;
          ctx.lineWidth = 1;
          for (let i = 40; i < canvas.width; i += 60) {
            ctx.beginPath();
            ctx.moveTo(i, 20);
            ctx.lineTo(i, canvas.height - 20);
            ctx.stroke();
          }

          // Active indicator dot
          ctx.fillStyle = cardData.primaryColor;
          ctx.beginPath();
          ctx.arc(80, 85, 8, 0, 2 * Math.PI);
          ctx.fill();

          // Init System label
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 28px Courier New, monospace";
          ctx.fillText((cardData.businessName || "SYSTEM.INIT").toUpperCase(), 110, 95);

          // Role
          ctx.fillStyle = "#6b7280";
          ctx.font = "bold 18px Courier New, monospace";
          ctx.fillText(`// ROLE: ${cardData.role || "Job Title"}`, 80, 145);

          // User Name
          ctx.fillStyle = cardData.primaryColor;
          ctx.font = "bold 48px Courier New, monospace";
          ctx.fillText(cardData.name || "USER ID", 80, 235);

          // Divider
          ctx.strokeStyle = `${cardData.primaryColor}55`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(80, 290);
          ctx.lineTo(970, 290);
          ctx.stroke();

          // Contacts
          ctx.fillStyle = "#93c5fd";
          ctx.font = "18px Courier New, monospace";
          let currentY = 350;

          if (cardData.phone) ctx.fillText(`[TEL] ${cardData.phone}`, 80, currentY);
          if (cardData.email) ctx.fillText(`[NET] ${cardData.email}`, 500, currentY);
          currentY += 45;
          if (cardData.website) ctx.fillText(`[URL] ${cardData.website}`, 80, currentY);
          if (cardData.address) ctx.fillText(`[LOC] ${cardData.address}`, 500, currentY);

        } else if (selectedTemplate === "creative") {
          // Creative Vibrant Gradient card
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, cardData.primaryColor);
          grad.addColorStop(1, cardData.secondaryColor);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw some decorative white circular overlay
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          ctx.beginPath();
          ctx.arc(900, 100, 200, 0, 2 * Math.PI);
          ctx.fill();

          // Logo
          if (cardData.logo) {
            try {
              const logoImg = await loadImage(cardData.logo);
              ctx.drawImage(logoImg, 80, 80, 80, 80);
            } catch (e) {
              ctx.fillStyle = "rgba(255,255,255,0.2)";
              ctx.beginPath();
              ctx.arc(120, 120, 40, 0, 2 * Math.PI);
              ctx.fill();
            }
          }

          // Business Name
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 26px sans-serif";
          ctx.fillText((cardData.businessName || "Creative").toUpperCase(), 80, 220);

          // User Name
          ctx.fillStyle = "#ffffff";
          ctx.font = "extrabold 56px sans-serif";
          ctx.fillText(cardData.name || "Creator Name", 80, 315);

          // Job Title
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.font = "bold 20px sans-serif";
          ctx.fillText((cardData.role || "Creative Director").toUpperCase(), 80, 360);

          // Divider
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(80, 400);
          ctx.lineTo(970, 400);
          ctx.stroke();

          // Contacts
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 18px sans-serif";
          let currentY = 460;

          if (cardData.phone) ctx.fillText(`Phone: ${cardData.phone}`, 80, currentY);
          if (cardData.email) ctx.fillText(`Email: ${cardData.email}`, 500, currentY);
          currentY += 45;
          if (cardData.website) ctx.fillText(`Web: ${cardData.website}`, 80, currentY);
          if (cardData.address) ctx.fillText(`Loc: ${cardData.address}`, 500, currentY);

        } else {
          // Classic Executive card
          ctx.fillStyle = "#111827";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Stripe on left
          const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
          grad.addColorStop(0, cardData.primaryColor);
          grad.addColorStop(1, cardData.secondaryColor);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 30, canvas.height);

          // Logo
          if (cardData.logo) {
            try {
              const logoImg = await loadImage(cardData.logo);
              ctx.drawImage(logoImg, 80, 80, 80, 80);
            } catch (e) {
              ctx.fillStyle = "#1f2937";
              ctx.fillRect(80, 80, 80, 80);
            }
          }

          // Business Name
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 34px sans-serif";
          ctx.fillText((cardData.businessName || "Business Name").toUpperCase(), 80, 220);

          // Job Title
          ctx.fillStyle = cardData.primaryColor;
          ctx.font = "bold 20px sans-serif";
          ctx.fillText((cardData.role || "Job Title").toUpperCase(), 80, 260);

          // Name
          ctx.fillStyle = "#ffffff";
          ctx.font = "extrabold 48px sans-serif";
          ctx.fillText(cardData.name || "Your Name", 80, 335);

          // Divider line
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(80, 380);
          ctx.lineTo(970, 380);
          ctx.stroke();

          // Contacts
          ctx.fillStyle = "#d1d5db";
          ctx.font = "18px sans-serif";
          let currentY = 430;

          if (cardData.phone) ctx.fillText(`Phone: ${cardData.phone}`, 80, currentY);
          if (cardData.email) ctx.fillText(`Email: ${cardData.email}`, 500, currentY);
          currentY += 45;
          if (cardData.website) ctx.fillText(`Website: ${cardData.website}`, 80, currentY);
          if (cardData.address) ctx.fillText(`Address: ${cardData.address}`, 500, currentY);
        }

        // BACK SIDE DRAWING (Centered QR code & template details)
      } else {
        if (selectedTemplate === "minimal") {
          // White minimalist card
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 4;
          ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

          // Header
          ctx.fillStyle = "#1f2937";
          ctx.font = "bold 28px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(cardData.businessName || "Vscan Connected", canvas.width / 2, 120);

          ctx.fillStyle = "#9ca3af";
          ctx.font = "normal 18px sans-serif";
          ctx.fillText("Scan QR code to connect & pay", canvas.width / 2, 160);

          // Draw QR
          if (qrCodeDataUrl) {
            const qrImg = await loadImage(qrCodeDataUrl);
            ctx.drawImage(qrImg, canvas.width / 2 - 125, 200, 250, 250);
          }

          // Footer
          ctx.fillStyle = "#9ca3af";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText("POWERED BY VSCAN", canvas.width / 2, 510);

        } else if (selectedTemplate === "luxury") {
          // Luxury Black & Gold
          ctx.fillStyle = "#0c0c12";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Gold frame border
          ctx.strokeStyle = "#d4af37";
          ctx.lineWidth = 3;
          ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

          // Header
          ctx.fillStyle = "#d4af37";
          ctx.font = "bold 28px Georgia, serif";
          ctx.textAlign = "center";
          ctx.fillText((cardData.businessName || "Vscan Connected").toUpperCase(), canvas.width / 2, 120);

          ctx.fillStyle = "#9ca3af";
          ctx.font = "italic 18px Georgia, serif";
          ctx.fillText("Scan QR code to connect & pay", canvas.width / 2, 160);

          // QR Code with Gold Border Container
          if (qrCodeDataUrl) {
            const qrImg = await loadImage(qrCodeDataUrl);
            ctx.drawImage(qrImg, canvas.width / 2 - 125, 200, 250, 250);
            ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
            ctx.lineWidth = 3;
            ctx.strokeRect(canvas.width / 2 - 130, 195, 260, 260);
          }

          // Footer
          ctx.fillStyle = "#d4af37";
          ctx.font = "16px Georgia, serif";
          ctx.fillText("POWERED BY VSCAN", canvas.width / 2, 510);

        } else if (selectedTemplate === "tech") {
          // Cyberpunk/Tech
          ctx.fillStyle = "#05050f";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = cardData.primaryColor;
          ctx.lineWidth = 4;
          ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

          // Header
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 26px Courier New, monospace";
          ctx.textAlign = "center";
          ctx.fillText((cardData.businessName || "Vscan Connected").toUpperCase(), canvas.width / 2, 110);

          ctx.fillStyle = "#6b7280";
          ctx.font = "bold 16px Courier New, monospace";
          ctx.fillText("// SCAN QR TO ACCESS PROFILE SERVICES", canvas.width / 2, 150);

          // QR
          if (qrCodeDataUrl) {
            const qrImg = await loadImage(qrCodeDataUrl);
            ctx.drawImage(qrImg, canvas.width / 2 - 125, 190, 250, 250);
            ctx.strokeStyle = cardData.primaryColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(canvas.width / 2 - 130, 185, 260, 260);
          }

          // Footer
          ctx.fillStyle = cardData.primaryColor;
          ctx.font = "bold 16px Courier New, monospace";
          ctx.fillText("[SYSTEM.READY_VSCAN]", canvas.width / 2, 505);

        } else if (selectedTemplate === "creative") {
          // Creative Gradient
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, cardData.primaryColor);
          grad.addColorStop(1, cardData.secondaryColor);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Header
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 32px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText((cardData.businessName || "Vscan Connected").toUpperCase(), canvas.width / 2, 110);

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.font = "bold 18px sans-serif";
          ctx.fillText("Scan QR to connect & view services", canvas.width / 2, 155);

          // QR
          if (qrCodeDataUrl) {
            const qrImg = await loadImage(qrCodeDataUrl);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(canvas.width / 2 - 135, 190, 270, 270);
            ctx.drawImage(qrImg, canvas.width / 2 - 125, 200, 250, 250);
          }

          // Footer
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText("POWERED BY VSCAN.BIZ", canvas.width / 2, 515);

        } else {
          // Classic Executive
          ctx.fillStyle = "#111827";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Colored stripe on left
          const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
          grad.addColorStop(0, cardData.primaryColor);
          grad.addColorStop(1, cardData.secondaryColor);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 30, canvas.height);

          // Header
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 30px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText((cardData.businessName || "Vscan Connected").toUpperCase(), canvas.width / 2, 115);

          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.font = "18px sans-serif";
          ctx.fillText("Scan QR code to connect & pay", canvas.width / 2, 155);

          // QR
          if (qrCodeDataUrl) {
            const qrImg = await loadImage(qrCodeDataUrl);
            ctx.drawImage(qrImg, canvas.width / 2 - 125, 190, 250, 250);
          }

          // Footer
          ctx.fillStyle = cardData.primaryColor;
          ctx.font = "bold 16px sans-serif";
          ctx.fillText("POWERED BY VSCAN", canvas.width / 2, 505);
        }
      }

      // Download trigger
      const link = document.createElement("a");
      link.download = `${cardData.businessName || "business"}-card-${side}-${selectedTemplate}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success(`${side.toUpperCase()} card side downloaded successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Download failed. Check image URLs or CORS blocks.");
    }
  };

  // Launch A4 Printing Layout Grid (10 cards per page, 3.5"x2" credit card dimensions)
  const handlePrintCards = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // CSS Styling for the A4 sheet grid
    const stylesHtml = `
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          font-family: Arial, sans-serif;
          background: #ffffff;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .page-header {
          text-align: center;
          margin-bottom: 10px;
          border-bottom: 1px solid #ccc;
          width: 100%;
          padding-bottom: 5px;
        }
        .page-header h1 {
          font-size: 16px;
          margin: 0;
          color: #333;
        }
        .page-header p {
          font-size: 10px;
          margin: 3px 0 0 0;
          color: #777;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 3.5in);
          grid-gap: 15px;
          justify-content: center;
          margin-top: 10px;
        }
        .card-box {
          width: 3.5in;
          height: 2.0in;
          border: 1px dashed #cccccc;
          position: relative;
          box-sizing: border-box;
          overflow: hidden;
          page-break-inside: avoid;
        }
        /* CLASSIC */
        .card-classic {
          background-color: #111827;
          color: #f9fafb;
          padding: 15px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        .stripe-classic {
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
        }
        /* MINIMALIST */
        .card-minimal {
          background-color: #ffffff;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          padding: 15px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        /* LUXURY */
        .card-luxury {
          background-color: #0c0c12;
          color: #f3f4f6;
          padding: 15px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        .luxury-frame {
          position: absolute;
          inset: 8px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          pointer-events: none;
        }
        /* CYBERPUNK */
        .card-tech {
          background-color: #05050f;
          color: #e0e7ff;
          padding: 15px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          border: 1px solid ${cardData.primaryColor};
          font-family: monospace;
        }
        /* CREATIVE */
        .card-creative {
          background: linear-gradient(135deg, ${cardData.primaryColor}, ${cardData.secondaryColor});
          color: #ffffff;
          padding: 15px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        .card-title {
          font-weight: bold;
          font-size: 14px;
          margin: 0;
        }
        .card-subtitle {
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 2px;
        }
        .card-name {
          font-size: 16px;
          font-weight: 800;
          margin: 10px 0 0 0;
        }
        .card-info {
          font-size: 8px;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 5px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 3px;
        }
        .minimal-info {
          border-top: 1px solid #f3f4f6;
          color: #4b5563;
        }
        .luxury-text {
          font-family: Georgia, serif;
        }
        .back-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }
        .qr-img {
          width: 75px;
          height: 75px;
          margin: 6px 0;
          padding: 3px;
          background: #ffffff;
          border-radius: 6px;
        }
        .print-btn-bar {
          background: #f3f4f6;
          padding: 10px;
          width: 100%;
          display: flex;
          justify-content: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .btn-print {
          background: #7c3aed;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
        }
        @media print {
          .print-btn-bar {
            display: none;
          }
        }
      </style>
    `;

    // Render single template front or back HTML card
    const renderCardHtml = (side: "front" | "back") => {
      const isClassic = selectedTemplate === "classic";
      const isMinimal = selectedTemplate === "minimal";
      const isLuxury = selectedTemplate === "luxury";
      const isTech = selectedTemplate === "tech";
      const isCreative = selectedTemplate === "creative";

      if (side === "front") {
        return `
          <div class="card-box">
            ${isClassic ? `
              <div class="card-classic">
                <div class="stripe-classic" style="background: ${cardData.primaryColor}"></div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <div class="card-title">${cardData.businessName || "Business"}</div>
                    <div class="card-subtitle" style="color: ${cardData.primaryColor}">${cardData.role}</div>
                  </div>
                  ${cardData.logo ? `<img src="${cardData.logo}" style="width: 25px; height: 25px; object-fit: contain;" />` : ""}
                </div>
                <div class="card-name">${cardData.name}</div>
                <div class="card-info">
                  <div>📞 ${cardData.phone || ""}</div>
                  <div>✉️ ${cardData.email || ""}</div>
                  <div>🌐 ${cardData.website || ""}</div>
                  <div style="grid-column: span 2;">📍 ${cardData.address || ""}</div>
                </div>
              </div>
            ` : ""}

            ${isMinimal ? `
              <div class="card-minimal">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <div class="card-title" style="color:#111; font-size:15px;">${cardData.name}</div>
                    <div class="card-subtitle" style="color:#888;">${cardData.role}</div>
                  </div>
                  ${cardData.logo ? `<img src="${cardData.logo}" style="width: 20px; height: 20px; object-fit: contain;" />` : ""}
                </div>
                <div class="card-subtitle" style="font-weight:bold; color:#444; margin-top:20px;">${cardData.businessName}</div>
                <div class="card-info minimal-info">
                  <div>Phone: ${cardData.phone || ""}</div>
                  <div>Email: ${cardData.email || ""}</div>
                  <div>Website: ${cardData.website || ""}</div>
                  <div style="grid-column: span 2;">Loc: ${cardData.address || ""}</div>
                </div>
              </div>
            ` : ""}

            ${isLuxury ? `
              <div class="card-luxury luxury-text">
                <div class="luxury-frame"></div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; z-index: 10;">
                  <div>
                    <div class="card-title" style="color: #d4af37;">${cardData.businessName}</div>
                    <div class="card-subtitle" style="color: #999;">${cardData.role}</div>
                  </div>
                </div>
                <div class="card-name" style="font-style: italic; font-weight: normal; color: white;">${cardData.name}</div>
                <div class="card-info" style="border-top: 1px solid rgba(212,175,55,0.2); z-index:10; color:#ddd;">
                  <div>Tel: ${cardData.phone || ""}</div>
                  <div>Mail: ${cardData.email || ""}</div>
                  <div>Web: ${cardData.website || ""}</div>
                  <div style="grid-column: span 2;">Loc: ${cardData.address || ""}</div>
                </div>
              </div>
            ` : ""}

            ${isTech ? `
              <div class="card-tech">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <div class="card-title" style="color:${cardData.primaryColor};">// ${cardData.businessName}</div>
                    <div class="card-subtitle" style="color:#555;">[ROLE: ${cardData.role}]</div>
                  </div>
                </div>
                <div class="card-name" style="color:#fff;">${cardData.name}</div>
                <div class="card-info" style="border-top: 1px solid ${cardData.primaryColor}33; color:#93c5fd;">
                  <div>TEL: ${cardData.phone || ""}</div>
                  <div>NET: ${cardData.email || ""}</div>
                  <div>URL: ${cardData.website || ""}</div>
                  <div style="grid-column: span 2;">LOC: ${cardData.address || ""}</div>
                </div>
              </div>
            ` : ""}

            ${isCreative ? `
              <div class="card-creative">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius:10px; font-size:9px;">${cardData.businessName}</div>
                </div>
                <div class="card-name" style="font-size:18px;">${cardData.name}</div>
                <div class="card-subtitle" style="color: rgba(255,255,255,0.8);">${cardData.role}</div>
                <div class="card-info" style="border-top: 1px solid rgba(255,255,255,0.2);">
                  <div>Phone: ${cardData.phone || ""}</div>
                  <div>Email: ${cardData.email || ""}</div>
                  <div>Web: ${cardData.website || ""}</div>
                  <div style="grid-column: span 2;">Loc: ${cardData.address || ""}</div>
                </div>
              </div>
            ` : ""}
          </div>
        `;
      } else {
        // BACK SIDE
        return `
          <div class="card-box">
            <div class="${isClassic ? "card-classic" : isMinimal ? "card-minimal" : isLuxury ? "card-luxury luxury-text" : isTech ? "card-tech" : "card-creative"}">
              ${isClassic ? `<div class="stripe-classic" style="background: ${cardData.primaryColor}"></div>` : ""}
              ${isLuxury ? `<div class="luxury-frame"></div>` : ""}
              <div class="back-side">
                <div class="card-title" style="font-size: 11px; ${isMinimal ? "color:#333;" : isLuxury ? "color:#d4af37;" : "color:#fff;"}">${cardData.businessName || "Vscan Connected"}</div>
                <div style="font-size: 7px; color: ${isMinimal ? "#777" : "rgba(255,255,255,0.6)"}; margin-top:2px;">Scan to connect & pay</div>
                <img src="${qrCodeDataUrl}" class="qr-img" />
                <div style="font-size: 7px; font-weight: bold; letter-spacing: 1px; color: ${isMinimal ? "#999" : isLuxury ? "#d4af37" : "rgba(255,255,255,0.7)"};">POWERED BY VSCAN</div>
              </div>
            </div>
          </div>
        `;
      }
    };

    // Render 5 fronts, then 5 backs (formatted for double-sided sheet alignment!)
    let gridContent = "";
    for (let i = 0; i < 5; i++) {
      gridContent += renderCardHtml("front");
      gridContent += renderCardHtml("front");
    }

    // Page 2: Back sides
    let gridContentBack = "";
    for (let i = 0; i < 5; i++) {
      gridContentBack += renderCardHtml("back");
      gridContentBack += renderCardHtml("back");
    }

    // Complete HTML structure for A4 print
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Vscan Business Cards</title>
          ${stylesHtml}
        </head>
        <body>
          <div class="print-btn-bar">
            <button class="btn-print" onclick="window.print()">Print A4 Card Sheet</button>
          </div>
          
          <div class="page-header">
            <h1>Business Cards - Front Side</h1>
            <p>Layout template: ${selectedTemplate.toUpperCase()} (Cut along dashed guidelines)</p>
          </div>
          <div class="grid-container">
            ${gridContent}
          </div>

          <div style="page-break-before: always; width: 100%; border-top: 1px dashed #ccc; margin: 30px 0;"></div>

          <div class="page-header">
            <h1>Business Cards - Back Side (Smart QR)</h1>
            <p>Layout template: ${selectedTemplate.toUpperCase()} (Aligns with Front Side for printing)</p>
          </div>
          <div class="grid-container">
            ${gridContentBack}
          </div>

          <script>
            window.onload = function() {
              // Wait for image renders
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-app-bg text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light"></div>
          <p className="text-xs text-app-text-muted">Loading your designer toolbox...</p>
        </div>
      </div>
    );
  }

  // Fallback check: if user has no business profile yet
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-app-bg text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />
        <div className="max-w-md bg-app-surface border border-app-border rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-primary/10 text-primary-light rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
            <Building2 size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Business Profile Required</h2>
            <p className="text-app-text-muted text-sm leading-relaxed">
              You must complete the onboarding profile setup before you can design and generate smart QR business cards.
            </p>
          </div>
          <button
            onClick={() => router.push("/app/onboarding")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-sm font-extrabold text-white transition shadow-lg shadow-primary/20"
          >
            Complete Onboarding Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[80px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px]" />

      {/* Header section */}
      <div className="border-b border-app-border pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">
            Smart Business Card Designer
          </h1>
          <p className="text-app-text-muted text-sm mt-1">
            Design premium double-sided business cards connected directly to your Vscan smart QR routing profile.
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          isDisabled={isSaving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10 text-white`}
          style={{
            background: saved
              ? "linear-gradient(135deg,#10b981,#059669)"
              : "linear-gradient(135deg,#7c3aed,#4f46e5)",
          }}
        >
          {saved ? (
            <>
              <CheckCircle2 size={14} /> <span>Saved!</span>
            </>
          ) : isSaving ? (
            <>
              <RefreshCw className="animate-spin w-3.5 h-3.5" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" /> <span>Save Details</span>
            </>
          )}
        </Button>
      </div>

      {/* Design Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Designer Toolbox */}
        <div className="lg:col-span-6 space-y-6">

          {/* Card Style Selector */}
          <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-primary-light" />
              Select Card Design Layout
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {[
                { id: "classic", name: "Classic" },
                { id: "minimal", name: "Minimal" },
                { id: "luxury", name: "Luxury" },
                { id: "tech", name: "Cyber" },
                { id: "creative", name: "Creative" },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id as any)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition ${selectedTemplate === tmpl.id
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                    : "bg-app-bg/30 border-app-border text-app-text-muted hover:border-app-text-muted/30"
                    }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile Fields Form */}
          <div className="bg-app-surface border border-app-border rounded-2xl p-6 space-y-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User size={16} className="text-primary-light" />
              Customize Info Content
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">
                    Business Name
                  </label>
                  <input
                    value={cardData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    value={cardData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">
                  Job Title / Designation
                </label>
                <input
                  value={cardData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">
                    Inquiry Email
                  </label>
                  <input
                    value={cardData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">
                    Phone / Contact
                  </label>
                  <input
                    value={cardData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">
                  Company Website / Mini-Site URL
                </label>
                <input
                  value={cardData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">
                  Physical Store Address
                </label>
                <input
                  value={cardData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* QR Destination settings */}
          <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-4 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <QrCode size={16} className="text-primary-light" />
              Smart QR Redirect Link
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "website", name: "Mini Website", desc: "Redirect to mini website" },
                { id: "reviews", name: "Google Reviews", desc: "Collect customer ratings" },
                { id: "custom", name: "Custom Link", desc: "Set custom redirect URL" },
              ].map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => setQrDestination(dest.id as any)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-center flex flex-col justify-between ${qrDestination === dest.id
                    ? "bg-primary/10 border-primary text-primary-light"
                    : "bg-app-bg/30 border-app-border text-app-text-muted hover:border-app-text-muted/30"
                    }`}
                >
                  <span className="text-xs font-bold text-white block">{dest.name}</span>
                  <span className="text-[9px] text-app-text-dimmed mt-1 block leading-tight">{dest.desc}</span>
                </div>
              ))}
            </div>

            {qrDestination === "custom" && (
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">
                  Custom Destination URL
                </label>
                <input
                  value={customQrUrl}
                  onChange={(e) => setCustomQrUrl(e.target.value)}
                  placeholder="https://mywebsite.com/special-offer"
                  className="border border-app-border bg-app-bg/50 rounded-xl px-3 py-2 text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Color Palettes Customizer */}
          {selectedTemplate !== "minimal" && selectedTemplate !== "luxury" && (
            <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkle size={16} className="text-primary-light" />
                Color Theme Schemes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {[
                  { name: "Vscan Purple", p: "#7c3aed", s: "#4f46e5", g: true },
                  { name: "Forest Green", p: "#059669", s: "#10b981", g: true },
                  { name: "Sunset Orange", p: "#ea580c", s: "#eab308", g: true },
                  { name: "Neon Cyber", p: "#d946ef", s: "#06b6d4", g: true },
                ].map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset.p, preset.s, preset.g)}
                    className={`relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${cardData.primaryColor === preset.p && cardData.gradientEnabled === preset.g
                      ? "bg-primary/10 border-primary text-white"
                      : "bg-app-bg/30 border-app-border text-app-text-muted hover:border-app-text-muted/30"
                      }`}
                  >
                    <span className="text-[10px] font-bold text-white truncate">{preset.name}</span>
                    <div className="flex gap-1 h-3 rounded-md overflow-hidden">
                      <div className="flex-1" style={{ backgroundColor: preset.p }} />
                      <div className="flex-1" style={{ backgroundColor: preset.s }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Card Live 3D Previewer & Downloader Actions */}
        <div className="lg:col-span-6 flex flex-col items-center gap-6">
          <div className="sticky top-6 w-full max-w-md space-y-6">

            {/* 3D Flip Card Widget */}
            <div className="bg-app-surface border border-app-border rounded-3xl p-6 flex flex-col items-center backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="text-center mb-6">
                <h3 className="font-bold text-sm text-white">Live 3D Card Preview</h3>
                <p className="text-[10px] text-app-text-dimmed mt-0.5">Click the card or use flip controls to toggle sides</p>
              </div>

              {/* 3D Component Rendering */}
              <div className="w-full flex justify-center py-2 px-1">
                <BusinessCard
                  data={cardData}
                  template={selectedTemplate}
                  isFlipped={isFlipped}
                  onClick={() => setIsFlipped(!isFlipped)}
                  qrCodeDataUrl={qrCodeDataUrl}
                />
              </div>

              {/* Toggle controls */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsFlipped(false)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-extrabold transition border ${!isFlipped
                    ? "bg-primary border-primary text-white"
                    : "bg-app-bg/30 border-app-border text-app-text-muted hover:text-white"
                    }`}
                >
                  Front Info
                </button>
                <button
                  onClick={() => setIsFlipped(true)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-extrabold transition border ${isFlipped
                    ? "bg-primary border-primary text-white"
                    : "bg-app-bg/30 border-app-border text-app-text-muted hover:text-white"
                    }`}
                >
                  Back QR Code
                </button>
              </div>

              {/* Destination info badge */}
              <div className="mt-5 w-full bg-app-bg/40 p-2.5 rounded-xl border border-app-border text-center flex items-center justify-center gap-1.5">
                <span className="text-[9px] uppercase tracking-widest text-app-text-dimmed font-bold">QR Destination:</span>
                <span className="text-[9px] font-mono text-primary-light truncate max-w-[200px]" title={getQrRedirectUrl()}>
                  {getQrRedirectUrl()}
                </span>
                <a href={getQrRedirectUrl()} target="_blank" rel="noreferrer" className="text-app-text-dimmed hover:text-white transition">
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Exporter Action Buttons Card */}
            <div className="bg-app-surface border border-app-border rounded-3xl p-6 space-y-4 backdrop-blur-md shadow-2xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-app-border pb-2 mb-2">
                Export & Print Actions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => downloadCardImage("front")}
                  className="flex items-center justify-center gap-2 bg-app-bg/50 hover:bg-app-bg/80 text-xs font-bold py-3 px-4 rounded-xl border border-app-border text-app-text-muted transition active:scale-95"
                >
                  <Download size={14} className="text-primary-light" /> Download Front (PNG)
                </button>
                <button
                  onClick={() => downloadCardImage("back")}
                  className="flex items-center justify-center gap-2 bg-app-bg/50 hover:bg-app-bg/80 text-xs font-bold py-3 px-4 rounded-xl border border-app-border text-app-text-muted transition active:scale-95"
                >
                  <Download size={14} className="text-primary-light" /> Download Back (PNG)
                </button>
              </div>

              <button
                onClick={handlePrintCards}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-xs font-extrabold py-3.5 px-4 rounded-xl text-white transition active:scale-95 shadow-lg shadow-primary/20"
              >
                <Printer size={15} /> Print A4 Business Card Sheet (10 Cards)
              </button>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                <p className="text-[10px] text-app-text-muted leading-relaxed">
                  💡 <strong>Print Tip:</strong> Selecting &quot;Print A4 Business Card Sheet&quot; generates a sheet of 10 card alignments. For double-sided print, feed the sheet back into the printer reversed!
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
