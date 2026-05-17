import BusinessModern from "./templates/BusinessModern";
import BusinessMinimal from "./templates/BusinessMinimal";
import BusinessPremium from "./templates/BusinessPremium";

export const templates = [

  // IT / DIGITAL
  {
    id: "it-company",
    name: "IT Company Pro",
    category: "technology",
    component: BusinessModern,
    preview: "bg-blue-600",
  },
  {
    id: "software-agency",
    name: "Software Agency",
    category: "technology",
    component: BusinessPremium,
    preview: "bg-indigo-600",
  },
  {
    id: "startup-tech",
    name: "Startup Tech",
    category: "technology",
    component: BusinessModern,
    preview: "bg-cyan-500",
  },

  // RESTAURANT / FOOD
  {
    id: "restaurant-classic",
    name: "Restaurant Classic",
    category: "food",
    component: BusinessMinimal,
    preview: "bg-red-500",
  },
  {
    id: "cafe-modern",
    name: "Cafe Modern",
    category: "food",
    component: BusinessMinimal,
    preview: "bg-amber-700",
  },
  {
    id: "bakery-shop",
    name: "Bakery Shop",
    category: "food",
    component: BusinessMinimal,
    preview: "bg-orange-400",
  },

  // HEALTHCARE
  {
    id: "clinic-care",
    name: "Clinic Care",
    category: "health",
    component: BusinessMinimal,
    preview: "bg-emerald-500",
  },
  {
    id: "hospital-plus",
    name: "Hospital Plus",
    category: "health",
    component: BusinessMinimal,
    preview: "bg-teal-500",
  },
  {
    id: "dental-studio",
    name: "Dental Studio",
    category: "health",
    component: BusinessMinimal,
    preview: "bg-sky-500",
  },

  // BEAUTY / SALON
  {
    id: "salon-luxury",
    name: "Salon Luxury",
    category: "beauty",
    component: BusinessModern,
    preview: "bg-pink-500",
  },
  {
    id: "spa-relax",
    name: "Spa Relax",
    category: "beauty",
    component: BusinessMinimal,
    preview: "bg-rose-400",
  },

  // REAL ESTATE
  {
    id: "real-estate-pro",
    name: "Real Estate Pro",
    category: "real-estate",
    component: BusinessModern,
    preview: "bg-zinc-800",
  },
  {
    id: "property-dealer",
    name: "Property Dealer",
    category: "real-estate",
    component: BusinessModern,
    preview: "bg-stone-700",
  },

  // EDUCATION
  {
    id: "coaching-center",
    name: "Coaching Center",
    category: "education",
    component: BusinessMinimal,
    preview: "bg-violet-500",
  },
  {
    id: "online-course",
    name: "Online Course",
    category: "education",
    component: BusinessModern,
    preview: "bg-purple-600",
  },

  // SERVICES
  {
    id: "repair-services",
    name: "Repair Services",
    category: "services",
    component: BusinessModern,
    preview: "bg-yellow-500",
  },
  // {
  //   id: "home-services",
  //   name: "Home Services",
  //   category: "services",
  //   component: BusinessMinimal,
  //   preview: "bg-lime-500",
  // },

  // // LEGAL / FINANCE
  // {
  //   id: "law-firm",
  //   name: "Law Firm",
  //   category: "legal",
  //   component: BusinessModern,
  //   preview: "bg-slate-700",
  // },
  // {
  //   id: "finance-consulting",
  //   name: "Finance Consulting",
  //   category: "finance",
  //   component: BusinessMinimal,
  //   preview: "bg-green-700",
  // },

  // CREATOR / PERSONAL
  // {
  //   id: "creator-brand",
  //   name: "Creator Brand",
  //   category: "creator",
  //   component: BusinessModern,
  //   preview: "bg-fuchsia-500",
  // },
];

export const getTemplate = (id) => templates.find((t) => t.id === id) ?? templates[0];