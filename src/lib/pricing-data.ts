export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

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
    },
    INR: {
        starter: {
            name: "Starter",
            price: 1599,
            currency: "INR",
            period: "/month",
            description: "Serious tutors scaling up.",
            features: [
                "20 Hours / month",
                "20 AI Reports / month",
                "Overage: ₹100/hr",
                "Full AI Tech Support"
            ]
        },
        pro: {
            name: "Pro",
            price: 6499,
            currency: "INR",
            period: "/month",
            description: "Agencies & Power Users.",
            features: [
                "80 Hours / month",
                "80 AI Reports / month",
                "Overage: ₹90/hr",
                "Priority AI Support"
            ]
        },
        overage: {
            starter: "₹100 / hour",
            pro: "₹90 / hour"
        }
    },
    EUR: {
        starter: {
            name: "Starter",
            price: 19,
            currency: "EUR",
            period: "/month",
            description: "Serious tutors scaling up.",
            features: [
                "20 Hours / month",
                "20 AI Reports / month",
                "Overage: €1.25/hr",
                "Full AI Tech Support"
            ]
        },
        pro: {
            name: "Pro",
            price: 79,
            currency: "EUR",
            period: "/month",
            description: "Agencies & Power Users.",
            features: [
                "80 Hours / month",
                "80 AI Reports / month",
                "Overage: €1.10/hr",
                "Priority AI Support"
            ]
        },
        overage: {
            starter: "€1.25 / hour",
            pro: "€1.10 / hour"
        }
    },
    GBP: {
        starter: {
            name: "Starter",
            price: 15,
            currency: "GBP",
            period: "/month",
            description: "Serious tutors scaling up.",
            features: [
                "20 Hours / month",
                "20 AI Reports / month",
                "Overage: £1.00/hr",
                "Full AI Tech Support"
            ]
        },
        pro: {
            name: "Pro",
            price: 65,
            currency: "GBP",
            period: "/month",
            description: "Agencies & Power Users.",
            features: [
                "80 Hours / month",
                "80 AI Reports / month",
                "Overage: £0.90/hr",
                "Priority AI Support"
            ]
        },
        overage: {
            starter: "£1.00 / hour",
            pro: "£0.90 / hour"
        }
    },
    CAD: {
        starter: {
            name: "Starter",
            price: 29,
            currency: "CAD",
            period: "/month",
            description: "Serious tutors scaling up.",
            features: [
                "20 Hours / month",
                "20 AI Reports / month",
                "Overage: $1.75/hr",
                "Full AI Tech Support"
            ]
        },
        pro: {
            name: "Pro",
            price: 109,
            currency: "CAD",
            period: "/month",
            description: "Agencies & Power Users.",
            features: [
                "80 Hours / month",
                "80 AI Reports / month",
                "Overage: $1.50/hr",
                "Priority AI Support"
            ]
        },
        overage: {
            starter: "$1.75 / hour",
            pro: "$1.50 / hour"
        }
    },
    AUD: {
        starter: {
            name: "Starter",
            price: 29,
            currency: "AUD",
            period: "/month",
            description: "Serious tutors scaling up.",
            features: [
                "20 Hours / month",
                "20 AI Reports / month",
                "Overage: $1.75/hr",
                "Full AI Tech Support"
            ]
        },
        pro: {
            name: "Pro",
            price: 119,
            currency: "AUD",
            period: "/month",
            description: "Agencies & Power Users.",
            features: [
                "80 Hours / month",
                "80 AI Reports / month",
                "Overage: $1.60/hr",
                "Priority AI Support"
            ]
        },
        overage: {
            starter: "$1.75 / hour",
            pro: "$1.60 / hour"
        }
    }
};

export const formatPrice = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat(currency === 'EUR' ? 'de-DE' : 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
