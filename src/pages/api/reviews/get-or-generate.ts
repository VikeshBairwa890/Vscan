import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { isOpenAiConfigured, getChatModel } from "../../../lib/ai/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const CUSTOMER_NAMES = [
  "Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Rao",
  "Vikram Singh", "Anjali Gupta", "Sanjay Verma", "Deepika Iyer",
  "Arjun Mehta", "Neha Joshi"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { slug } = req.query;
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ success: false, message: "Missing or invalid slug." });
  }

  try {
    const bp = await prisma.businessProfile.findFirst({
      where: { customSlug: slug.toLowerCase().trim() },
      include: { services: true }
    });

    if (!bp) {
      return res.status(404).json({ success: false, message: "Business profile not found." });
    }

    // Check if reviews already exist
    let reviews = await prisma.review.findMany({
      where: {
        businessProfileId: bp.id,
        aiGenerated: true
      },
      orderBy: { id: "asc" }
    });

    if (reviews.length >= 10) {
      return res.status(200).json({ success: true, reviews });
    }

    // Generate reviews
    const businessName = bp.businessName || "this business";
    const category = bp.category || "services";
    const city = bp.city || "town";
    const servicesList = bp.services.map(s => s.name);
    const serviceString = servicesList.slice(0, 3).join(", ");

    let generatedComments: string[] = [];

    if (isOpenAiConfigured()) {
      try {
        const model = getChatModel(0.8);
        const response = await model.invoke([
          new SystemMessage(
            "You are a local business assistant. Generate exactly 10 short, positive customer reviews (1-2 sentences each) for an Indian local business. " +
            "Do not include star ratings or names in the output. Just return a JSON array of 10 strings representing the review comments."
          ),
          new HumanMessage(
            `Generate 10 positive reviews for a business named "${businessName}", which is a "${category}" located in "${city}". ` +
            `They offer services like: ${serviceString || "various professional services"}. ` +
            `Make the comments sound authentic, realistic, friendly, and varied. Return a valid JSON array of strings only.`
          )
        ]);

        const text = response.content.toString();
        // Extract JSON array
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          generatedComments = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.error("AI Review generation failed, using fallback:", err);
      }
    }

    // Fallback if AI is not configured or failed
    if (generatedComments.length < 10) {
      const fallbacks = [
        `Outstanding services! The team at ${businessName} did an amazing job. Highly recommend!`,
        `Very professional staff and top-notch quality. Best ${category} in ${city}!`,
        `Loved my experience here. Highly prompt, clean, and value for money.`,
        `Excellent attention to detail. Will definitely visit again.`,
        `Super convenient and friendly. Directly paid via UPI, very smooth experience.`,
        `Wonderful service! They really care about customer satisfaction.`,
        `Great value and very polite behavior. Highly recommended for ${serviceString || "services"}.`,
        `Prompt response on WhatsApp and clean work. Keep it up!`,
        `Absolutely the best ${category} I have visited. Five stars!`,
        `Highly professional work, they guide you well and keep prices transparent.`
      ];
      generatedComments = fallbacks;
    }

    // Create the reviews in database
    const newReviewsData = generatedComments.map((comment, index) => ({
      businessProfileId: bp.id,
      customerName: CUSTOMER_NAMES[index % CUSTOMER_NAMES.length],
      rating: 5,
      comment,
      aiGenerated: true,
      isPublished: true
    }));

    // Save reviews
    await prisma.review.createMany({
      data: newReviewsData
    });

    // Fetch them back
    reviews = await prisma.review.findMany({
      where: {
        businessProfileId: bp.id,
        aiGenerated: true
      },
      orderBy: { id: "asc" }
    });

    return res.status(200).json({ success: true, reviews });
  } catch (error: any) {
    console.error("Error in get-or-generate reviews:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
