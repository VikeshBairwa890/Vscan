import { prisma } from "@/lib/prisma";

interface SignupInterface {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default class Signup {

    static async signupPost(data: SignupInterface) {
        if (data.fullName == "") {
            return { success: false, message: "Full name is required" }
        }
        if (data.email == "") {
            return { success: false, message: "Email is required" }
        }
        if (data.password == "") {
            return { success: false, message: "Password is required" }
        }
        if (data.confirmPassword == "") {
            return { success: false, message: "Confirm password is required" }
        }
        if (data.password !== data.confirmPassword) {
            return { success: false, message: "Passwords do not match" }
        }
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (user) {
                return { success: false, message: "User already exists" }
            }
            const createdUser = await prisma.user.create({
                data: {
                    name: data.fullName,
                    email: data.email,
                    password: data.password,
                },
            });
            if (!createdUser || createdUser == null || createdUser == undefined) {
                return { success: false, message: "Signup failed" }
            }
            const business = await prisma.businessProfile.create({
                data: {
                    userId: createdUser.id,
                    businessName: data.fullName,
                    email: data.email
                },
            });
            if (!business || business == null || business == undefined) {
                return { success: false, message: "Signup failed" }
            }
            return { success: true, message: "Signup successful", data: createdUser, business };
        } catch (error) {
            return { success: false, message: "Something went wrong" }
        }
    }
}