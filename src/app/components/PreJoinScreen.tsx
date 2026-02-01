"use client"

import { useEffect, useState, useRef } from "react"
import { Mic, MicOff, Video, VideoOff, Phone, Settings, AlertCircle, Loader2, Monitor, ChevronDown, Check, GripHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createLocalVideoTrack, createLocalAudioTrack, LocalVideoTrack, LocalAudioTrack } from "livekit-client"
import { BackgroundBlur, VirtualBackground } from "@livekit/track-processors";
import Vapi from "@vapi-ai/web"




interface PreJoinScreenProps {
    onJoin: (name: string, micEnabled: boolean, camEnabled: boolean, audioDeviceId?: string, videoDeviceId?: string, bgSettings?: { type: 'none' | 'blur' | 'image', imageUrl?: string }) => void
    userDisplayName?: string
    meetingName?: string
    isLoading?: boolean
}

export default function PreJoinScreen({ onJoin, userDisplayName, meetingName, isLoading }: PreJoinScreenProps) {
    const [name, setName] = useState(userDisplayName || "")
    const [micEnabled, setMicEnabled] = useState(true)
    const [camEnabled, setCamEnabled] = useState(true)

    // Device selection
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
    const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>("")
    const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>("")

    // Background Settings
    const [bgSettings, setBgSettings] = useState<{ type: 'none' | 'blur' | 'image', imageUrl?: string }>({ type: 'none' });



    // Vapi State
    const [isInCall, setIsInCall] = useState(false)
    const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
    const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false)
    const [volumeLevel, setVolumeLevel] = useState(0)
    const [notification, setNotification] = useState<{ title: string, message: string } | null>(null)

    // Draggable Logic
    const [position, setPosition] = useState({ x: 20, y: 20 }) // Default bottom-right offset
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }


    // Tracks for preview
    const [videoTrack, setVideoTrack] = useState<LocalVideoTrack | null>(null)
    const [audioTrack, setAudioTrack] = useState<LocalAudioTrack | null>(null)
    const [error, setError] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Vapi Instance
    const vapiRef = useRef<Vapi | null>(null);

    useEffect(() => {
        let mounted = true;

        const initMedia = async () => {
            try {
                if (camEnabled) {
                    const vTrack = await createLocalVideoTrack({
                        resolution: { width: 1280, height: 720 },
                        deviceId: selectedVideoDeviceId ? { exact: selectedVideoDeviceId } : undefined
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
    }, [camEnabled, selectedVideoDeviceId]);

    // Apply Background Processor
    useEffect(() => {
        const applyProcessor = async () => {
            if (!videoTrack || !camEnabled) return;

            try {
                if (bgSettings.type === 'blur') {
                    const processor = BackgroundBlur(10);
                    await videoTrack.setProcessor(processor);
                } else if (bgSettings.type === 'image' && bgSettings.imageUrl) {
                    const img = new Image();
                    img.src = bgSettings.imageUrl;
                    img.crossOrigin = "anonymous";
                    await img.decode();
                    const processor = VirtualBackground(img.src);
                    await videoTrack.setProcessor(processor);
                } else {
                    await videoTrack.setProcessor(undefined as any);
                }
            } catch (error) {
                console.error("Failed to apply background processor:", error);
            }
        };
        applyProcessor();
    }, [videoTrack, camEnabled, bgSettings]);

    // Fetch devices
    useEffect(() => {
        const getDevices = async () => {
            try {
                // Ensure we have permissions first to get labels
                // If cam is already enabled, we essentially have video permission from the other effect or future call
                // But better to strictly request if needed or just enumerate.
                // Enumerate first
                const devices = await navigator.mediaDevices.enumerateDevices();

                const audio = devices.filter(d => d.kind === 'audioinput');
                const video = devices.filter(d => d.kind === 'videoinput');

                setAudioDevices(audio);
                setVideoDevices(video);

                // Set defaults if not set
                if (!selectedAudioDeviceId && audio.length > 0) {
                    setSelectedAudioDeviceId(audio[0].deviceId);
                }
                if (!selectedVideoDeviceId && video.length > 0) {
                    setSelectedVideoDeviceId(video[0].deviceId);
                }
            } catch (e) {
                console.error("Error enumerating devices", e);
            }
        };

        // We call getDevices initially, and also listening to devicechange could be good
        getDevices();

        navigator.mediaDevices.addEventListener('devicechange', getDevices);
        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', getDevices);
        }
    }, [selectedAudioDeviceId, selectedVideoDeviceId]);

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
            videoTrack?.stop();
            audioTrack?.stop();
            if (vapiRef.current) {
                vapiRef.current.stop();
            }
        }
    }, [videoTrack, audioTrack]);

    useEffect(() => {
        // Initialize Vapi
        const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
        if (!publicKey) {
            console.error("Vapi Public Key is missing");
            return;
        }

        const vapiInstance = new Vapi(publicKey);
        vapiRef.current = vapiInstance;

        // Vapi Event Listeners
        vapiInstance.on('call-start', () => {
            setCallStatus('connected');
            setIsInCall(true);
        });

        vapiInstance.on('call-end', () => {
            setCallStatus('disconnected');
            setIsInCall(false);
            setAssistantIsSpeaking(false);
        });

        vapiInstance.on('speech-start', () => {
            setAssistantIsSpeaking(true);
        });

        vapiInstance.on('speech-end', () => {
            setAssistantIsSpeaking(false);
        });

        vapiInstance.on('volume-level', (level) => {
            setVolumeLevel(level);
        });

        vapiInstance.on('error', (e) => {
            console.error("Vapi Error:", e);
            setCallStatus('disconnected');
            setIsInCall(false);
            setNotification({
                title: "Call Failed",
                message: "Our agent is busy at the moment. Please try again later."
            });
            setTimeout(() => setNotification(null), 5000);
        });

        return () => {
            vapiInstance.stop();
        }
    }, []);


    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            // Stop tracks so the main room can re-acquire them (or we could pass them, but easier to let Room handle it)
            videoTrack?.stop()
            audioTrack?.stop()
            onJoin(name, micEnabled, camEnabled, selectedAudioDeviceId, selectedVideoDeviceId, bgSettings)
        }
    }

    const handleAITroubleshoot = async () => {
        if (!vapiRef.current) {
            setNotification({
                title: "Initialization Failed",
                message: "AI support system could not be initialized. Please refresh."
            });
            return;
        }

        if (callStatus !== 'disconnected') return;

        setCallStatus('connecting');
        setIsInCall(true);
        setNotification(null);

        try {
            if (process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) {
                // Ensure any previous call is stopped
                vapiRef.current.stop();
                await vapiRef.current.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
            } else {
                console.error("Vapi Assistant ID not found in env");
                setCallStatus('disconnected');
                setIsInCall(false);
                setNotification({
                    title: "Configuration Error",
                    message: "Assistant ID configuration is missing."
                });
            }
        } catch (e) {
            console.error("Failed to start call", e);
            setCallStatus('disconnected');
            setIsInCall(false);
            setNotification({
                title: "Connection Failed",
                message: "Could not connect to the AI assistant."
            });
        }
    }


    const endAICall = () => {
        vapiRef.current?.stop();
    }

    return (
        <div className="min-h-screen bg-[#202124] flex items-center justify-center p-4 font-sans text-white relative">
            {notification && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md animate-in fade-in slide-in-from-top-4">
                    <Alert variant="destructive" className="bg-red-900/50 border-red-500/50 text-white">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{notification.title}</AlertTitle>
                        <AlertDescription>{notification.message}</AlertDescription>
                    </Alert>
                </div>
            )}
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
                            {/* Mic Controls */}
                            <div className="flex items-center gap-1 bg-[#3c4043] rounded-full p-1 border border-neutral-700">
                                <button
                                    onClick={() => setMicEnabled(!micEnabled)}
                                    className={`p-3 rounded-full transition-colors ${micEnabled ? 'bg-transparent hover:bg-neutral-600' : 'bg-red-500 hover:bg-red-600'}`}
                                >
                                    {micEnabled ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                                </button>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="p-1.5 rounded-full hover:bg-neutral-600 text-neutral-400 hover:text-white transition-colors">
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-60 p-2 bg-[#202124] border-neutral-700 text-white" align="center">
                                        <div className="text-xs font-semibold text-neutral-400 px-2 py-1 mb-1">Microphone</div>
                                        {audioDevices.map(device => (
                                            <button
                                                key={device.deviceId}
                                                onClick={() => setSelectedAudioDeviceId(device.deviceId)}
                                                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-neutral-700 flex items-center justify-between group"
                                            >
                                                <span className="truncate">{device.label || `Microphone ${device.deviceId.slice(0, 4)}...`}</span>
                                                {selectedAudioDeviceId === device.deviceId && <Check className="w-4 h-4 text-blue-500" />}
                                            </button>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Camera Controls */}
                            <div className="flex items-center gap-1 bg-[#3c4043] rounded-full p-1 border border-neutral-700">
                                <button
                                    onClick={() => setCamEnabled(!camEnabled)}
                                    className={`p-3 rounded-full transition-colors ${camEnabled ? 'bg-transparent hover:bg-neutral-600' : 'bg-red-500 hover:bg-red-600'}`}
                                >
                                    {camEnabled ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                                </button>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="p-1.5 rounded-full hover:bg-neutral-600 text-neutral-400 hover:text-white transition-colors">
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-60 p-2 bg-[#202124] border-neutral-700 text-white" align="center">
                                        <div className="text-xs font-semibold text-neutral-400 px-2 py-1 mb-1">Camera</div>
                                        {videoDevices.map(device => (
                                            <button
                                                key={device.deviceId}
                                                onClick={() => setSelectedVideoDeviceId(device.deviceId)}
                                                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-neutral-700 flex items-center justify-between group"
                                            >
                                                <span className="truncate">{device.label || `Camera ${device.deviceId.slice(0, 4)}...`}</span>
                                                {selectedVideoDeviceId === device.deviceId && <Check className="w-4 h-4 text-blue-500" />}
                                            </button>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Background Controls */}
                            <div className="flex items-center gap-1 bg-[#3c4043] rounded-full p-1 border border-neutral-700">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="p-3 rounded-full hover:bg-neutral-600 transition-colors" title="Background Settings">
                                            <Settings className="w-5 h-5 text-white" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-72 p-4 bg-[#202124] border-neutral-700 text-white" align="center">
                                        <div className="text-sm font-semibold mb-3">Background Effects</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => setBgSettings({ type: 'none' })}
                                                className={`h-16 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${bgSettings.type === 'none' ? 'border-blue-500 bg-blue-500/20' : 'border-neutral-600 hover:border-neutral-500'}`}
                                            >
                                                <div className="w-6 h-6 rounded border border-neutral-400"></div>
                                                <span className="text-[10px]">None</span>
                                            </button>

                                            <button
                                                onClick={() => setBgSettings({ type: 'blur' })}
                                                className={`h-16 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${bgSettings.type === 'blur' ? 'border-blue-500 bg-blue-500/20' : 'border-neutral-600 hover:border-neutral-500'}`}
                                            >
                                                <div className="w-6 h-6 rounded bg-gradient-to-br from-neutral-400 to-neutral-600 blur-[2px]"></div>
                                                <span className="text-[10px]">Blur</span>
                                            </button>

                                            <label className={`h-16 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${bgSettings.type === 'image' ? 'border-blue-500 bg-blue-500/20' : 'border-neutral-600 hover:border-neutral-500'}`}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            setBgSettings({ type: 'image', imageUrl: url });
                                                        }
                                                    }}
                                                />
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <div className="text-neutral-300">Img</div>
                                                </div>
                                                <span className="text-[10px]">Upload</span>
                                            </label>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
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
            {/* Vapi Call Overlay */}
            {/* Vapi Call Popup (Draggable) */}
            {isInCall && (
                <div
                    className="fixed z-50 animate-in fade-in zoom-in duration-300 shadow-2xl rounded-2xl overflow-hidden bg-[#202124] border border-neutral-700 w-80"
                    style={{
                        right: `${position.x}px`,
                        bottom: `${position.y}px`,
                        cursor: isDragging ? 'grabbing' : 'default'
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* Drag Handle */}
                    <div
                        className="h-6 bg-neutral-800 w-full flex items-center justify-center cursor-grab hover:bg-neutral-700 transition-colors"
                        onMouseDown={handleMouseDown}
                    >
                        <GripHorizontal className="w-8 h-4 text-neutral-500" />
                    </div>

                    <div className="p-6 flex flex-col items-center gap-6 relative">
                        {/* Background Glow - Smaller */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] transition-all duration-500 ${assistantIsSpeaking ? 'opacity-100' : 'opacity-30'}`} />

                        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                            {/* Smaller Avatar */}
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${assistantIsSpeaking ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'border-neutral-700'}`}>
                                <div className={`w-[72px] h-[72px] rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden relative`}>
                                    {assistantIsSpeaking ? (
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className="w-1 bg-blue-400 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.1}s`, height: `${10 + Math.random() * 20}px` }} />
                                            ))}
                                        </div>
                                    ) : (
                                        <Monitor className="w-8 h-8 text-neutral-600" />
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white">AI Support</h3>
                                <p className="text-neutral-400 text-xs font-mono uppercase tracking-wider">
                                    {callStatus === 'connecting' ? 'Connecting...' : assistantIsSpeaking ? 'Speaking...' : 'Listening...'}
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={endAICall}
                            variant="destructive"
                            size="sm"
                            className="w-full rounded-full h-10 text-sm font-medium relative z-10 hover:bg-red-600 shadow-lg shadow-red-900/20"
                        >
                            <Phone className="mr-2 w-4 h-4 rotate-135" />
                            End Call
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
