import PostAiStudio from "@/services/app/ai-suggestions-post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(200).json({ success: false, message: "Method Not Allowed" });
    }
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Unauthorized: Missing user ID." });
    }
    const { data } = req.body;

    const result = await PostAiStudio(userId, data)
    return res.status(200).json({ success: result.success, message: result.message, data: result.data });

}