import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import UserSession from "@/services/UserSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = req.cookies.userSession;
        if (!token) {
            return res.status(200).json({ success: false, message: "Unauthorized" });
        }

        const sessionResult = await UserSession(token);
        if (!sessionResult.success) {
            return res.status(200).json({ success: false, message: sessionResult.message });
        }

        const userId = sessionResult.data.userId;

        if (req.method === "GET") {
            const notifications = await prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });

            return res.status(200).json({ success: true, data: notifications });
        }

        if (req.method === "PUT") {
            const { id } = req.body;

            if (id) {
                // Mark single notification as read
                const notification = await prisma.notification.updateMany({
                    where: { id, userId },
                    data: { isRead: true }
                });
                return res.status(200).json({ success: true, message: "Notification marked as read" });
            } else {
                // Mark all notifications as read
                await prisma.notification.updateMany({
                    where: { userId, isRead: false },
                    data: { isRead: true }
                });
                return res.status(200).json({ success: true, message: "All notifications marked as read" });
            }
        }

        return res.status(200).json({ success: false, message: "Method not allowed" });
    } catch (error: any) {
        console.error("Notifications API Error:", error);
        return res.status(200).json({ success: false, message: "Internal server error" });
    }
}
