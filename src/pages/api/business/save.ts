import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(200).json({ success: false, message: "Method Not Allowed" });
    }

    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Missing user ID header." });
    }

    try {
        const {
            businessName,
            tagline,
            logo,
            phone,
            email,
            address,
            website,
            googleReviewLink,
            upiId
        } = req.body;

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(200).json({ success: false, message: "User not found." });
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
                upiId: upiId || ""
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
                upiId: upiId || ""
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
