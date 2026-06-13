import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import ActivityLogs from "../ActivityLogs";

interface LoginInterface {
    email: string;
    password: string;
}

export default class Login {

    static async loginPost(data: LoginInterface) {
        if (data.email == "") {
            return { success: false, message: "Email is required" }
        }
        if (data.password == "") {
            return { success: false, message: "Password is required" }
        }
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (!user) {
                return { success: false, message: "User not found" }
            }
            if (user.password !== data.password) {
                return { success: false, message: "Invalid password" }
            }
            const session = await prisma.session.create({
                data: {
                    sessionToken: randomUUID(),
                    userId: user.id,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                },
            });
            if (!user) {
                return { success: false, message: "User not found" }
            }
            ActivityLogs(user.id, '', 'login', user.email, 'Login successful');
            return { success: true, message: "Login successful", data: user, session: session };
        } catch (error: any) {
            ActivityLogs(data.email || '', '', 'login', 'logion service', error.message);
            return { success: false, message: "Something went wrong" }
        }
    }
}