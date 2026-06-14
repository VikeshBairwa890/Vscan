import { NextApiRequest, NextApiResponse } from "next";
import GetDashboardStatus from "@/services/app/dashboard-status";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET" && req.method !== "POST") {
        return res.status(200).json({ success: false, message: "Method Not Allowed" });
    }

    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Unauthorized: Missing user ID." });
    }

    const result = await GetDashboardStatus(userId);

    return res.status(200).json({ success: result.success, data: result, message: result.message });
}
