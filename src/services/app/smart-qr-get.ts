import { prisma } from "@/lib/prisma";
import ActivityLogs from "../ActivityLogs";

export async function GetSmartQr(userId: string): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
    try {
        const profile = await prisma.businessProfile.findUnique({
            where: { userId: userId },
            include: {
                smartQrSettings: true
            }
        });

        if (!profile) {
            return { success: false, message: "Business profile not found." };
        }

        const settings = profile.smartQrSettings;

        if (!settings) {
            return {
                success: true,
                message: "Smart QR settings not found, returned default settings",
                data: {
                    qrDestination: "smart-menu",
                    customUrl: "",
                    primaryColor: "#7c3aed",
                    secondaryColor: "#4f46e5",
                    gradientEnabled: false,
                    qrDesignPattern: "classic",
                    selectedFlyerLayout: "table-stand"
                }
            };
        }

        return {
            success: true,
            message: "Smart QR settings fetched successfully",
            data: {
                qrDestination: settings.qrDestination,
                customUrl: settings.customUrl,
                primaryColor: settings.primaryColor,
                secondaryColor: settings.secondaryColor,
                gradientEnabled: settings.gradientEnabled,
                qrDesignPattern: settings.qrDesignPattern,
                selectedFlyerLayout: settings.selectedFlyerLayout
            }
        };
    } catch (error: any) {
        await ActivityLogs(userId, "", "ERROR", "GetSmartQr Service", error.message);
        return {
            success: false,
            message: "Failed to fetch Smart QR settings",
            error: error.message
        };
    }
}
