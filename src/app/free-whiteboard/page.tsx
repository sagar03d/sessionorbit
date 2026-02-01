import WhiteboardDemo from "@/components/landing/WhiteboardDemo"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Free Online Whiteboard | SessionOrbit',
    description: 'A free, no-login online whiteboard for teachers and students. Draw, sketch, and collaborate instantly.',
}

export default function FreeWhiteboardPage() {
    return (
        <WhiteboardDemo variant="full" />
    )
}
