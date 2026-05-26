import { prisma } from "@/lib/prisma";
import ActivityLogs from "../ActivityLogs";

interface AiSuggestionData {
    keywords: string[];
    cacheStatus: string;
    generatedCount: number;
}

export default async function PostAiStudio(userId: string, data: AiSuggestionData): Promise<{ success: boolean; message: string; data?: AiSuggestionData; error?: string }> {
    try {
        const profile = await prisma.businessProfile.findUnique({
            where: { userId: userId }
        });

        if (!profile) {
            return { success: false, message: "Business profile not found." };
        }

        const keywords = data.keywords || [];
        const cacheStatus = data.cacheStatus || "empty";
        const generatedCount = typeof data.generatedCount === "number" ? data.generatedCount : 0;

        // Sync with BusinessProfile's aiKeywords
        await prisma.businessProfile.update({
            where: { id: profile.id },
            data: {
                aiKeywords: keywords
            }
        });

        // Upsert AiSuggestion settings
        const aiSuggestion = await prisma.aiSuggestion.upsert({
            where: { businessProfileId: profile.id },
            update: {
                keywords,
                cacheStatus,
                generatedCount,
                updatedAt: new Date()
            },
            create: {
                businessProfileId: profile.id,
                keywords,
                cacheStatus,
                generatedCount,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        await ActivityLogs(userId, profile.id, "UPDATE", "AI SEO Manager Settings", "Saved AI keywords and suggestions settings");

        return {
            success: true,
            message: "AI Suggestions saved successfully",
            data: aiSuggestion
        };
    } catch (error: any) {
        await ActivityLogs(userId, "", "ERROR", "PostAiStudio Service", error.message);
        return {
            success: false,
            message: "Failed to save AI Suggestions",
            error: error.message
        };
    }
}