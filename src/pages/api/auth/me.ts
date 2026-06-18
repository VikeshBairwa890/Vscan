import { NextApiRequest, NextApiResponse } from "next";
import UserSession from "@/services/UserSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(200).json({ success: false, message: "Method not allowed" });
    }

    try {
        const token = req.cookies.userSession;
        if (!token) {
            return res.status(200).json({ success: false, message: "Unauthorized" });
        }

        const result = await UserSession(token);
        if (result.success) {
            return res.status(200).json({ success: true, data: result.data.user });
        } else {
            return res.status(200).json({ success: false, message: result.message });
        }
    } catch (error: any) {
        return res.status(200).json({ success: false, message: "Internal server error" });
    }
}
