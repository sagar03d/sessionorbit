"use client"

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { getStroke } from 'perfect-freehand'
import { useRoomContext } from '@livekit/components-react'
import { jsPDF } from "jspdf"
import { Download, Image as ImageIcon, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Point {
    x: number
    y: number
    pressure?: number
}

interface Stroke {
    points: Point[]
    color: string
    width: number
}

export interface WhiteboardHandle {
    getStream: () => MediaStream | null;
}

export interface WhiteboardProps {
    meetingId?: string
    boardId?: string // 'main' | 'worksheet' etc
    enableUpload?: boolean
    initialData?: {
        background?: string | null
    }
}

const Whiteboard = forwardRef<WhiteboardHandle, WhiteboardProps>(({ meetingId, boardId = "main", enableUpload = false, initialData }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [currentStroke, setCurrentStroke] = useState<Point[] | null>(null)
    const [strokes, setStrokes] = useState<Stroke[]>([])
    const [backgroundImage, setBackgroundImage] = useState<string | null>(initialData?.background || null)
    const [bgImageObj, setBgImageObj] = useState<HTMLImageElement | null>(null)
    const [color, setColor] = useState('#000000')
    const [width, setWidth] = useState(4)
    const [camera, setCamera] = useState({ x: 0, y: 0, z: 1 })
    const roomContext = useRoomContext()
    const room = roomContext || null
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Load initial state
    useEffect(() => {
        if (!meetingId) return

        const loadState = async () => {
            const { data, error } = await supabase
                .from('meetings')
                .select('whiteboard_data')
                .eq('id', meetingId)
                .single()

            if (data && data.whiteboard_data) {
                const dbData = data.whiteboard_data

                // Legacy: Array (Just strokes, implies 'main' board)
                if (Array.isArray(dbData)) {
                    if (boardId === 'main') {
                        setStrokes(dbData as Stroke[])
                    }
                }
                // New: Object { [boardId]: { strokes: [], background: "..." } }
                else if (typeof dbData === 'object') {
                    const boardData = dbData[boardId]
                    if (boardData) {
                        setStrokes(boardData.strokes || [])
                        if (boardData.background) {
                            setBackgroundImage(boardData.background)
                        }
                    }
                }
            }
        }
        loadState()
    }, [meetingId, boardId])

    // Preload background image object logic
    useEffect(() => {
        if (backgroundImage) {
            const img = new Image()
            img.src = backgroundImage
            img.onload = () => {
                setBgImageObj(img)
            }
        } else {
            setBgImageObj(null)
        }
    }, [backgroundImage])

    // Draw whenever dependencies change (including bg obj)
    // We use a separate effect for drawing to avoid infinite loops if we put draw in dependency of other effects carelessly
    useEffect(() => {
        draw()
    }, [strokes, currentStroke, color, width, bgImageObj, camera])


    const saveToDb = (newStrokes: Stroke[], newBg: string | null) => {
        if (!meetingId) return

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(async () => {
            const { data } = await supabase
                .from('meetings')
                .select('whiteboard_data')
                .eq('id', meetingId)
                .single()

            let currentData = data?.whiteboard_data || {}

            // Handle legacy migration on save
            if (Array.isArray(currentData)) {
                currentData = { main: { strokes: currentData, background: null } }
            }

            // Update specific board
            const updatedData = {
                ...currentData,
                [boardId]: {
                    strokes: newStrokes,
                    background: newBg
                }
            }

            await supabase
                .from('meetings')
                .update({ whiteboard_data: updatedData })
                .eq('id', meetingId)
        }, 2000)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                // Resize if too big (Max width 1280px)
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
                setBackgroundImage(dataUrl)
                saveToDb(strokes, dataUrl)
            }
            img.src = event.target?.result as string
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.save()
        ctx.translate(camera.x, camera.y)
        ctx.scale(camera.z, camera.z)

        if (bgImageObj) {
            // Draw background at World (0,0) with intrinsic size
            // This decouples it from viewport size (infinite canvas behavior)
            ctx.drawImage(bgImageObj, 0, 0, bgImageObj.width, bgImageObj.height)
        }

        // Draw completed strokes
        strokes.forEach((stroke) => {
            const outlinePoints = getStroke(stroke.points, {
                size: stroke.width,
                thinning: 0.5,
                smoothing: 0.8,
                streamline: 0.65,
                easing: (t) => t,
                start: { taper: 0, cap: true },
                end: { taper: 0, cap: true },
            })

            ctx.fillStyle = stroke.color
            ctx.beginPath()
            const firstPoint = outlinePoints[0]
            if (firstPoint) {
                ctx.moveTo(firstPoint[0], firstPoint[1])
                for (let i = 1; i < outlinePoints.length; i++) {
                    ctx.lineTo(outlinePoints[i][0], outlinePoints[i][1])
                }
            }
            ctx.fill()
        })

        // Draw current stroke
        if (currentStroke) {
            const outlinePoints = getStroke(currentStroke, {
                size: width,
                thinning: 0.5,
                smoothing: 0.8,
                streamline: 0.65,
                easing: (t) => t,
                start: { taper: 0, cap: true },
                end: { taper: 0, cap: true },
            })

            ctx.fillStyle = color
            ctx.beginPath()
            const firstPoint = outlinePoints[0]
            if (firstPoint) {
                ctx.moveTo(firstPoint[0], firstPoint[1])
                for (let i = 1; i < outlinePoints.length; i++) {
                    ctx.lineTo(outlinePoints[i][0], outlinePoints[i][1])
                }
            }
            ctx.fill()
        }

        ctx.restore()
    }, [strokes, currentStroke, color, width, bgImageObj, camera])

    useImperativeHandle(ref, () => ({
        getStream: () => {
            const canvas = canvasRef.current;
            if (!canvas) return null;

            // Create a virtual canvas for composition
            const compositeCanvas = document.createElement('canvas');
            const SIDEBAR_WIDTH = 288; // w-72 = 18rem = 288px
            const logicalWidth = canvas.clientWidth;
            const logicalHeight = canvas.clientHeight;

            compositeCanvas.width = logicalWidth + SIDEBAR_WIDTH;
            compositeCanvas.height = logicalHeight;

            const ctx = compositeCanvas.getContext('2d');
            if (!ctx) return null;

            let animationFrameId: number;
            let lastDrawTime = 0;
            const FPS = 20;
            const INTERVAL = 1000 / FPS;

            const render = (timestamp: number) => {
                if (compositeCanvas.captureStream(FPS).getTracks().every(t => t.readyState === 'ended')) {
                    cancelAnimationFrame(animationFrameId);
                    return;
                }

                const elapsed = timestamp - lastDrawTime;

                if (elapsed > INTERVAL) {
                    lastDrawTime = timestamp - (elapsed % INTERVAL);

                    // 1. Draw Whiteboard (with white background)
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);

                    // Draw source (contains BG + Strokes)
                    ctx.drawImage(canvas, 0, 0, logicalWidth, logicalHeight);

                    // 2. Draw Sidebar Background
                    ctx.fillStyle = '#171717';
                    ctx.fillRect(logicalWidth, 0, SIDEBAR_WIDTH, logicalHeight);

                    // 3. Draw "Live Feeds" Header
                    ctx.fillStyle = '#a3a3a3';
                    ctx.font = 'bold 12px sans-serif';
                    ctx.fillText("LIVE FEEDS", logicalWidth + 16, 30);

                    // 4. Draw Video Elements
                    const videoElements = Array.from(document.querySelectorAll('video'));
                    let yOffset = 50;
                    const PADDING = 12;
                    const VIDEO_HEIGHT = 150;
                    const VIDEO_WIDTH = SIDEBAR_WIDTH - (PADDING * 2);

                    videoElements.forEach((video, index) => {
                        if (yOffset + VIDEO_HEIGHT > compositeCanvas.height) return;
                        try {
                            const rect = video.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0) {
                                ctx.drawImage(video, logicalWidth + PADDING, yOffset, VIDEO_WIDTH, VIDEO_HEIGHT);
                                yOffset += VIDEO_HEIGHT + PADDING;
                            }
                        } catch (e) { /* ignore */ }
                    });
                }
                animationFrameId = requestAnimationFrame(render);
            };
            animationFrameId = requestAnimationFrame(render);

            const stream = compositeCanvas.captureStream(FPS);
            return stream;
        }
    }));

    const screenToWorld = (x: number, y: number) => {
        return {
            x: (x - camera.x) / camera.z,
            y: (y - camera.y) / camera.z
        }
    }

    const handlePointerDown = (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const screenX = e.clientX - rect.left
        const screenY = e.clientY - rect.top

        // Prevent drawing if panning (e.g. middle mouse or special mode - though we used Wheel for pan, basic Pointer is for draw)
        // Check for right click or special keys if we wanted pan-drag

        const { x, y } = screenToWorld(screenX, screenY)

        setCurrentStroke([{ x, y, pressure: e.pressure }])
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!currentStroke) return
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const screenX = e.clientX - rect.left
        const screenY = e.clientY - rect.top

        const { x, y } = screenToWorld(screenX, screenY)

        setCurrentStroke([...currentStroke, { x, y, pressure: e.pressure }])
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!currentStroke) return // Prevent empty strokes

        const newStroke = { points: currentStroke, color, width }
        const newStrokes = [...strokes, newStroke]

        setStrokes(newStrokes)
        setCurrentStroke(null)

        saveToDb(newStrokes, backgroundImage)

        // Broadcast if we had real-time sync (omitted for brevity/focus on background feature)
        if (room) {
            const encoder = new TextEncoder()
            const payload = encoder.encode(JSON.stringify({
                type: 'whiteboard-stroke',
                stroke: newStroke
            }))
            room.localParticipant.publishData(payload, { reliable: true })
        }
    }

    // Handle Resize
    // Handle Resize
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !canvas.parentElement) return

        const parent = canvas.parentElement

        const handleResize = () => {
            if (parent.clientWidth > 0 && parent.clientHeight > 0) {
                canvas.width = parent.clientWidth
                canvas.height = parent.clientHeight
                draw()
            }
        }

        // Initial resize
        handleResize()

        const resizeObserver = new ResizeObserver(() => {
            handleResize()
        })

        resizeObserver.observe(parent)

        return () => {
            resizeObserver.disconnect()
        }
    }, [draw])

    // PDF
    const downloadPDF = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'l' : 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(`whiteboard-${meetingId || 'download'}.pdf`);
    };

    const clearBoard = () => {
        if (confirm("Clear entire board? This will remove the background and all strokes.")) {
            setStrokes([]);
            setBackgroundImage(null);
            setBgImageObj(null);

            // Send empty data
            saveToDb([], null);

            if (room) {
                const encoder = new TextEncoder()
                const payload = encoder.encode(JSON.stringify({ type: 'whiteboard-clear' }))
                room.localParticipant.publishData(payload, { reliable: true })
            }
        }
    };

    // LiveKit Data Handling
    useEffect(() => {
        if (!room) return

        const handleData = (payload: Uint8Array) => {
            const decoder = new TextDecoder()
            const data = JSON.parse(decoder.decode(payload))

            // Simplified: All broadcast strokes apply to current view
            if (data.type === 'whiteboard-full') {
                setStrokes(data.strokes)
            } else if (data.type === 'whiteboard-stroke') {
                setStrokes(s => [...s, data.stroke])
            } else if (data.type === 'whiteboard-clear') {
                setStrokes([])
            }
        }

        room.on('dataReceived', handleData)
        return () => { room.off('dataReceived', handleData) }
    }, [room])


    return (
        <div className="relative w-full h-full bg-white group select-none touch-none">
            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-sm p-3 rounded-full shadow-xl border border-white/10 z-50 transition-opacity opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                    <button onClick={() => setColor('#000000')} className={`w-6 h-6 rounded-full border-2 ${color === '#000000' ? 'border-white scale-110' : 'border-transparent hover:scale-105'} bg-black transition-transform`} />
                    <button onClick={() => setColor('#ef4444')} className={`w-6 h-6 rounded-full border-2 ${color === '#ef4444' ? 'border-white scale-110' : 'border-transparent hover:scale-105'} bg-red-500 transition-transform`} />
                    <button onClick={() => setColor('#3b82f6')} className={`w-6 h-6 rounded-full border-2 ${color === '#3b82f6' ? 'border-white scale-110' : 'border-transparent hover:scale-105'} bg-blue-500 transition-transform`} />
                    <button onClick={() => setColor('#22c55e')} className={`w-6 h-6 rounded-full border-2 ${color === '#22c55e' ? 'border-white scale-110' : 'border-transparent hover:scale-105'} bg-green-500 transition-transform`} />
                </div>

                <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
                    <button onClick={() => setWidth(2)} className={`p-2 rounded-lg ${width === 2 ? 'bg-white/20' : 'hover:bg-white/10 text-neutral-400'}`}>
                        <div className="w-1 h-1 bg-current rounded-full" />
                    </button>
                    <button onClick={() => setWidth(4)} className={`p-2 rounded-lg ${width === 4 ? 'bg-white/20' : 'hover:bg-white/10 text-neutral-400'}`}>
                        <div className="w-2 h-2 bg-current rounded-full" />
                    </button>
                    <button onClick={() => setWidth(8)} className={`p-2 rounded-lg ${width === 8 ? 'bg-white/20' : 'hover:bg-white/10 text-neutral-400'}`}>
                        <div className="w-3 h-3 bg-current rounded-full" />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    {/* Upload Button */}
                    {enableUpload && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Upload Worksheet (Image)"
                            >
                                <ImageIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    <button
                        onClick={clearBoard}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Clear Board"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={downloadPDF}
                        className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Download PDF"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="w-full h-full block cursor-crosshair active:cursor-crosshair"
                onWheel={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect()
                    if (!rect) return

                    e.preventDefault()

                    // Standard Scroll: Inverted logic (Scrolling Down = Moving Camera Down = Seeing stuff below)
                    setCamera(c => ({
                        ...c,
                        x: c.x + e.deltaX,
                        y: c.y + e.deltaY // Previously minus, now plus for "Scroll" feel
                    }))
                }}
                style={{ touchAction: 'none' }}
            />
        </div>
    )
})

Whiteboard.displayName = 'Whiteboard'

export default Whiteboard
