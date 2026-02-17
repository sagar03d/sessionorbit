export type Currency = 'USD';

export interface PricingTier {
    name: string;
    price: number;
    currency: Currency;
    period: string;
    features: string[];
    description: string;
}

export const PRICING_DATA: Record<Currency, {
    starter: PricingTier;
    pro: PricingTier;
    overage: {
        starter: string;
        pro: string;
    };
}> = {
    USD: {
        starter: {
            name: "Starter",
            price: 19,
            currency: "USD",
            period: "/month",
            description: "Serious tutors scaling up.",
            features: [
                "20 Hours / month",
                "20 AI Reports / month",
                "Overage: $1.25/hr",
                "Full AI Tech Support"
            ]
        },
        pro: {
            name: "Pro",
            price: 79,
            currency: "USD",
            period: "/month",
            description: "Agencies & Power Users.",
            features: [
                "80 Hours / month",
                "80 AI Reports / month",
                "Overage: $1.10/hr",
                "Priority AI Support"
            ]
        },
        overage: {
            starter: "$1.25 / hour",
            pro: "$1.10 / hour"
        }
    }
};

export const formatPrice = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
