import SaveMiniWebsiteData from "@/services/app/mini-website-post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(200).json({ message: "Method Not Allowed" });
  }

  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    return res.status(200).json({ success: false, message: "Unauthorized: Missing user ID." });
  }

  const tamplateData = req.body.tamplateData;
  if (!tamplateData) {
    return res.status(200).json({ success: false, message: "Missing template data." });
  }
  const result = await SaveMiniWebsiteData(userId, tamplateData);

  return res.status(200).json({ success: result?.success, message: result?.message, data: result.data });

}
