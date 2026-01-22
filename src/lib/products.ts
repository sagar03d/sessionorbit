export type Product = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
};

export const products: Product[] = [
  {
    product_id: "pdt_0NVXU1RKiRN9ytPzJKeik",
    name: "Basic Plan",
    description: "Get access to basic features and support",
    price: 2900, // in cents
    features: [
      "Access to basic features",
      "Email support",
      "1 Team member",
      "Basic analytics",
    ],
  },
  {
    product_id: "pdt_0NVXUD7cgUhkXY2k3HukI",
    name: "Premium Plan",
    description: "Get access to premium features and support",
    price: 7900, // in cents
    features: [
      "Access to all features",
      "Priority 24/7 support",
      "Unlimited team members",
      "Advanced analytics",
      "Custom integrations",
    ],
  },
];
