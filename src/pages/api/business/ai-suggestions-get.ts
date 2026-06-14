import { NextApiRequest, NextApiResponse } from "next";
import { GetAiStudio } from "@/services/app/ai-suggestions-get";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(200).json({ success: false, message: "Method Not Allowed" });
    }

    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Unauthorized: Missing user ID." });
    }

    const result = await GetAiStudio(userId);
    if (result.success) {
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });
    } else {
        return res.status(200).json({ success: false, message: result.message });
    }
}
