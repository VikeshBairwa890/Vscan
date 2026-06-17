import { prisma } from "@/lib/prisma";
import { generateFieldContent } from "@/lib/ai/field-generator";
import { logAiContent } from "@/lib/ai/log-ai-content";
import type { AiType } from "@/generated/prisma/enums";
import ActivityLogs from "../ActivityLogs";

interface FieldGeneratePayload {
  field: string;
  currentValue?: string;
  userPrompt?: string;
}

const FIELD_AI_TYPE: Record<string, AiType> = {
  title: "DESCRIPTION",
  tagline: "DESCRIPTION",
  buttonText: "DESCRIPTION",
  announcement: "DESCRIPTION",
  serviceName: "SERVICE",
  serviceDesc: "SERVICE",
  testimonialContent: "REVIEW",
  testimonialName: "REVIEW",
  testimonialCompany: "REVIEW",
  faqQuestion: "SEO",
  faqAnswer: "SEO",
  employeeBio: "DESCRIPTION",
  mediaTitle: "DESCRIPTION",
  amenity: "DESCRIPTION",
  aboutTitle: "DESCRIPTION",
  aboutSubtitle: "DESCRIPTION",
  aboutBody: "DESCRIPTION",
  seoPageTitle: "SEO",
  seoMetaDescription: "SEO",

export default async function PostAiGenerateField(
  userId: string,
  payload: FieldGeneratePayload
): Promise<{ success: boolean; message: string; suggestion?: string; usedFallback?: boolean; error?: string }> {
  try {
    if (!payload.field) {
      return { success: false, message: "Field name is required." };
    }

    const profile = await prisma.businessProfile.findUnique({
      where: { userId },
      include: { services: true },
    });

    if (!profile) {
      return { success: false, message: "Business profile not found." };
    }

    const services = profile.services.map((s) => ({
      name: s.name,
      description: s.description || "",
      price: s.price || "0",
      isPopular: s.isPopular,
    }));

    const result = await generateFieldContent({
      field: payload.field,
      currentValue: payload.currentValue || "",
      userPrompt: payload.userPrompt,
      businessName: profile.businessName || "",
      category: profile.category || "",
      tagline: profile.about || "",
      services,
    });

    const aiType = FIELD_AI_TYPE[payload.field] || "DESCRIPTION";
    await logAiContent(
      profile.id,
      aiType,
      JSON.stringify({ field: payload.field, currentValue: payload.currentValue, userPrompt: payload.userPrompt }),
      result.suggestion,
      result.model,
      0
    );

    await ActivityLogs(userId, profile.id, "CREATE", "AI Field Suggestion", payload.field);

    return {
      success: true,
      message: result.usedFallback
        ? "Suggestion generated (using defaults — set OPENAI_API_KEY for AI copy)"
        : "Suggestion generated",
      suggestion: result.suggestion,
      usedFallback: result.usedFallback,
    };
  } catch (error: any) {
    await ActivityLogs(userId, "", "ERROR", "PostAiGenerateField", error.message);
    return {
      success: false,
      message: "Failed to generate suggestion",
      error: error.message,
    };
  }
}
