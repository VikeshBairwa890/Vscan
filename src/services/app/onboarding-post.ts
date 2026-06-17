import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "./slug-helper";
import GenerateMiniWebsite from "./generate-mini-website";

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

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return { success: false, message: "User not found." };
        }

        const aboutText =
            data.businessAbout?.trim() ||
            `Welcome to ${data.businessName}. We offer quality ${data.category} services for our local community.`;

        const slug = await generateUniqueSlug(data.businessName, user.id);

        const businessProfile = await prisma.businessProfile.upsert({
            where: { userId: user.id },
            update: {
                businessName: data.businessName,
                about: aboutText,
                category: data.category,
                contactNumber: data.contactNumber || data.whatsapp || "",
                whatsappNumber: data.whatsapp || data.contactNumber || "",
                businessAddress: data.address || "",
                city: data.city || "",
                state: data.state || "",
                instagram: data.instagram || "",
                googleReviewLink: data.googleReviewLink || "",
                upiId: data.upiId || "",
                paymentQrCode: data.qrCodeImage || "",
                customSlug: slug,
                isPublished: false,
                onboardingCompleted: true,
            },
            create: {
                userId: user.id,
                businessName: data.businessName,
                about: aboutText,
                category: data.category,
                contactNumber: data.contactNumber || data.whatsapp || "",
                whatsappNumber: data.whatsapp || data.contactNumber || "",
                businessAddress: data.address || "",
                city: data.city || "",
                state: data.state || "",
                instagram: data.instagram || "",
                googleReviewLink: data.googleReviewLink || "",
                upiId: data.upiId || "",
                paymentQrCode: data.qrCodeImage || "",
                customSlug: slug,
                isPublished: false,
                onboardingCompleted: true,
            }
        });

        await prisma.service.deleteMany({
            where: { businessProfileId: businessProfile.id }
        });

        if (data.services.length > 0) {
            await prisma.service.createMany({
                data: data.services.map((s: any, index: number) => ({
                    businessProfileId: businessProfile.id,
                    name: s.name,
                    description: s.description || "",
                    price: s.price?.toString() || "0",
                    isPopular: !!s.isPopular,
                    order: index,
                }))
            });
        }

        const generateResult = await GenerateMiniWebsite(userId, {
            businessName: data.businessName,
            businessAbout: aboutText,
            category: data.category,
            address: data.address,
            city: data.city,
            state: data.state,
            whatsapp: data.whatsapp,
            contactNumber: data.contactNumber,
            instagram: data.instagram,
            googleReviewLink: data.googleReviewLink,
            services: data.services,
            upiId: data.upiId,
        });

        if (!generateResult.success) {
            return {
                success: false,
                message: generateResult.message || "Profile saved but mini website could not be created.",
                businessProfile,
                aiGeneration: generateResult,
            };
        }

        return {
            success: true,
            message: generateResult.usedFallback
                ? "Business profile saved. Your mini website is ready with default content — add OPENAI_API_KEY for richer AI copy."
                : "Business profile created and mini website is ready!",
            businessProfile,
            aiGeneration: generateResult,
        };
    } catch (error: any) {

        return {
            success: false,
            message: error.message || "Failed to save onboarding data",
            error: error.message
        };
    }
}
