import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const token = req.cookies.userSession;

        if (token) {
            // Remove session from database
            await prisma.session.deleteMany({
                where: {
                    sessionToken: token,
                },
            });
        }

        // Clear the cookie
        res.setHeader('Set-Cookie', 'userSession=; HttpOnly; Path=/; Secure; SameSite=Lax; Max-Age=0');
        
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
