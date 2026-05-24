import { prisma } from "@/lib/prisma";
import axios from "axios";
import ActivityLogs from "../ActivityLogs";

export async function GetMiniWebsiteInfo(userId: string) {
    try {
        const userProfile = await prisma.user.findFirst({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                businessProfile: {
                    select: {
                        businessName: true,
                        BusinessLogo: true,
                        category: true,
                        about: true,
                        contactNumber: true,
                        whatsappNumber: true,
                        email: true,
                        businessAddress: true,
                        website: true,
                        instagram: true,
                        facebook: true,
                        twitter: true,
                        linkedin: true,
                        paymentQrCode: true,
                        upiId: true,
                        googleReviewLink: true,
                        seoTitle: true,
                        seoDescription: true,
                        isPublished: true,
                        isQrGenerated: true,
                        viewCount: true,
                        shareCount: true,
                        miniWebsiteInfo: {
                            select: {
                                data: true
                            }
                        }
                    }
                }
            }
        });

        if (!userProfile) {
            return { success: false, message: "No business profile found. Onboard now", userProfile: {} }
        }
        
        let profileData: any = {};
        const savedInfo = userProfile.businessProfile?.miniWebsiteInfo?.data;
        
        if (savedInfo) {
            profileData = typeof savedInfo === "string" ? JSON.parse(savedInfo) : savedInfo;
            // Merge essential system fields
            profileData.id = userProfile.id;
            profileData.name = userProfile.name;
            profileData.role = userProfile.role;
            profileData.isActive = userProfile.isActive;
            if (userProfile.businessProfile) {
                profileData.isPublished = userProfile.businessProfile.isPublished;
                profileData.isQrGenerated = userProfile.businessProfile.isQrGenerated;
                profileData.viewCount = userProfile.businessProfile.viewCount;
                profileData.shareCount = userProfile.businessProfile.shareCount;
            }
        } else {
            profileData = {
                id: userProfile.id,
                name: userProfile.name,
                role: userProfile.role,
                isActive: userProfile.isActive,
                businessName: userProfile.businessProfile?.businessName || "",
                BusinessLogo: userProfile.businessProfile?.BusinessLogo || "",
                category: userProfile.businessProfile?.category || "",
                about: userProfile.businessProfile?.about || "",
                contactNumber: userProfile.businessProfile?.contactNumber || "",
                whatsappNumber: userProfile.businessProfile?.whatsappNumber || "",
                email: userProfile.businessProfile?.email || "",
                businessAddress: userProfile.businessProfile?.businessAddress || "",
                website: userProfile.businessProfile?.website || "",
                instagram: userProfile.businessProfile?.instagram || "",
                facebook: userProfile.businessProfile?.facebook || "",
                twitter: userProfile.businessProfile?.twitter || "",
                linkedin: userProfile.businessProfile?.linkedin || "",
                paymentQrCode: userProfile.businessProfile?.paymentQrCode || "",
                upiId: userProfile.businessProfile?.upiId || "",
                googleReviewLink: userProfile.businessProfile?.googleReviewLink || "",
                seoTitle: userProfile.businessProfile?.seoTitle || "",
                seoDescription: userProfile.businessProfile?.seoDescription || "",
                isPublished: userProfile.businessProfile?.isPublished || false,
                isQrGenerated: userProfile.businessProfile?.isQrGenerated || false,
                viewCount: userProfile.businessProfile?.viewCount || 0,
                shareCount: userProfile.businessProfile?.shareCount || 0,
            };
        }
        return { success: true, message: "Business profile found", data: profileData };

    } catch (error: any) {
        ActivityLogs(userId, "", "GET", "Mini Website API", error.message);
        return { success: false, message: error.message };
    }
}