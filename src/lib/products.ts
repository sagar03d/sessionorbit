export type Product = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
};

export const products: Product[] = [
  {
    product_id: "pdt_0NZPf3tdQYzb7GqMGn2Ry",
    name: "Starter",
    description: "For individual tutors.",
    price: 600, // in cents
    features: [
      "25 Hours / month",
      "25 AI Reports / month",
      "Standard AI Tech Support",
    ],
  },
  {
    product_id: "pdt_0NXtJ1NuGIbVJlSRPcaBM",
    name: "Professional",
    description: "Serious tutors scaling up.",
    price: 1900, // in cents
    features: [
      "100 Hours / month",
      "100 AI Reports / month",
      "Full AI Tech Support",
    ],
  },
  {
    product_id: "pdt_demo_class", // User will replace this with their actual ID
    name: "Demo Lesson",
    description: "Sample orbital class.",
    price: 100, // $1.00
    features: [
      "1-on-1 with AI Nova",
      "Interactive Simulation",
      "Personalized Report",
    ],
  },
];
