import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { slug, rating, comment, customerName, customerEmail } = req.body;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ success: false, message: "Missing or invalid slug." });
  }

  if (rating === undefined || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
  }

  try {
    const bp = await prisma.businessProfile.findFirst({
      where: { customSlug: slug.toLowerCase().trim() }
    });

    if (!bp) {
      return res.status(404).json({ success: false, message: "Business profile not found." });
    }

    const isPublished = rating >= 4; // Auto-publish if 4 or 5 stars, keep private if <= 3

    const newReview = await prisma.review.create({
      data: {
        businessProfileId: bp.id,
        rating: Number(rating),
        comment: comment || "",
        customerName: customerName || "Anonymous Customer",
        customerEmail: customerEmail || "",
        aiGenerated: false,
        isPublished
      }
    });

    return res.status(200).json({
      success: true,
      message: rating <= 3
        ? "Thank you for your valuable feedback. It has been recorded privately."
        : "Thank you for your rating!",
      review: newReview
    });
  } catch (error: any) {
    console.error("Error in submit review:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
