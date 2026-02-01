
import { useEffect } from "react";
import { useLocalParticipant } from "@livekit/components-react";
import { BackgroundBlur, VirtualBackground } from "@livekit/track-processors";

export default function RoomEffects({ bgSettings }: { bgSettings?: { type: 'none' | 'blur' | 'image', imageUrl?: string } }) {
    const { localParticipant } = useLocalParticipant();

    useEffect(() => {
        const applyBg = async () => {
            if (!localParticipant) return;

            // Wait for video track to be published
            const videoTrackPublication = localParticipant.videoTrackPublications.values().next().value;
            if (!videoTrackPublication || !videoTrackPublication.track) return;

            const track = videoTrackPublication.track;

            try {
                if (bgSettings?.type === 'blur') {
                    await track.setProcessor(BackgroundBlur(10));
                } else if (bgSettings?.type === 'image' && bgSettings.imageUrl) {
                    const img = new Image();
                    img.src = bgSettings.imageUrl;
                    img.crossOrigin = "anonymous";
                    await new Promise((resolve) => { img.onload = resolve; });
                    await track.setProcessor(VirtualBackground(img.src));
                } else {
                    await track.setProcessor(undefined as any);
                }
            } catch (error) {
                console.error("Failed to apply room background:", error);
            }
        };

        const interval = setInterval(applyBg, 2000); // Poll/Check occasionally or use events? 
        // Better: Listen to track subscription/publication events. 
        // For MVP, polling or dependency on `localParticipant.videoTrackPublications` is safer.

        applyBg();

        return () => clearInterval(interval);
    }, [localParticipant, bgSettings]);

    return null;
}
