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
    product_id: "pdt_0NXtJC1y7tkYPvdNAN4tX",
    name: "Agency",
    description: "Agencies & Power Users.",
    price: 7900, // in cents
    features: [
      "400 Hours / month",
      "400 AI Reports / month",
      "Priority AI Support",
    ],
  },
];
