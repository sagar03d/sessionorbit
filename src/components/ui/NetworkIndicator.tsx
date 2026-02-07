import { useConnectionQualityIndicator } from "@livekit/components-react";
import { Participant, ConnectionQuality } from "livekit-client";
import { Wifi, WifiOff } from "lucide-react";

interface NetworkIndicatorProps {
    participant: Participant;
    className?: string;
}

export function NetworkIndicator({ participant, className }: NetworkIndicatorProps) {
    const { quality } = useConnectionQualityIndicator({ participant });

    // Map quality to color/icon
    // Quality is an enum: Excellent = 0, Good = 1, Poor = 2, Lost = 3 (Wait, check LiveKit docs for exact enum values)
    // Actually LiveKit client ConnectionQuality:
    // Excellent = 2
    // Good = 1
    // Poor = 0
    // Unkown = 3 ?

    // Let's double check the enum or just log it to be safe, but usually:
    // Excellent (2), Good (1), Poor (0)

    // Correction: 
    // LiveKit Protocol: 
    // POOR = 0
    // GOOD = 1
    // EXCELLENT = 2
    // LOST = 3 (If using some extensions, but standard is 0-2)

    let color = "text-green-500";
    let Icon = Wifi;
    let label = "Excellent Connection";

    if (quality === ConnectionQuality.Excellent) {
        color = "text-green-400";
        label = "Excellent Connection";
    } else if (quality === ConnectionQuality.Good) {
        color = "text-yellow-400";
        label = "Good Connection";
    } else if (quality === ConnectionQuality.Poor) {
        color = "text-red-500";
        label = "Poor Connection";
    } else {
        // Unknown or Lost
        color = "text-neutral-500";
        Icon = WifiOff;
        label = "Network functionality limited";
    }

    return (
        <div className={`flex items-center justify-center p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-sm ${className}`} title={label}>
            <Icon className={`w-3 h-3 ${color}`} />
        </div>
    );
}
