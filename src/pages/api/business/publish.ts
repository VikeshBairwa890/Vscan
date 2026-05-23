import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT" && req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user ID." });
  }

  try {
    const { isPublished } = req.body;

    const profile = await prisma.businessProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Business profile not found." });
    }

    const updatedProfile = await prisma.businessProfile.update({
      where: { id: profile.id },
      data: {
        isPublished: isPublished !== undefined ? !!isPublished : !profile.isPublished
      }
    });

    return res.status(200).json({
      success: true,
      message: `Website successfully ${updatedProfile.isPublished ? "published" : "unpublished"}`,
      isPublished: updatedProfile.isPublished
    });
  } catch (error: any) {
    console.error("Publish API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update publication status",
      error: error.message
    });
  }
}
