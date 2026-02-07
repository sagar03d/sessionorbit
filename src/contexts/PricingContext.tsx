"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Currency, PRICING_DATA, formatPrice } from "@/lib/pricing-data";

interface PricingContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    toggleCurrency: () => void;
    prices: typeof PRICING_DATA['USD'];
    format: (amount: number) => string;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Try to detect currency from IP
        const detectCurrency = async () => {
            try {
                // Check if already saved in local storage
                const saved = localStorage.getItem('orbit_currency') as Currency;
                if (saved && PRICING_DATA[saved]) {
                    setCurrency(saved);
                    setIsLoading(false);
                    return;
                }

                // Auto-detect based on Timezone
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                if (timeZone.includes('Calcutta') || timeZone.includes('Kolkata') || timeZone.includes('India')) {
                    setCurrency('INR');
                } else if (timeZone.includes('Europe/London') || timeZone.includes('Europe/Belfast')) {
                    setCurrency('GBP');
                } else if (timeZone.includes('Europe')) {
                    // Rough Eur check - assumes most of Europe is EUR (ignoring Scandic/Swiss for simplicity or defaulting to EUR)
                    if (!timeZone.includes('Moscow') && !timeZone.includes('Istanbul')) {
                        setCurrency('EUR');
                    }
                } else if (timeZone.includes('Australia')) {
                    setCurrency('AUD');
                } else if (timeZone.includes('Canada') || timeZone.includes('America/Toronto') || timeZone.includes('America/Vancouver')) {
                    setCurrency('CAD');
                } else {
                    // Default to USD
                    setCurrency('USD');
                }
            } catch (e) {
                console.error("Failed to detect currency", e);
            } finally {
                setIsLoading(false);
            }
        };

        detectCurrency();
    }, []);

    const handleSetCurrency = (c: Currency) => {
        setCurrency(c);
        localStorage.setItem('orbit_currency', c);
    };

    const toggleCurrency = () => {
        const currencies: Currency[] = ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD'];
        const currentIndex = currencies.indexOf(currency);
        const nextIndex = (currentIndex + 1) % currencies.length;
        handleSetCurrency(currencies[nextIndex]);
    };

    const value = {
        currency,
        setCurrency: handleSetCurrency,
        toggleCurrency,
        prices: PRICING_DATA[currency],
        format: (amount: number) => formatPrice(amount, currency)
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
