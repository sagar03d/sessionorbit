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
    X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import { hitTest, ElementType, WhiteboardElement, ERASER_CURSOR_URL } from '@/utils/whiteboard-utils'

interface WhiteboardDemoProps {
    variant?: 'demo' | 'full'
}

export default function WhiteboardDemo({ variant = 'demo' }: WhiteboardDemoProps) {
    const router = useRouter()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const lastEditingTimeRef = useRef<number>(0)

    const [elements, setElements] = useState<WhiteboardElement[]>([])
    const [currentElement, setCurrentElement] = useState<WhiteboardElement | null>(null)
    const [history, setHistory] = useState<WhiteboardElement[][]>([])
    const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([])
    const [editingId, setEditingId] = useState<string | null>(null)

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

        // Dotted Pattern
        ctx.save()
        ctx.fillStyle = '#334155' // Slate 700
        const gridSize = 40 * camera.z
        const dotSize = 1.5 * Math.max(0.5, camera.z)
        const offsetX = camera.x % gridSize
        const offsetY = camera.y % gridSize

        for (let x = offsetX; x < canvas.width; x += gridSize) {
            for (let y = offsetY; y < canvas.height; y += gridSize) {
                ctx.beginPath()
                ctx.arc(x, y, dotSize, 0, Math.PI * 2)
                ctx.fill()
            }
        }
        ctx.restore()

        ctx.save()
        ctx.translate(camera.x, camera.y)
        ctx.scale(camera.z, camera.z)

        const renderElement = (element: WhiteboardElement) => {
            // Skip rendering text on canvas if it's being edited (we show the textarea instead)
            if (element.id === editingId) {
                if (element.type === 'sticky') {
                    // Still render the sticky background box
                    ctx.fillStyle = element.color + '33'
                    ctx.fillRect(element.x - 40, element.y - 40, 80, 80)
                    ctx.strokeStyle = element.color
                    ctx.strokeRect(element.x - 40, element.y - 40, 80, 80)
                }
                return
            }

            ctx.strokeStyle = element.color
            ctx.fillStyle = element.color
            ctx.lineWidth = element.strokeWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.globalAlpha = element.opacity || 1

            if (['pencil', 'highlighter', 'eraser'].includes(element.type)) {
                if (!element.points || element.points.length === 0) return

                if (element.type === 'eraser') {
                    // This shouldn't happen with new eraser logic, but keeping for safety
                    ctx.strokeStyle = '#1e293b'
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

                // Multiline text handling
                const lines = (element.text || "").split('\n')
                const lineHeight = element.strokeWidth * 4 * 1.2
                const startY = element.y - ((lines.length - 1) * lineHeight) / 2

                lines.forEach((line, i) => {
                    ctx.fillText(line, element.x, startY + (i * lineHeight))
                })

            } else if (element.type === 'image' && element.image) {
                const w = (element.endX ?? element.x) - element.x
                const h = (element.endY ?? element.y) - element.y
                ctx.drawImage(element.image, element.x, element.y, w, h)
            }
        }

        elements.forEach(renderElement)
        if (currentElement) renderElement(currentElement)

        ctx.restore()
    }, [elements, currentElement, camera, editingId])

    useEffect(() => {
        draw()
    }, [draw])

    // Focus textarea when editing starts
    useEffect(() => {
        if (editingId && textareaRef.current) {
            textareaRef.current.focus()
            // Move cursor to end
            const len = textareaRef.current.value.length
            textareaRef.current.setSelectionRange(len, len)
        }
    }, [editingId])

    // --- Interaction Handlers ---
    const screenToWorld = (x: number, y: number) => {
        return {
            x: (x - camera.x) / camera.z,
            y: (y - camera.y) / camera.z
        }
    }

    const handlePointerDown = (e: React.PointerEvent) => {
        if (editingId) return;

        // Prevent accidental creation immediately after finishing an edit
        if (Date.now() - lastEditingTimeRef.current < 100) return;

        const isDrawingTool = ['pencil', 'highlighter', 'eraser', 'rect', 'circle', 'triangle'].includes(selectedTool);
        if (isDrawingTool || selectedTool === 'hand') {
            e.currentTarget.setPointerCapture(e.pointerId)
        }

        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const screenX = e.clientX - rect.left
        const screenY = e.clientY - rect.top
        const { x, y } = screenToWorld(screenX, screenY)

        if (selectedTool === 'hand') return

        if (selectedTool === 'select' || selectedTool === 'text') {
            // Check if we clicked on an existing text/sticky to edit
            for (let i = elements.length - 1; i >= 0; i--) {
                const el = elements[i];
                if ((el.type === 'text' || el.type === 'sticky') && hitTest(el, x, y, camera.z)) {
                    setEditingId(el.id);
                    // Ensure focus
                    setTimeout(() => {
                        if (textareaRef.current) {
                            textareaRef.current.focus()
                            const len = textareaRef.current.value.length
                            textareaRef.current.setSelectionRange(len, len)
                        }
                    }, 50);
                    return;
                }
            }
        }

        if (selectedTool === 'select') return

        if (selectedTool === 'eraser') {
            const elToDelete = elements.find(el => hitTest(el, x, y, camera.z))
            if (elToDelete) {
                setElements(prev => prev.filter(el => el.id !== elToDelete.id))
                // Note: We're not tracking history for eraser clicks in this simple demo logic effectively, 
                // but we could add to history here if needed.
                setHistory(prev => [...prev, elements])
            }
            return
        }

        const id = Math.random().toString(36).substring(7)
        let type = selectedTool as ElementType

        // Image handling is different
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
            points: ['pencil', 'highlighter'].includes(type) ? [{ x, y, pressure: e.pressure }] : undefined,
            opacity: type === 'highlighter' ? 0.4 : 1,
            text: ""
        }

        if (type === 'text' || type === 'sticky') {
            setElements(prev => [...prev, newElement])
            setEditingId(id)
            // Ensure focus after a short delay
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus()
                }
            }, 50)
            // Note: Keeping selectedTool as 'text'/'sticky' so user can add multiple easily if they want
        } else {
            setCurrentElement(newElement)
        }
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

        const screenX = e.clientX - rect.left
        const screenY = e.clientY - rect.top
        const { x, y } = screenToWorld(screenX, screenY)

        if (selectedTool === 'eraser' && e.buttons === 1) {
            const elToDelete = elements.find(el => hitTest(el, x, y, camera.z))
            if (elToDelete) {
                setElements(prev => prev.filter(el => el.id !== elToDelete.id))
            }
            return
        }

        if (!currentElement) return

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
        if (selectedTool === 'eraser') return

        if (currentElement) {
            const newElements = [...elements, currentElement]
            setHistory([...history, elements])
            setRedoStack([])
            setElements(newElements)
            setCurrentElement(null)
        }
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
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
                const maxWidth = 400
                const scale = maxWidth / img.width < 1 ? maxWidth / img.width : 1
                const width = img.width * scale
                const height = img.height * scale

                const canvas = canvasRef.current
                if (!canvas) return

                const cx = canvas.width / 2
                const cy = canvas.height / 2

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
            const delta = -e.deltaY * 0.01
            setCamera(c => ({
                ...c,
                z: Math.min(5, Math.max(0.1, c.z + delta))
            }))
        } else {
            setCamera(c => ({
                ...c,
                x: c.x - e.deltaX,
                y: c.y - e.deltaY
            }))
        }
    }

    // --- Text Edit Handlers ---
    const handleTextUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!editingId) return
        setElements(prev => prev.map(el => el.id === editingId ? { ...el, text: e.target.value } : el))
    }

    const handleTextBlur = () => {
        if (!editingId) return
        const el = elements.find(e => e.id === editingId)
        if (el && !el.text?.trim()) {
            setElements(prev => prev.filter(e => e.id !== editingId))
        } else {
            setHistory(prev => [...prev, elements])
        }
        setEditingId(null)
        lastEditingTimeRef.current = Date.now()
    }

    const handleTextKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            (e.currentTarget as HTMLElement).blur()
        }
    }

    // Helper to get screen coords for editing overlay
    const getEditingStyle = () => {
        if (!editingId || !canvasRef.current) return {};
        const el = elements.find(e => e.id === editingId);
        if (!el) return {};

        const screenPos = {
            x: (el.x * camera.z) + camera.x,
            y: (el.y * camera.z) + camera.y
        }

        // Robust font size and visibility
        const baseFontSize = el.strokeWidth * 4;
        const fontSize = Math.max(16, baseFontSize * camera.z);

        return {
            left: screenPos.x,
            top: screenPos.y,
            transform: 'translate(-50%, -50%)',
            fontSize: `${fontSize}px`,
            color: el.type === 'sticky' ? '#000000' : (el.color === '#ffffff' ? '#ffffff' : el.color),
            minWidth: '120px',
            maxWidth: '400px',
            minHeight: '1.5em',
            lineHeight: '1.2',
            padding: '10px',
            background: el.type === 'sticky' ? 'transparent' : 'rgba(15, 23, 42, 0.95)',
            borderRadius: '8px',
            border: `2px solid ${el.color}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 100,
            outline: 'none',
            fontFamily: 'sans-serif',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden'
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
        handleResize();
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

                {/* Branding */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-3 pointer-events-none select-none">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="orbit-container">
                            <div className="orbiting-dot" />
                        </div>
                        <img
                            src="/logo.png"
                            alt="SessionOrbit Logo"
                            className="w-full h-full object-contain relative z-10"
                        />
                    </div>
                    <span className="font-bold bg-gradient-to-r from-deep-indigo to-orbit-cyan bg-clip-text text-transparent text-xl tracking-tight drop-shadow-md font-sans">
                        SessionOrbit
                    </span>
                </div>

                {/* Exit Button */}
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-[#0f172a]/95 px-4 py-2 rounded-xl shadow-xl border border-white/10 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all group backdrop-blur-md"
                    title="Exit Whiteboard"
                >
                    <span className="text-sm font-medium">Exit</span>
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Toolbar */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 sm:top-4 sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-0 flex flex-col sm:flex-row items-center gap-1 bg-[#0f172a]/95 p-1.5 rounded-2xl shadow-2xl border border-white/10 z-30 transition-all duration-300 backdrop-blur-md">

                    <div className="flex flex-col sm:flex-row items-center gap-1 px-1 border-b sm:border-b-0 sm:border-r border-white/10 pb-1 sm:pb-0">
                        <button onClick={() => setSelectedTool('select')} className={`p-2 rounded-lg ${selectedTool === 'select' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Select / Edit">
                            <MousePointer2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('hand')} className={`p-2 rounded-lg ${selectedTool === 'hand' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Pan Tool">
                            <Hand className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-1 px-1 border-b sm:border-b-0 sm:border-r border-white/10 py-1 sm:py-0">
                        <button onClick={() => setSelectedTool('pencil')} className={`p-2 rounded-lg ${selectedTool === 'pencil' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Pencil">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('highlighter')} className={`p-2 rounded-lg ${selectedTool === 'highlighter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Highlighter">
                            <Highlighter className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('eraser')} className={`p-2 rounded-lg ${selectedTool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Eraser">
                            <Eraser className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-1 px-1 border-b sm:border-b-0 sm:border-r border-white/10 py-1 sm:py-0 hidden sm:flex">
                        <button onClick={() => setSelectedTool('rect')} className={`p-2 rounded-lg ${selectedTool === 'rect' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Rectangle">
                            <Square className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('circle')} className={`p-2 rounded-lg ${selectedTool === 'circle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Circle">
                            <Circle className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('triangle')} className={`p-2 rounded-lg ${selectedTool === 'triangle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Triangle">
                            <Triangle className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-1 px-1 border-b sm:border-b-0 sm:border-r border-white/10 py-1 sm:py-0">
                        <button onClick={() => setSelectedTool('text')} className={`p-2 rounded-lg ${selectedTool === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Text">
                            <TypeIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedTool('sticky')} className={`p-2 rounded-lg ${selectedTool === 'sticky' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`} title="Sticky Note">
                            <StickyNote className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-1 px-1 border-b sm:border-b-0 sm:border-r border-white/10 py-1 sm:py-0">
                        <button onClick={undo} disabled={history.length === 0} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30">
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button onClick={redo} disabled={redoStack.length === 0} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30">
                            <Redo2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-1 px-2 pt-1 sm:pt-0">
                        <div className="flex flex-row sm:flex-col gap-1">
                            <button onClick={() => setColor('#3b82f6')} className={`w-4 h-4 rounded-full bg-blue-500 ${color === '#3b82f6' ? 'ring-2 ring-white' : ''}`} />
                            <button onClick={() => setColor('#ef4444')} className={`w-4 h-4 rounded-full bg-red-500 ${color === '#ef4444' ? 'ring-2 ring-white' : ''}`} />
                            <button onClick={() => setColor('#22c55e')} className={`w-4 h-4 rounded-full bg-green-500 ${color === '#22c55e' ? 'ring-2 ring-white' : ''}`} />
                        </div>
                        <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
                        <div className="w-6 h-px bg-white/10 my-1 block sm:hidden" />

                        <div className="flex flex-col sm:flex-row gap-1">
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
                    className={`w-full h-full block touch-none ${selectedTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : selectedTool === 'eraser' ? '' : 'cursor-crosshair'}`}
                    style={{
                        cursor: selectedTool === 'eraser' ? ERASER_CURSOR_URL : undefined
                    }}
                />

                {/* Text Editing Overlay */}
                {editingId && (
                    <textarea
                        ref={textareaRef}
                        value={elements.find(e => e.id === editingId)?.text || ""}
                        onChange={handleTextUpdate}
                        onBlur={handleTextBlur}
                        onKeyDown={handleTextKeyDown}
                        placeholder="Type something..."
                        className="absolute z-[100] border-0 outline-none resize-none overflow-hidden text-center pointer-events-auto shadow-2xl"
                        style={getEditingStyle() as React.CSSProperties}
                        autoFocus
                    />
                )}

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
