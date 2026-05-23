import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user ID." });
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
      instagram,
      facebook,
      theme,
      googleReviewLink,
      upiId,
      services = [],
      hours = [],
      showSections
    } = req.body;

    const profile = await prisma.businessProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Business profile not found." });
    }

    // Map business hours to database columns
    const hoursMap: Record<string, string> = {};
    hours.forEach((h: any) => {
      const day = h.day?.toLowerCase() || "";
      const time = h.time || "Closed";
      if (day.includes("mon")) hoursMap.mondayHours = time;
      else if (day.includes("tue")) hoursMap.tuesdayHours = time;
      else if (day.includes("wed")) hoursMap.wednesdayHours = time;
      else if (day.includes("thu")) hoursMap.thursdayHours = time;
      else if (day.includes("fri")) hoursMap.fridayHours = time;
      else if (day.includes("sat")) hoursMap.saturdayHours = time;
      else if (day.includes("sun")) hoursMap.sundayHours = time;
    });

    // Update BusinessProfile details
    const updatedProfile = await prisma.businessProfile.update({
      where: { id: profile.id },
      data: {
        businessName,
        about: tagline,
        logo,
        contactNumber: phone,
        whatsappNumber: phone,
        email,
        businessAddress: address,
        website,
        instagram,
        facebook,
        upiId,
        googleReviewLink,
        // Save simple JSON representation of active sections and theme in SEO description or other helper field if we want to retrieve them
        seoTitle: theme, // Store theme name in seoTitle
        seoDescription: JSON.stringify(showSections), // Store active sections toggles as JSON string
        ...hoursMap
      }
    });

    // Delete and recreate services to synchronize changes
    await prisma.service.deleteMany({
      where: { businessProfileId: profile.id }
    });

    if (services.length > 0) {
      await prisma.service.createMany({
        data: services.map((s: any) => ({
          businessProfileId: profile.id,
          name: s.name || "Service",
          description: s.desc || "",
          price: s.price?.toString() || "0",
          isPopular: !!s.isPopular
        }))
      });
    }

    return res.status(200).json({
      success: true,
      message: "Website changes saved successfully",
      profile: updatedProfile
    });
  } catch (error: any) {
    console.error("Save Website API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save website changes",
      error: error.message
    });
  }
}
