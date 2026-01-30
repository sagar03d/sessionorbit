"use client"

import { useEffect, useState, use, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
    LiveKitRoom,
    useLocalParticipant,
    useRoomContext,
    useTracks,
    VideoTrack,
} from "@livekit/components-react"
import "@livekit/components-styles"
import { Track } from "livekit-client"
import { Copy, Check, Users, Layout, Video, LogOut, VideoOff, Mic, MicOff, Settings, Wifi, WifiOff, FileText, Image as ImageIcon, Plus, Link as LinkIcon, Globe, X, Captions, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Whiteboard, { WhiteboardHandle } from "../../components/Whiteboard"
import ExcalidrawBoard from "../../components/ExcalidrawBoard"
import CodeEditor from "../../components/CodeEditor"
import PreJoinScreen from "../../components/PreJoinScreen"

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
                alert("This class has ended.")
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
                        alert("The host has ended this class.")
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
            const { data: { user } } = await supabase.auth.getUser()

            const { data: meetingData, error: meetingError } = await supabase
                .from('meetings')
                .select('*')
                .or(`host_code.eq.${roomCode},moderator_code.eq.${roomCode},participant_code.eq.${roomCode}`)
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

            const displayName = user ? (
                (await supabase.from('profiles').select('full_name').eq('id', user.id).single()).data?.full_name || user.email || "User"
            ) : ""

            setName(displayName)
            fetchToken(meetingData.id, displayName, userRole)
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
        if (!hasJoinedRoom || !SpeechRecognition || !isTranscribing) return;

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
                        alert("Speech recognition permission denied. Please allow microphone access for captions.");
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


    const fetchToken = async (roomId: string, displayName: string, userRole: string, identity?: string) => {
        setIsJoining(true)
        try {
            let url = `/api/livekit/token?room=${roomId}&username=${encodeURIComponent(displayName)}&role=${userRole}`
            if (identity) {
                url += `&identity=${encodeURIComponent(identity)}`
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

    const handlePreJoin = async (enteredName: string, mic: boolean, cam: boolean, audioDeviceId?: string, videoDeviceId?: string) => {
        setPreJoinChoices({ mic, cam, audioDeviceId, videoDeviceId })
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
                if (meeting.host_code === roomCode) joinRole = "host"
                else if (meeting.moderator_code === roomCode) joinRole = "moderator"

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

            // Step 2: Fetch token using the UUID as identity
            // This ensures LiveKit identity === Supabase meeting_participants.id
            await fetchToken(meeting.id, finalName, calculatedRole, pId || undefined)

            // Step 3: Trigger join
            setHasJoinedRoom(true)
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
            alert("Failed to save tab. You might not have permission.")
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
            alert("Failed to close tab.")
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

        const { error } = await supabase
            .from('meetings')
            .update({ ended_at: new Date().toISOString() })
            .eq('id', meeting.id)

        if (error) {
            console.error("Failed to end class", error)
            alert("Failed to end class. Please try again.")
            return false
        } else {
            router.push("/dashboard")
            return true
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
                alert("Failed to start cloud recording: " + (data.error || "Unknown error"));
                setIsRecording(false);
            } else {
                console.log("Cloud recording started:", data.egressId);
            }
        } catch (err) {
            console.error("Error starting recording:", err);
            setIsRecording(false);
            alert("Network error starting recording");
        }
    };

    const stopRecording = async () => {
        if (!meeting || role !== 'host') return;

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
                alert("Recording stopped. It will be processed shortly.");
            } else {
                console.error("Failed to stop recording", data);
                alert("Failed to stop recording: " + data.error);
            }
        } catch (e) {
            console.error(e);
            alert("Error stopping recording");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <p>Connecting to classroom...</p>
            </div>
        )
    }

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
            <RoomHeader
                meetingName={meeting?.name || "Classroom"}
                role={role}
                isRecording={isRecording}
                onToggleRecording={isRecording ? stopRecording : startRecording}
                copied={copied}
                onCopyInviteLink={copyInviteLink}
                onLeave={() => {
                    if (role === 'participant') {
                        if (confirm("Are you sure you want to leave this class?")) {
                            router.push(`/feedback?meeting_id=${meeting?.id}&participant_id=${participantDbId}`)
                        }
                    } else {
                        router.push("/dashboard")
                    }
                }}
                onEndClass={handleEndClass}
                isLowBandwidth={isLowBandwidth}
                onToggleLowBandwidth={setIsLowBandwidth}
                isTranscribing={isTranscribing}
            />

            <div className="flex-1 relative bg-white overflow-hidden flex flex-row min-h-0" style={{ height: '-webkit-fill-available' } as React.CSSProperties}>
                <RoomAudioEffects />
                <RoomTracker participantDbId={participantDbId} />
                <RemoteMuteHandler />
                <ActiveRoomManager meetingId={meeting?.id} />

                {/* Main Content Area */}
                <div className="flex-1 relative bg-white overflow-hidden h-full min-w-0 flex flex-col">
                    {/* Tabs Bar */}
                    <div className="h-10 bg-neutral-100 border-b border-neutral-200 flex items-center px-4 gap-2 shrink-0 overflow-x-auto thin-scrollbar z-10">
                        {tabs.map(tab => (
                            <div
                                key={tab.id}
                                className={`flex items-center gap-2 h-full px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTabId === tab.id ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}
                            >
                                <button
                                    onClick={() => setActiveTabId(tab.id)}
                                    className="flex items-center gap-2 h-full"
                                >
                                    {tab.type === 'whiteboard' ? <Layout className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                                    {tab.title}
                                </button>
                                {tab.id !== 'main' && role === 'host' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeTab(tab.id)
                                        }}
                                        className="ml-1 p-0.5 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-red-500 transition-colors"
                                        title="Close Tab"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Plus Button */}
                        {role === 'host' && (
                            <div className="relative ml-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors"
                                            title="Add New Tab"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-0" align="start">
                                        <div className="flex flex-col py-1 bg-white rounded-lg">
                                            <button
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                                                onClick={() => { fileInputRef.current?.click(); }}
                                            >
                                                <ImageIcon className="w-4 h-4" />
                                                Worksheet (Image)
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                                                onClick={handleEmbedUrl}
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                                Embed URL
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-neutral-700 border-t border-neutral-100 mt-1"
                                                onClick={() => addNewTabWrapper('code')}
                                            >
                                                <Code2 className="w-4 h-4" />
                                                New Code Tab
                                            </button>
                                            {/* <button
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-neutral-700 border-t border-neutral-100 mt-1"
                                                onClick={() => addNewTabWrapper('excalidraw')}
                                            >
                                                <Layout className="w-4 h-4" />
                                                Infinite Whiteboard
                                            </button> */}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUploadForTab}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 relative w-full h-full">
                        {tabs.map(tab => {
                            if (tab.type === 'whiteboard') {
                                // Render Whiteboard (Hidden if not active to preserve state)
                                const isVisible = activeTabId === tab.id
                                return (
                                    <div
                                        key={tab.id}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ display: isVisible ? 'block' : 'none', visibility: isVisible ? 'visible' : 'hidden' }}
                                    >
                                        <Whiteboard
                                            ref={(el) => {
                                                if (el) whiteboardRefs.current[tab.id] = el
                                            }}
                                            meetingId={meeting?.id}
                                            boardId={tab.boardId || 'main'}
                                            enableUpload={localCanWrite}
                                            canWrite={localCanWrite}
                                            initialData={tab.initialData}
                                        />
                                    </div>
                                )
                            } else if (tab.type === 'code') {
                                // Render Code Editor (Hidden if not active to preserve state)
                                const isVisible = activeTabId === tab.id
                                return (
                                    <div
                                        key={tab.id}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ display: isVisible ? 'block' : 'none', visibility: isVisible ? 'visible' : 'hidden' }}
                                    >
                                        <CodeEditor
                                            meetingId={meeting?.id}
                                            boardId={tab.boardId || tab.id}
                                            canWrite={localCanWrite}
                                            initialData={tab.initialData as any}
                                        />
                                    </div>
                                )
                            } else if (tab.type === 'excalidraw') {
                                // Render Excalidraw Board
                                const isVisible = activeTabId === tab.id
                                return (
                                    <div
                                        key={tab.id}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ display: isVisible ? 'block' : 'none', visibility: isVisible ? 'visible' : 'hidden' }}
                                    >
                                        <ExcalidrawBoard
                                            meetingId={meeting?.id}
                                            boardId={tab.boardId || tab.id}
                                            canWrite={localCanWrite}
                                            initialData={tab.initialData as any}
                                        />
                                    </div>
                                )
                            } else if (tab.type === 'embed') {
                                if (activeTabId !== tab.id) return null
                                return (
                                    <div key={tab.id} className="absolute inset-0 w-full h-full bg-neutral-100 flex flex-col">
                                        <iframe
                                            src={tab.src}
                                            className="w-full h-full border-none"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>

                {/* Video Sidebar */}
                <div className="hidden sm:flex w-72 border-l border-neutral-800 bg-neutral-900 flex-col shrink-0 h-full z-20 shadow-xl overflow-hidden">
                    <div className="flex-1 overflow-y-auto thin-scrollbar bg-neutral-950">
                        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 shrink-0">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                <Video className="w-3.5 h-3.5" />
                                Live Feeds
                            </h3>
                        </div>
                        <div className="p-3 space-y-3">
                            <ParticipantVideos role={role} isLowBandwidth={isLowBandwidth} />
                        </div>

                        <div className="p-4 border-y border-neutral-800 flex justify-between items-center bg-neutral-900 shrink-0">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-3.5 h-3.5" />
                                Participants
                            </h3>
                        </div>
                        <div className="p-3">
                            <ParticipantList meetingId={meeting?.id} currentRole={role} />
                        </div>
                    </div>
                </div>
            </div>
        </LiveKitRoom>
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
            alert("Failed to toggle noise cancellation. It might not be supported by your device.");
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
                {role === "host" && (
                    <div className="flex gap-2">
                        <button
                            onClick={onToggleRecording}
                            className={`flex items-center gap-2 text-xs font-semibold py-1.5 px-3 rounded transition-colors border ${isRecording ? 'bg-red-500/20 text-red-500 border-red-500/20 hover:bg-red-500/30' : 'bg-white/10 text-white border-white/5 hover:bg-white/20'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white'}`} />
                            <span className="hidden sm:inline">{isRecording ? 'Recording...' : 'Record'}</span>
                        </button>
                        <button
                            onClick={onCopyInviteLink}
                            className="flex items-center gap-2 bg-white/10 text-white text-xs font-semibold py-1.5 px-3 rounded hover:bg-white/20 transition-colors border border-white/5"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{copied ? 'Copied Link' : 'Invite'}</span>
                        </button>
                    </div>
                )}
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

function ParticipantVideos({ role, isLowBandwidth }: { role: string, isLowBandwidth: boolean }) {
    const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare])

    return (
        <div className="grid grid-cols-1 gap-2">
            {tracks.map(track => (
                <div key={track.participant.identity} className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                    {!isLowBandwidth && <VideoTrack trackRef={track} className="w-full h-full object-cover" />}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {track.participant.name || track.participant.identity}
                    </div>
                </div>
            ))}
            {tracks.length === 0 && (
                <div className="p-4 text-center text-neutral-500 text-xs italic">
                    No active video feeds
                </div>
            )}
        </div>
    )
}

function ParticipantList({ meetingId, currentRole }: { meetingId: string | undefined, currentRole: string }) {
    const [participants, setParticipants] = useState<any[]>([])
    const room = useRoomContext()

    const fetchParticipants = useCallback(async () => {
        if (!meetingId) return
        console.log("[ParticipantList] Fetching participants for meeting:", meetingId)
        const { data, error } = await supabase
            .from('meeting_participants')
            .select('*')
            .eq('meeting_id', meetingId)
            .is('left_at', null)
            .order('joined_at', { ascending: true })

        if (error) {
            console.error("[ParticipantList] Error fetching participants:", error)
        } else {
            console.log("[ParticipantList] Fetched participants:", data)
            setParticipants(data || [])
        }
    }, [meetingId])

    useEffect(() => {
        if (!meetingId || !room) return

        fetchParticipants()

        const channel = supabase.channel(`participants_list_${meetingId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'meeting_participants',
                filter: `meeting_id=eq.${meetingId}`
            }, (payload) => {
                console.log("[ParticipantList] Supabase subscription event received:", payload.eventType, payload)
                fetchParticipants()
            })
            .subscribe((status) => {
                console.log("[ParticipantList] Subscription status:", status)
            })

        // Fallback: Listen to LiveKit events to refresh (with delay to allow DB commit)
        const handleParticipantConnected = () => {
            console.log("[ParticipantList] LiveKit participantConnected event")
            fetchParticipants()
        }

        const handleParticipantDisconnected = () => {
            console.log("[ParticipantList] LiveKit participantDisconnected event")
            // Add small delay to allow database update to complete
            setTimeout(() => {
                fetchParticipants()
            }, 500)
        }

        // Listen for custom cleanup event for immediate updates
        const handleCleanupEvent = (event: any) => {
            console.log("[ParticipantList] Received participant-cleanup event:", event.detail)
            fetchParticipants()
        }

        room.on('participantConnected', handleParticipantConnected)
        room.on('participantDisconnected', handleParticipantDisconnected)
        window.addEventListener('participant-cleanup', handleCleanupEvent)

        return () => {
            supabase.removeChannel(channel)
            room.off('participantConnected', handleParticipantConnected)
            room.off('participantDisconnected', handleParticipantDisconnected)
            window.removeEventListener('participant-cleanup', handleCleanupEvent)
        }
    }, [meetingId, room, fetchParticipants])

    const toggleWriteAccess = async (participantId: string, currentVal: boolean) => {
        if (currentRole !== 'host') return
        const { error } = await supabase
            .from('meeting_participants')
            .update({ can_write: !currentVal })
            .eq('id', participantId)

        if (error) {
            console.error("Failed to toggle write access", error)
        } else {
            fetchParticipants()
        }
    }

    return (
        <div className="space-y-2">
            {participants.map(p => (
                <div key={p.id} className={`flex items-center justify-between p-2 rounded border transition-colors ${p.left_at ? 'bg-neutral-900/10 border-neutral-900/20 opacity-50' : 'bg-neutral-900/50 border-neutral-800'}`}>
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-neutral-200">{p.name}</span>
                            <div className="flex items-center gap-2">
                                {currentRole === 'host' && p.role !== 'host' && !p.left_at && (
                                    <button
                                        onClick={() => toggleWriteAccess(p.id, p.can_write)}
                                        className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${p.can_write ? 'bg-blue-600 border-blue-400 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                                        title={p.can_write ? "Revoke Write Access" : "Grant Write Access"}
                                    >
                                        {p.can_write ? 'CAN WRITE' : 'READ ONLY'}
                                    </button>
                                )}
                                <span className="text-[10px] text-neutral-500 uppercase font-bold">{p.role}</span>
                            </div>
                        </div>
                        <div className="flex flex-col text-[9px] text-neutral-500">
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                Joined: {new Date(p.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {p.left_at && (
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                    Left: {new Date(p.left_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {participants.length === 0 && (
                <p className="text-center text-neutral-600 text-xs py-4">No other participants</p>
            )}
        </div>
    )
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
                alert("The host has ended this class.")
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
