import { prisma } from "@/lib/prisma";
import ActivityLogs from "../ActivityLogs";

export async function GetAiStudio(userId: string): Promise<{ success: boolean; message: string; data?: any; error?: string }> {
    try {
        const profile = await prisma.businessProfile.findUnique({
            where: { userId: userId },
            include: {
                aiSuggestion: true
            }
        });

        if (!profile) {
            return { success: false, message: "Business profile not found." };
        }

        let aiSuggestionData = profile.aiSuggestion;

        if (!aiSuggestionData) {
            // Default keywords from schema profile or standard defaults
            const defaultKeywords = profile.aiKeywords && profile.aiKeywords.length > 0
                ? profile.aiKeywords
                : ["Service", "Quality", "Professional", "Value", "", "", "", "", "", ""];

            // Expand keywords list to total 10 items if shorter
            const keywords = [...defaultKeywords];
            while (keywords.length < 10) {
                keywords.push("");
            }

            return {
                success: true,
                message: "AI Suggestions not found, returned default settings",
                data: {
                    keywords,
                    cacheStatus: "empty",
                    generatedCount: 0
                }
            };
        }

        // Expand keywords list to total 10 items if shorter
        const keywords = [...(aiSuggestionData.keywords || [])];
        while (keywords.length < 10) {
            keywords.push("");
        }

        return {
            success: true,
            message: "AI Suggestions fetched successfully",
            data: {
                keywords,
                cacheStatus: aiSuggestionData.cacheStatus,
                generatedCount: aiSuggestionData.generatedCount
            }
        };
    } catch (error: any) {
        await ActivityLogs(userId, "", "ERROR", "GetAiStudio Service", error.message);
        return {
            success: false,
            message: "Failed to fetch AI Suggestions",
            error: error.message
        };
    }
}
