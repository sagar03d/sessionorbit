"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { getStroke } from 'perfect-freehand'
import {
    Download,
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
    Minus,
    Plus,
    Maximize,
    Upload,
} from 'lucide-react'

// --- Types ---
interface Point {
    x: number
    y: number
    pressure?: number
}

type ElementType = 'pencil' | 'highlighter' | 'eraser' | 'rect' | 'circle' | 'triangle' | 'text' | 'sticky' | 'image';

interface WhiteboardElement {
    id: string
    type: ElementType
    points?: Point[]
    x: number
    y: number
    endX?: number
    endY?: number
    color: string
    strokeWidth: number
    text?: string
    opacity?: number
    image?: HTMLImageElement
}

interface WhiteboardDemoProps {
    variant?: 'demo' | 'full'
}

export default function WhiteboardDemo({ variant = 'demo' }: WhiteboardDemoProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [elements, setElements] = useState<WhiteboardElement[]>([])
    const [currentElement, setCurrentElement] = useState<WhiteboardElement | null>(null)
    const [history, setHistory] = useState<WhiteboardElement[][]>([])
    const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([])

    const [selectedTool, setSelectedTool] = useState<ElementType | 'hand' | 'select'>('pencil')
    const [color, setColor] = useState('#3b82f6') // Default blue
    const [width, setWidth] = useState(4)
    const [camera, setCamera] = useState({ x: 0, y: 0, z: 1 })

    // --- Drawing Logic ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear and set background
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#1e293b' // Dark background matching theme (Slate 800)
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Grid pattern
        ctx.save()
        ctx.strokeStyle = '#334155' // Slate 700
        ctx.lineWidth = 1
        ctx.beginPath()
        const gridSize = 40 * camera.z
        const offsetX = camera.x % gridSize
        const offsetY = camera.y % gridSize

        for (let x = offsetX; x < canvas.width; x += gridSize) {
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
        }
        for (let y = offsetY; y < canvas.height; y += gridSize) {
            ctx.moveTo(0, y)
            ctx.lineTo(canvas.width, y)
        }
        ctx.globalAlpha = 0.3
        ctx.stroke()
        ctx.restore()

        ctx.save()
        ctx.translate(camera.x, camera.y)
        ctx.scale(camera.z, camera.z)

        const renderElement = (element: WhiteboardElement) => {
            ctx.strokeStyle = element.color
            ctx.fillStyle = element.color
            ctx.lineWidth = element.strokeWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.globalAlpha = element.opacity || 1

            if (['pencil', 'highlighter', 'eraser'].includes(element.type)) {
                if (!element.points || element.points.length === 0) return

                if (element.type === 'eraser') {
                    ctx.strokeStyle = '#1e293b' // Match background
                    ctx.fillStyle = '#1e293b'
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
            } else if (element.type === 'image' && element.image) {
                const w = (element.endX ?? element.x) - element.x
                const h = (element.endY ?? element.y) - element.y
                ctx.drawImage(element.image, element.x, element.y, w, h)
            }
        }

        elements.forEach(renderElement)
        if (currentElement) renderElement(currentElement)

        ctx.restore()
    }, [elements, currentElement, camera])

    useEffect(() => {
        draw()
    }, [draw])

    // --- Interaction Handlers ---
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
        const { x, y } = screenToWorld(screenX, screenY)

        if (selectedTool === 'hand') return

        const id = Math.random().toString(36).substring(7)
        let type = selectedTool as ElementType

        let text = undefined;
        if (type === 'text' || type === 'sticky') {
            const defaultText = type === 'text' ? "Text" : "Note";
            text = prompt("Enter text:", defaultText);
            if (!text) return; // Cancel if no text
        }

        // Image handling is different (via upload), so pointer down just does selection logic if we had it,
        // or nothing for now as we don't have drag-move logic implemented yet for elements.
        if (type === 'image') return

        const newElement: WhiteboardElement = {
            id,
            type,
            x,
            y,
            endX: x,
            endY: y,
            color,
            strokeWidth: width,
            points: ['pencil', 'highlighter', 'eraser'].includes(type) ? [{ x, y, pressure: e.pressure }] : undefined,
            opacity: type === 'highlighter' ? 0.4 : 1,
            text
        }

        setCurrentElement(newElement)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        if (selectedTool === 'hand' && e.buttons === 1) {
            setCamera(c => ({
                ...c,
                x: c.x + e.movementX,
                y: c.y + e.movementY
            }))
            return
        }

        if (!currentElement) return

        const screenX = e.clientX - rect.left
        const screenY = e.clientY - rect.top
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

    const handlePointerUp = () => {
        if (!currentElement) return
        const newElements = [...elements, currentElement]
        setHistory([...history, elements])
        setRedoStack([])
        setElements(newElements)
        setCurrentElement(null)
    }

    const undo = () => {
        if (history.length === 0) return
        const previous = history[history.length - 1]
        setRedoStack([elements, ...redoStack])
        setElements(previous)
        setHistory(history.slice(0, -1))
    }

    const redo = () => {
        if (redoStack.length === 0) return
        const next = redoStack[0]
        setElements(next)
        setHistory([...history, elements])
        setRedoStack(redoStack.slice(1))
    }

    const clearBoard = () => {
        if (confirm("Clear board?")) {
            setHistory([...history, elements])
            setElements([])
            setRedoStack([])
        }
    }

    const downloadPDF = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const { jsPDF } = await import("jspdf");

        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'l' : 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(`whiteboard-export.pdf`);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                // Center image in current view
                const maxWidth = 400
                const scale = maxWidth / img.width < 1 ? maxWidth / img.width : 1
                const width = img.width * scale
                const height = img.height * scale

                const canvas = canvasRef.current
                if (!canvas) return

                // We want to place it at the center of the CURRENT VIEW
                // Canvas center in screen coords:
                const cx = canvas.width / 2
                const cy = canvas.height / 2

                // Convert to world coords:
                const { x, y } = screenToWorld(cx - width / 2, cy - height / 2)

                const newElement: WhiteboardElement = {
                    id: Math.random().toString(36).substring(7),
                    type: 'image',
                    x,
                    y,
                    endX: x + width,
                    endY: y + height,
                    color: '#ffffff',
                    strokeWidth: 0,
                    image: img
                }

                setElements(prev => [...prev, newElement])
                setHistory(prev => [...prev, elements])
                setRedoStack([])
                // Reset tool to select so they don't accidentally draw over it
                setSelectedTool('select')
            }
            img.src = event.target?.result as string
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    // --- Keyboard & Wheel Handling ---
    const lastToolRef = useRef<ElementType | 'hand' | 'select'>('pencil')

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat) {
                const tag = (e.target as HTMLElement).tagName
                if (tag === 'INPUT' || tag === 'TEXTAREA') return

                setSelectedTool(prev => {
                    if (prev !== 'hand') {
                        lastToolRef.current = prev
                        return 'hand'
                    }
                    return prev
                })
            }
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setSelectedTool(prev => {
                    if (prev === 'hand') {
                        return lastToolRef.current
                    }
                    return prev
                })
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
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
    }

    // --- Resizing ---
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas && canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                draw();
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial size
        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);


    return (
        <div className={`w-full mx-auto ${variant === 'demo' ? 'max-w-5xl mb-20 px-4' : 'h-screen'}`}>
            {variant === 'demo' && (
                <div className="text-center mb-8">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Interactive Demo
                    </span>
                    <h3 className="mt-4 text-3xl font-bold text-white">Experience the Infinite Canvas</h3>
                    <p className="text-slate-400 mt-2">Try drawing, typing, or adding shapes below. No login required.</p>
                </div>
            )}

            <div className={`relative w-full ${variant === 'demo' ? 'h-[600px] rounded-2xl border border-white/10 shadow-2xl' : 'h-full'} overflow-hidden bg-[#1e293b] group`}>
                {/* Toolbar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#0f172a] p-1.5 rounded-xl shadow-2xl border border-white/10 z-10 transition-all duration-300 backdrop-blur-md">

                    <div className="flex items-center gap-1 px-1 border-r border-white/10">
                        <button onClick={() => setSelectedTool('select')} className={`p-2 rounded-lg ${selectedTool === 'select' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <MousePointer2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('hand')} className={`p-2 rounded-lg ${selectedTool === 'hand' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <Hand className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 px-1 border-r border-white/10">
                        <button onClick={() => setSelectedTool('pencil')} className={`p-2 rounded-lg ${selectedTool === 'pencil' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('highlighter')} className={`p-2 rounded-lg ${selectedTool === 'highlighter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <Highlighter className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('eraser')} className={`p-2 rounded-lg ${selectedTool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <Eraser className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 px-1 border-r border-white/10 hidden sm:flex">
                        <button onClick={() => setSelectedTool('rect')} className={`p-2 rounded-lg ${selectedTool === 'rect' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <Square className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('circle')} className={`p-2 rounded-lg ${selectedTool === 'circle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <Circle className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('triangle')} className={`p-2 rounded-lg ${selectedTool === 'triangle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <Triangle className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 px-1 border-r border-white/10">
                        <button onClick={() => setSelectedTool('text')} className={`p-2 rounded-lg ${selectedTool === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <TypeIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('sticky')} className={`p-2 rounded-lg ${selectedTool === 'sticky' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                            <StickyNote className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 px-1 border-r border-white/10">
                        <button onClick={undo} disabled={history.length === 0} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30">
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button onClick={redo} disabled={redoStack.length === 0} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30">
                            <Redo2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 px-2">
                        <button onClick={() => setColor('#3b82f6')} className={`w-4 h-4 rounded-full bg-blue-500 ${color === '#3b82f6' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#0f172a]' : ''}`} />
                        <button onClick={() => setColor('#ef4444')} className={`w-4 h-4 rounded-full bg-red-500 ${color === '#ef4444' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#0f172a]' : ''}`} />
                        <button onClick={() => setColor('#22c55e')} className={`w-4 h-4 rounded-full bg-green-500 ${color === '#22c55e' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#0f172a]' : ''}`} />
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <button onClick={clearBoard} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg" title="Clear">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg" title="Upload Image">
                            <Upload className="w-4 h-4" />
                        </button>
                        <button onClick={downloadPDF} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg" title="Export PDF">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                />

                <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onWheel={handleWheel}
                    className={`w-full h-full block touch-none ${selectedTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}
                />

                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-[#0f172a]/90 backdrop-blur border border-white/10 p-1 rounded-lg">
                    <button onClick={() => setCamera(c => ({ ...c, z: Math.max(0.1, c.z - 0.1) }))} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10">
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400 w-8 text-center">{Math.round(camera.z * 100)}%</span>
                    <button onClick={() => setCamera(c => ({ ...c, z: Math.min(5, c.z + 0.1) }))} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10">
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setCamera({ x: 0, y: 0, z: 1 })} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 ml-1">
                        <Maximize className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
