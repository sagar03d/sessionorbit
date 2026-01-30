"use client"

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { getStroke } from 'perfect-freehand'
import { useRoomContext } from '@livekit/components-react'
import { jsPDF } from "jspdf"
import {
    Download,
    Image as ImageIcon,
    Trash2,
    MousePointer2,
    Hand,
    Pencil,
    Highlighter,
    Eraser,
    Square,
    Circle,
    Triangle,
    Type as TypeIcon,
    StickyNote,
    Undo2,
    Redo2,
    ZoomIn,
    ZoomOut,
    Minus,
    Plus,
    Maximize,
    Upload
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Point {
    x: number
    y: number
    pressure?: number
}

type ElementType = 'pencil' | 'highlighter' | 'eraser' | 'rect' | 'circle' | 'triangle' | 'text' | 'sticky';

interface WhiteboardElement {
    id: string
    type: ElementType
    points?: Point[] // For pencil, highlighter
    x: number // Start X or Position X
    y: number // Start Y or Position Y
    endX?: number // For shapes
    endY?: number // For shapes
    width?: number // For shapes, sticky
    height?: number // For shapes, sticky
    color: string
    strokeWidth: number
    text?: string
    opacity?: number
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
    canWrite?: boolean
}

const Whiteboard = forwardRef<WhiteboardHandle, WhiteboardProps>(({ meetingId, boardId = "main", enableUpload = false, canWrite = false, initialData }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [elements, setElements] = useState<WhiteboardElement[]>([])
    const [currentElement, setCurrentElement] = useState<WhiteboardElement | null>(null)
    const [history, setHistory] = useState<WhiteboardElement[][]>([])
    const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([])

    const [backgroundImage, setBackgroundImage] = useState<string | null>(initialData?.background || null)
    const [bgImageObj, setBgImageObj] = useState<HTMLImageElement | null>(null)

    const [selectedTool, setSelectedTool] = useState<ElementType | 'hand' | 'select'>('pencil')
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

                // Legacy migration handled here
                if (Array.isArray(dbData)) {
                    if (boardId === 'main') {
                        setElements(dbData as any)
                    }
                }
                else if (typeof dbData === 'object') {
                    const boardData = dbData[boardId]
                    if (boardData) {
                        setElements(boardData.elements || boardData.strokes || [])
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

    // Draw whenever dependencies change
    useEffect(() => {
        draw()
    }, [elements, currentElement, color, width, bgImageObj, camera])


    const saveToDb = (newElements: WhiteboardElement[], newBg: string | null) => {
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

            if (Array.isArray(currentData)) {
                currentData = { main: { elements: currentData, background: null } }
            }

            const updatedData = {
                ...currentData,
                [boardId]: {
                    elements: newElements,
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
                saveToDb(elements, dataUrl)
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
            ctx.drawImage(bgImageObj, 0, 0, bgImageObj.width, bgImageObj.height)
        }

        const renderElement = (element: WhiteboardElement) => {
            ctx.strokeStyle = element.color
            ctx.fillStyle = element.color
            ctx.lineWidth = element.strokeWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.globalAlpha = element.opacity || 1

            if (element.type === 'pencil' || element.type === 'highlighter' || element.type === 'eraser') {
                if (!element.points || element.points.length === 0) return

                if (element.type === 'eraser') {
                    ctx.strokeStyle = '#ffffff'
                    ctx.fillStyle = '#ffffff'
                }

                const outlinePoints = getStroke(element.points, {
                    size: element.strokeWidth,
                    thinning: element.type === 'pencil' ? 0.5 : 0,
                    smoothing: 0.8,
                    streamline: 0.65,
                })

                ctx.beginPath()
                const firstPoint = outlinePoints[0]
                if (firstPoint) {
                    ctx.moveTo(firstPoint[0], firstPoint[1])
                    for (let i = 1; i < outlinePoints.length; i++) {
                        ctx.lineTo(outlinePoints[i][0], outlinePoints[i][1])
                    }
                }
                ctx.fill()
            } else if (element.type === 'rect') {
                const x = Math.min(element.x, element.endX ?? element.x)
                const y = Math.min(element.y, element.endY ?? element.y)
                const w = Math.abs((element.endX ?? element.x) - element.x)
                const h = Math.abs((element.endY ?? element.y) - element.y)
                ctx.strokeRect(x, y, w, h)
            } else if (element.type === 'circle') {
                const rx = Math.abs((element.endX ?? element.x) - element.x)
                const ry = Math.abs((element.endY ?? element.y) - element.y)
                const radius = Math.sqrt(rx * rx + ry * ry)
                ctx.beginPath()
                ctx.arc(element.x, element.y, radius, 0, Math.PI * 2)
                ctx.stroke()
            } else if (element.type === 'triangle') {
                ctx.beginPath()
                ctx.moveTo(element.x, element.y)
                ctx.lineTo(element.endX ?? element.x, element.endY ?? element.y)
                ctx.lineTo(element.x - ((element.endX ?? element.x) - element.x), element.endY ?? element.y)
                ctx.closePath()
                ctx.stroke()
            } else if (element.type === 'text' || element.type === 'sticky') {
                if (element.type === 'sticky') {
                    ctx.fillStyle = element.color + '33' // Light background
                    ctx.fillRect(element.x - 40, element.y - 40, 80, 80)
                    ctx.strokeStyle = element.color
                    ctx.strokeRect(element.x - 40, element.y - 40, 80, 80)
                    ctx.fillStyle = element.color
                }
                ctx.font = `${element.strokeWidth * 4}px sans-serif`
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(element.text || "", element.x, element.y)
            }
        }

        elements.forEach(renderElement)
        if (currentElement) renderElement(currentElement)

        ctx.restore()
    }, [elements, currentElement, bgImageObj, camera])

    useImperativeHandle(ref, () => ({
        getStream: () => {
            const canvas = canvasRef.current;
            if (!canvas) return null;

            const compositeCanvas = document.createElement('canvas');
            const SIDEBAR_WIDTH = 288;
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

                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);

                    // Re-draw the canvas content into the composite
                    // Since draw() is already optimized, we can just use the source canvas
                    ctx.drawImage(canvas, 0, 0, logicalWidth, logicalHeight);

                    ctx.fillStyle = '#171717';
                    ctx.fillRect(logicalWidth, 0, SIDEBAR_WIDTH, logicalHeight);

                    ctx.fillStyle = '#a3a3a3';
                    ctx.font = 'bold 12px sans-serif';
                    ctx.fillText("LIVE FEEDS", logicalWidth + 16, 30);

                    const videoElements = Array.from(document.querySelectorAll('video'));
                    let yOffset = 50;
                    const PADDING = 12;
                    const VIDEO_HEIGHT = 150;
                    const VIDEO_WIDTH = SIDEBAR_WIDTH - (PADDING * 2);

                    videoElements.forEach((video) => {
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
        if (!canWrite) return
        e.currentTarget.setPointerCapture(e.pointerId)
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const screenX = e.clientX - rect.left
        const screenY = e.clientY - rect.top

        const { x, y } = screenToWorld(screenX, screenY)

        if (selectedTool === 'hand') return

        const id = Math.random().toString(36).substring(7)

        let type = selectedTool as ElementType
        let defaultText = ""
        if (type === 'text') defaultText = "Text"
        if (type === 'sticky') defaultText = "Note"

        const newElement: WhiteboardElement = {
            id,
            type,
            x,
            y,
            endX: x,
            endY: y,
            color,
            strokeWidth: width,
            points: (type === 'pencil' || type === 'highlighter' || type === 'eraser') ? [{ x, y, pressure: e.pressure }] : undefined,
            opacity: type === 'highlighter' ? 0.4 : 1,
            text: (type === 'text' || type === 'sticky') ? prompt("Enter text:", defaultText) || defaultText : undefined
        }

        if ((type === 'text' || type === 'sticky') && !newElement.text) {
            // Cancel insertion if no text
            return
        }

        setCurrentElement(newElement)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        const screenX = e.clientX - rect.left
        const screenY = e.clientY - rect.top

        if (selectedTool === 'hand' && e.buttons === 1) {
            setCamera(c => ({
                ...c,
                x: c.x + e.movementX,
                y: c.y + e.movementY
            }))
            return
        }

        if (!currentElement || !canWrite) return

        const { x, y } = screenToWorld(screenX, screenY)

        if (currentElement.points) {
            setCurrentElement({
                ...currentElement,
                points: [...currentElement.points, { x, y, pressure: e.pressure }]
            })
        } else {
            setCurrentElement({
                ...currentElement,
                endX: x,
                endY: y
            })
        }
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!currentElement) return

        const newElements = [...elements, currentElement]
        setHistory([...history, elements])
        setRedoStack([])
        setElements(newElements)
        setCurrentElement(null)

        saveToDb(newElements, backgroundImage)

        if (room) {
            const encoder = new TextEncoder()
            const payload = encoder.encode(JSON.stringify({
                type: 'whiteboard-stroke',
                boardId,
                stroke: currentElement
            }))
            room.localParticipant.publishData(payload, { reliable: true })
        }
    }

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

        handleResize()

        const resizeObserver = new ResizeObserver(() => {
            handleResize()
        })

        resizeObserver.observe(parent)

        return () => {
            resizeObserver.disconnect()
        }
    }, [draw])

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
        if (confirm("Clear entire board? This will remove the background and all elements.")) {
            setHistory([...history, elements]);
            setRedoStack([]);
            setElements([]);
            setBackgroundImage(null);
            setBgImageObj(null);
            saveToDb([], null);

            if (room) {
                const encoder = new TextEncoder()
                const payload = encoder.encode(JSON.stringify({
                    type: 'whiteboard-clear',
                    boardId
                }))
                room.localParticipant.publishData(payload, { reliable: true })
            }
        }
    };

    const undo = () => {
        if (history.length === 0) return;
        const previous = history[history.length - 1];
        const newHistory = history.slice(0, -1);
        setRedoStack([elements, ...redoStack]);
        setElements(previous);
        setHistory(newHistory);
        saveToDb(previous, backgroundImage);
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const next = redoStack[0];
        const newRedoStack = redoStack.slice(1);
        setHistory([...history, elements]);
        setElements(next);
        setRedoStack(newRedoStack);
        saveToDb(next, backgroundImage);
    };

    useEffect(() => {
        if (!room) return

        const handleData = (payload: Uint8Array) => {
            const decoder = new TextDecoder()
            const data = JSON.parse(decoder.decode(payload))

            // Only apply updates for the current board
            if (data.boardId !== boardId) return

            if (data.type === 'whiteboard-full') {
                setElements(data.elements || data.strokes || [])
            } else if (data.type === 'whiteboard-stroke') {
                setElements(s => [...s, data.stroke])
            } else if (data.type === 'whiteboard-clear') {
                setElements([])
            }
        }

        room.on('dataReceived', handleData)
        return () => { room.off('dataReceived', handleData) }
    }, [room])


    return (
        <div className="relative w-full h-full bg-white group select-none touch-none overflow-hidden">
            {/* Toolbar */}
            {canWrite && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1a1c1e] p-1.5 rounded-xl shadow-2xl border border-white/10 z-50 transition-all duration-300">
                    {/* Tool Groups */}
                    <div className="flex items-center gap-0.5 px-1 border-r border-white/10">
                        <button
                            onClick={() => setSelectedTool('select')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'select' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Select"
                        >
                            <MousePointer2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setSelectedTool('hand')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'hand' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Pan (Space)"
                        >
                            <Hand className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 px-1 border-r border-white/10">
                        <button
                            onClick={() => setSelectedTool('pencil')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'pencil' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Pencil"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setSelectedTool('highlighter')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'highlighter' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Highlighter"
                        >
                            <Highlighter className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setSelectedTool('eraser')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'eraser' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Eraser"
                        >
                            <Eraser className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 px-1 border-r border-white/10">
                        <button
                            onClick={() => setSelectedTool('rect')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'rect' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Rectangle"
                        >
                            <Square className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setSelectedTool('circle')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'circle' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Circle"
                        >
                            <Circle className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setSelectedTool('triangle')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'triangle' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Triangle"
                        >
                            <Triangle className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-0.5 px-1 border-r border-white/10">
                        <button
                            onClick={() => setSelectedTool('text')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'text' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Text"
                        >
                            <TypeIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setSelectedTool('sticky')}
                            className={`p-2 rounded-lg transition-colors ${selectedTool === 'sticky' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                            title="Sticky Note"
                        >
                            <StickyNote className="w-4 h-4" />
                        </button>
                        {enableUpload && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Upload Image"
                            >
                                <Upload className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-0.5 px-1 border-r border-white/10">
                        <button
                            onClick={undo}
                            disabled={history.length === 0}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={redo}
                            disabled={redoStack.length === 0}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 px-2 border-r border-white/10">
                        <button onClick={() => setCamera(c => ({ ...c, z: Math.max(0.1, c.z - 0.1) }))} className="p-1 text-neutral-400 hover:text-white"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="text-[10px] font-mono text-neutral-400 min-w-[30px] text-center">{Math.round(camera.z * 100)}%</span>
                        <button onClick={() => setCamera(c => ({ ...c, z: Math.min(5, c.z + 0.1) }))} className="p-1 text-neutral-400 hover:text-white"><Plus className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setCamera({ x: 0, y: 0, z: 1 })} className="p-1 text-neutral-400 hover:text-white ml-1" title="Reset View"><Maximize className="w-3.5 h-3.5" /></button>
                    </div>

                    <div className="flex items-center gap-2 px-2">
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setColor('#000000')} className={`w-4 h-4 rounded-full border border-white/20 ${color === '#000000' ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1a1c1e]' : ''} bg-black`} />
                            <button onClick={() => setColor('#ef4444')} className={`w-4 h-4 rounded-full border border-white/20 ${color === '#ef4444' ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1a1c1e]' : ''} bg-red-500`} />
                            <button onClick={() => setColor('#22c55e')} className={`w-4 h-4 rounded-full border border-white/20 ${color === '#22c55e' ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1a1c1e]' : ''} bg-green-500`} />
                            <button onClick={() => setColor('#3b82f6')} className={`w-4 h-4 rounded-full border border-white/20 ${color === '#3b82f6' ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1a1c1e]' : ''} bg-blue-500`} />
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                            <button onClick={clearBoard} className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg" title="Clear All"><Trash2 className="w-4 h-4" /></button>
                            <button onClick={downloadPDF} className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg" title="Export PDF"><Download className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            )}

            {enableUpload && (
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            )}

            <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className={`w-full h-full block cursor-crosshair active:cursor-crosshair ${selectedTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : ''}`}
                onWheel={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect()
                    if (!rect) return

                    if (e.ctrlKey) {
                        // Zoom
                        const delta = -e.deltaY * 0.01
                        setCamera(c => ({
                            ...c,
                            z: Math.min(5, Math.max(0.1, c.z + delta))
                        }))
                    } else {
                        // Pan
                        setCamera(c => ({
                            ...c,
                            x: c.x - e.deltaX,
                            y: c.y - e.deltaY
                        }))
                    }
                }}
                style={{ touchAction: 'none' }}
            />
        </div>
    )
})

Whiteboard.displayName = 'Whiteboard'

export default Whiteboard
