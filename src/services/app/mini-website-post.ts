import { prisma } from "@/lib/prisma";
import ActivityLogs from "../ActivityLogs";

interface TemplateData {
    businessName: string;
    title: string;
    tagline: string;
    aboutSection?: { title: string; subtitle: string; body: string };
    sectionHeaders?: Record<string, { title: string; subtitle: string }>;
    seoPageTitle?: string;
    seoMetaDescription?: string;
    logo: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    website: string;
    instagram: string;
    facebook: string;
    youtube: string;
    theme: string;
    selectedTemplate: string;
    buttonText: string;
    googleFormLink: string;
    googleReviewLink: string;
    announcement: { text: string; enabled: boolean };
    services: any[];
    hours: any[];
    employees: any[];
    testimonials: any[];
    mediaLinks: any[];
    faqs: any[];
    amenities: any[];
    showSections: any;
    upiId?: string;
}

export default async function SaveMiniWebsiteData(userId: string, tamplateData: TemplateData): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
    try {
        // Clean up any nested duplicate data property
        if (tamplateData && (tamplateData as any).data) {
            delete (tamplateData as any).data;
        }

        const profile = await prisma.businessProfile.findUnique({
            where: { userId: userId }
        });

        if (!profile) {
            return { success: false, message: "Business profile not found." };
        }

        // Map business hours to database columns
        const hoursMap: Record<string, string> = {
            mondayHours: "Closed",
            tuesdayHours: "Closed",
            wednesdayHours: "Closed",
            thursdayHours: "Closed",
            fridayHours: "Closed",
            saturdayHours: "Closed",
            sundayHours: "Closed"
        };
        if (tamplateData.hours && Array.isArray(tamplateData.hours)) {
            tamplateData.hours.forEach((h: any) => {
                const day = h.day?.toLowerCase() || "";
                const time = h.open ? (h.time || "Open") : "Closed";

                if (day.includes("mon-fri") || day.includes("mon - fri") || day.includes("monday - friday") || day.includes("monday-friday")) {
                    hoursMap.mondayHours = time;
                    hoursMap.tuesdayHours = time;
                    hoursMap.wednesdayHours = time;
                    hoursMap.thursdayHours = time;
                    hoursMap.fridayHours = time;
                } else {
                    if (day.includes("mon") || day.includes("monday")) hoursMap.mondayHours = time;
                    if (day.includes("tue") || day.includes("tuesday")) hoursMap.tuesdayHours = time;
                    if (day.includes("wed") || day.includes("wednesday")) hoursMap.wednesdayHours = time;
                    if (day.includes("thu") || day.includes("thursday")) hoursMap.thursdayHours = time;
                    if (day.includes("fri") || day.includes("friday")) hoursMap.fridayHours = time;
                    if (day.includes("sat") || day.includes("saturday")) hoursMap.saturdayHours = time;
                    if (day.includes("sun") || day.includes("sunday")) hoursMap.sundayHours = time;
                }
            });
        }

        // Update standard BusinessProfile fields to keep both tables in sync
        const aboutBody =
            (tamplateData as any).aboutSection?.body ||
            tamplateData.tagline ||
            "";

        await prisma.businessProfile.update({
            where: { id: profile.id },
            data: {
                businessName: tamplateData.businessName || tamplateData.title,
                about: aboutBody,
                logo: tamplateData.logo,
                BusinessLogo: tamplateData.logo,
                contactNumber: tamplateData.phone,
                whatsappNumber: tamplateData.whatsapp || tamplateData.phone,
                email: tamplateData.email,
                businessAddress: tamplateData.address,
                website: tamplateData.website,
                instagram: tamplateData.instagram,
                facebook: tamplateData.facebook,
                upiId: tamplateData.upiId,
                googleReviewLink: tamplateData.googleReviewLink,
                seoTitle: tamplateData.theme,
                seoDescription: tamplateData.seoMetaDescription || profile.seoDescription,
                aiGeneratedDesc: tamplateData.tagline,
                ...hoursMap
            }
        });

        const builderSpecificData = {
            title: tamplateData.title || "",
            tagline: tamplateData.tagline || "",
            aboutSection: (tamplateData as any).aboutSection || null,
            sectionHeaders: (tamplateData as any).sectionHeaders || null,
            seoPageTitle: (tamplateData as any).seoPageTitle || "",
            seoMetaDescription: (tamplateData as any).seoMetaDescription || "",
            theme: tamplateData.theme || "",
            selectedTemplate: tamplateData.selectedTemplate || "",
            buttonText: tamplateData.buttonText || "",
            googleFormLink: tamplateData.googleFormLink || "",
            announcement: tamplateData.announcement || { enabled: false, text: "" },
            showSections: tamplateData.showSections || {},
            testimonials: tamplateData.testimonials || [],
            mediaLinks: tamplateData.mediaLinks || [],
            faqs: tamplateData.faqs || [],
            employees: tamplateData.employees || [],
            amenities: tamplateData.amenities || [],
            serviceImages: tamplateData.services?.map((s: any) => ({
                id: s.id,
                name: s.name,
                image: s.image || ""
            })) || []
        };

        // Upsert MiniWebsiteInfo table with the builder-specific data object
        const miniWebsite = await prisma.miniWebsiteInfo.upsert({
            where: { businessProfileId: profile.id },
            update: {
                updatedAt: new Date(),
                data: builderSpecificData as any
            },
            create: {
                businessProfileId: profile.id,
                createdAt: new Date(),
                data: builderSpecificData as any
            }
        });

        // Delete and recreate services to synchronize changes
        await prisma.service.deleteMany({
            where: { businessProfileId: profile.id }
        });
        if (tamplateData.services.length > 0) {
            await prisma.service.createMany({
                data: tamplateData.services.map((s: any, index: number) => ({
                    businessProfileId: profile.id,
                    name: s.name || "Service",
                    description: s.desc || "",
                    price: s.price?.toString() || "0",
                    isPopular: s.isPopular || false,
                    order: index,
                }))
            });
        }
        return {
            success: true,
            message: "Website changes saved successfully",
            data: miniWebsite
        };
    } catch (error: any) {
        await ActivityLogs(userId, "", "SaveMiniWebsiteData create or save", "CREATE", error.message);
        return {
            success: false,
            message: "Failed to save website changes",
            error: error.message
        };
    }
}