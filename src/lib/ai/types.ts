export interface OnboardingServiceInput {
  name: string;
  description?: string;
  price: string;
  isPopular?: boolean;
}

export interface OnboardingContext {
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
  services: OnboardingServiceInput[];
  upiId: string;
}

export interface SectionHeader {
  title: string;
  subtitle: string;
}

export interface AboutSection {
  title: string;
  subtitle: string;
  body: string;
}

export interface SectionHeaders {
  about: SectionHeader;
  services: SectionHeader;
  faqs: SectionHeader;
  testimonials: SectionHeader;
  team: SectionHeader;
  amenities: SectionHeader;
  hours: SectionHeader;
  contact: SectionHeader;
}

export interface CoreCopyOutput {
  title: string;
  tagline: string;
  buttonText: string;
  announcementText: string;
}

export interface CatalogItemOutput {
  name: string;
  desc: string;
  price: string;
  isPopular?: boolean;
}

export interface EngagementOutput {
  testimonials: Array<{ name: string; company: string; content: string; stars: number }>;
  faqs: Array<{ question: string; answer: string }>;
  amenities: string[];
}

export interface MetaOutput {
  selectedTemplate: string;
  theme: string;
  seoKeywords: string[];
  seoPageTitle: string;
  seoMetaDescription: string;
  hours: Array<{ day: string; time: string; open: boolean }>;
}

export interface PageContentOutput {
  aboutSection: AboutSection;
  sectionHeaders: SectionHeaders;
}

export interface FieldGenerateRequest {
  field: string;
  currentValue: string;
  userPrompt?: string;
  businessName?: string;
  category?: string;
  tagline?: string;
  services?: OnboardingServiceInput[];
}
