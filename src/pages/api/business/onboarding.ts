import PostOnboarding from "@/services/app/onboarding-post";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
    responseLimit: false,
    externalResolver: true,
  },
  maxDuration: 300,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized. Missing user ID header." });
  }

  const {
    businessName,
    businessAbout,
    category,
    address,
    city,
    state,
    whatsapp,
    contactNumber,
    instagram,
    googleReviewLink,
    services = [],
    upiId,
    qrCodeImage,
  } = req.body;

  if (!businessName?.trim()) {
    return res.status(400).json({ success: false, message: "Business name is required" });
  }

  if (!category?.trim()) {
    return res.status(400).json({ success: false, message: "Business category is required" });
  }

  const resolvedAbout =
    businessAbout?.trim() ||
    `Professional ${category || "local"} services by ${businessName}`;

  const data = {
    businessName: businessName.trim(),
    businessAbout: resolvedAbout,
    category: category.trim(),
    address: address || "",
    city: city || "",
    state: state || "",
    whatsapp: whatsapp || "",
    contactNumber: contactNumber || "",
    instagram: instagram || "",
    googleReviewLink: googleReviewLink || "",
    services: services || [],
    upiId: upiId || "",
    qrCodeImage: qrCodeImage || "",
  };

  const result = await PostOnboarding(userId, data);

  if (!result.success) {
    return res.status(500).json(result);
  }

  return res.status(200).json(result);
}
