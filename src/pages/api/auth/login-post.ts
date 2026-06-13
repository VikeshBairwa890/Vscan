
import Login from "@/services/auth/login-post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(200).json({ success: false, message: "Method not allowed" })
    }
    const { email, password } = req.body;
    if (!email) {
        return res.status(200).json({ success: false, message: "Email is required" })
    }
    if (!password) {
        return res.status(200).json({ success: false, message: "Password is required" })
    }
    const result = await Login.loginPost(req.body);
    if (result.success == false) {
        res.status(200).json({ success: false, message: result.message })
    }
    // set cookie hare , cookie name userSession, in which set expire date and token
    res.setHeader('Set-Cookie', `userSession=${result?.session?.sessionToken}; HttpOnly; Path=/; Secure; SameSite=Lax; Expires=${result?.session?.expires}`);
    res.status(200).json({ success: true, message: result.message });

}