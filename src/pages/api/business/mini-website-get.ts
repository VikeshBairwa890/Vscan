import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { GetMiniWebsiteInfo } from "@/services/app/mini-website-get";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(200).json({ message: "Method Not Allowed" });
    }

    // Support user ID from header or body
    const userId = (req.headers["x-user-id"] || req.query.userId) as string;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Missing user ID." });
    }
    const result = await GetMiniWebsiteInfo(userId);
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
