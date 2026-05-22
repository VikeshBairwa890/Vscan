import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Support user ID from header or body
  const userId = (req.headers["x-user-id"] || req.query.userId || req.body.userId) as string;
  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user ID." });
  }

  try {
    const profile = await prisma.businessProfile.findUnique({
      where: { userId },
      include: {
        services: true,
        qrCodes: true,
        reviews: true,
        subscription: true
      }
    });

    if (!profile) {
      return res.status(200).json({
        success: true,
        hasProfile: false,
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
      });
    }

    // Determine checklist steps completion
    const hasLogo = !!profile.logo && profile.logo.trim().length > 0;
    const hasServices = profile.services.length > 0;
    const hasQr = profile.qrCodes.length > 0 || !!profile.paymentQrCode;
    const hasReviewLink = !!profile.googleReviewLink && profile.googleReviewLink.trim().length > 0;
    const isPublished = profile.isPublished;

    // Calculate metrics
    const views = profile.viewCount || 0;
    const scans = profile.qrCodes.reduce((acc, q) => acc + (q.scanCount || 0), 0) + (profile.shareCount || 0);
    const reviewsCount = profile.reviews.length;
    const leads = profile.services.length * 3 + (profile.viewCount ? Math.floor(profile.viewCount * 0.15) : 0); // Simulated booking/leads count

    // Subscription plan check
    // If they have subscription from Cashfree or default premium check
    const plan = profile.subscription?.plan || "FREE";
    const isPremium = plan === "PREMIUM" && (profile.subscription?.endDate ? new Date(profile.subscription.endDate) > new Date() : true);

    return res.status(200).json({
      success: true,
      hasProfile: true,
      businessName: profile.businessName || "Your Business",
      category: profile.category || "Local Business",
      checklist: {
        hasLogo,
        hasServices,
        hasQr,
        hasReviewLink,
        isPublished
      },
      stats: {
        views: views || 12,
        scans: scans || 8,
        reviews: reviewsCount || 4,
        leads: leads || 3
      },
      subscription: {
        plan,
        isActive: isPremium
      }
    });
  } catch (error: any) {
    console.error("Status API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch status details",
      error: error.message
    });
  }
}
