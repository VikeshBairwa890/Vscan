import PostOnboarding from "@/services/app/onboarding-post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Method Not Allowed" });
  }

  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    return res.status(200).json({ success: false, message: "Unauthorized: Missing user ID." });
  }
  const { businessName, businessAbout, category, address, city, state, whatsapp, contactNumber, instagram, googleReviewLink, services = [], upiId, qrCodeImage } = req.body;
  if (!businessName) {
    return res.status(200).json({ message: "Business name is required" });
  }
  if (!businessAbout) {
    return res.status(200).json({ message: "Business about is required" });
  }
  if (!category) {
    return res.status(200).json({ message: "Business category is required" });
  }
  // if (!address) {
  //   return res.status(200).json({ message: "Business address is required" });
  // }
  // if (!city) {
  //   return res.status(200).json({ message: "Business city is required" });
  // }
  // if (!state) {
  //   return res.status(200).json({ message: "Business state is required" });
  // }
  // if (!whatsapp) {
  //   return res.status(200).json({ message: "Business whatsapp is required" });
  // }
  // if (!contactNumber) {
  //   return res.status(200).json({ message: "Business contact number is required" });
  // }
  // if (!instagram) {
  //   return res.status(200).json({ message: "Business instagram is required" });
  // }
  // if (!googleReviewLink) {
  //   return res.status(200).json({ message: "Business google review link is required" });
  // }
  // if (!upiId) {
  //   return res.status(200).json({ message: "Business upi id is required" });
  // }
  // if (!qrCodeImage) {
  //   return res.status(200).json({ message: "Business qr code image is required" });
  // }
  const data = {
    businessName: businessName || '',
    businessAbout: businessAbout || '',
    category: category || '',
    address: address || '',
    city: city || '',
    state: state || '',
    whatsapp: whatsapp || '',
    contactNumber: contactNumber || '',
    instagram: instagram || '',
    googleReviewLink: googleReviewLink || '',
    services: services || [],
    upiId: upiId || '',
    qrCodeImage: qrCodeImage || ''
  }
  const result = await PostOnboarding(userId, data);
  return res.status(200).json(result);
}
