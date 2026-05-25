import { prisma } from "@/lib/prisma";
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
                        mondayHours: true,
                        tuesdayHours: true,
                        wednesdayHours: true,
                        thursdayHours: true,
                        fridayHours: true,
                        saturdayHours: true,
                        sundayHours: true,
                        services: {
                            orderBy: {
                                order: "asc"
                            }
                        },
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
            // Clean up any legacy duplicate nested data property
            if (profileData && profileData.data) {
                delete profileData.data;
            }
        }

        const bp = userProfile.businessProfile;

        // Reconstruct hours array from individual database columns
        let hours: any[] = [];
        if (bp) {
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
        } else {
            hours = [
                { day: "Mon-Fri", time: "9:00 AM - 7:00 PM", open: true },
                { day: "Saturday", time: "10:00 AM - 5:00 PM", open: true },
                { day: "Sunday", time: "Closed", open: false }
            ];
        }

        // Reconstruct services from the database Service table and stitch thumbnail images back from builder JSON
        let services: any[] = [];
        if (bp?.services) {
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

        // Construct unified state object using businessProfile as the master source of truth
        const mergedData = {
            // Builder-specific config (defaults if not present)
            theme: bp?.seoTitle || profileData.theme || "blue",
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

            // Master data from BusinessProfile (strictly overrides builder data)
            id: userProfile.id,
            name: userProfile.name,
            role: userProfile.role,
            isActive: userProfile.isActive,
            businessName: bp?.businessName || "",
            title: bp?.businessName || "",
            tagline: bp?.about || "",
            about: bp?.about || "",
            logo: bp?.BusinessLogo || bp?.BusinessLogo || "",
            BusinessLogo: bp?.BusinessLogo || bp?.BusinessLogo || "",
            phone: bp?.contactNumber || "",
            contactNumber: bp?.contactNumber || "",
            whatsapp: bp?.whatsappNumber || bp?.contactNumber || "",
            whatsappNumber: bp?.whatsappNumber || bp?.contactNumber || "",
            email: bp?.email || "",
            address: bp?.businessAddress || "",
            businessAddress: bp?.businessAddress || "",
            website: bp?.website || "",
            instagram: bp?.instagram || "",
            facebook: bp?.facebook || "",
            twitter: bp?.twitter || "",
            linkedin: bp?.linkedin || "",
            upiId: bp?.upiId || "",
            paymentQrCode: bp?.paymentQrCode || "",
            googleReviewLink: bp?.googleReviewLink || "",
            isPublished: bp?.isPublished || false,
            isQrGenerated: bp?.isQrGenerated || false,
            viewCount: bp?.viewCount || 0,
            shareCount: bp?.shareCount || 0,
            hours,
            services
        };

        return { success: true, message: "Business profile found", data: mergedData };

    } catch (error: any) {
        ActivityLogs(userId, "", "GET", "Mini Website API", error.message);
        return { success: false, message: error.message };
    }
}