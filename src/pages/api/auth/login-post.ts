
import Login from "@/services/auth/login-post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(200).json({ success: false, message: "Method not allowed" })
    }
    const { email, password } = req.body;

    const result = await Login.loginPost(req.body);
    return res.status(200).json({ success: result.success, message: result.message, data: result.data })

}