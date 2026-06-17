import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { getChatModel, getModelName, isOpenAiConfigured } from "./openai";
import {
  coreCopySchema,
  catalogSchema,
  engagementSchema,
  metaSchema,
  pageContentSchema,
} from "./schemas";
import {
  defaultTemplateForCategory,
  formatBusinessContext,
  normalizeTemplateId,
} from "./category-map";
import { buildFallbackMiniWebsiteContent } from "./fallback-content";
import type { OnboardingContext } from "./types";

interface AgentState {
  context: OnboardingContext;
}

const SYSTEM_BASE =
  "You are an expert SEO copywriter and local-business website strategist in India. " +
  "Write for a professional ONE-PAGE business website (not short snippets). " +
  "Use natural English, local SEO keywords (city, category, 'near me'), and a trustworthy business tone. " +
  "Content must feel like a real company website — informative, welcoming, and conversion-focused. " +
  "Use INR for prices. Avoid generic filler; be specific to the business context.";

async function coreCopyAgent(state: AgentState) {
  const model = getChatModel(0.6).withStructuredOutput(coreCopySchema);
  const contextText = formatBusinessContext(state.context);

  const result = await model.invoke([
    new SystemMessage(
      `${SYSTEM_BASE} Generate hero section copy: H1 title, one-line hero tagline with local SEO, CTA button, and announcement ribbon.`
    ),
    new HumanMessage(contextText),
  ]);

  return {
    coreCopy: {
      title: result.title,
      tagline: result.tagline,
      buttonText: result.buttonText,
      announcementText: result.announcementText,
    },
  };
}

async function pageContentAgent(state: AgentState) {
  const model = getChatModel(0.65).withStructuredOutput(pageContentSchema);
  const contextText = formatBusinessContext(state.context);

  const result = await model.invoke([
    new SystemMessage(
      `${SYSTEM_BASE} Generate full About Us section (title, subtitle, 2-3 paragraph body, 120-200 words) and section headers (title + subtitle) for services, FAQs, testimonials, team, amenities, hours, and contact. Each subtitle should be 1-2 sentences.`
    ),
    new HumanMessage(contextText),
  ]);

  return { pageContent: result };
}

async function catalogAgent(state: AgentState) {
  const model = getChatModel(0.5).withStructuredOutput(catalogSchema);
  const contextText = formatBusinessContext(state.context);

  const result = await model.invoke([
    new SystemMessage(
      `${SYSTEM_BASE} Create a rich service catalog. Keep user-provided names and prices. Each service needs a 2-3 sentence description covering benefits, ideal customer, and why choose this business. Generate 3-6 services.`
    ),
    new HumanMessage(contextText),
  ]);

  return {
    catalog: result.services.map((s) => ({
      name: s.name,
      desc: s.desc,
      price: s.price,
      isPopular: s.isPopular ?? false,
    })),
  };
}

async function engagementAgent(state: AgentState) {
  const model = getChatModel(0.7).withStructuredOutput(engagementSchema);
  const contextText = formatBusinessContext(state.context);

  const result = await model.invoke([
    new SystemMessage(
      `${SYSTEM_BASE} Create 3 authentic Indian customer testimonials (2-4 sentences each), 4-6 detailed FAQs (answers 2-4 sentences), and 5-7 amenity highlights. FAQs should cover services, booking, location, pricing, and why choose us.`
    ),
    new HumanMessage(contextText),
  ]);

  return {
    engagement: {
      testimonials: result.testimonials,
      faqs: result.faqs,
      amenities: result.amenities,
    },
  };
}

async function metaAgent(state: AgentState) {
  const model = getChatModel(0.3).withStructuredOutput(metaSchema);
  const contextText = formatBusinessContext(state.context);
  const fallbackTemplate = defaultTemplateForCategory(state.context.category);

  const result = await model.invoke([
    new SystemMessage(
      `${SYSTEM_BASE} Pick template id, theme color, 6-12 SEO keywords, SEO page title (under 60 chars), meta description (under 160 chars with CTA), and realistic business hours for India. Default template: ${fallbackTemplate}.`
    ),
    new HumanMessage(contextText),
  ]);

  return {
    meta: {
      selectedTemplate: normalizeTemplateId(result.selectedTemplate, state.context.category),
      theme: result.theme,
      seoKeywords: result.seoKeywords,
      seoPageTitle: result.seoPageTitle,
      seoMetaDescription: result.seoMetaDescription,
      hours: result.hours,
    },
  };
}

export async function runMiniWebsiteGraph(context: OnboardingContext) {
  if (!isOpenAiConfigured()) {
    const fallback = buildFallbackMiniWebsiteContent(context);
    return {
      coreCopy: fallback.coreCopy,
      catalog: fallback.catalog,
      engagement: fallback.engagement,
      pageContent: fallback.pageContent,
      meta: fallback.meta,
      model: fallback.model,
      usedFallback: true,
    };
  }

  try {
    const state: AgentState = { context };
    const [coreResult, pageResult, catalogResult, engagementResult, metaResult] = await Promise.all([
      coreCopyAgent(state),
      pageContentAgent(state),
      catalogAgent(state),
      engagementAgent(state),
      metaAgent(state),
    ]);

    return {
      coreCopy: coreResult.coreCopy,
      pageContent: pageResult.pageContent,
      catalog: catalogResult.catalog,
      engagement: engagementResult.engagement,
      meta: metaResult.meta,
      model: getModelName(),
      usedFallback: false,
    };
  } catch (error: any) {
    console.error("[runMiniWebsiteGraph] AI failed, using fallback:", error?.message);
    const fallback = buildFallbackMiniWebsiteContent(context);
    return {
      coreCopy: fallback.coreCopy,
      catalog: fallback.catalog,
      engagement: fallback.engagement,
      pageContent: fallback.pageContent,
      meta: fallback.meta,
      model: fallback.model,
      usedFallback: true,
      aiError: error?.message || "AI generation failed",
    };
  }
}
