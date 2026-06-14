import { prisma } from "@/lib/prisma";

export default async function PublishProfile(userId: string, email: string, isPublished: boolean) {
    if (!userId || userId?.length == 0) {
        return { success: false, message: "User ID is required", data: null }
    }

    try {

        const profile = await prisma.businessProfile.findUnique({
            where: { userId: userId },
            include: { subscription: true }
        });

        if (!profile) {
            return { success: false, message: "Business profile not found." }
        }
        // check hare subscription of user
        const subscription = profile.subscription;
        if (!subscription) {
            return { success: false, message: "Subscription not found." }
        }
        // check subscription is active or not
        if (subscription.isActive == false) {
            return { success: false, message: "Subscription is not active." }
        }

        // check subscription plan is premium
        if (subscription.plan == "FREE" || subscription.plan == "BASIC") {
            return { success: false, message: "Please upgrade your subscription plan to publish your website." }
        }

        const updatedProfile = await prisma.businessProfile.update({
            where: { id: profile.id },
            data: {
                isPublished: isPublished !== undefined ? !!isPublished : !profile.isPublished
            }
        });

        return {
            success: true,
            message: `Website successfully ${updatedProfile.isPublished ? "published" : "unpublished"}`,
            isPublished: updatedProfile.isPublished
        };
    } catch (error: any) {
        console.error("Publish API Error:", error);
        return {
            success: false,
            message: error.message
        };
    }
}