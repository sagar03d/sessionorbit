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
    agency: PricingTier;
    overage: {
        starter: string;
        pro: string;
        agency: string;
    };
}> = {
    USD: {
        starter: {
            name: "Starter",
            price: 6,
            currency: "USD",
            period: "/month",
            description: "For individual tutors.",
            features: [
                "25 Hours / month",
                "25 AI Reports / month",
                "Overage: $0.80/hr",
                "Standard AI Tech Support"
            ]
        },
        pro: {
            name: "Professional",
            price: 19,
            currency: "USD",
            period: "/month",
            description: "Serious tutors scaling up.",
            features: [
                "100 Hours / month",
                "100 AI Reports / month",
                "Overage: $1.25/hr",
                "Full AI Tech Support"
            ]
        },
        agency: {
            name: "Agency",
            price: 79,
            currency: "USD",
            period: "/month",
            description: "Agencies & Power Users.",
            features: [
                "400 Hours / month",
                "400 AI Reports / month",
                "Overage: $1.10/hr",
                "Priority AI Support"
            ]
        },
        overage: {
            starter: "$0.80 / hour",
            pro: "$1.25 / hour",
            agency: "$1.10 / hour"
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
