import { prisma } from "@/lib/prisma";
import ActivityLogs from "../ActivityLogs";

interface TemplateData {
    businessName: string;
    title: string;
    tagline: string;
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

        const profile = await prisma.businessProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            return { success: false, message: "Business profile not found." };
        }

        // Map business hours to database columns
        const hoursMap: Record<string, string> = {};
        tamplateData.hours.forEach((h: any) => {
            const day = h.day?.toLowerCase() || "";
            const time = h.time || "Closed";
            if (day.includes("mon")) hoursMap.mondayHours = time;
            else if (day.includes("tue")) hoursMap.tuesdayHours = time;
            else if (day.includes("wed")) hoursMap.wednesdayHours = time;
            else if (day.includes("thu")) hoursMap.thursdayHours = time;
            else if (day.includes("fri")) hoursMap.fridayHours = time;
            else if (day.includes("sat")) hoursMap.saturdayHours = time;
            else if (day.includes("sun")) hoursMap.sundayHours = time;
        });

        // Update standard BusinessProfile fields to keep both tables in sync
        await prisma.businessProfile.update({
            where: { id: profile.id },
            data: {
                businessName: tamplateData.businessName || tamplateData.title,
                about: tamplateData.tagline,
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
                seoDescription: JSON.stringify(tamplateData.showSections),
                ...hoursMap
            }
        });

        // Upsert MiniWebsiteInfo table with the full state data object
        const miniWebsite = await prisma.miniWebsiteInfo.upsert({
            where: { businessProfileId: profile.id },
            update: {
                createdAt: new Date(),
                data: tamplateData as any
            },
            create: {
                businessProfileId: profile.id,
                createdAt: new Date(),
                data: tamplateData as any
            }
        });

        // Delete and recreate services to synchronize changes
        await prisma.service.deleteMany({
            where: { businessProfileId: profile.id }
        });
        let a = 0;
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