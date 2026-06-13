import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(200).json({ success: false, message: "Method Not Allowed" });
    }

    const { slug } = req.query;
    if (!slug || typeof slug !== "string") {
        return res.status(200).json({ success: false, message: "Missing or invalid slug." });
    }

    try {
        const bp = await prisma.businessProfile.findFirst({
            where: { customSlug: slug.toLowerCase().trim() },
            include: {
                services: {
                    orderBy: { order: "asc" }
                },
                miniWebsiteInfo: true,
                user: true
            }
        });

        if (!bp) {
            return res.status(200).json({ success: false, message: "Business profile not found." });
        }

        let profileData: any = {};
        const savedInfo = bp.miniWebsiteInfo?.data;

        if (savedInfo) {
            profileData = typeof savedInfo === "string" ? JSON.parse(savedInfo) : savedInfo;
            if (profileData && profileData.data) {
                delete profileData.data;
            }
        }

        // Reconstruct hours from database columns
        let hours: any[] = [];
        const mon = bp.mondayHours || "Closed";
        const tue = bp.tuesdayHours || "Closed";
        const wed = bp.wednesdayHours || "Closed";
        const thu = bp.thursdayHours || "Closed";
        const fri = bp.fridayHours || "Closed";
        const sat = bp.saturdayHours || "Closed";
        const sun = bp.sundayHours || "Closed";

        if (mon === tue && tue === wed && wed === thu && thu === fri) {
            hours.push({
                day: "Mon-Fri",
                time: mon === "Closed" ? "Closed" : mon,
                open: mon !== "Closed"
            });
        } else {
            hours.push({ day: "Monday", time: mon, open: mon !== "Closed" });
            hours.push({ day: "Tuesday", time: tue, open: tue !== "Closed" });
            hours.push({ day: "Wednesday", time: wed, open: wed !== "Closed" });
            hours.push({ day: "Thursday", time: thu, open: thu !== "Closed" });
            hours.push({ day: "Friday", time: fri, open: fri !== "Closed" });
        }
        hours.push({ day: "Saturday", time: sat, open: sat !== "Closed" });
        hours.push({ day: "Sunday", time: sun, open: sun !== "Closed" });

        // Reconstruct services with matched builder thumbnail images
        let services: any[] = [];
        if (bp.services) {
            const serviceImages = profileData.serviceImages || [];
            services = bp.services.map((s: any, idx: number) => {
                const matchingImg = serviceImages.find((img: any) => img.id === s.id || img.name === s.name) || serviceImages[idx];
                return {
                    id: s.id,
                    name: s.name,
                    price: s.price || "",
                    desc: s.description || "",
                    isPopular: s.isPopular || false,
                    image: matchingImg?.image || ""
                };
            });
        }

        // Construct response
        const mergedData = {
            // Builder-specific config (defaults if not present)
            theme: bp.seoTitle || profileData.theme || "blue",
            selectedTemplate: profileData.selectedTemplate || "it-company",
            buttonText: profileData.buttonText || "Contact Us",
            googleFormLink: profileData.googleFormLink || "",
            announcement: profileData.announcement || { enabled: true, text: "🎉Add your announcement here" },
            showSections: profileData.showSections || {
                announcement: true, services: true, hours: true, contact: true,
                showWhatsapp: true, social: true, employees: true, testimonials: true,
                mediaLinks: true, faqs: true, amenities: true, googleForm: true
            },
            testimonials: profileData.testimonials || [],
            mediaLinks: profileData.mediaLinks || [],
            faqs: profileData.faqs || [],
            employees: profileData.employees || [],
            amenities: profileData.amenities || [],

            // Master data from BusinessProfile
            id: bp.id,
            name: bp.user?.name || bp.businessName || "",
            businessName: bp.businessName || "",
            title: bp.businessName || "",
            tagline: bp.about || "",
            about: bp.about || "",
            logo: bp.logo || bp.BusinessLogo || "",
            BusinessLogo: bp.logo || bp.BusinessLogo || "",
            phone: bp.contactNumber || "",
            contactNumber: bp.contactNumber || "",
            whatsapp: bp.whatsappNumber || bp.contactNumber || "",
            whatsappNumber: bp.whatsappNumber || bp.contactNumber || "",
            email: bp.email || "",
            address: bp.businessAddress || "",
            businessAddress: bp.businessAddress || "",
            website: bp.website || "",
            instagram: bp.instagram || "",
            facebook: bp.facebook || "",
            twitter: bp.twitter || "",
            linkedin: bp.linkedin || "",
            upiId: bp.upiId || "",
            paymentQrCode: bp.paymentQrCode || "",
            googleReviewLink: bp.googleReviewLink || "",
            isPublished: bp.isPublished || false,
            isQrGenerated: bp.isQrGenerated || false,
            viewCount: bp.viewCount || 0,
            shareCount: bp.shareCount || 0,
            customSlug: bp.customSlug || "",
            hours,
            services
        };

        // Increment profile view count asynchronously
        try {
            await prisma.businessProfile.update({
                where: { id: bp.id },
                data: { viewCount: { increment: 1 } }
            });
        } catch (err) {
            console.error("Failed to increment view count:", err);
        }

        return res.status(200).json({ success: true, data: mergedData });
    } catch (error: any) {
        console.error("Public profile fetch error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
