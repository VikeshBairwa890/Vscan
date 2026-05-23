import Signup from "@/services/auth/signup-post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(200).json({ success: false, message: "Method not allowed" })
    }
    const { fullName, email, password, confirmPassword } = req.body;

    const result = await Signup.signupPost(req.body);
    return res.status(200).json({ success: result.success, message: result.message, data: result.data })

}