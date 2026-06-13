import { prisma } from "@/lib/prisma";
import ActivityLogs from "./ActivityLogs";
import { NextApiResponse } from "next";

export default async function UserSession(token: string, res?: NextApiResponse): Promise<any | null> {
    try {
        const userTicket = await prisma.session.findUnique({
            where: { sessionToken: token },
            select: {
                expires: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            }
        })
        if (!userTicket) {
            if (res) {
                res.redirect(`/auth?error=${encodeURIComponent("Invalid or expired session")}`);
                return { success: false, message: "Invalid or expired session" };
            }
            return { success: false, message: "Invalid or expired session", }
        }
        if (new Date(userTicket.expires) < new Date()) {
            ActivityLogs(userTicket.user?.id || '', '', '', 'Session check failed', 'Session has expired');
            if (res) {
                res.redirect(`/auth?error=${encodeURIComponent("Session has expired")}`);
                return { success: false, message: "Session has expired" };
            }
            return { success: false, message: "Session has expired", }
        }
        return { success: true, data: userTicket }

    } catch (error: any) {
        ActivityLogs('', '', '', 'Session check failed', error.message);
        if (res) {
            res.redirect(`/auth?error=${encodeURIComponent("Internal server error")}`);
            return { success: false, message: "Internal server error" };
        }
        return { success: false, message: "Internal server error" };
    }
}