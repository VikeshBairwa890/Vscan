const questions = [
  {
    key: "welcome",
    type: "welcome",
  },

  {
    key: "businessName",
    question: "What's your business name?",
    type: "text",
  },

  {
    key: "category",
    question: "What type of business do you run?",
    type: "single-select",

    options: [
      {
        label: "Salon",
        value: "Salon",
        description:
          "Hair, beauty & grooming services",
        icon: "scissors",
      },

      {
        label: "Spa",
        value: "Spa",
        description:
          "Relaxation & wellness treatments",
        icon: "sparkles",
      },

      {
        label: "Hotel",
        value: "Hotel",
        description:
          "Rooms & hospitality services",
        icon: "hotel",
      },

      {
        label: "Restaurant",
        value: "Restaurant",
        description:
          "Dining & food services",
        icon: "utensils",
      },

      {
        label: "Gym",
        value: "Gym",
        description:
          "Fitness & training services",
        icon: "dumbbell",
      },

      {
        label: "Clinic",
        value: "Clinic",
        description:
          "Healthcare & consultation",
        icon: "stethoscope",
      },

      {
        label: "Shop",
        value: "Shop",
        description:
          "Retail & local store business",
        icon: "shopping-bag",
      },

      {
        label: "Other",
        value: "Other",
        description:
          "Custom business category",
        icon: "circle-help",
      },
    ],
  },

  {
    key: "services",
    question: "Select the services you provide",
    type: "multi-select",
  },

  {
    key: "whatsapp",
    question: "What's your WhatsApp number?",
    type: "text",
  },

  {
    key: "instagram",
    question: "What's your Instagram username?",
    type: "text",
    optional: true,
  },
];

export default questions;