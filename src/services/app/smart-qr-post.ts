import { prisma } from "@/lib/prisma";
import ActivityLogs from "../ActivityLogs";

interface SmartQrSettingsData {
    qrDestination: string;
    customUrl: string;
    primaryColor: string;
    secondaryColor: string;
    gradientEnabled: boolean;
    qrDesignPattern: string;
    selectedFlyerLayout: string;
}

export default async function SmartQrPost(userId: string, data: SmartQrSettingsData): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
    try {
        const profile = await prisma.businessProfile.findUnique({
            where: { userId: userId }
        });

        if (!profile) {
            return { success: false, message: "Business profile not found." };
        }

        const settings = await prisma.smartQrSettings.upsert({
            where: { businessProfileId: profile.id },
            update: {
                qrDestination: data.qrDestination || "smart-menu",
                customUrl: data.customUrl || "",
                primaryColor: data.primaryColor || "#7c3aed",
                secondaryColor: data.secondaryColor || "#4f46e5",
                gradientEnabled: !!data.gradientEnabled,
                qrDesignPattern: data.qrDesignPattern || "classic",
                selectedFlyerLayout: data.selectedFlyerLayout || "table-stand",
                updatedAt: new Date()
            },
            create: {
                businessProfileId: profile.id,
                qrDestination: data.qrDestination || "smart-menu",
                customUrl: data.customUrl || "",
                primaryColor: data.primaryColor || "#7c3aed",
                secondaryColor: data.secondaryColor || "#4f46e5",
                gradientEnabled: !!data.gradientEnabled,
                qrDesignPattern: data.qrDesignPattern || "classic",
                selectedFlyerLayout: data.selectedFlyerLayout || "table-stand",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        // Also mark isQrGenerated as true on BusinessProfile
        await prisma.businessProfile.update({
            where: { id: profile.id },
            data: { isQrGenerated: true }
        });

        await ActivityLogs(userId, profile.id, "UPDATE", "Smart QR Settings", "Saved Smart QR code styling and routing settings");

        return {
            success: true,
            message: "Smart QR settings saved successfully",
            data: settings
        };
    } catch (error: any) {
        await ActivityLogs(userId, "", "ERROR", "SmartQrPost Service", error.message);
        return {
            success: false,
            message: "Failed to save Smart QR settings",
            error: error.message
        };
    }
}