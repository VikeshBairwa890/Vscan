
import { prisma } from "@/lib/prisma";
import axios from "axios";
import ActivityLogs from "../ActivityLogs";

interface OnboardPostServiceProps {
    businessName: string;
    businessAbout: string;
    category: string;
    address: string;
    city: string;
    state: string;
    whatsapp: string;
    contactNumber: string;
    instagram: string;
    googleReviewLink: string;
    services: Array<{
        name: string;
        description: string;
        price: string;
        isPopular: boolean;
    }>;
    upiId: string;
    qrCodeImage: string;
    isPublished: boolean;
}

export default async function OnboardPostService(data: OnboardPostServiceProps, userId: string) {

    if (userId == null || userId == "") {
        return { success: false, message: "User ID is required" }
    }
    if (data.businessName == null || data.businessName == "") {
        return { success: false, message: "Business Name is required" }
    }
    if (data.category == null || data.category == "") {
        return { success: false, message: "Category is required" }
    }
    if (data.address == null || data.address == "") {
        return { success: false, message: "Address is required" }
    }
    if (data.city == null || data.city == "") {
        return { success: false, message: "City is required" }
    }
    if (data.state == null || data.state == "") {
        return { success: false, message: "State is required" }
    }
    if (data.whatsapp == null || data.whatsapp == "") {
        return { success: false, message: "Whatsapp is required" }
    }
    if (data.services == null || data.services.length == 0) {
        return { success: false, message: "Services is required" }
    }
    try {
        const user = await prisma.user.findFirst({ where: { id: userId } });
        if (!user) {
            return { success: false, message: "User is not exist" }
        }

        const businessProfile = await prisma.businessProfile.upsert({
            where: { userId: userId },
            update: {
                businessName: data.businessName,
                about: data.businessAbout,
                category: data.category,
                businessAddress: data.address,
                city: data.city,
                state: data.state,
                whatsappNumber: data.whatsapp,
                contactNumber: data.contactNumber,
                googleReviewLink: data.googleReviewLink,
                upiId: data.upiId,
                paymentQrCode: data.qrCodeImage,
                instagram: data.instagram,
                isPublished: false
            },
            create: {
                userId: userId,
                businessName: data.businessName,
                about: data.businessAbout,
                category: data.category,
                businessAddress: data.address,
                city: data.city,
                state: data.state,
                whatsappNumber: data.whatsapp,
                contactNumber: data.contactNumber,
                googleReviewLink: data.googleReviewLink,
                upiId: data.upiId,
                paymentQrCode: data.qrCodeImage,
                instagram: data.instagram,
                isPublished: false
            }
        });
        if (data.services.length > 0) {
            await prisma.service.deleteMany({
                where: { businessProfileId: businessProfile.id }
            });
            const services = await prisma.service.createMany({
                data: data.services ? data.services.map((service: any) => ({
                    name: service.name,
                    description: service.description,
                    price: service.price,
                    isPopular: service.isPopular,
                    businessProfileId: businessProfile.id
                })) : []

            });
        }
        ActivityLogs(userId, businessProfile.id, "onboard", "OnboardPostService", "Business profile created successfully");
        return { success: true, message: "Business profile created successfully", businessProfile }
    } catch (error: any) {
        ActivityLogs(userId, "", "onboard", "OnboardPostService", error.message);
        return { success: false, message: error.message }
    }
}