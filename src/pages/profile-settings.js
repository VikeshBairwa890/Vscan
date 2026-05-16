"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Camera, Save, CreditCard, QrCode, Building2, Phone, Globe, Star, MapPin, Link as LinkIcon } from "lucide-react";
import { Toaster } from "sonner";

export default function Profile() {
    const [profileData, setProfileData] = useState({
        name: "",
        about: "",
        contact: "",
        whatsapp: "",
        businessAddress: "",
        companyWebsite: "",
        googleReviewLink: "",
        upiId: "",
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    const logoInputRef = useRef(null);
    const qrInputRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        try {
            const response = await fetch('/api/profile/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (type === 'logo') {
                    setLogoPreview(data.url);
                    setProfileData(prev => ({ ...prev, logo: data.url }));
                } else {
                    setQrPreview(data.url);
                    setProfileData(prev => ({ ...prev, paymentQr: data.url }));
                }
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                console.log('Profile saved');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!mounted || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
            <Toaster position="top-right" richColors />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-purple-600" />
                                            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Update your business details</p>
                                    </div>
                                    <Button
                                        onPress={handleSave}
                                        isLoading={isSaving}
                                        className="bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6"
                                        startContent={!isSaving && <Save className="w-4 h-4" />}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Logo Upload Section */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-xl">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-linear-to-r from-blue-200 to-blue-100 p-0.5">
                                            <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                                {logoPreview ? (
                                                    <Image
                                                        src={logoPreview}
                                                        alt="Business Logo"
                                                        width={96}
                                                        height={96}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                        <Building2 className="w-10 h-10 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => logoInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-all duration-200"
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
                                        <p className="text-sm font-medium text-gray-700">Business Logo</p>
                                        <p className="text-xs text-gray-500">Recommended: 320x240px. Max 1MB</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <div className="relative">
                                            <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                id="name"
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                placeholder="Enter your business name"
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* About */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="about" className="text-sm font-medium text-gray-700">
                                            About Business
                                        </label>
                                        <textarea
                                            id="about"
                                            value={profileData.about}
                                            onChange={(e) => handleInputChange("about", e.target.value)}
                                            placeholder="Tell customers about your business..."
                                            rows={4}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Contact + WhatsApp */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="contact" className="text-sm font-medium text-gray-700">
                                                Contact Number
                                            </label>
                                            <div className="relative">
                                                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    id="contact"
                                                    type="text"
                                                    value={profileData.contact}
                                                    onChange={(e) => handleInputChange("contact", e.target.value)}
                                                    placeholder="+91 12345 67890"
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
                                                WhatsApp Number
                                            </label>
                                            <div className="relative">
                                                <svg
                                                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                                </svg>
                                                <input
                                                    id="whatsapp"
                                                    type="text"
                                                    value={profileData.whatsapp}
                                                    onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                                                    placeholder="+91 12345 67890"
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Website + Review */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="website" className="text-sm font-medium text-gray-700">
                                                Company Website
                                            </label>
                                            <div className="relative">
                                                <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    id="website"
                                                    type="text"
                                                    value={profileData.companyWebsite}
                                                    onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                                                    placeholder="https://yourbusiness.com"
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="review" className="text-sm font-medium text-gray-700">
                                                Google Review Link
                                            </label>
                                            <div className="relative">
                                                <Star className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    id="review"
                                                    type="text"
                                                    value={profileData.googleReviewLink}
                                                    onChange={(e) => handleInputChange("googleReviewLink", e.target.value)}
                                                    placeholder="https://g.page/r/..."
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="address" className="text-sm font-medium text-gray-700">
                                            Business Address
                                        </label>
                                        <div className="relative">
                                            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                            <textarea
                                                id="address"
                                                value={profileData.businessAddress}
                                                onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                                                placeholder="Enter your complete business address"
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Settings Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                            <div className="px-6 py-4 bg-linear-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-green-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Payment Settings</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Configure payment options</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* QR Code Upload */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Payment QR Code</label>
                                    <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-xl bg-white border-2 border-gray-200 overflow-hidden shadow-sm">
                                                {qrPreview ? (
                                                    <Image
                                                        src={qrPreview}
                                                        alt="Payment QR"
                                                        width={128}
                                                        height={128}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                                                        <QrCode className="w-10 h-10 text-gray-400" />
                                                        <span className="text-xs text-gray-500 mt-2">No QR</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => qrInputRef.current?.click()}
                                                className="absolute -bottom-2 -right-2 p-1.5 bg-green-600 rounded-full text-white shadow-lg hover:bg-green-700 transition-all duration-200"
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
                                        <p className="text-xs text-gray-500 text-center">Upload payment QR code<br />Max 1MB. Recommended: 320x320px</p>
                                    </div>
                                </div>

                                {/* UPI ID */}
                                <div className="space-y-3">
                                    <label htmlFor="upiId" className="text-sm font-medium text-gray-700">
                                        UPI ID
                                    </label>
                                    <div className="relative">
                                        <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            id="upiId"
                                            type="text"
                                            value={profileData.upiId}
                                            onChange={(e) => handleInputChange("upiId", e.target.value)}
                                            placeholder="business@upi"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Enter your UPI ID to receive payments directly
                                    </p>
                                </div>

                                {/* Info Box */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-start gap-2">
                                        <div className="flex-1">
                                            <p className="text-xs text-blue-800 font-medium">Payment Integration Active</p>
                                            <p className="text-xs text-blue-600 mt-1">Customers can pay via any UPI app using QR code or UPI ID</p>
                                        </div>
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