"use client"

import { useConnectionQualityIndicator } from "@livekit/components-react"
import { Participant } from "livekit-client"

export default function ConnectionStatus({ participant }: { participant: Participant }) {
    const { quality } = useConnectionQualityIndicator({ participant })
    const qualityScore = quality as unknown as number // Cast enum to number for comparison

    // Quality mapping:
    // 0: Poor/Lost (Red)
    // 1: Poor (Orange)
    // 2: Good (Yellow)
    // 3: Good (Light Green)
    // 4: Excellent (Green) - "Unknown" often returns 4 initially or during stable connection

    const getQualityColor = (q: number) => {
        if (q === 0) return "text-red-500" // Lost
        if (q === 1) return "text-orange-500" // Poor
        if (q === 2) return "text-yellow-400" // Fair
        if (q === 3) return "text-lime-400" // Good
        return "text-green-500" // Excellent (4)
    }

    const getQualityText = (q: number) => {
        if (q === 0) return "Connection Lost"
        if (q === 1) return "Poor Connection"
        if (q === 2) return "Fair Connection"
        if (q === 3) return "Good Connection"
        return "Excellent Connection"
    }

    // Generic Signal Icon (Can use Lucide `Signal` or `Wifi`, but custom bars give more granular look if needed)
    // Using simple bars here for clarity
    return (
        <div
            className="flex items-end gap-0.5 p-1 rounded bg-black/40 backdrop-blur-sm"
            title={getQualityText(qualityScore)}
        >
            <div className={`w-1 rounded-sm ${qualityScore >= 1 ? getQualityColor(qualityScore) : 'bg-neutral-600'} h-1.5 transition-colors duration-500`} />
            <div className={`w-1 rounded-sm ${qualityScore >= 2 ? getQualityColor(qualityScore) : 'bg-neutral-600'} h-2.5 transition-colors duration-500`} />
            <div className={`w-1 rounded-sm ${qualityScore >= 3 ? getQualityColor(qualityScore) : 'bg-neutral-600'} h-3.5 transition-colors duration-500`} />
            <div className={`w-1 rounded-sm ${qualityScore >= 4 ? getQualityColor(qualityScore) : 'bg-neutral-600'} h-4.5 transition-colors duration-500`} />
        </div>
    )
}
