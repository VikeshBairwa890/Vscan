import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(200).json({ success: false, message: "Method Not Allowed" });
    }

    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Unauthorized: Missing user ID." });
    }
    try {
        const { businessName, tagline, logo, phone, email, address, website, googleReviewLink, upiId, customSlug } = req.body;

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(200).json({ success: false, message: "User not found." });
        }

        let validatedSlug = null;
        if (customSlug) {
            const slugLower = customSlug.toLowerCase().trim();
            if (slugLower.length > 0) {
                if (!/^[a-z0-9-]+$/.test(slugLower)) {
                    return res.status(200).json({
                        success: false,
                        message: "URL handle can only contain lowercase letters, numbers, and hyphens."
                    });
                }
                if (slugLower.length < 3 || slugLower.length > 30) {
                    return res.status(200).json({
                        success: false,
                        message: "URL handle must be between 3 and 30 characters."
                    });
                }
                // Check if already taken
                const existing = await prisma.businessProfile.findFirst({
                    where: {
                        customSlug: slugLower,
                        NOT: { userId: user.id }
                    }
                });
                if (existing) {
                    return res.status(200).json({
                        success: false,
                        message: "This URL handle is already taken. Please choose another one."
                    });
                }
                validatedSlug = slugLower;
            }
        }

        // If no customSlug is provided and user has no customSlug set, generate one automatically from businessName
        if (!validatedSlug) {
            const existingProfile = await prisma.businessProfile.findUnique({
                where: { userId: user.id },
                select: { customSlug: true }
            });
            if (!existingProfile || !existingProfile.customSlug) {
                const { generateUniqueSlug } = await import("@/services/app/slug-helper");
                validatedSlug = await generateUniqueSlug(businessName || "business", user.id);
            }
        }

        // Upsert BusinessProfile
        const businessProfile = await prisma.businessProfile.upsert({
            where: { userId: user.id },
            update: {
                businessName: businessName || "",
                about: tagline || "",
                logo: logo || "",
                contactNumber: phone || "",
                whatsappNumber: phone || "",
                email: email || "",
                businessAddress: address || "",
                website: website || "",
                googleReviewLink: googleReviewLink || "",
                upiId: upiId || "",
                customSlug: validatedSlug || undefined
            },
            create: {
                userId: user.id,
                businessName: businessName || "",
                about: tagline || "",
                logo: logo || "",
                contactNumber: phone || "",
                whatsappNumber: phone || "",
                email: email || "",
                businessAddress: address || "",
                website: website || "",
                googleReviewLink: googleReviewLink || "",
                upiId: upiId || "",
                customSlug: validatedSlug
            }
        });

        return res.status(200).json({
            success: true,
            message: "Profile settings saved successfully",
            businessProfile
        });
    } catch (error: any) {
        console.error("Save Profile API Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save profile settings",
            error: error.message
        });
    }
}
