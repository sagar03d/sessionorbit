"use client"

import { useEffect, useState, useRef } from "react"
import { Mic, MicOff, Video, VideoOff, Phone, Settings, AlertCircle, Loader2, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createLocalVideoTrack, createLocalAudioTrack, LocalVideoTrack, LocalAudioTrack } from "livekit-client"

interface PreJoinScreenProps {
    onJoin: (name: string, micEnabled: boolean, camEnabled: boolean) => void
    userDisplayName?: string
    meetingName?: string
    isLoading?: boolean
}

export default function PreJoinScreen({ onJoin, userDisplayName, meetingName, isLoading }: PreJoinScreenProps) {
    const [name, setName] = useState(userDisplayName || "")
    const [micEnabled, setMicEnabled] = useState(true)
    const [camEnabled, setCamEnabled] = useState(true)

    // Tracks for preview
    const [videoTrack, setVideoTrack] = useState<LocalVideoTrack | null>(null)
    const [audioTrack, setAudioTrack] = useState<LocalAudioTrack | null>(null)
    const [error, setError] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        let mounted = true;

        const initMedia = async () => {
            try {
                if (camEnabled) {
                    const vTrack = await createLocalVideoTrack({
                        resolution: { width: 1280, height: 720 },
                    });
                    if (mounted) {
                        setVideoTrack(vTrack);
                        if (videoRef.current) {
                            vTrack.attach(videoRef.current);
                        }
                    } else {
                        vTrack.stop();
                    }
                } else {
                    if (videoTrack) {
                        videoTrack.stop();
                        setVideoTrack(null);
                    }
                }
            } catch (e) {
                console.error("Error accessing camera:", e);
                setError("Could not access camera. Please check permissions.")
            }
        };

        initMedia();

        return () => {
            mounted = false;
        };
    }, [camEnabled]);

    // Handle mic separately to avoid restarting video when mic toggles
    useEffect(() => {
        // We don't necessarily need to create an audio track for preview (audio feedback loop),
        // but we verify permission. state `micEnabled` just controls what we pass to onJoin.
    }, [micEnabled]);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            videoTrack?.stop();
            audioTrack?.stop();
        }
    }, [videoTrack, audioTrack]);


    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            // Stop tracks so the main room can re-acquire them (or we could pass them, but easier to let Room handle it)
            videoTrack?.stop()
            audioTrack?.stop()
            onJoin(name, micEnabled, camEnabled)
        }
    }

    const handleAITroubleshoot = () => {
        alert("Connecting to AI Technical Support... (Demo Feature)");
    }

    return (
        <div className="min-h-screen bg-[#202124] flex items-center justify-center p-4 font-sans text-white">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Video Preview */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-full aspect-video bg-[#3c4043] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group">
                        {camEnabled ? (
                            <div className="w-full h-full relative">
                                <video ref={videoRef} className="w-full h-full object-cover -scale-x-100" />
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    {name || "Your Name"}
                                </div>
                            </div>
                        ) : (
                            <div className="text-neutral-400 flex flex-col items-center gap-4">
                                <span className="text-xl font-medium">Camera is off</span>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-red-400 p-4 text-center z-20">
                                <AlertCircle className="w-8 h-8 mb-2" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 transition-transform duration-300">
                            <button
                                onClick={() => setMicEnabled(!micEnabled)}
                                className={`p-4 rounded-full transition-colors border ${micEnabled ? 'bg-[#3c4043] border-transparent hover:bg-[#4a4e51]' : 'bg-red-500 border-red-500 hover:bg-red-600'}`}
                            >
                                {micEnabled ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                            </button>
                            <button
                                onClick={() => setCamEnabled(!camEnabled)}
                                className={`p-4 rounded-full transition-colors border ${camEnabled ? 'bg-[#3c4043] border-transparent hover:bg-[#4a4e51]' : 'bg-red-500 border-red-500 hover:bg-red-600'}`}
                            >
                                {camEnabled ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                            </button>
                        </div>
                    </div>
                    {/* Audio visualizer link or text could go here */}
                </div>

                {/* Right Side: Join Controls */}
                <div className="flex flex-col items-center lg:items-start gap-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-google font-medium mb-2">Ready to join?</h1>
                        <p className="text-neutral-400 text-lg">{meetingName || "Classroom"}</p>
                    </div>

                    <div className="w-full max-w-sm space-y-4">
                        {!userDisplayName && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Your Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full bg-transparent border border-neutral-600 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-neutral-600"
                                />
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button
                                onClick={handleJoin}
                                disabled={!name.trim() || isLoading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-base font-medium transition-transform hover:scale-[1.02]"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join now"}
                            </Button>
                            <button
                                className="p-3 rounded-full border border-neutral-600 hover:bg-neutral-800 text-blue-400"
                                title="Use Companion Mode"
                            >
                                <Monitor className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="pt-4 border-t border-neutral-700 w-full">
                            <button
                                onClick={handleAITroubleshoot}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors group"
                            >
                                <div className="p-2 bg-blue-500/20 rounded-full group-hover:scale-110 transition-transform">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="font-medium">AI Troubleshoot Call</span>
                            </button>
                            <p className="text-center text-xs text-neutral-500 mt-2">Having trouble? Talk to our AI assistant.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
