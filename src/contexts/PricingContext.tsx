"use client";

import React, { createContext, useContext, useState } from "react";
import { Currency, PRICING_DATA, formatPrice } from "@/lib/pricing-data";

interface PricingContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    prices: typeof PRICING_DATA['USD'];
    format: (amount: number) => string;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: React.ReactNode }) {
    const [currency] = useState<Currency>('USD');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSetCurrency = (c: Currency) => {
        // No-op: Currency is locked to USD
        console.warn("Currency change is disabled. Locked to USD.");
    };

    const value = {
        currency,
        setCurrency: handleSetCurrency,
        prices: PRICING_DATA['USD'], // Always use USD data
        format: (amount: number) => formatPrice(amount, 'USD') // Always format as USD
    };

    return (
        <PricingContext.Provider value={value}>
            {children}
        </PricingContext.Provider>
    );
}

export function usePricing() {
    const context = useContext(PricingContext);
    if (context === undefined) {
        throw new Error("usePricing must be used within a PricingProvider");
    }
    return context;
}
