import { prisma } from "@/lib/prisma";
import { runMiniWebsiteGraph } from "@/lib/ai/mini-website-graph";
import { logAiContent } from "@/lib/ai/log-ai-content";
import type { OnboardingContext } from "@/lib/ai/types";
import SaveMiniWebsiteData from "./mini-website-post";
import ActivityLogs from "../ActivityLogs";

const uid = () => Math.random().toString(36).slice(2, 8);

export default async function GenerateMiniWebsite(
  userId: string,
  onboardingData: OnboardingContext
): Promise<{ success: boolean; message: string; usedFallback?: boolean; error?: string }> {
  try {
    const profile = await prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return { success: false, message: "Business profile not found." };
    }

    const context: OnboardingContext = {
      businessName: onboardingData.businessName || profile.businessName || "",
      businessAbout:
        onboardingData.businessAbout ||
        profile.about ||
        `Professional ${onboardingData.category || profile.category || "local"} services`,
      category: onboardingData.category || profile.category || "Other",
      address: onboardingData.address || profile.businessAddress || "",
      city: onboardingData.city || profile.city || "",
      state: onboardingData.state || profile.state || "",
      whatsapp: onboardingData.whatsapp || profile.whatsappNumber || "",
      contactNumber: onboardingData.contactNumber || profile.contactNumber || "",
      instagram: onboardingData.instagram || profile.instagram || "",
      googleReviewLink: onboardingData.googleReviewLink || profile.googleReviewLink || "",
      services: onboardingData.services || [],
      upiId: onboardingData.upiId || profile.upiId || "",
    };

    const graphResult = await runMiniWebsiteGraph(context);
    const { coreCopy, pageContent, catalog, engagement, meta, model, usedFallback, aiError } = graphResult;

    if (!coreCopy || !catalog || !engagement || !meta || !pageContent) {
      return { success: false, message: "Content generation incomplete. Please try again." };
    }

    const fullAddress = [context.address, context.city, context.state].filter(Boolean).join(", ");
    const aboutSection = pageContent.aboutSection;
    const sectionHeaders = pageContent.sectionHeaders;

    const templateData = {
      businessName: context.businessName,
      title: coreCopy.title || context.businessName,
      tagline: coreCopy.tagline,
      aboutSection,
      sectionHeaders,
      seoPageTitle: meta.seoPageTitle,
      seoMetaDescription: meta.seoMetaDescription,
      logo: profile.BusinessLogo || profile.logo || "",
      phone: context.contactNumber || context.whatsapp,
      whatsapp: context.whatsapp || context.contactNumber,
      email: profile.email || "",
      address: fullAddress,
      website: profile.website || "",
      instagram: context.instagram,
      facebook: profile.facebook || "",
      youtube: "",
      theme: meta.theme,
      selectedTemplate: meta.selectedTemplate,
      buttonText: coreCopy.buttonText,
      googleFormLink: "",
      googleReviewLink: context.googleReviewLink,
      announcement: {
        enabled: true,
        text: coreCopy.announcementText,
      },
      services: catalog.map((s) => ({
        id: uid(),
        name: s.name,
        price: s.price,
        desc: s.desc,
        image: "",
        isPopular: s.isPopular,
      })),
      hours: meta.hours,
      employees: [
        {
          id: uid(),
          name: context.businessName,
          bio: `Founder & Owner — leading ${context.category} services in ${context.city || "the local area"}.`,
          phone: context.contactNumber || context.whatsapp,
          email: profile.email || "",
          image: "",
        },
      ],
      testimonials: engagement.testimonials.map((t) => ({
        id: uid(),
        name: t.name,
        company: t.company,
        content: t.content,
        stars: t.stars,
      })),
      mediaLinks: [
        {
          id: uid(),
          title: "Our Work Showcase",
          url: "https://youtube.com",
        },
      ],
      faqs: engagement.faqs.map((f) => ({
        id: uid(),
        question: f.question,
        answer: f.answer,
      })),
      amenities: engagement.amenities,
      showSections: {
        announcement: true,
        about: true,
        services: true,
        hours: true,
        contact: true,
        showWhatsapp: true,
        social: true,
        employees: true,
        testimonials: true,
        mediaLinks: false,
        faqs: true,
        amenities: true,
        googleForm: false,
      },
      upiId: context.upiId,
    };

    const saveResult = await SaveMiniWebsiteData(userId, templateData as any);
    if (!saveResult.success) {
      return { success: false, message: saveResult.message || "Failed to save generated website" };
    }

    await prisma.businessProfile.update({
      where: { id: profile.id },
      data: {
        about: aboutSection.body,
        aiKeywords: meta.seoKeywords,
        aiGeneratedDesc: coreCopy.tagline,
        seoDescription: meta.seoMetaDescription,
      },
    });

    await prisma.aiSuggestion.upsert({
      where: { businessProfileId: profile.id },
      update: {
        keywords: meta.seoKeywords,
        cacheStatus: usedFallback ? "fallback" : "ready",
        generatedCount: meta.seoKeywords.length,
        updatedAt: new Date(),
      },
      create: {
        businessProfileId: profile.id,
        keywords: meta.seoKeywords,
        cacheStatus: usedFallback ? "fallback" : "ready",
        generatedCount: meta.seoKeywords.length,
      },
    });

    const contextSummary = JSON.stringify(context).slice(0, 2000);
    const outputSummary = JSON.stringify({
      coreCopy,
      pageContent,
      catalogCount: catalog.length,
      faqCount: engagement.faqs.length,
      meta,
      usedFallback,
      aiError,
    }).slice(0, 4000);

    await logAiContent(profile.id, "DESCRIPTION", contextSummary, outputSummary, model, 0);

    await ActivityLogs(
      userId,
      profile.id,
      "CREATE",
      "AI Mini Website Generation",
      usedFallback ? "Generated with fallback content" : "Generated mini website from onboarding"
    );

    return {
      success: true,
      usedFallback: usedFallback ?? false,
      message: usedFallback
        ? "Mini website created with smart defaults (set a valid OPENAI_API_KEY for full AI content)."
        : "Mini website generated successfully",
    };
  } catch (error: any) {
    await ActivityLogs(userId, "", "ERROR", "GenerateMiniWebsite", error.message);
    return {
      success: false,
      message: "Failed to generate mini website",
      error: error.message,
    };
  }
}
