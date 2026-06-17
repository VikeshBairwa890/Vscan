import { z } from "zod";

const sectionHeaderSchema = z.object({
  title: z.string().describe("Section heading, clear and professional"),
  subtitle: z.string().describe("Supporting subheading, 1-2 sentences with local SEO context"),
});

export const coreCopySchema = z.object({
  title: z.string().describe("Business name or branded title for H1"),
  tagline: z
    .string()
    .describe("Hero subheading: one compelling sentence with city/category keywords for local SEO"),
  buttonText: z.string().describe("Primary call-to-action button label"),
  announcementText: z.string().describe("Promotional ribbon text, friendly and action-oriented"),
});

export const catalogSchema = z.object({
  services: z.array(
    z.object({
      name: z.string(),
      desc: z
        .string()
        .describe(
          "Full service description: 2-3 sentences explaining benefits, who it is for, and why choose this business. Include natural SEO keywords."
        ),
      price: z.string().describe("Price in INR format e.g. ₹999"),
      isPopular: z.boolean().describe("Whether this is a featured/popular service"),
    })
  ),
});

export const engagementSchema = z.object({
  testimonials: z
    .array(
      z.object({
        name: z.string(),
        company: z.string(),
        content: z
          .string()
          .describe("Authentic review: 2-4 sentences mentioning specific service quality and experience"),
        stars: z.number().min(1).max(5),
      })
    )
    .min(2)
    .max(4),
  faqs: z
    .array(
      z.object({
        question: z.string().describe("Natural question customers search for"),
        answer: z
          .string()
          .describe("Helpful answer: 2-4 sentences with practical details, location, pricing hints where relevant"),
      })
    )
    .min(4)
    .max(6),
  amenities: z.array(z.string()).min(5).max(8),
});

export const pageContentSchema = z.object({
  aboutSection: z.object({
    title: z.string().describe("About section H2 e.g. About Our Salon"),
    subtitle: z.string().describe("One sentence introducing the business story or value proposition"),
    body: z
      .string()
      .describe(
        "About us content: 2-3 full paragraphs (120-200 words). Cover history/mission, services expertise, why locals trust this business. Natural SEO with city, category, and service keywords."
      ),
  }),
  sectionHeaders: z.object({
    about: sectionHeaderSchema,
    services: sectionHeaderSchema,
    faqs: sectionHeaderSchema,
    testimonials: sectionHeaderSchema,
    team: sectionHeaderSchema,
    amenities: sectionHeaderSchema,
    hours: sectionHeaderSchema,
    contact: sectionHeaderSchema,
  }),
});

export const metaSchema = z.object({
  selectedTemplate: z.string().describe("Template id from allowed list"),
  theme: z.enum(["blue", "green", "orange", "slate", "gold"]),
  seoKeywords: z.array(z.string()).min(6).max(12),
  seoPageTitle: z
    .string()
    .max(60)
    .describe("SEO page title: business + category + city, under 60 chars"),
  seoMetaDescription: z
    .string()
    .max(160)
    .describe("Meta description for search engines: compelling summary under 160 chars with CTA"),
  hours: z.array(
    z.object({
      day: z.string(),
      time: z.string(),
      open: z.boolean(),
    })
  ),
});

export const fieldOutputSchema = z.object({
  suggestion: z.string().describe("Generated content for the requested field"),
});
