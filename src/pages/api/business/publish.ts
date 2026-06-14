import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import PublishProfile from "@/services/app/pubblish";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT" && req.method !== "POST") {
    return res.status(200).json({ message: "Method Not Allowed" });
  }

  const userId = req.headers["x-user-id"] as string;
  const email = req.headers["x-user-email"] as string;
  if (!userId) {
    return res.status(200).json({ success: false, message: "Unauthorized: Missing user ID." });
  }

  const { isPublished } = req.body;
  const result = await PublishProfile(userId, email, isPublished);
  return res.status(200).json(result);

}
