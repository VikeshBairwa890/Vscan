import { NextApiRequest, NextApiResponse } from "next";
import PostAiGenerateField from "@/services/app/ai-generate-field";

export const config = {
  api: {
    responseLimit: false,
    externalResolver: true,
  },
  maxDuration: 180,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(200).json({ success: false, message: "Method Not Allowed" });
  }

  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    return res.status(200).json({ success: false, message: "Missing user ID." });
  }

  const { field, currentValue, userPrompt } = req.body || {};
  const result = await PostAiGenerateField(userId, { field, currentValue, userPrompt });

  return res.status(200).json(result);
}
