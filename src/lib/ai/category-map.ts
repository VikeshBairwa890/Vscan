const CATEGORY_TEMPLATE_MAP: Record<string, string> = {
  Salon: "salon-luxury",
  Spa: "spa-relax",
  Hotel: "real-estate-pro",
  Restaurant: "restaurant-classic",
  Gym: "coaching-center",
  Clinic: "clinic-care",
  Shop: "bakery-shop",
  Other: "it-company",
};

const ALLOWED_TEMPLATES = [
  "it-company",
  "software-agency",
  "startup-tech",
  "restaurant-classic",
  "cafe-modern",
  "bakery-shop",
  "clinic-care",
  "hospital-plus",
  "dental-studio",
  "salon-luxury",
  "spa-relax",
  "real-estate-pro",
  "property-dealer",
  "coaching-center",
  "online-course",
  "repair-services",
];

export function defaultTemplateForCategory(category: string): string {
  return CATEGORY_TEMPLATE_MAP[category] || "it-company";
}

export function normalizeTemplateId(templateId: string, category: string): string {
  if (ALLOWED_TEMPLATES.includes(templateId)) {
    return templateId;
  }
  return defaultTemplateForCategory(category);
}

export function formatBusinessContext(context: {
  businessName: string;
  businessAbout: string;
  category: string;
  address: string;
  city: string;
  state: string;
  whatsapp: string;
  contactNumber: string;
  instagram: string;
  googleReviewLink: string;
  services: Array<{ name: string; description?: string; price: string; isPopular?: boolean }>;
}): string {
  const location = [context.address, context.city, context.state].filter(Boolean).join(", ");
  const servicesList = context.services
    .map((s) => `- ${s.name}: ₹${s.price}${s.isPopular ? " (popular)" : ""} — ${s.description || ""}`)
    .join("\n");

  return [
    `Business Name: ${context.businessName}`,
    `Category: ${context.category}`,
    `About: ${context.businessAbout || "Local business serving customers in India"}`,
    `Location: ${location || "India"}`,
    `WhatsApp: ${context.whatsapp || context.contactNumber || "N/A"}`,
    `Instagram: ${context.instagram || "N/A"}`,
    `Google Review: ${context.googleReviewLink || "N/A"}`,
    `Services:\n${servicesList || "General services"}`,
    `Allowed templates: ${ALLOWED_TEMPLATES.join(", ")}`,
  ].join("\n");
}
