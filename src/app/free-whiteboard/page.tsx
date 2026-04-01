import WhiteboardDemo from "@/components/landing/WhiteboardDemo"
import { Metadata } from 'next'
import { translations } from '@/lib/translations/whiteboard'

export const metadata: Metadata = {
    title: translations.en.metadata.title,
    description: translations.en.metadata.description,
    alternates: {
        canonical: 'https://www.sessionorbit.com/free-whiteboard',
    }
}

export default function FreeWhiteboardPage() {
    return (
        <WhiteboardDemo variant="full" lang="en" />
    )
}
