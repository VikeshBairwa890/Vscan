"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Camera, Save, CreditCard, QrCode, Building2, Phone, Globe, Star, MapPin, Link as LinkIcon, Mail } from "lucide-react";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";
export default function Profile() {
    const [profileData, setProfileData] = useState({
        name: "",
        about: "",
        contact: "",
        whatsapp: "",
        email: "",
        businessAddress: "",
        companyWebsite: "",
        googleReviewLink: "",
        upiId: "",
        logo: "",
        paymentQr: "",
        customSlug: "",
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    const logoInputRef = useRef(null);
    const qrInputRef = useRef(null);

    useEffect(() => {
        setMounted(true);

        const loadProfile = async () => {
            const userStr = localStorage.getItem("currentUser");
            if (!userStr) {
                setIsLoading(false);
                return;
            }

            try {
                const user = JSON.parse(userStr);
                const res = await fetch(`/api/business/status?userId=${user.id}`);
                if (res.ok) {
                    const statusData = await res.json();
                    if (statusData.hasProfile) {
                        setProfileData({
                            name: statusData.businessName || "",
                            about: statusData.about || "",
                            contact: statusData.contactNumber || "",
                            whatsapp: statusData.whatsappNumber || "",
                            email: statusData.email || "",
                            businessAddress: statusData.businessAddress || "",
                            companyWebsite: statusData.website || "",
                            googleReviewLink: statusData.googleReviewLink || "",
                            upiId: statusData.upiId || "",
                            logo: statusData.logo || "",
                            paymentQr: statusData.paymentQrCode || "",
                            customSlug: statusData.customSlug || "",
                        });
                        if (statusData.logo) setLogoPreview(statusData.logo);
                        if (statusData.paymentQrCode) setQrPreview(statusData.paymentQrCode);
                    }
                }
            } catch (err) {
                console.error("Error loading profile settings", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        try {
            const response = await fetch('/api/business/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (type === 'logo') {
                    setLogoPreview(data.url);
                    setProfileData(prev => ({ ...prev, logo: data.url }));
                    toast.success("Logo uploaded!");
                } else {
                    setQrPreview(data.url);
                    setProfileData(prev => ({ ...prev, paymentQr: data.url }));
                    toast.success("Payment QR uploaded!");
                }
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error("Error uploading file");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const userStr = localStorage.getItem("currentUser");
        if (!userStr) {
            toast.error("Session expired, please login again.");
            setIsSaving(false);
            return;
        }

        try {
            const user = JSON.parse(userStr);
            const response = await fetch('/api/business/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.id
                },
                body: JSON.stringify({
                    businessName: profileData.name,
                    tagline: profileData.about,
                    logo: profileData.logo,
                    phone: profileData.whatsapp || profileData.contact,
                    email: profileData.email,
                    address: profileData.businessAddress,
                    website: profileData.companyWebsite,
                    googleReviewLink: profileData.googleReviewLink,
                    upiId: profileData.upiId,
                    customSlug: profileData.customSlug,
                }),
            });

            const resData = await response.json();
            if (response.ok && resData.success !== false) {
                toast.success('Profile settings saved successfully!');
                if (resData.businessProfile?.customSlug) {
                    setProfileData(prev => ({ ...prev, customSlug: resData.businessProfile.customSlug }));
                }
            } else {
                throw new Error(resData.message || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (!mounted || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-app-bg text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light"></div>
                    <p className="text-xs text-app-text-muted">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app-bg text-white py-6 px-4 md:px-8 space-y-6 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Profile Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Information Card */}
                    <div className="bg-app-surface border border-app-border rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                        <div className="px-6 py-4 bg-app-bg/30 border-b border-app-border">
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-primary-light" />
                                        <h2 className="text-lg font-bold text-white">Profile Information</h2>
                                    </div>
                                    <p className="text-xs text-app-text-muted mt-0.5">Update your storefront and business details</p>
                                </div>
                                <Button
                                    onPress={handleSave}
                                    isLoading={isSaving}
                                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-extrabold text-xs py-2.5 px-6 rounded-xl transition active:scale-95 shadow-lg shadow-primary/20"
                                    startContent={!isSaving && <Save className="w-4 h-4" />}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Logo Upload Section */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-app-bg/40 border border-app-border rounded-2xl">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-light to-secondary-light p-0.5 shadow-md">
                                        <div className="w-full h-full rounded-full bg-app-surface overflow-hidden flex items-center justify-center">
                                            {logoPreview ? (
                                                <Image
                                                    src={logoPreview}
                                                    alt="Business Logo"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-app-bg/40">
                                                    <Building2 className="w-10 h-10 text-app-text-dimmed" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => logoInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-white shadow-lg hover:bg-primary-dark transition-all duration-200"
                                        type="button"
                                    >
                                        <Camera className="w-3 h-3" />
                                    </button>
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(file, 'logo');
                                        }}
                                        className="hidden"
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <p className="text-sm font-bold text-white">Business Logo</p>
                                    <p className="text-xs text-app-text-dimmed mt-0.5">Recommended: 320x240px. Max 1MB</p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                {/* Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="name" className="text-xs font-semibold text-app-text-muted">
                                        Business Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="w-4 h-4 text-app-text-dimmed absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            id="name"
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Enter your business name"
                                            className="w-full pl-10 pr-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Custom URL Handle (Slug) */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="customSlug" className="text-xs font-semibold text-app-text-muted">
                                        Custom URL Path (Slug)
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex items-center bg-app-bg/60 border border-app-border rounded-xl px-3 text-xs text-app-text-dimmed select-none font-mono">
                                            vscan.biz/
                                        </div>
                                        <input
                                            id="customSlug"
                                            type="text"
                                            value={profileData.customSlug}
                                            onChange={(e) => handleInputChange("customSlug", e.target.value.toLowerCase().trim().replace(/[^a-z0-9-]/g, ""))}
                                            placeholder="your-business-handle"
                                            className="flex-1 px-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-app-text-dimmed">
                                        This defines your mini-website link (e.g. vscan.biz/your-business-handle). Only lowercase letters, numbers, and hyphens are allowed.
                                    </p>
                                </div>

                                {/* About */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="about" className="text-xs font-semibold text-app-text-muted">
                                        About Business
                                    </label>
                                    <textarea
                                        id="about"
                                        value={profileData.about}
                                        onChange={(e) => handleInputChange("about", e.target.value)}
                                        placeholder="Tell customers about your business..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Contact + WhatsApp + Email */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="contact" className="text-xs font-semibold text-app-text-muted">
                                            Contact Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="w-4 h-4 text-app-text-dimmed absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                id="contact"
                                                type="text"
                                                value={profileData.contact}
                                                onChange={(e) => handleInputChange("contact", e.target.value)}
                                                placeholder="+91 12345 67890"
                                                className="w-full pl-10 pr-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="whatsapp" className="text-xs font-semibold text-app-text-muted">
                                            WhatsApp Number
                                        </label>
                                        <div className="relative">
                                            <FaWhatsapp className="w-4 h-4 text-app-text-dimmed absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                id="whatsapp"
                                                type="text"
                                                value={profileData.whatsapp}
                                                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                                                placeholder="+91 12345 67890"
                                                className="w-full pl-10 pr-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="email" className="text-xs font-semibold text-app-text-muted">
                                            Inquiry Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 text-app-text-dimmed absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                placeholder="inquiry@business.com"
                                                className="w-full pl-10 pr-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Website + Review */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="website" className="text-xs font-semibold text-app-text-muted">
                                            Company Website
                                        </label>
                                        <div className="relative">
                                            <Globe className="w-4 h-4 text-app-text-dimmed absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                id="website"
                                                type="text"
                                                value={profileData.companyWebsite}
                                                onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                                                placeholder="https://yourbusiness.com"
                                                className="w-full pl-10 pr-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="review" className="text-xs font-semibold text-app-text-muted">
                                            Google Review Link
                                        </label>
                                        <div className="relative">
                                            <Star className="w-4 h-4 text-app-text-dimmed absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                id="review"
                                                type="text"
                                                value={profileData.googleReviewLink}
                                                onChange={(e) => handleInputChange("googleReviewLink", e.target.value)}
                                                placeholder="https://g.page/r/..."
                                                className="w-full pl-10 pr-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="address" className="text-xs font-semibold text-app-text-muted">
                                        Business Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-app-text-dimmed absolute left-3 top-3.5" />
                                        <textarea
                                            id="address"
                                            value={profileData.businessAddress}
                                            onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                                            placeholder="Enter your complete business address"
                                            rows={3}
                                            className="w-full pl-10 pr-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Settings Section */}
                <div className="lg:col-span-1">
                    <div className="bg-app-surface border border-app-border rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md sticky">
                        <div className="px-6 py-4 bg-app-bg/30 border-b border-app-border">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-app-success" />
                                <h2 className="text-lg font-bold text-white">Payment Settings</h2>
                            </div>
                            <p className="text-xs text-app-text-muted mt-0.5">Configure payment options</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* QR Code Upload */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-app-text-muted">Payment QR Code</label>
                                <div className="flex flex-col items-center gap-4 p-4 bg-app-bg/40 border border-app-border rounded-2xl">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-xl bg-white border border-app-border overflow-hidden shadow-sm flex items-center justify-center">
                                            {qrPreview ? (
                                                <Image
                                                    src={qrPreview}
                                                    alt="Payment QR"
                                                    width={128}
                                                    height={128}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-app-bg/20">
                                                    <QrCode className="w-10 h-10 text-app-text-dimmed" />
                                                    <span className="text-xs text-app-text-muted mt-2">No QR</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => qrInputRef.current?.click()}
                                            className="absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-full text-white shadow-lg hover:bg-primary-dark transition-all duration-200"
                                            type="button"
                                        >
                                            <Camera className="w-3 h-3" />
                                        </button>
                                        <input
                                            ref={qrInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload(file, 'qr');
                                            }}
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="text-[10px] text-app-text-dimmed text-center leading-relaxed">Upload payment QR code<br />Max 1MB. Recommended: 320x320px</p>
                                </div>
                            </div>

                            {/* UPI ID */}
                            <div className="space-y-3">
                                <label htmlFor="upiId" className="text-xs font-semibold text-app-text-muted">
                                    UPI ID
                                </label>
                                <div className="relative">
                                    <LinkIcon className="w-4 h-4 text-app-text-dimmed absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="upiId"
                                        type="text"
                                        value={profileData.upiId}
                                        onChange={(e) => handleInputChange("upiId", e.target.value)}
                                        placeholder="business@upi"
                                        className="w-full pl-10 pr-4 py-2.5 border border-app-border bg-app-bg/60 rounded-xl text-xs text-white placeholder-app-text-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                                </div>
                                <p className="text-[10px] text-app-text-dimmed">
                                    Enter your UPI ID to receive payments directly
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                                <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                        <p className="text-xs text-primary-light font-bold">Payment Integration Active</p>
                                        <p className="text-xs text-app-text-muted mt-1 leading-relaxed">Customers can pay via any UPI app using QR code or UPI ID</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}