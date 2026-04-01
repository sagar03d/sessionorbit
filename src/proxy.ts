import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'de', 'fr', 'es', 'ja', 'it', 'zh', 'ko', 'nl', 'ru']
const defaultLocale = 'en'

// Mapping of countries to languages (Simplified for top languages)
const countryToLocale: Record<string, string> = {
    'DE': 'de', 'AT': 'de', 'CH': 'de',
    'FR': 'fr', 'BE': 'fr', 'LU': 'fr', 'CA': 'fr',
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es',
    'JP': 'ja',
    'IT': 'it',
    'CN': 'zh', 'TW': 'zh', 'HK': 'zh',
    'KR': 'ko',
    'NL': 'nl',
    'RU': 'ru', 'BY': 'ru', 'KZ': 'ru'
}

function getLocale(request: NextRequest) {
    // 1. Check x-vercel-ip-country first (Vercel specific)
    const country = request.headers.get('x-vercel-ip-country')
    if (country && countryToLocale[country.toUpperCase()]) {
        return countryToLocale[country.toUpperCase()]
    }

    // 2. Check Accept-Language header
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    try {
        const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
        return matchLocale(languages, locales, defaultLocale)
    } catch (e) {
        return defaultLocale
    }
}

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Check if the current pathname is any of our target pages
    const isTargetPage = pathname === '/free-whiteboard' || pathname === '/free-ai-whiteboard'
    
    if (isTargetPage) {
        const locale = getLocale(request)
        
        // Redirect to the localized version if it's not English (or even if it is English, if you want /[lang] URLs)
        // For now, we'll redirect everyone to /[lang]/... to keep the pattern consistent
        return NextResponse.redirect(
            new URL(`/${locale}${pathname}`, request.url)
        )
    }
}

export const config = {
    // Only run on the specific whiteboard pages for now to avoid side-effects
    matcher: [
        '/free-whiteboard',
        '/free-ai-whiteboard',
    ],
}
