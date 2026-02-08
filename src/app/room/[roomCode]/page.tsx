"use client"

import { useEffect, useState, use, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
    LiveKitRoom,
    useLocalParticipant,
    useRoomContext,
    useTracks,
    VideoTrack,
    useRemoteParticipants,
} from "@livekit/components-react"
import "@livekit/components-styles"
import { BackgroundBlur, VirtualBackground } from "@livekit/track-processors";
import { Track, ConnectionQuality } from "livekit-client"
import { Copy, Check, Users, Layout, Video, LogOut, VideoOff, Mic, MicOff, Settings, Wifi, WifiOff, FileText, Image as ImageIcon, Plus, Link as LinkIcon, Globe, X, Captions, Code2, UserPlus, Square, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Whiteboard, { WhiteboardHandle } from "../../components/Whiteboard"
import ExcalidrawBoard from "../../components/ExcalidrawBoard"
import CodeEditor from "../../components/CodeEditor"
import PreJoinScreen from "../../components/PreJoinScreen"
import RoomEffects from "./RoomEffects";


import Chat from "@/components/chat/Chat";
import { toast, Toaster } from 'sonner';

// Helper for speech recognition
const SpeechRecognition = (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null;



interface Tab {
    id: string
    type: 'whiteboard' | 'embed' | 'code' | 'excalidraw'
    title: string
    src?: string // for embed or background image helper
    boardId?: string
    initialData?: {
        background?: string
        content?: string
        language?: string
        elements?: any[]
        appState?: any
    }
}

export default function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const { roomCode } = use(params)
    const router = useRouter()
    const [token, setToken] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [role, setRole] = useState<string>("")
    const [meeting, setMeeting] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isJoining, setIsJoining] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

    // Dynamic Tabs State
    const [tabs, setTabs] = useState<Tab[]>([{ id: 'main', type: 'whiteboard', title: 'Whiteboard', boardId: 'main' }])
    const [activeTabId, setActiveTabId] = useState<string>('main')
    const [sidebarTab, setSidebarTab] = useState<'videos' | 'chat'>('videos')
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    const searchParams = useSearchParams()
    const recorderToken = searchParams.get("recorder_token")
    const isRecorder = !!recorderToken

    // Refs
    // We keep a map of refs for all active whiteboards to support recording
    const whiteboardRefs = useRef<Record<string, WhiteboardHandle>>({})
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
    const [audioDestination, setAudioDestination] = useState<MediaStreamAudioDestinationNode | null>(null)
    const [isLowBandwidth, setIsLowBandwidth] = useState(false)

    // Pre-Join State
    const [hasJoinedRoom, setHasJoinedRoom] = useState(false)
    const [preJoinChoices, setPreJoinChoices] = useState<{ mic: boolean, cam: boolean, audioDeviceId?: string, videoDeviceId?: string }>({ mic: true, cam: true })
    const [bgSettings, setBgSettings] = useState<{ type: 'none' | 'blur' | 'image', imageUrl?: string } | undefined>(undefined);

    // Participant & Transcription State
    const [participantDbId, setParticipantDbId] = useState<string | null>(null)
    const [isTranscribing, setIsTranscribing] = useState(true)
    const [localCanWrite, setLocalCanWrite] = useState(false)
    const conversationRef = useRef<any[]>([])
    const talkTimeRef = useRef<number>(0)
    const lastTalkStartRef = useRef<number | null>(null)

    // Cleanup ref for leaving
    const participantDbIdRef = useRef<string | null>(null)
    const meetingRef = useRef<any>(null)
    const nameRef = useRef<string>("")

    // Update refs to avoid stale closures in event listeners
    meetingRef.current = meeting
    nameRef.current = name

    useEffect(() => {
        // Subscription for termination and tab sync - should run for everyone
        const syncMeetingData = async (mId: string) => {
            const { data: initialData } = await supabase
                .from('meetings')
                .select('whiteboard_data, ended_at')
                .eq('id', mId)
                .single()

            if (initialData?.ended_at) {
                toast.info("This class has ended.")
                router.push("/dashboard")
                return
            }

            if (initialData?.whiteboard_data?.tabs_config) {
                setTabs(initialData.whiteboard_data.tabs_config)
            }

            const channel = supabase.channel(`room_updates_${mId}`)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'meetings',
                    filter: `id=eq.${mId}`
                }, (payload) => {
                    const newData = payload.new as any
                    if (newData.ended_at) {
                        toast.warning("The host has ended this class.")
                        router.push("/dashboard")
                        return
                    }
                    if (newData.whiteboard_data?.tabs_config) {
                        setTabs(newData.whiteboard_data.tabs_config)
                    }
                })
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }

        const initMeeting = async () => {
            // Check session storage for pre-join skip
            if (typeof window !== 'undefined') {
                const alreadyJoined = sessionStorage.getItem(`hasJoined_${roomCode}`);
                if (alreadyJoined) {
                    console.log("Already joined correctly, skipping prejoin");
                    setHasJoinedRoom(true);
                }
            }

            let { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                try {
                    const res = await fetch('/api/auth/me');
                    if (res.ok) {
                        const data = await res.json();
                        user = data.user;
                    }
                } catch (e) {
                    console.error("Manual auth check failed", e);
                }
            }

            const { data: meetingData, error: meetingError } = await supabase
                .from('meetings')
                .select('*')
                .or(`host_code.eq."${roomCode}",moderator_code.eq."${roomCode}",participant_code.eq."${roomCode}"`)
                .single()

            if (meetingError || !meetingData) {
                console.error('Meeting not found')
                router.push("/dashboard")
                return
            }

            setMeeting(meetingData)
            if (meetingData.egress_id) {
                setIsRecording(true)
            }
            syncMeetingData(meetingData.id)

            // Subscribe to local participant's can_write status if they are not the host
            const subscribeToLocalAccess = async (mId: string, uId: string | null) => {
                const { data } = await supabase
                    .from('meeting_participants')
                    .select('can_write')
                    .eq('meeting_id', mId)
                    .eq('user_id', uId)
                    .is('left_at', null)
                    .maybeSingle()

                if (data) setLocalCanWrite(data.can_write)

                const accessChannel = supabase.channel(`local_access_${mId}`)
                    .on('postgres_changes', {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'meeting_participants',
                        filter: `meeting_id=eq.${mId}`
                    }, (payload) => {
                        const newUser = payload.new as any
                        if (newUser.user_id === uId || (newUser.name === nameRef.current && !uId)) {
                            setLocalCanWrite(newUser.can_write)
                        }
                    })
                    .subscribe()

                return () => {
                    supabase.removeChannel(accessChannel)
                }
            }

            let userRole = "participant"
            if (meetingData.host_code === roomCode) {
                userRole = "host"
                if (!user || user.id !== meetingData.host_id) {
                    router.push("/login")
                    return
                }
            } else if (meetingData.moderator_code === roomCode) {
                userRole = "moderator"
            }
            setRole(userRole)


            const profileData = user ? (
                (await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single()).data
            ) : null

            const displayName = profileData?.full_name || user?.email || "User"
            const avatarUrl = profileData?.avatar_url

            setName(displayName)

            // If it's the recorder, use the token directly and skip everything else
            if (recorderToken) {
                console.log("Recorder detected, auto-joining...");
                setToken(recorderToken);
                setHasJoinedRoom(true);
                setPreJoinChoices({ mic: false, cam: false }); // Force mute
                return;
            }

            fetchToken(meetingData.id, displayName, userRole, avatarUrl || undefined)
            if (userRole !== 'host') {
                subscribeToLocalAccess(meetingData.id, user?.id || null)
            } else {
                setLocalCanWrite(true) // Host can always write
            }
        }

        initMeeting()

        // Speech Recognition will be handled by a dedicated effect now

        return () => {
            if (participantDbIdRef.current) {
                const finalTalkTime = talkTimeRef.current + (lastTalkStartRef.current ? (Date.now() - lastTalkStartRef.current) / 1000 : 0);
                supabase.from('meeting_participants')
                    .update({
                        left_at: new Date().toISOString(),
                        talk_time_seconds: Math.round(finalTalkTime)
                    })
                    .eq('id', participantDbIdRef.current)
            }
        }
    }, [roomCode, router]) // Removed 'name' from dep array to avoid re-init loops? Careful.

    // Dedicated Effect for Speech Recognition Lifecycle
    useEffect(() => {
        if (!hasJoinedRoom || !SpeechRecognition || !isTranscribing || isRecorder) return;

        let recognition: any = null;
        let shouldRestart = true;

        const startRecognition = () => {
            try {
                recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    console.log("[SpeechRecognition] Started");
                };

                recognition.onresult = async (event: any) => {
                    const text = event.results[event.results.length - 1][0].transcript;
                    if (text && meetingRef.current?.id && participantDbIdRef.current) {
                        console.log("[SpeechRecognition] Result:", text);
                        const { error } = await supabase.from('meeting_transcriptions').insert({
                            meeting_id: meetingRef.current.id,
                            participant_id: participantDbIdRef.current,
                            speaker_name: nameRef.current || 'Unknown',
                            content: text,
                            timestamp: new Date().toISOString()
                        });

                        if (error) console.error("[SpeechRecognition] Save Error:", error);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error("[SpeechRecognition] Error:", event.error);
                    if (event.error === 'not-allowed') {
                        shouldRestart = false;
                        toast.error("Speech recognition permission denied. Please allow microphone access for captions.");
                    }
                };

                recognition.onend = () => {
                    console.log("[SpeechRecognition] Ended");
                    if (shouldRestart && isTranscribing) {
                        console.log("[SpeechRecognition] Restarting...");
                        setTimeout(startRecognition, 1000);
                    }
                };

                recognition.start();
            } catch (e) {
                console.error("[SpeechRecognition] Init Error:", e);
            }
        };

        startRecognition();

        return () => {
            shouldRestart = false;
            if (recognition) {
                recognition.onend = null;
                recognition.stop();
            }
        };
    }, [hasJoinedRoom, isTranscribing]);

    // Auto-start recording for host
    useEffect(() => {
        if (hasJoinedRoom && role === 'host' && !isRecording && meeting?.id) {
            console.log("Auto-starting recording for host...");
            startRecording();
        }
    }, [hasJoinedRoom, role, meeting?.id]);


    const fetchToken = async (roomId: string, displayName: string, userRole: string, avatarUrl?: string, identity?: string) => {
        setIsJoining(true)
        try {
            let url = `/api/livekit/token?room=${roomId}&username=${encodeURIComponent(displayName)}&role=${userRole}`
            if (identity) {
                url += `&identity=${encodeURIComponent(identity)}`
            }
            if (avatarUrl) {
                url += `&avatarUrl=${encodeURIComponent(avatarUrl)}`
            }
            const resp = await fetch(url)
            const data = await resp.json()
            if (data.token) {
                setToken(data.token)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsJoining(false)
            setIsLoading(false)
        }
    }

    const handlePreJoin = async (enteredName: string, mic: boolean, cam: boolean, audioDeviceId?: string, videoDeviceId?: string, bgSettingsChoice?: { type: 'none' | 'blur' | 'image', imageUrl?: string }) => {
        setPreJoinChoices({ mic, cam, audioDeviceId, videoDeviceId })
        setBgSettings(bgSettingsChoice);

        // Save session flag
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(`hasJoined_${roomCode}`, 'true');
        }

        const finalName = enteredName || name || "Guest"
        setName(finalName)

        // Calculate role from meeting data to avoid stale state
        let calculatedRole = "participant"
        if (meeting) {
            if (meeting.host_code === roomCode) calculatedRole = "host"
            else if (meeting.moderator_code === roomCode) calculatedRole = "moderator"
        }

        const finishJoin = async () => {
            // Track Join in DB if not already tracked
            if (meeting && !participantDbIdRef.current) {
                const { data: { user } } = await supabase.auth.getUser()

                // Explicitly determine role from roomCode and meeting data to avoid state lag
                let joinRole = "participant"
                console.log(`[finishJoin] host_code: '${meeting.host_code}', moderator_code: '${meeting.moderator_code}', roomCode: '${roomCode}'`)

                if (meeting.host_code === roomCode) joinRole = "host"
                else if (meeting.moderator_code === roomCode) joinRole = "moderator"

                console.log(`[finishJoin] Calculated joinRole: ${joinRole}`)

                // For authenticated users, try to avoid duplicate active rows for the SAME ROLE
                if (user) {
                    const { data: existing } = await supabase
                        .from('meeting_participants')
                        .select('id')
                        .eq('meeting_id', meeting.id)
                        .eq('user_id', user.id)
                        .eq('role', joinRole)
                        .is('left_at', null)
                        .maybeSingle()

                    if (existing) {
                        setParticipantDbId(existing.id)
                        participantDbIdRef.current = existing.id
                        setHasJoinedRoom(true)
                        return
                    }
                }

                const { data: partData, error: partError } = await supabase
                    .from('meeting_participants')
                    .insert([{
                        meeting_id: meeting.id,
                        user_id: user?.id || null,
                        name: finalName,
                        role: joinRole,
                        joined_at: new Date().toISOString()
                    }])
                    .select()
                    .single()

                if (partData) {
                    setParticipantDbId(partData.id)
                    participantDbIdRef.current = partData.id
                    return partData.id
                } else if (partError) {
                    console.error("Failed to track join:", partError)
                }
            }
            return participantDbIdRef.current
        }

        if (meeting) {
            // Step 1: Track join in DB first to get a UUID
            const pId = await finishJoin()

            if (meeting && finalName.trim()) {
                setIsLoading(true)
                // Get avatar for pre-join too if possible
                const { data: { user } } = await supabase.auth.getUser()
                const profileData = user ? (await supabase.from('profiles').select('avatar_url').eq('id', user.id).single()).data : null
                const avatarUrl = profileData?.avatar_url

                await fetchToken(meeting.id, finalName, calculatedRole, avatarUrl || undefined, pId || undefined)
                setPreJoinChoices({ mic: mic, cam: cam })
                setHasJoinedRoom(true)
            }
        }
    }

    // --- Dynamic Tab Handlers ---

    const addNewTab = async (type: 'whiteboard' | 'embed' | 'code' | 'excalidraw', content?: string) => {
        if (!meeting) return

        const newId = crypto.randomUUID()
        let newTab: Tab;

        if (type === 'whiteboard') {
            newTab = {
                id: newId,
                type: 'whiteboard',
                title: content ? 'Worksheet' : 'Whiteboard',
                boardId: newId,
                initialData: content ? { background: content } : undefined,
            }
        } else if (type === 'code') {
            newTab = {
                id: newId,
                type: 'code',
                title: 'Code Editor',
                boardId: newId,
                initialData: { content: "// Write your code here...", language: 'javascript' }
            }
        } else if (type === 'excalidraw') {
            newTab = {
                id: newId,
                type: 'excalidraw',
                title: 'Infinite Board',
                boardId: newId,
                initialData: { elements: [], appState: {} }
            }
        } else {
            newTab = {
                id: newId,
                type: 'embed',
                title: 'Web',
                src: content
            }
        }

        // Optimistic Update
        const updatedTabs = [...tabs, newTab]
        setTabs(updatedTabs)
        setActiveTabId(newId)

        // Update DB
        const { data } = await supabase
            .from('meetings')
            .select('whiteboard_data')
            .eq('id', meeting.id)
            .single()

        const currentWbData = data?.whiteboard_data || {}
        // Use DB tabs as base if available to avoid conflict, but here we just append logic
        // Actually, safer to just append to what we think is current, or rely on merge.
        // For simplicity allow optimistic to represent truth for now.

        const updatedWbData = {
            ...currentWbData,
            tabs_config: updatedTabs,
            // Init data for new whiteboard or code if needed
            ...(type === 'whiteboard' && content ? {
                [newId]: {
                    strokes: [],
                    background: content
                }
            } : {}),
            ...(type === 'code' ? {
                [newId]: {
                    content: "// Write your code here...",
                    language: 'javascript'
                }
            } : {}),
            ...(type === 'excalidraw' ? {
                [newId]: {
                    type: 'excalidraw',
                    elements: [],
                    appState: {}
                }
            } : {})
        }

        const { error } = await supabase
            .from('meetings')
            .update({ whiteboard_data: updatedWbData })
            .eq('id', meeting.id)

        if (error) {
            console.error("Failed to add tab", error)
            toast.error("Failed to save tab. You might not have permission.")
            // Revert state?
            setTabs(tabs) // Revert to old
            setActiveTabId(activeTabId)
        }
    }

    const removeTab = async (tabId: string) => {
        if (!meeting || tabId === 'main') return
        if (!confirm("Are you sure you want to close this tab?")) return

        const newTabs = tabs.filter(t => t.id !== tabId)
        const nextActiveId = activeTabId === tabId ? (newTabs[newTabs.length - 1]?.id || 'main') : activeTabId

        // Optimistic
        setTabs(newTabs)
        setActiveTabId(nextActiveId)

        // Update DB
        const { data } = await supabase
            .from('meetings')
            .select('whiteboard_data')
            .eq('id', meeting.id)
            .single()

        const currentWbData = data?.whiteboard_data || {}
        const updatedWbData = {
            ...currentWbData,
            tabs_config: newTabs
        }

        const { error } = await supabase
            .from('meetings')
            .update({ whiteboard_data: updatedWbData })
            .eq('id', meeting.id)

        if (error) {
            console.error("Failed to remove tab", error)
            toast.error("Failed to close tab.")
            setTabs(tabs)
            setActiveTabId(activeTabId)
        }
    }

    // Fix: Correct function definition keyword
    const addNewTabWrapper = (type: 'whiteboard' | 'embed' | 'code' | 'excalidraw', content?: string) => {
        return addNewTab(type, content)
    }

    const handleImageUploadForTab = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                // Resize
                const MAX_WIDTH = 1280
                const scale = MAX_WIDTH / img.width

                let finalWidth = img.width
                let finalHeight = img.height

                if (scale < 1) {
                    finalWidth = img.width * scale
                    finalHeight = img.height * scale
                }

                const canvas = document.createElement('canvas')
                canvas.width = finalWidth
                canvas.height = finalHeight
                const ctx = canvas.getContext('2d')
                ctx?.drawImage(img, 0, 0, finalWidth, finalHeight)

                const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
                addNewTabWrapper('whiteboard', dataUrl)
            }
            img.src = event.target?.result as string
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    const getEmbedUrl = (inputUrl: string) => {
        let cleanUrl = inputUrl.trim();
        if (!cleanUrl.startsWith('http')) {
            cleanUrl = 'https://' + cleanUrl;
        }

        try {
            const url = new URL(cleanUrl);

            // YouTube Handling
            if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
                let videoId = '';

                if (url.hostname.includes('youtu.be')) {
                    // Pattern: youtu.be/VIDEO_ID
                    videoId = url.pathname.slice(1);
                } else if (url.pathname.includes('/shorts/')) {
                    // Pattern: youtube.com/shorts/VIDEO_ID
                    videoId = url.pathname.split('/shorts/')[1].split('?')[0];
                } else if (url.pathname.includes('/live/')) {
                    // Pattern: youtube.com/live/VIDEO_ID
                    videoId = url.pathname.split('/live/')[1].split('?')[0];
                } else if (url.pathname.includes('/v/')) {
                    // Pattern: youtube.com/v/VIDEO_ID
                    videoId = url.pathname.split('/v/')[1].split('?')[0];
                } else {
                    // Pattern: youtube.com/watch?v=VIDEO_ID
                    videoId = url.searchParams.get('v') || '';
                }

                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
                }

                // If it's just youtube.com without a video, it will still fail due to SAMEORIGIN
                // but we've done our best to extract a video ID.
            }

            return cleanUrl;
        } catch (e) {
            return cleanUrl;
        }
    }

    const handleEmbedUrl = () => {
        const url = prompt("Enter URL to embed.\n\nNOTE: Many websites (like Google, standard YouTube pages) block embedding. Use specific embed URLs (e.g. YouTube 'Embed' link) or websites that allow framing.")
        if (url) {
            const embeddableUrl = getEmbedUrl(url)
            addNewTabWrapper('embed', embeddableUrl)
        }
    }

    const handleEndClass = async () => {
        if (!meeting || role !== 'host') return false
        if (!confirm("Are you sure you want to end this class for everyone?")) return false

        // Stop recording if active
        if (isRecording) {
            try {
                await fetch('/api/room/record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roomId: meeting.id, action: 'STOP' })
                });
            } catch (e) { console.error("Failed to stop recording on end", e) }
        }

        // Use Server API to end class (calculates duration & usage)
        try {
            const res = await fetch('/api/room/end', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomId: meeting.id })
            });

            if (!res.ok) {
                const data = await res.json();
                console.error("Failed to end class API", data);
                toast.error("Error ending class: " + (data.error || "Unknown"));
                return false;
            } else {
                router.push("/dashboard");
                return true;
            }
        } catch (e) {
            console.error("Exception ending class", e);
            toast.error("Network error ending class.");
            return false;
        }
    }


    const copyInviteLink = () => {
        if (!meeting) return
        const url = `${window.location.origin}/room/${meeting.participant_code}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const startRecording = async () => {
        if (!meeting || role !== 'host') return;

        try {
            setIsRecording(true); // Optimistic UI
            const res = await fetch('/api/room/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomId: meeting.id, action: 'START' })
            });
            const data = await res.json();
            if (!res.ok) {
                console.error("Failed to start cloud recording", data);
                toast.error("Failed to start cloud recording: " + (data.error || "Unknown error"));
                setIsRecording(false);
            } else {
                console.log("Cloud recording started:", data.egressId);
            }
        } catch (err) {
            console.error("Error starting recording:", err);
            setIsRecording(false);
            toast.error("Network error starting recording");
        }
    };

    const stopRecording = async () => {
        if (!meeting || role !== 'host') {
            console.error("Unauthorized attempt to stop recording. Role:", role)
            return
        }

        try {
            // Optimistic UI update or wait?
            // Better to wait for confirmation for stop
            const res = await fetch('/api/room/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomId: meeting.id, action: 'STOP' })
            });
            const data = await res.json();
            if (res.ok) {
                setIsRecording(false);
                toast.success("Recording stopped. It will be processed shortly.");
            } else {
                console.error("Failed to stop recording", data);
                toast.error("Failed to stop recording: " + data.error);
            }
        } catch (e) {
            console.error(e);
            toast.error("Error stopping recording");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-black text-white overflow-hidden">
                <p>Connecting to classroom...</p>
            </div>
        )
    }

    // If joined, render the room
    if (!hasJoinedRoom) {
        return (
            <PreJoinScreen
                userDisplayName={name}
                onJoin={handlePreJoin}
                isLoading={isJoining}
            />
        )
    }

    if (token === "") {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <p>Failed to join room. Please try again.</p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
            style={{ height: '100dvh' }}
            connect={true}
            video={preJoinChoices.cam ? (preJoinChoices.videoDeviceId ? { deviceId: preJoinChoices.videoDeviceId } : true) : false}
            audio={preJoinChoices.mic ? (preJoinChoices.audioDeviceId ? { deviceId: preJoinChoices.audioDeviceId } : true) : false}
            onDisconnected={() => {
                router.push("/dashboard")
            }}
        >
            {!isRecorder && (
                <RoomEffects bgSettings={bgSettings} />
            )}

            {/* Toast Notifications */}
            <Toaster position="top-center" theme="dark" richColors />

            <div className="flex flex-col h-screen w-screen bg-[#0b0c15] text-white overflow-hidden font-sans selection:bg-indigo-500/30">
                {/* Header */}
                <div className="h-14 border-b border-white/5 bg-[#0f111a] flex items-center justify-between px-4 z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                            <div className="w-full h-full rounded-full bg-[#0f111a] flex items-center justify-center">
                                <span className="text-indigo-400 font-bold text-xs">
                                    {meeting?.name?.charAt(0) || "C"}
                                </span>
                            </div>
                        </div>
                        <span className="text-white font-medium text-sm">
                            {meeting?.name || "Classroom"}
                        </span>

                        <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

                        {/* {isRecording && (
                            <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-red-400 text-xs font-medium">Recording...</span>
                            </div>
                        )} */}

                        <div className="flex items-center gap-2">
                            {/* Mobile Sidebar Toggle */}
                            <button
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="lg:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
                                title="Open Sidebar"
                            >
                                <Users size={18} />
                            </button>

                            <button
                                onClick={copyInviteLink}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-slate-300 text-xs transition-colors"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <UserPlus size={14} />}
                                <span className="hidden sm:inline">{copied ? "Copied" : "Invite"}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {role === 'host' && (
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs transition-colors ${isRecording ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
                            >
                                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-slate-400'}`} />
                                <span className="hidden sm:inline">{isRecording ? "Stop Rec" : "Record"}</span>
                            </button>
                        )}

                        <button className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors">
                            <Settings size={18} />
                        </button>
                        <button
                            onClick={handleEndClass}
                            className="p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-red-500/10 transition-colors"
                            title={role === 'host' ? "End Class" : "Leave Class"}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                <RoomAudioEffects />
                <RoomTracker participantDbId={participantDbId} />
                <RemoteMuteHandler />
                <ActiveRoomManager meetingId={meeting?.id} />

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Content Area - Tabs & Canvas */}
                    <div className="flex-1 flex flex-col relative bg-[#13151f] overflow-hidden">

                        {/* Tabs Bar */}
                        <div className="h-10 border-b border-white/5 bg-[#0f111a] flex items-end px-2 gap-1 shrink-0">
                            {/* New Tab Button at Start */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="p-2 mb-1 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-md transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 bg-[#1a1d2d] border-white/10 text-white p-1" align="start">
                                    <div className="space-y-0.5">
                                        <button
                                            onClick={() => addNewTabWrapper('whiteboard')}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-md flex items-center gap-2"
                                        >
                                            <Square size={14} /> Whiteboard
                                        </button>
                                        <button
                                            onClick={() => addNewTabWrapper('excalidraw')}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-md flex items-center gap-2"
                                        >
                                            <Globe size={14} /> Infinite Board
                                        </button>
                                        <button
                                            onClick={() => addNewTabWrapper('code')}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-md flex items-center gap-2"
                                        >
                                            <Code2 size={14} /> Code Editor
                                        </button>
                                        <div className="h-[1px] bg-white/10 my-1" />
                                        <button
                                            onClick={handleEmbedUrl}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-md flex items-center gap-2"
                                        >
                                            <LinkIcon size={14} /> Embed Website
                                        </button>
                                        <label className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-md flex items-center gap-2 cursor-pointer">
                                            <ImageIcon size={14} />
                                            <span>Image Board</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUploadForTab}
                                            />
                                        </label>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Separator */}
                            <div className="w-[1px] h-4 bg-white/10 mb-3 mx-1"></div>

                            {/* Tab Items */}
                            <div className="flex-1 flex overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {tabs.map(tab => {
                                    const isActive = activeTabId === tab.id
                                    return (
                                        <div
                                            key={tab.id}
                                            onClick={() => setActiveTabId(tab.id)}
                                            className={`
                                                group relative flex items-center gap-2 px-4 py-2 text-xs font-medium cursor-pointer transition-all select-none
                                                ${isActive
                                                    ? 'bg-[#13151f] text-white border-t border-x border-white/5 rounded-t-md relative top-[1px] z-10'
                                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-t-md'
                                                }
                                            `}
                                        >
                                            <span className={`
                                                ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-500'}
                                            `}>
                                                {tab.type === 'whiteboard' && <Square size={12} />}
                                                {tab.type === 'excalidraw' && <Globe size={12} />}
                                                {tab.type === 'code' && <Code2 size={12} />}
                                                {tab.type === 'embed' && <LinkIcon size={12} />}
                                            </span>
                                            <span className="max-w-[100px] truncate">{tab.title}</span>

                                            {tab.id !== 'main' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }}
                                                    className={`
                                                        ml-1 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity
                                                        ${isActive ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-white/10 text-slate-600 hover:text-slate-400'}
                                                    `}
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 relative w-full h-full overflow-hidden">
                            {tabs.map(tab => (
                                <div
                                    key={tab.id}
                                    className="absolute inset-0 w-full h-full"
                                    style={{
                                        display: activeTabId === tab.id ? 'block' : 'none',
                                        zIndex: activeTabId === tab.id ? 10 : 0
                                    }}
                                >
                                    {tab.type === 'whiteboard' && (
                                        <Whiteboard
                                            ref={input => {
                                                if (input) whiteboardRefs.current[tab.id] = input
                                                else delete whiteboardRefs.current[tab.id]
                                            }}
                                            meetingId={meeting?.id}
                                            boardId={tab.id || 'main'}
                                            enableUpload={true}
                                            canWrite={localCanWrite}
                                            initialData={tab.initialData}
                                        />
                                    )}
                                    {tab.type === 'excalidraw' && (
                                        <ExcalidrawBoard
                                            meetingId={meeting?.id}
                                            boardId={tab.id || 'main'}
                                            canWrite={localCanWrite}
                                            initialData={tab.initialData}
                                        />
                                    )}
                                    {tab.type === 'code' && (
                                        <CodeEditor
                                            meetingId={meeting?.id}
                                            boardId={tab.id || 'main'}
                                            initialData={tab.initialData}
                                            canWrite={localCanWrite}
                                        />
                                    )}
                                    {tab.type === 'embed' && tab.src && (
                                        <iframe
                                            src={tab.src}
                                            className="w-full h-full border-0 bg-white"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className={`
                        w-80 bg-[#0b0c15] border-l border-white/5 flex flex-col shrink-0 transition-all duration-300
                        lg:relative lg:translate-x-0
                        ${isMobileSidebarOpen ? 'fixed inset-y-0 right-0 z-50 translate-x-0' : 'fixed translate-x-full lg:translate-x-0'}
                        ${isLowBandwidth ? 'translate-x-full absolute right-0 h-full z-50' : ''}
                    `}>

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="lg:hidden absolute top-2 left-2 p-2 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors z-10"
                        >
                            <X size={18} />
                        </button>

                        {/* Sidebar Tabs */}
                        <div className="flex items-center h-10 border-b border-white/5 bg-[#0f111a]">
                            <button
                                onClick={() => setSidebarTab('videos')}
                                className={`flex-1 h-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors ${sidebarTab === 'videos' ? 'text-indigo-400 bg-[#13151f] border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                            >
                                <Users size={14} /> PEOPLE
                            </button>
                            <button
                                onClick={() => setSidebarTab('chat')}
                                className={`flex-1 h-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors ${sidebarTab === 'chat' ? 'text-indigo-400 bg-[#13151f] border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                            >
                                <MessageSquare size={14} /> CHAT
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-hidden relative">
                            {/* Video List */}
                            <div
                                className="absolute inset-0 w-full h-full overflow-y-auto thin-scrollbar p-2 space-y-2"
                                style={{
                                    display: sidebarTab === 'videos' ? 'block' : 'none',
                                    zIndex: sidebarTab === 'videos' ? 10 : 0
                                }}
                            >
                                <ParticipantVideos isLowBandwidth={isLowBandwidth} />
                            </div>

                            {/* Chat */}
                            <div
                                className="absolute inset-0 w-full h-full"
                                style={{
                                    display: sidebarTab === 'chat' ? 'block' : 'none',
                                    zIndex: sidebarTab === 'chat' ? 10 : 0
                                }}
                            >
                                <Chat />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LiveKitRoom>
    )
}

function NetworkIndicator({ participant }: { participant: any }) {
    const [quality, setQuality] = useState(participant.connectionQuality)

    useEffect(() => {
        const onQualityChanged = (q: any) => setQuality(q)
        participant.on('connectionQualityChanged', onQualityChanged)
        return () => { participant.off('connectionQualityChanged', onQualityChanged) }
    }, [participant])

    if (quality === ConnectionQuality.Excellent || quality === ConnectionQuality.Good) {
        return <Wifi className="w-4 h-4 text-green-500" />
    } else if (quality === ConnectionQuality.Poor) {
        return <Wifi className="w-4 h-4 text-yellow-500" />
    }
    return <WifiOff className="w-4 h-4 text-red-500" />
}



function VideoTile({ track, isLowBandwidth }: { track: any, isLowBandwidth: boolean }) {
    const { localParticipant } = useLocalParticipant()
    const participant = track.participant
    const isLocal = participant.identity === localParticipant.identity

    // Metadata parsing
    const [metadata, setMetadata] = useState<any>({})
    useEffect(() => {
        try {
            if (participant.metadata) {
                setMetadata(JSON.parse(participant.metadata))
            }
        } catch (e) { }
    }, [participant.metadata])

    // Role
    const role = metadata.role || 'participant'

    const toggleMic = async () => {
        if (isLocal) {
            if (localParticipant.isMicrophoneEnabled) {
                await localParticipant.setMicrophoneEnabled(false)
            } else {
                await localParticipant.setMicrophoneEnabled(true)
            }
        }
    }

    const toggleCam = async () => {
        if (isLocal) {
            if (localParticipant.isCameraEnabled) {
                await localParticipant.setCameraEnabled(false)
            } else {
                await localParticipant.setCameraEnabled(true)
            }
        }
    }

    // Explicitly check for camera track
    const camPublication = participant.getTrackPublication(Track.Source.Camera)
    const isCamEnabled = camPublication && camPublication.isSubscribed && !camPublication.isMuted

    return (
        <div className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 shadow-xl group">
            {/* Mirroring local video or Remote Video */}
            {!isLowBandwidth && isCamEnabled ? (
                <VideoTrack
                    trackRef={track}
                    className="w-full h-full object-cover -scale-x-100"
                />
            ) : (
                /* Placeholder if camera off */
                <div className="w-full h-full flex items-center justify-center bg-neutral-900 border-2 border-dashed border-neutral-800 rounded-lg">
                    {metadata.avatarUrl ? (
                        <img
                            src={metadata.avatarUrl}
                            alt={participant.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white/10 shadow-2xl"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-2xl ring-4 ring-white/5">
                            {participant.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                    )}
                </div>
            )}

            {/* Role Overlay */}
            <div className="absolute top-2 left-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg border ${role === 'host' ? 'bg-indigo-600/80 text-white border-indigo-400/50' : 'bg-black/60 text-neutral-300 border-white/10'}`}>
                    {role === 'host' ? 'Teacher' : 'Student'}
                </span>
            </div>

            {/* Network Indicator (Top Right) */}
            <div className="absolute top-2 right-2 z-10">
                <NetworkIndicator participant={participant} />
            </div>

            {/* In-feed Controls (Visible on hover if local) */}
            {isLocal && (
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    <button
                        onClick={toggleMic}
                        className={`p-2.5 rounded-full transition-all hover:scale-110 shadow-lg ${localParticipant.isMicrophoneEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                        title={localParticipant.isMicrophoneEnabled ? "Mute Mic" : "Unmute Mic"}
                    >
                        {localParticipant.isMicrophoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={toggleCam}
                        className={`p-2.5 rounded-full transition-all hover:scale-110 shadow-lg ${localParticipant.isCameraEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                        title={localParticipant.isCameraEnabled ? "Stop Video" : "Start Video"}
                    >
                        {localParticipant.isCameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                </div>
            )}

            {/* Status Indicators */}
            <div className="absolute bottom-2 right-2 flex gap-1.5">
                {!participant.isMicrophoneEnabled && (
                    <div className="p-1.5 bg-red-500/90 backdrop-blur-sm rounded-full shadow-lg border border-red-400/50">
                        <MicOff className="w-3 h-3 text-white" />
                    </div>
                )}
                {!participant.isCameraEnabled && (
                    <div className="p-1.5 bg-neutral-900/90 backdrop-blur-sm rounded-full shadow-lg border border-white/10">
                        <VideoOff className="w-3 h-3 text-white" />
                    </div>
                )}
            </div>

            {/* Small name bottom left (subtle) */}
            <div className="absolute bottom-2 left-2 text-[9px] font-bold text-white/40 uppercase tracking-tighter truncate max-w-[80px]">
                {participant.name}
            </div>
        </div>
    )
}

// Add useRemoteParticipants to imports at the top first, or just use it if available in scope?
// I need to add the import first.
function ParticipantVideos({ isLowBandwidth }: { isLowBandwidth: boolean }) {
    const { localParticipant } = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();
    const screenShareTracks = useTracks([Track.Source.ScreenShare]);

    // We also subscribe to tracks to ensure re-renders when tracks are published/unpublished/muted
    // This is crucial because useRemoteParticipants handles participant list, but not necessarily track state deep updates
    useTracks([Track.Source.Camera, Track.Source.ScreenShare]);

    // Create track references for all participants (Camera source)
    // This ensures we show a tile for everyone, even if camera is off (publication is undefined)
    const cameraTracks = [localParticipant, ...remoteParticipants].map(p => ({
        participant: p,
        source: Track.Source.Camera,
        publication: p.getTrackPublication(Track.Source.Camera)
    }));

    // Sort tracks: Host first, then Moderator, then others
    const sortedTracks = [...cameraTracks, ...screenShareTracks].sort((a, b) => {
        let roleA = 'participant';
        let roleB = 'participant';

        try {
            if (a.participant.metadata) {
                const meta = JSON.parse(a.participant.metadata);
                roleA = meta.role || 'participant';
            }
        } catch (e) { roleA = a.participant.metadata || 'participant' }

        try {
            if (b.participant.metadata) {
                const meta = JSON.parse(b.participant.metadata);
                roleB = meta.role || 'participant';
            }
        } catch (e) { roleB = b.participant.metadata || 'participant' }

        const score = (r: string) => {
            if (r === 'host') return 0;
            if (r === 'moderator') return 1;
            return 2;
        }

        return score(roleA) - score(roleB);
    });

    return (
        <div className="grid grid-cols-1 gap-3">
            {sortedTracks.map((track, i) => (
                <VideoTile
                    key={`${track.participant.identity}-${track.source}-${i}`}
                    track={track}
                    isLowBandwidth={isLowBandwidth}
                />
            ))}
            {sortedTracks.length === 0 && (
                <div className="p-8 text-center bg-neutral-900/50 rounded-xl border border-dashed border-neutral-800">
                    <p className="text-neutral-500 text-xs font-medium">Waiting for participants...</p>
                </div>
            )}
        </div>
    )
}

function RoomHeader({
    meetingName,
    role,
    isRecording,
    onToggleRecording,
    copied,
    onCopyInviteLink,
    onLeave,
    isLowBandwidth,
    onToggleLowBandwidth,
    isTranscribing,
    onEndClass
}: {
    meetingName: string,
    role: string,
    isRecording: boolean,
    onToggleRecording: () => void,
    copied: boolean,
    onCopyInviteLink: () => void,
    onLeave: () => void,
    isLowBandwidth: boolean,
    onToggleLowBandwidth: (state: boolean) => void,
    isTranscribing: boolean,
    onEndClass?: () => Promise<boolean>
}) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [noiseCancellationEnabled, setNoiseCancellationEnabled] = useState(false)
    const [isProcessingNC, setIsProcessingNC] = useState(false)
    const settingsRef = useRef<HTMLDivElement>(null)

    const room = useRoomContext();
    const { localParticipant } = useLocalParticipant();

    const handleBandwidthToggle = async () => {
        const newState = !isLowBandwidth
        onToggleLowBandwidth(newState)

        if (newState && localParticipant) {
            try {
                await localParticipant.setCameraEnabled(false)
            } catch (e) {
                console.error("Failed to disable camera for low bandwidth", e)
            }
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleNoiseCancellation = async (enable: boolean) => {
        if (!room) return;
        setIsProcessingNC(true);
        try {
            if (!localParticipant) return;

            const pub = localParticipant.getTrackPublication(Track.Source.Microphone);
            if (!pub || !pub.track) return;

            const track = pub.track.mediaStreamTrack;

            if (enable) {
                await track.applyConstraints({
                    noiseSuppression: true,
                    echoCancellation: true,
                });
                setNoiseCancellationEnabled(true);
            } else {
                await track.applyConstraints({
                    noiseSuppression: false,
                });
                setNoiseCancellationEnabled(false);
            }
        } catch (e) {
            console.error("Error toggling NC", e);
            toast.error("Failed to toggle noise cancellation. It might not be supported by your device.");
            setNoiseCancellationEnabled(!enable);
        } finally {
            setIsProcessingNC(false);
        }
    };

    return (
        <div className="bg-neutral-900 border-b border-neutral-800 h-14 flex items-center justify-between px-4 z-50 shadow-2xl shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5 group">
                    <div className="relative w-7 h-7 flex items-center justify-center">
                        <div className="orbit-container">
                            <div className="orbiting-dot" />
                        </div>
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-full h-full object-contain relative z-10"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-white" />
                    <span className="font-semibold text-white truncate max-w-[100px] sm:max-w-none">{meetingName}</span>
                    <span className="hidden xs:inline-block text-[10px] bg-white/10 text-neutral-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">{role}</span>
                </div>
                <div className="flex gap-2">
                    {(role === "host" || isRecording) && (
                        <button
                            type="button"
                            disabled={role !== 'host'}
                            onClick={role === "host" ? onToggleRecording : undefined}
                            className={`flex items-center gap-2 text-xs font-semibold py-1.5 px-3 rounded transition-colors border ${isRecording ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-white/10 text-white border-white/5'} ${role === 'host' ? (isRecording ? 'hover:bg-red-500/30 cursor-pointer' : 'hover:bg-white/20 cursor-pointer') : 'cursor-default opacity-100 pointer-events-none'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white'}`} />
                            {/* <span className="hidden sm:inline">{isRecording ? 'Recording...' : 'Record'}</span> */}
                        </button>
                    )}
                    {role === "host" && (
                        <button
                            onClick={onCopyInviteLink}
                            className="flex items-center gap-2 bg-white/10 text-white text-xs font-semibold py-1.5 px-3 rounded hover:bg-white/20 transition-colors border border-white/5"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{copied ? 'Copied Link' : 'Invite'}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleBandwidthToggle}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${isLowBandwidth
                        ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)] border border-blue-400'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'
                        }`}
                    title="Save Data / Improve Connection"
                >
                    {isLowBandwidth ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                    <span className="hidden lg:inline">{isLowBandwidth ? "Low Data Mode" : "Save Data"}</span>
                </button>

                {/* {isTranscribing && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-green-600 text-white shadow-[0_0_10px_rgba(22,163,74,0.5)] border border-green-400">
                        <Captions className="w-3.5 h-3.5 animate-pulse" />
                        <span className="hidden lg:inline">Live Captions Active</span>
                    </div>
                )} */}

                <div className="relative" ref={settingsRef}>
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`p-2 rounded-lg transition-colors border ${isSettingsOpen ? 'bg-white/20 text-white border-white/20' : 'text-neutral-400 hover:text-white hover:bg-white/10 border-transparent'}`}
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>

                    {isSettingsOpen && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-5 z-[100]">
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Audio Settings
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm text-neutral-200 font-medium">Noise Cancellation</span>
                                    </div>
                                    <button
                                        role="switch"
                                        aria-checked={noiseCancellationEnabled}
                                        onClick={() => toggleNoiseCancellation(!noiseCancellationEnabled)}
                                        disabled={isProcessingNC}
                                        className={`
                                            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 ring-offset-neutral-950
                                            ${noiseCancellationEnabled ? 'bg-blue-600' : 'bg-neutral-600'}
                                            ${isProcessingNC ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <span
                                            className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${noiseCancellationEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    {role === 'host' ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all ml-2 flex items-center gap-1"
                                    title="Leave/End Class"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-1 bg-neutral-900 border-neutral-800" align="end">
                                <div className="grid gap-1">
                                    <button
                                        onClick={onLeave}
                                        className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md transition-colors font-medium"
                                    >
                                        Leave Class
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const success = await onEndClass?.()
                                            if (success && room) {
                                                const encoder = new TextEncoder()
                                                const payload = encoder.encode(JSON.stringify({ type: 'room-terminated' }))
                                                try {
                                                    await room.localParticipant.publishData(payload, { reliable: true })
                                                } catch (e) { console.error("Failed to broadcast termination", e) }
                                            }
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-neutral-800 rounded-md transition-colors font-bold"
                                    >
                                        End Class for All
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <button
                            onClick={onLeave}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all ml-2"
                            title="Leave Class"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}


function RoomAudioEffects() {
    // Placeholder for now
    return null
}

function RemoteMuteHandler() {
    // Placeholder for now
    return null
}

function RoomTracker({ participantDbId }: { participantDbId: string | null }) {
    const room = useRoomContext()
    const { localParticipant } = useLocalParticipant()
    const talkTimeRef = useRef(0)
    const intervalRef = useRef<any>(null)
    const isSpeakingRef = useRef(false)
    const lastUpdateRef = useRef(Date.now())

    useEffect(() => {
        if (!room || !localParticipant) return

        const onActiveSpeakersChanged = (speakers: any[]) => {
            const isLocalSpeaking = speakers.some(s => s.identity === localParticipant.identity)

            if (isLocalSpeaking && !isSpeakingRef.current) {
                // Started speaking
                isSpeakingRef.current = true
            } else if (!isLocalSpeaking && isSpeakingRef.current) {
                // Stopped speaking
                isSpeakingRef.current = false
            }
        }

        room.on('activeSpeakersChanged', onActiveSpeakersChanged)

        // Interval to accumulate time if speaking
        intervalRef.current = setInterval(() => {
            if (isSpeakingRef.current) {
                talkTimeRef.current += 1
            }

            // Sync to DB every 10s if changed
            if (Date.now() - lastUpdateRef.current > 10000 && talkTimeRef.current > 0 && participantDbId) {
                supabase.from('meeting_participants')
                    .update({ talk_time_seconds: Math.round(talkTimeRef.current) })
                    .eq('id', participantDbId)
                    .then(() => {
                        lastUpdateRef.current = Date.now()
                    })
            }
        }, 1000)

        return () => {
            room.off('activeSpeakersChanged', onActiveSpeakersChanged)
            if (intervalRef.current) clearInterval(intervalRef.current)

            // Final sync
            if (talkTimeRef.current > 0 && participantDbId) {
                supabase.from('meeting_participants')
                    .update({ talk_time_seconds: Math.round(talkTimeRef.current) })
                    .eq('id', participantDbId)
            }
        }
    }, [room, localParticipant, participantDbId])

    return null
}
function ActiveRoomManager({ meetingId }: { meetingId: string | undefined }) {
    const room = useRoomContext()
    const router = useRouter()

    useEffect(() => {
        if (!room || !meetingId) return

        const handleData = (payload: Uint8Array) => {
            const decoder = new TextDecoder()
            const data = JSON.parse(decoder.decode(payload))

            if (data.type === 'room-terminated') {
                console.log("[ActiveRoomManager] Room terminated by host")
                toast.warning("The host has ended this class.")
                router.push("/dashboard")
            } else if (data.type === 'participant-left-cleanup') {
                console.log("[ActiveRoomManager] Received participant-left signal, triggering refresh")
                // Trigger a custom event that ParticipantList can listen to
                window.dispatchEvent(new CustomEvent('participant-cleanup', {
                    detail: { participantId: data.participantId }
                }))
            }
        }

        const handleParticipantDisconnected = async (participant: any) => {
            console.log("[ActiveRoomManager] Participant disconnected event fired")
            console.log("[ActiveRoomManager] Identity:", participant.identity)
            console.log("[ActiveRoomManager] Name:", participant.name)
            console.log("[ActiveRoomManager] Meeting ID:", meetingId)

            if (!participant.identity) {
                console.warn("[ActiveRoomManager] No identity found, skipping cleanup")
                return
            }

            // Mark as left in Supabase using the identity (which is now the Supabase UUID)
            console.log("[ActiveRoomManager] Attempting to mark participant as left:", participant.identity)
            const { data, error } = await supabase
                .from('meeting_participants')
                .update({ left_at: new Date().toISOString() })
                .eq('id', participant.identity)
                .is('left_at', null)
                .select()

            if (error) {
                console.error("[ActiveRoomManager] Error cleaning up participant:", error)
            } else {
                console.log("[ActiveRoomManager] Successfully marked participant as left:", data)

                // Broadcast a signal to force immediate UI update
                if (room && data && data.length > 0) {
                    const encoder = new TextEncoder()
                    const payload = encoder.encode(JSON.stringify({
                        type: 'participant-left-cleanup',
                        participantId: participant.identity
                    }))
                    try {
                        await room.localParticipant.publishData(payload, { reliable: true })
                        console.log("[ActiveRoomManager] Broadcasted participant-left signal")
                    } catch (e) {
                        console.error("[ActiveRoomManager] Failed to broadcast", e)
                    }
                }
            }
        }

        room.on('dataReceived', handleData)
        room.on('participantDisconnected', handleParticipantDisconnected)

        return () => {
            room.off('dataReceived', handleData)
            room.off('participantDisconnected', handleParticipantDisconnected)
        }
    }, [room, meetingId, router])

    return null
}
