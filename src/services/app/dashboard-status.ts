import { prisma } from "@/lib/prisma";
import ActivityLogs from "../ActivityLogs";

export default async function GetDashboardStatus(userId: string) {
    if (!userId || userId?.length == 0) {
        return {
            success: false,
            message: "User ID is required",
            data: null
        }
    }
    try {
        const profile = await prisma.businessProfile.findUnique({
            where: { userId: userId },
            include: {
                services: true,
                qrCodes: true,
                reviews: true,
                subscription: true
            }
        });

        if (!profile) {
            return {
                success: true,
                hasProfile: false,
                onboardingCompleted: false,
                checklist: {
                    hasLogo: false,
                    hasServices: false,
                    hasQr: false,
                    hasReviewLink: false,
                    isPublished: false
                },
                stats: {
                    views: 0,
                    scans: 0,
                    reviews: 0,
                    leads: 0
                },
                subscription: {
                    plan: "FREE",
                    isActive: false
                }
            };
        }

        // Determine checklist steps completion
        const hasLogo = !!profile.logo && profile.logo.trim().length > 0;
        const hasServices = profile.services.length > 0;
        const hasQr = profile.qrCodes.length > 0 || !!profile.paymentQrCode;
        const hasReviewLink = !!profile.googleReviewLink && profile.googleReviewLink.trim().length > 0;
        const isPublished = profile.isPublished;

        const views = profile.viewCount || 0;
        const scans = profile.qrCodes.reduce((acc, q) => acc + (q.scanCount || 0), 0) + (profile.shareCount || 0);
        const reviewsCount = profile.reviews.length;
        const leads = profile.services.length * 3 + (profile.viewCount ? Math.floor(profile.viewCount * 0.15) : 0);

        const plan = profile.subscription?.plan || "FREE";
        const isPremium = plan === "PREMIUM" && (profile.subscription?.endDate ? new Date(profile.subscription.endDate) > new Date() : true);

        return {
            success: true,
            hasProfile: true,
            onboardingCompleted: profile.onboardingCompleted,
            businessName: profile.businessName || "Your Business",
            category: profile.category || "Local Business",
            about: profile.about || "",
            logo: profile.logo || "",
            contactNumber: profile.contactNumber || "",
            whatsappNumber: profile.whatsappNumber || "",
            email: profile.email || "",
            businessAddress: profile.businessAddress || "",
            website: profile.website || "",
            instagram: profile.instagram || "",
            facebook: profile.facebook || "",
            upiId: profile.upiId || "",
            googleReviewLink: profile.googleReviewLink || "",
            paymentQrCode: profile.paymentQrCode || "",
            seoTitle: profile.seoTitle || "",
            seoDescription: profile.seoDescription || "",
            checklist: {
                hasLogo,
                hasServices,
                hasQr,
                hasReviewLink,
                isPublished
            },
            stats: {
                views: views || 0,
                scans: scans || 0,
                reviews: reviewsCount || 0,
                leads: leads || 0
            },
            subscription: {
                plan,
                isActive: isPremium
            }
        };
    } catch (error: any) {
        ActivityLogs(userId, '', 'GET', '/api/business/status', error.message);
        return {
            success: false,
            message: "Failed to fetch status details",
            data: error.message
        }
    }


}