import { Metadata } from 'next'
import WhiteboardDemo from "@/components/landing/WhiteboardDemo"
import { translations, languages, Language } from '@/lib/translations/whiteboard'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    return languages.map((lang) => ({
        lang,
    }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
    const { lang } = params
    const t = translations[lang as Language]?.metadata || translations.en.metadata

    return {
        title: t.title,
        description: t.description,
        alternates: {
            canonical: `https://www.sessionorbit.com/${lang}/free-whiteboard`,
            languages: languages.reduce((acc, l) => {
                acc[l] = `https://www.sessionorbit.com/${l}/free-whiteboard`
                return acc
            }, {} as Record<string, string>)
        }
    }
}

export default function LocalizedFreeWhiteboardPage({ params }: { params: { lang: string } }) {
    const { lang } = params

    if (!languages.includes(lang as Language)) {
        notFound()
    }

    return (
        <WhiteboardDemo variant="full" lang={lang as Language} />
    )
}
