import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "./slug-helper";

interface BusinessProfilePayload {
    businessName: string;
    businessAbout: string;
    category: string;
    address: string;
    city: string;
    state: string;
    whatsapp: string;
    contactNumber: string;
    instagram: string;
    googleReviewLink: string;
    services: Array<{
        id?: string;
        name: string;
        description?: string;
        price: string;
        isPopular?: boolean;
    }>;
    upiId: string;
    qrCodeImage: string;
}

export default async function PostOnboarding(userId: string, data: BusinessProfilePayload) {

    try {

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return { success: false, message: "User not found." };
        }

        const slug = await generateUniqueSlug(data.businessName, user.id);

        // Upsert BusinessProfile
        const businessProfile = await prisma.businessProfile.upsert({
            where: { userId: user.id },
            update: {
                businessName: data.businessName,
                category: data.category,
                contactNumber: data.whatsapp || '',
                whatsappNumber: data.whatsapp || '',
                businessAddress: data.address || '',
                city: data.city || '',
                state: data.state || '',
                instagram: data.instagram || '',
                googleReviewLink: data.googleReviewLink || '',
                upiId: data.upiId || '',
                paymentQrCode: data.qrCodeImage || '',
                customSlug: slug,
                isPublished: false // Onboarding completed, but site is not published yet
            },
            create: {
                userId: user.id,
                businessName: data.businessName,
                category: data.category,
                contactNumber: data.whatsapp || '',
                whatsappNumber: data.whatsapp || '',
                businessAddress: data.address || '',
                city: data.city || '',
                state: data.state || '',
                instagram: data.instagram || '',
                googleReviewLink: data.googleReviewLink || '',
                upiId: data.upiId || '',
                paymentQrCode: data.qrCodeImage || '',
                customSlug: slug,
                isPublished: false
            }
        });

        // Delete existing services for this business profile (if any) and insert new ones
        await prisma.service.deleteMany({
            where: { businessProfileId: businessProfile.id }
        });

        if (data.services.length > 0) {
            await prisma.service.createMany({
                data: data.services.map((s: any) => ({
                    businessProfileId: businessProfile.id,
                    name: s.name,
                    description: s.description || "",
                    price: s.price?.toString() || "0",
                    isPopular: !!s.isPopular
                }))
            });
        }

        return {
            success: true,
            message: "Business profile and services created successfully",
            businessProfile
        };
    } catch (error: any) {

        return {
            success: false,
            message: "Failed to save onboarding data",
            error: error.message
        };
    }
}