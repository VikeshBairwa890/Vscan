import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { getChatModel, getModelName, isOpenAiConfigured } from "./openai";
import { fieldOutputSchema } from "./schemas";
import { formatBusinessContext } from "./category-map";
import type { FieldGenerateRequest } from "./types";

const FIELD_HINTS: Record<string, string> = {
  title: "Business title displayed on the mini website header",
  tagline: "Short tagline describing the business value proposition",
  buttonText: "Call-to-action button label (e.g. Book Now, Contact Us)",
  announcement: "Short promotional announcement ribbon text",
  serviceName: "Product or service name",
  serviceDesc: "Service description, 1-2 sentences",
  testimonialContent: "Customer testimonial review text",
  testimonialName: "Customer name for a testimonial",
  testimonialCompany: "Customer company or role",
  faqQuestion: "Frequently asked question",
  faqAnswer: "Helpful answer to the FAQ",
  employeeBio: "Team member role or short bio",
  mediaTitle: "Title for a media or showcase link",
  amenity: "Single facility or amenity label",
  aboutTitle: "About section H2 heading",
  aboutSubtitle: "About section supporting subtitle, 1-2 sentences",
  aboutBody: "Full About Us content: 2-3 paragraphs, SEO-friendly, professional business website tone",
  seoPageTitle: "SEO page title under 60 characters with business, category, and city",
  seoMetaDescription: "Meta description under 160 characters with CTA for search engines",
  address: "Formatted business address",
};

function buildFallbackSuggestion(request: FieldGenerateRequest): string {
  const name = request.businessName || "Our business";
  const category = request.category || "local services";

  switch (request.field) {
    case "tagline":
      return request.userPrompt
        ? `${name} — ${request.userPrompt}`
        : `Trusted ${category} in your neighbourhood`;
    case "title":
      return name;
    case "buttonText":
      return "Book Now";
    case "announcement":
      return `Welcome to ${name}! Contact us today.`;
    case "serviceDesc":
      return `Professional ${request.currentValue || "service"} by ${name}`;
    case "serviceName":
      return request.currentValue || "Premium Service";
    case "testimonialContent":
      return `Great experience at ${name}. Highly recommended!`;
    case "faqQuestion":
      return `What services does ${name} offer?`;
    case "faqAnswer":
      return `We offer quality ${category}. Contact us for details.`;
    case "address":
      return request.currentValue || `${name}, India`;
    case "aboutBody":
      return [
        `${name} is a trusted ${category} serving customers in ${request.tagline || "the local area"}. We focus on quality, transparency, and long-term relationships with every client.`,
        `Our team brings practical experience and customer-first service across all offerings. Contact us today to learn how we can help you.`,
      ].join("\n\n");
    case "aboutSubtitle":
      return `Discover why locals choose ${name} for professional ${category} services.`;
    case "seoPageTitle":
      return `${name} | ${category}`.slice(0, 60);
    case "seoMetaDescription":
      return `Visit ${name} for expert ${category}. Book online or call today for friendly, professional service.`.slice(0, 160);
    default:
      return request.currentValue || `${name} — ${category}`;
  }
}

export async function generateFieldContent(request: FieldGenerateRequest) {
  if (!isOpenAiConfigured()) {
    return {
      suggestion: buildFallbackSuggestion(request),
      model: "fallback",
      usedFallback: true,
    };
  }

  const model = getChatModel(0.7).withStructuredOutput(fieldOutputSchema);
  const fieldHint = FIELD_HINTS[request.field] || request.field;

  const contextBlock = formatBusinessContext({
    businessName: request.businessName || "Business",
    businessAbout: request.tagline || "",
    category: request.category || "Local Business",
    address: "",
    city: "",
    state: "",
    whatsapp: "",
    contactNumber: "",
    instagram: "",
    googleReviewLink: "",
    services: request.services || [],
  });

  const userInstruction = request.userPrompt?.trim()
    ? `User instruction: ${request.userPrompt.trim()}`
    : "Suggest an improved alternative.";

  try {
    const result = await model.invoke([
      new SystemMessage(
        "You are an expert Indian local-business copywriter. Generate only the content for the specific field requested. Keep it concise and professional."
      ),
      new HumanMessage(
        [
          contextBlock,
          `Field: ${request.field}`,
          `Field purpose: ${fieldHint}`,
          `Current value: ${request.currentValue || "(empty)"}`,
          userInstruction,
        ].join("\n\n")
      ),
    ]);

    return {
      suggestion: result.suggestion,
      model: getModelName(),
      usedFallback: false,
    };
  } catch (error: any) {
    console.error("[generateFieldContent] AI failed, using fallback:", error?.message);
    return {
      suggestion: buildFallbackSuggestion(request),
      model: "fallback",
      usedFallback: true,
      aiError: error?.message,
    };
  }
}
