import {
  defaultTemplateForCategory,
} from "./category-map";
import type {
  CatalogItemOutput,
  CoreCopyOutput,
  EngagementOutput,
  MetaOutput,
  OnboardingContext,
  PageContentOutput,
} from "./types";

const DEFAULT_HOURS = [
  { day: "Mon-Fri", time: "9:00 AM - 7:00 PM", open: true },
  { day: "Saturday", time: "10:00 AM - 5:00 PM", open: true },
  { day: "Sunday", time: "Closed", open: false },
];

function formatPrice(price: string): string {
  const trimmed = (price || "").trim();
  if (!trimmed) return "₹0";
  if (trimmed.startsWith("₹")) return trimmed;
  return `₹${trimmed}`;
}

function locationLine(context: OnboardingContext): string {
  return [context.address, context.city, context.state].filter(Boolean).join(", ");
}

export function buildFallbackMiniWebsiteContent(context: OnboardingContext) {
  const city = context.city || "your city";
  const category = context.category || "local business";
  const loc = locationLine(context) || city;

  const coreCopy: CoreCopyOutput = {
    title: context.businessName,
    tagline: `Trusted ${category} in ${city} — quality service, fair pricing, and a team that cares about every customer.`,
    buttonText: "Book Now",
    announcementText: `Welcome to ${context.businessName}! Visit us in ${city} or message us on WhatsApp today.`,
  };

  const catalog: CatalogItemOutput[] =
    context.services.length > 0
      ? context.services.map((s) => {
          const short = s.description?.trim() || "";
          const desc =
            short.length >= 80
              ? short
              : `${s.name} at ${context.businessName} is delivered by trained professionals using quality products and proven techniques. Ideal for customers in ${city} who want reliable ${category} services with transparent pricing and friendly support. Book online or call us to schedule your appointment.`;
          return {
            name: s.name,
            desc,
            price: formatPrice(s.price),
            isPopular: s.isPopular,
          };
        })
      : [
          {
            name: "Consultation",
            desc: `Start with a personalised consultation at ${context.businessName}. We assess your needs, explain options clearly, and recommend the best ${category} solution for your budget and schedule in ${city}.`,
            price: "₹499",
            isPopular: true,
          },
          {
            name: "Premium Service",
            desc: `Our flagship offering combines expert care, premium materials, and attention to detail. Trusted by families and professionals across ${city} for consistent results and excellent customer experience.`,
            price: "₹999",
            isPopular: false,
          },
        ];

  const serviceNames = catalog.map((s) => s.name).slice(0, 4).join(", ");

  const engagement: EngagementOutput = {
    testimonials: [
      {
        name: "Priya Sharma",
        company: `${city} Customer`,
        content: `I have been visiting ${context.businessName} for over a year and the quality has always been excellent. The staff listens carefully, explains every step, and the results are consistently professional. Highly recommended for anyone looking for reliable ${category} services in ${city}.`,
        stars: 5,
      },
      {
        name: "Rahul Mehta",
        company: "Regular Client",
        content: `${context.businessName} stands out for punctual service, clean facilities, and honest pricing. From booking on WhatsApp to the final delivery, the entire experience feels organised and trustworthy. A great local business I am happy to recommend to friends and family.`,
        stars: 5,
      },
      {
        name: "Anita Desai",
        company: "Local Resident",
        content: `What I appreciate most is how welcoming the team is and how clearly they communicate timelines and costs. Whether it is a quick visit or a detailed service, they treat every customer with respect and professionalism.`,
        stars: 5,
      },
    ],
    faqs: [
      {
        question: `What services does ${context.businessName} offer?`,
        answer: `We provide ${serviceNames} and a full range of ${category} solutions tailored for residents and visitors in ${city}. Every service is performed by trained staff with a focus on quality, hygiene, and customer satisfaction. Contact us for a complete list and current offers.`,
      },
      {
        question: "How do I book an appointment?",
        answer: `Booking is easy — call us, send a WhatsApp message, or walk in during business hours. We confirm your slot quickly and share any preparation tips so your visit is smooth. Same-day appointments may be available depending on demand.`,
      },
      {
        question: "Where are you located and when are you open?",
        answer: `We are located at ${loc}. Our regular hours are Monday to Friday 9:00 AM – 7:00 PM, Saturday 10:00 AM – 5:00 PM, and Sunday closed. We recommend calling ahead on holidays or busy weekends.`,
      },
      {
        question: "What are your prices and payment options?",
        answer: `Pricing depends on the service selected; indicative rates are listed on our website. We accept cash, UPI, and major digital wallets. Our team explains costs upfront so there are no surprises before you confirm.`,
      },
      {
        question: `Why choose ${context.businessName} in ${city}?`,
        answer: `We combine local expertise, consistent quality, and responsive customer support. Many clients choose us for our transparent communication, convenient location, and reputation built on repeat customers across ${city} and nearby areas.`,
      },
    ],
    amenities: [
      "Trained Professionals",
      "Hygienic Environment",
      "Easy WhatsApp Booking",
      "Transparent Pricing",
      "Customer Support",
      "Convenient Location",
      "Digital Payments",
    ],
  };

  const pageContent: PageContentOutput = {
    aboutSection: {
      title: `About ${context.businessName}`,
      subtitle: `Your trusted ${category} partner in ${city}, built on quality, care, and community.`,
      body: [
        `${context.businessName} is a leading ${category} in ${city}, dedicated to helping customers access professional services with confidence. ${context.businessAbout || `We focus on delivering consistent results, friendly service, and value that keeps local families and businesses coming back.`}`,
        `Our team brings hands-on experience across ${serviceNames || category} and understands what clients in ${city} expect — punctual appointments, clear communication, and workmanship that meets high standards. Whether you are a first-time visitor or a long-term client, we tailor every interaction to your needs.`,
        `Located at ${loc}, we are proud to serve the local community with modern facilities, fair pricing, and a commitment to excellence. Visit us, call, or message on WhatsApp to discover why ${context.businessName} is a name locals trust for ${category} services.`,
      ].join("\n\n"),
    },
    sectionHeaders: {
      about: {
        title: `About ${context.businessName}`,
        subtitle: `Learn about our story, values, and commitment to ${city}.`,
      },
      services: {
        title: "Our Services",
        subtitle: `Explore our ${category} offerings — expert care, clear pricing, and results you can trust.`,
      },
      faqs: {
        title: "Frequently Asked Questions",
        subtitle: "Answers to common questions about booking, pricing, location, and our services.",
      },
      testimonials: {
        title: "What Our Customers Say",
        subtitle: `Real reviews from clients who trust ${context.businessName} in ${city}.`,
      },
      team: {
        title: "Meet Our Team",
        subtitle: "Skilled professionals dedicated to your comfort and satisfaction.",
      },
      amenities: {
        title: "Why Choose Us",
        subtitle: "Facilities and benefits that make every visit simple and stress-free.",
      },
      hours: {
        title: "Business Hours",
        subtitle: `Plan your visit — we're here for you throughout the week in ${city}.`,
      },
      contact: {
        title: "Contact Us",
        subtitle: "Reach out by phone, WhatsApp, or visit us — we respond quickly.",
      },
    },
  };

  const meta: MetaOutput = {
    selectedTemplate: defaultTemplateForCategory(context.category),
    theme: "blue",
    seoKeywords: [
      context.businessName,
      category,
      city,
      `${category} in ${city}`,
      `${category} near me`,
      `best ${category.toLowerCase()} ${city}`,
      context.state || "India",
      "book appointment",
      "professional service",
      "local business",
    ].filter(Boolean),
    seoPageTitle: `${context.businessName} | ${category} in ${city}`.slice(0, 60),
    seoMetaDescription: `Visit ${context.businessName} for expert ${category} in ${city}. ${serviceNames}. Book via WhatsApp or call today.`.slice(0, 160),
    hours: DEFAULT_HOURS,
  };

  return {
    coreCopy,
    catalog,
    engagement,
    pageContent,
    meta,
    model: "fallback",
  };
}
