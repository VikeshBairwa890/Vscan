import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Method Not Allowed" });
  }

  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    return res.status(200).json({ message: "Unauthorized. Missing user ID header." });
  }

  try {
    const { businessName, businessAbout, category, address, city, state, whatsapp, contactNumber, instagram, googleReviewLink, services = [], upiId, qrCodeImage } = req.body;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Upsert BusinessProfile
    const businessProfile = await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName,
        category,
        contactNumber: whatsapp,
        whatsappNumber: whatsapp,
        businessAddress: address,
        city,
        state,
        instagram,
        googleReviewLink,
        upiId,
        paymentQrCode: qrCodeImage,
        isPublished: false // Onboarding completed, but site is not published yet
      },
      create: {
        userId: user.id,
        businessName,
        category,
        contactNumber: whatsapp,
        whatsappNumber: whatsapp,
        businessAddress: address,
        city,
        state,
        instagram,
        googleReviewLink,
        upiId,
        paymentQrCode: qrCodeImage,
        isPublished: false
      }
    });

    // Delete existing services for this business profile (if any) and insert new ones
    await prisma.service.deleteMany({
      where: { businessProfileId: businessProfile.id }
    });

    if (services.length > 0) {
      await prisma.service.createMany({
        data: services.map((s: any) => ({
          businessProfileId: businessProfile.id,
          name: s.name,
          description: s.description || "",
          price: s.price?.toString() || "0",
          isPopular: !!s.isPopular
        }))
      });
    }

    return res.status(200).json({
      success: true,
      message: "Business profile and services created successfully",
      businessProfile
    });
  } catch (error: any) {
    console.error("Onboarding API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save onboarding data",
      error: error.message
    });
  }
}
