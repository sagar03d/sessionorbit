"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { Suspense } from "react";

if (typeof window !== "undefined") {
    // Only initialize if the key is present and not on localhost
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && typeof window !== "undefined" && !window.location.host.includes("localhost") && !window.location.host.includes("127.0.0.1")) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host:
                process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
            capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        });
    }
}

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            let url = window.origin + pathname;
            if (searchParams && searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }
            posthog.capture("$pageview", {
                $current_url: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}

function PostHogProviderContent({ children }: { children: React.ReactNode }) {
    return (
        <PHProvider client={posthog}>
            <Suspense fallback={null}>
                <PostHogPageView />
            </Suspense>
            {children}
        </PHProvider>
    )
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    // If no key is provided, just render children without the provider to avoid errors/warnings
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        return <>{children}</>;
    }

    return <PostHogProviderContent>{children}</PostHogProviderContent>;
}
