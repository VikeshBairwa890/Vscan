import { prisma } from "@/lib/prisma";

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
            return { success: true, message: "Login successful", data: user };
        } catch (error) {
            return { success: false, message: "Something went wrong" }
        }
    }
}