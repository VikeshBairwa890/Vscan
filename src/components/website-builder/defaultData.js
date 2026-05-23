const uid = () => Math.random().toString(36).slice(2, 10);

export const DEFAULT = {
  businessName: "Vikesh Studio",
  tagline: "Professional Services You Can Trust",
  logo: "",
  phone: "+91 98765 43210",
  email: "hello@vikesh.in",
  address: "123 MG Road, Jaipur, Rajasthan",
  website: "www.vikesh.in",
  instagram: "vikesh.studio",
  facebook: "vikeshstudio",
  youtube: "",
  theme: "blue",
  buttonText: "Contact Us",
  googleFormLink: "",
  announcement: { enabled: true, text: "🎉 Special offer: 20% off this week! Call now." },
  services: [
    { id: uid(), name: "Web Design", price: "₹5,000", desc: "Beautiful responsive websites", image: "" },
    { id: uid(), name: "SEO Management", price: "₹3,000", desc: "Rank higher on Google", image: "" },
  ],
  hours: [
    { day: "Mon – Fri", time: "9:00 AM – 7:00 PM", open: true },
    { day: "Saturday", time: "10:00 AM – 5:00 PM", open: true },
    { day: "Sunday", time: "Closed", open: false },
  ],
  employees: [
    { id: uid(), name: "Vikesh Sharma", bio: "Founder & CEO", phone: "+91 98765 43210", email: "vikesh@vikesh.in", image: "" },
  ],
  testimonials: [
    { id: uid(), name: "Ravi Kumar", company: "TechCorp India", content: "Excellent service, very professional! Highly recommended.", stars: 5 },
    { id: uid(), name: "Priya Singh", company: "", content: "Great results within a week. Will use again!", stars: 5 },
  ],
  mediaLinks: [
    { id: uid(), title: "Our Work Showcase", url: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
  ],
  faqs: [
    { id: uid(), question: "How long does a project take?", answer: "Most projects are completed within 7-14 business days depending on scope." },
    { id: uid(), question: "Do you offer refunds?", answer: "Yes, we offer a 7-day satisfaction guarantee on all services." },
  ],
  amenities: ["Free Consultation", "24/7 Support", "Home Delivery", "Online Payment", "Certified Team", "Instant Response"],
  showSections: {
    announcement: true, services: true, hours: true, contact: true,
    social: true, employees: true, testimonials: true, mediaLinks: true,
    faqs: true, amenities: true, googleForm: true,
  },
};