import type { Metadata } from 'next'
import WhiteboardLandingPage from "@/components/marketing/WhiteboardLandingPage"
import { translations } from '@/lib/translations/whiteboard'

export const metadata: Metadata = {
    title: translations.en.metadata.ai_title,
    description: translations.en.metadata.ai_description,
    alternates: {
        canonical: 'https://www.sessionorbit.com/free-ai-whiteboard',
    }
}

export default function FreeAIWhiteboardPage() {
    return (
        <WhiteboardLandingPage lang="en" />
    )
}
