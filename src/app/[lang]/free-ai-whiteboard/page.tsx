import { Metadata } from 'next'
import WhiteboardLandingPage from "@/components/marketing/WhiteboardLandingPage"
import { translations, languages, Language } from '@/lib/translations/whiteboard'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    return languages.map((lang) => ({
        lang,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params
    const t = translations[lang as Language]?.metadata || translations.en.metadata

    return {
        title: t.ai_title,
        description: t.ai_description,
        alternates: {
            canonical: `https://www.sessionorbit.com/${lang}/free-ai-whiteboard`,
            languages: languages.reduce((acc, l) => {
                acc[l] = `https://www.sessionorbit.com/${l}/free-ai-whiteboard`
                return acc
            }, {} as Record<string, string>)
        }
    }
}

export default async function LocalizedFreeAIWhiteboardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params

    if (!languages.includes(lang as Language)) {
        notFound()
    }

    return (
        <WhiteboardLandingPage lang={lang as Language} />
    )
}
