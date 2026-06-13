import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Scissors,
  Hotel,
  Utensils,
  Dumbbell,
  Stethoscope,
  ShoppingBag,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Upload,
  Plus,
  Trash2,
  Phone,

  Link,
  MapPin,
  Building2,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import servicesByCategory from "./Services";

interface OnboardingWizardProps {
  onComplete?: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavedBadgeVisible, setIsSavedBadgeVisible] = useState(false);

  // Core Form State
  const [businessName, setBusinessName] = useState("");
  const [businessAbout, setBusinessAbout] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Contact Info
  const [contactNumber, setContactNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [googleReviewLink, setGoogleReviewLink] = useState("");

  // Services
  const [services, setServices] = useState<Array<{ name: string; description: string; price: string; isPopular: boolean }>>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServicePopular, setNewServicePopular] = useState(false);

  // Payments
  const [upiId, setUpiId] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [uploadingQr, setUploadingQr] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem("onboardingDraft");
    if (draft) {
      try {
        const data = JSON.parse(draft);
        if (data.businessName) setBusinessName(data.businessName);
        if (data.businessAbout) setBusinessAbout(data.businessAbout);
        if (data.category) setCategory(data.category);
        if (data.address) setAddress(data.address);
        if (data.city) setCity(data.city);
        if (data.state) setState(data.state);
        if (data.whatsapp) setWhatsapp(data.whatsapp);
        if (data.contactNumber) setContactNumber(data.contactNumber);
        if (data.instagram) setInstagram(data.instagram);
        if (data.googleReviewLink) setGoogleReviewLink(data.googleReviewLink);
        if (data.services) setServices(data.services);
        if (data.upiId) setUpiId(data.upiId);
        if (data.qrCodeImage) setQrCodeImage(data.qrCodeImage);
        if (data.currentStep) setCurrentStep(data.currentStep);
      } catch (e) {
        console.error("Error loading onboarding draft", e);
      }
    }
  }, []);

  // Save draft to localStorage on form state change
  useEffect(() => {
    const draftData = {
      businessName,
      businessAbout,
      category,
      address,
      city,
      state,
      whatsapp,
      contactNumber,
      instagram,
      googleReviewLink,
      services,
      upiId,
      qrCodeImage,
      currentStep
    };
    localStorage.setItem("onboardingDraft", JSON.stringify(draftData));

    // Show visual status indicator
    setIsSavedBadgeVisible(true);
    const timer = setTimeout(() => setIsSavedBadgeVisible(false), 800);
    return () => clearTimeout(timer);
  }, [
    businessName,
    businessAbout,
    category,
    address,
    city,
    state,
    whatsapp,
    contactNumber,
    instagram,
    googleReviewLink,
    services,
    upiId,
    qrCodeImage,
    currentStep
  ]);

  // Load default services based on category
  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    // Populate default services for selected category
    const defaultServices = servicesByCategory[selectedCategory as keyof typeof servicesByCategory] || [];
    const formattedDefaults = defaultServices
      .filter(s => s !== "Other")
      .map(s => ({
        name: s,
        description: `Premium ${s} service tailored for you`,
        price: "999",
        isPopular: false
      }));
    setServices(formattedDefaults);
  };

  // Add a new service to the list
  const handleAddService = () => {
    if (!newServiceName.trim()) {
      toast.error("Service name is required");
      return;
    }
    setServices([
      ...services,
      {
        name: newServiceName,
        description: newServiceDesc,
        price: newServicePrice || "0",
        isPopular: newServicePopular
      }
    ]);
    // Reset service form fields
    setNewServiceName("");
    setNewServiceDesc("");
    setNewServicePrice("");
    setNewServicePopular(false);
    toast.success("Service added successfully!");
  };

  // Remove service
  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // Simulated QR Code upload
  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "qr");

    try {
      const response = await fetch("/api/business/upload", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        setQrCodeImage(data.url);
        toast.success("QR Code uploaded successfully!");
      } else {
        toast.error("Failed to upload QR Code");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during upload");
    } finally {
      setUploadingQr(false);
    }
  };

  // Submit complete onboarding setup
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const userStr = localStorage.getItem("currentUser");
    let userId = "";
    if (userStr) {
      try {
        userId = JSON.parse(userStr).id;
      } catch (e) {
        console.error(e);
      }
    }

    if (!userId) {
      toast.error("User session expired. Please sign in again.");
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch("/api/business/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify({
          businessName,
          businessAbout,
          category,
          address,
          city,
          state,
          whatsapp,
          contactNumber,
          instagram,
          googleReviewLink,
          services,
          upiId,
          qrCodeImage
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to save profile");
      }

      // Success
      toast.success("Business profile created successfully!");
      localStorage.setItem("onboardingCompleted", "true");
      localStorage.removeItem("onboardingDraft");

      if (onComplete) {
        onComplete();
      } else {
        router.push("/app/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case "Salon": return <Scissors className="w-5 h-5" />;
      case "Spa": return <Sparkles className="w-5 h-5" />;
      case "Hotel": return <Hotel className="w-5 h-5" />;
      case "Restaurant": return <Utensils className="w-5 h-5" />;
      case "Gym": return <Dumbbell className="w-5 h-5" />;
      case "Clinic": return <Stethoscope className="w-5 h-5" />;
      case "Shop": return <ShoppingBag className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  const categoriesList = ["Salon", "Spa", "Hotel", "Restaurant", "Gym", "Clinic", "Shop", "Other"];

  // Navigation handlers
  const nextStep = () => {
    if (currentStep === 1 && (!businessName.trim() || !category)) {
      toast.error("Please fill in Business Name and select a Category");
      return;
    }
    if (currentStep === 3 && !whatsapp.trim()) {
      toast.error("WhatsApp number is required");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-app-bg text-white flex flex-col justify-between py-6 px-4 md:px-8 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent tracking-tight">Vscan</span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-primary/10 text-primary-light rounded border border-primary/20">AI Onboarding</span>
        </div>

        {/* Draft Auto-Save Indicator */}
        <AnimatePresence>
          {isSavedBadgeVisible && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-app-text-muted flex items-center gap-1.5 bg-app-surface px-3 py-1.5 rounded-full border border-app-border"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-app-success animate-pulse" />
              Draft saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="max-w-3xl mx-auto w-full mt-8 z-10">
        <div className="flex justify-between items-center text-xs font-semibold text-app-text-muted uppercase tracking-widest mb-3">
          <span>Step {currentStep} of 5</span>
          <span className="text-primary-light">
            {currentStep === 1 && "Core Details"}
            {currentStep === 2 && "Services Offered"}
            {currentStep === 3 && "Contact Info"}
            {currentStep === 4 && "Payments Setup"}
            {currentStep === 5 && "Complete Setup"}
          </span>
        </div>

        <div className="w-full h-1.5 bg-app-surface border border-app-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: "20%" }}
            animate={{ width: `${currentStep * 20}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Wizard Area */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex items-center justify-center my-8 z-10">
        <div className="w-full bg-app-surface border border-app-border rounded-[32px] p-6 md:p-10 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {/* STEP 1: Core Business info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">Introduce your business</h2>
                    <p className="text-app-text-muted text-sm mt-1">Let's get started with the basics of your digital identity.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-app-text-muted uppercase tracking-wider mb-2">Business Name</label>
                      <div className="relative">
                        <Building2 className="w-5 h-5 text-app-text-dimmed absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                          placeholder="e.g., The Grooming Parlour"
                          className="w-full bg-app-bg/60 border border-app-border rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-app-text-muted uppercase tracking-wider mb-3">Select Business Category</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {categoriesList.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategorySelect(cat)}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-center ${category === cat
                              ? "bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                              : "bg-app-bg/40 border-app-border text-app-text-muted hover:border-app-text-muted/30 hover:text-white"
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category === cat ? "bg-primary text-white" : "bg-app-surface border border-app-border text-app-text-muted"}`}>
                              {getCategoryIcon(cat)}
                            </div>
                            <span className="text-sm font-medium">{cat}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-app-text-muted uppercase tracking-wider mb-2">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          placeholder="Jaipur"
                          className="w-full bg-app-bg/60 border border-app-border rounded-2xl px-4 py-3 text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-app-text-muted uppercase tracking-wider mb-2">State</label>
                        <input
                          type="text"
                          value={state}
                          onChange={e => setState(e.target.value)}
                          placeholder="Rajasthan"
                          className="w-full bg-app-bg/60 border border-app-border rounded-2xl px-4 py-3 text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-app-text-muted uppercase tracking-wider mb-2">Business Address</label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-app-text-dimmed absolute left-4 top-4" />
                        <textarea
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="Street, locality, landmark details..."
                          rows={3}
                          className="w-full bg-app-bg/60 border border-app-border rounded-2xl pl-12 pr-4 py-3 text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Service Listing */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">Services Catalog</h2>
                    <p className="text-app-text-muted text-sm mt-1">List the services you provide. Add pricing and highlight popular services.</p>
                  </div>

                  {/* Add Service Box */}
                  <div className="bg-app-bg/50 border border-app-border rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white">Add New Service</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newServiceName}
                        onChange={e => setNewServiceName(e.target.value)}
                        placeholder="Service Name (e.g. Premium Facial)"
                        className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-white text-xs placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-app-text-dimmed absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          value={newServicePrice}
                          onChange={e => setNewServicePrice(e.target.value)}
                          placeholder="Price (in INR, e.g. 799)"
                          className="w-full bg-app-surface border border-app-border rounded-xl pl-8 pr-4 py-2.5 text-white text-xs placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={newServiceDesc}
                      onChange={e => setNewServiceDesc(e.target.value)}
                      placeholder="Short description of service..."
                      className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-white text-xs placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-app-text-muted">
                        <input
                          type="checkbox"
                          checked={newServicePopular}
                          onChange={e => setNewServicePopular(e.target.checked)}
                          className="w-4 h-4 rounded text-primary bg-app-bg border-app-border focus:ring-primary"
                        />
                        Mark as Popular Service
                      </label>
                      <button
                        type="button"
                        onClick={handleAddService}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Service
                      </button>
                    </div>
                  </div>

                  {/* Active Services List */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {services.length === 0 ? (
                      <p className="text-app-text-dimmed text-xs text-center py-6">No services added yet. Use the tool above to add some!</p>
                    ) : (
                      services.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-app-bg/30 border border-app-border rounded-xl px-4 py-3 hover:border-app-text-muted/30 transition-colors">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{item.name}</span>
                              <span className="text-xs font-bold text-primary-light bg-primary/10 px-2 py-0.5 rounded border border-primary/20">₹{item.price}</span>
                              {item.isPopular && <span className="text-[10px] font-bold text-app-warning bg-app-warning/10 px-2 py-0.5 rounded border border-app-warning/20">Popular</span>}
                            </div>
                            <p className="text-app-text-muted text-xs mt-0.5 line-clamp-1">{item.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(idx)}
                            className="text-app-text-dimmed hover:text-red-450 p-1.5 rounded-lg hover:bg-app-surface transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Contact Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">Business Channels</h2>
                    <p className="text-app-text-muted text-sm mt-1">Connect your contact channels and online review pages.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-3">

                      {/* Inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* WhatsApp Number */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-app-text-muted tracking-wider mb-2"> WhatsApp Number</label>
                          <div className="relative">
                            <Phone className="w-5 h-5 text-app-success absolute left-4 top-1/2 -translate-y-1/2 z-10" />

                            <input
                              type="text"
                              value={whatsapp}
                              onChange={(e) => setWhatsapp(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full bg-app-bg/60 border border-app-border rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                          </div>
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-app-text-muted tracking-wider mb-2"> Contact Number</label>
                          <div className="relative">
                            <Phone className="w-5 h-5 text-app-success absolute left-4 top-1/2 -translate-y-1/2 z-10" />

                            <input
                              type="text"
                              value={contactNumber}
                              onChange={(e) => setContactNumber(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full bg-app-bg/60 border border-app-border rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-app-text-muted tracking-wider mb-2">Instagram Username (Optional)</label>
                      <div className="relative">
                        <span className="text-pink-500 absolute left-4 top-1/2 -translate-y-1/2 font-bold">@</span>
                        <input
                          type="text"
                          value={instagram}
                          onChange={e => setInstagram(e.target.value)}
                          placeholder="yourbusiness"
                          className="w-full bg-app-bg/60 border border-app-border rounded-2xl pl-10 pr-4 py-3.5 text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-app-text-muted tracking-wider mb-2">Google Review Link (Optional)</label>
                      <div className="relative">
                        <Link className="w-5 h-5 text-primary-light absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={googleReviewLink}
                          onChange={e => setGoogleReviewLink(e.target.value)}
                          placeholder="https://g.page/r/your-review-id/review"
                          className="w-full bg-app-bg/60 border border-app-border rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                      <p className="text-xs text-app-text-dimmed mt-1">Leave this empty if you don't have one; we'll guide you to create it later.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Payments Setup */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">Smart Payments</h2>
                    <p className="text-app-text-muted text-sm mt-1">Accept digital payments directly to your bank account with zero fee.</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-app-text-muted uppercase tracking-wider mb-2">UPI ID (e.g., yourname@okaxis)</label>
                      <div className="relative">
                        <Link className="w-5 h-5 text-app-success absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="e.g., salonstore@upi"
                          className="w-full bg-app-bg/60 border border-app-border rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                      <p className="text-xs text-app-text-dimmed mt-1">Customers scan your QR code and make payments instantly using BHIM, GPay, PhonePe, or Paytm.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-app-text-muted uppercase tracking-wider mb-2">Drag & Drop Payment QR Code Image</label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-app-border hover:border-app-text-muted/30 bg-app-bg/40 rounded-2xl p-6 text-center transition-colors relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          disabled={uploadingQr}
                        />
                        {uploadingQr ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
                            <span className="text-xs text-app-text-muted">Uploading image...</span>
                          </div>
                        ) : qrCodeImage ? (
                          <div className="space-y-3">
                            <img src={qrCodeImage} alt="QR Code Preview" className="w-32 h-32 object-contain mx-auto rounded-lg border border-app-border bg-white p-1" />
                            <p className="text-xs text-app-text-muted">QR Code uploaded. Click/Drag to replace.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-10 h-10 bg-app-surface border border-app-border text-app-text-muted rounded-full flex items-center justify-center mx-auto">
                              <Upload className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-white">Click to upload or drag & drop</p>
                            <p className="text-xs text-app-text-dimmed">PNG, JPG, JPEG up to 1MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Success Summary Page */}
              {currentStep === 5 && (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-primary/10 text-primary-light rounded-full flex items-center justify-center border border-primary/20 text-4xl shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                      🎉
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-app-text-muted bg-clip-text text-transparent">Ready to launch!</h2>
                    <p className="text-app-text-muted text-sm mt-1">Review your business overview before creating your smart presence.</p>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 gap-4 text-left bg-app-bg/40 border border-app-border rounded-2xl p-5 max-w-lg mx-auto">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">Business Name</span>
                      <p className="text-sm font-semibold truncate text-white">{businessName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">Category</span>
                      <p className="text-sm font-semibold text-white">{category}</p>
                    </div>
                    <div className="space-y-1 col-span-2 border-t border-app-border pt-2.5">
                      <span className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">Location</span>
                      <p className="text-sm text-app-text-muted truncate">{address || "Not specified"}, {city}, {state}</p>
                    </div>
                    <div className="space-y-1 border-t border-app-border pt-2.5">
                      <span className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">WhatsApp</span>
                      <p className="text-sm text-app-text-muted truncate">{whatsapp}</p>
                    </div>
                    <div className="space-y-1 border-t border-app-border pt-2.5">
                      <span className="text-[10px] font-bold text-app-text-dimmed uppercase tracking-wider">Services</span>
                      <p className="text-sm text-app-text-muted font-semibold">{services.length} items configured</p>
                    </div>
                  </div>

                  <p className="text-xs text-app-text-dimmed max-w-md mx-auto leading-relaxed">
                    By clicking continue, we will create your dynamic mini-website, set up your smart QR link redirector, and configure your AI SEO keywords.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Navigation buttons */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-app-border">
            <button
              type="button"
              onClick={prevStep}
              className={`px-5 py-3 rounded-xl border border-app-border hover:border-app-text-muted/35 hover:bg-app-surface/60 font-semibold text-sm transition-all duration-200 text-app-text-muted ${currentStep === 1 ? "opacity-0 pointer-events-none" : ""
                }`}
            >
              Back
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-200"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold text-sm px-8 py-3 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Launching...
                  </>
                ) : (
                  <>
                    Complete Setup <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-xs text-app-text-dimmed mt-auto z-10">
        &copy; {new Date().getFullYear()} Vscan. Made for local Indian enterprises.
      </div>
    </div>
  );
}
