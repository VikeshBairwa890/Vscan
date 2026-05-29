import { NextApiRequest, NextApiResponse } from "next";
import GetDashboardStatus from "@/services/app/dashboard-status";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET" && req.method !== "POST") {
        return res.status(200).json({ success: false, message: "Method Not Allowed" });
    }

    // Support user ID from header or body
    const userId = (req.headers["x-user-id"] || req.query.userId || req.body.userId) as string;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Missing user ID." });
    }
    const result = await GetDashboardStatus(userId);

    return res.status(200).json(result);
}
