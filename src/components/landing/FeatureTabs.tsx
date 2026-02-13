"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Mic,
    Settings,
    LogOut,
    UserPlus,
    Save,
    MousePointer2,
    Hand,
    Pen,
    Eraser,
    Square,
    Circle,
    Triangle,
    Type,
    StickyNote,
    Undo2,
    Redo2,
    Minus,
    Plus,
    Trash2,
    Download,
    Video,
    MicOff,
    MoreHorizontal,
    ChevronRight
} from "lucide-react";

export default function FeatureTabs() {
    const router = useRouter();
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scrollProgress, setScrollProgress] = useState(0);
    const whiteboardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = 600; // Progress reaches 1 within 600px of scroll
            const progress = Math.min(scrollY / maxScroll, 1);
            setScrollProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch support
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        setOffset({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y
        });
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

            {/* Main Interface Container */}
            <div className="relative w-full rounded-xl bg-[#0f111a] border border-white/10 shadow-2xl overflow-hidden min-h-[500px] sm:min-h-[700px] flex flex-col font-sans">

                {/* Top Header */}
                <div className="h-14 border-b border-white/5 bg-[#0f111a] flex items-center justify-between px-2 sm:px-4 z-20">
                    <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shrink-0">
                            <div className="w-full h-full rounded-full bg-[#0f111a] flex items-center justify-center overflow-hidden">
                                <video
                                    src="/videos/teacher-vid.mp4"
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            </div>
                        </div>
                        <span className="text-white font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">Elara&apos;s Class</span>

                        <div className="h-4 w-[1px] bg-white/10 mx-0.5 sm:mx-1 shrink-0"></div>

                        <div className="px-2 sm:px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-red-400 text-[10px] sm:text-xs font-medium">REC</span>
                        </div>

                        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-slate-300 text-xs transition-colors shrink-0">
                            <UserPlus size={14} />
                            Invite
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-3">
                        <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-slate-300 text-[10px] sm:text-xs transition-colors">
                            <Save size={14} className="sm:w-[14px] w-3" />
                            <span className="hidden xs:inline">SAVE</span>
                        </button>
                        <button className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors">
                            <Settings size={18} className="sm:w-[18px] w-4" />
                        </button>
                        <button className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-red-500/10 transition-colors">
                            <LogOut size={18} className="sm:w-[18px] w-4" />
                        </button>
                    </div>
                </div>

                {/* Tab & Content Area */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Main Canvas Area */}
                    <div className="flex-1 flex flex-col relative bg-[#13151f] overflow-hidden">
                        {/* Canvas Tabs */}
                        <div className="h-10 border-b border-white/5 bg-[#0f111a] flex items-end px-2">
                            <button className="px-3 sm:px-4 py-2 bg-[#13151f] text-white text-[10px] sm:text-xs font-medium rounded-t-md border-t border-x border-white/5 relative top-[1px]">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 text-slate-400"><Square size={12} /></span>
                                    Whiteboard
                                </div>
                            </button>
                            <button className="px-2 sm:px-3 py-2 text-slate-500 hover:text-slate-300 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Toolbar - Responsively scrollable on mobile */}
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-[#1a1d2d]/90 backdrop-blur-md border border-white/10 rounded-lg p-1 sm:p-1.5 flex items-center gap-0.5 sm:gap-1 shadow-xl max-w-[95%] overflow-x-auto no-scrollbar">
                            <ToolButton icon={MousePointer2} />
                            <ToolButton icon={Hand} active={isDragging} />
                            <ToolButton icon={Pen} />
                            <ToolButton icon={Eraser} />
                            <div className="hidden sm:block w-[1px] h-6 bg-white/10 mx-1 shrink-0"></div>
                            <ToolButton icon={Square} />
                            <ToolButton icon={Circle} />
                            <ToolButton icon={Triangle} />
                            <div className="hidden xs:block w-[1px] h-6 bg-white/10 mx-1 shrink-0"></div>
                            <ToolButton icon={Type} />
                            <ToolButton icon={StickyNote} />
                            <div className="hidden sm:block w-[1px] h-6 bg-white/10 mx-1 shrink-0"></div>
                            <ToolButton icon={Undo2} className="hidden xs:flex" />
                            <ToolButton icon={Redo2} className="hidden xs:flex" />
                            <div className="w-[1px] h-6 bg-white/10 mx-1 shrink-0"></div>
                            <button className="p-1 sm:p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white shrink-0"><Minus size={14} /></button>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 w-6 sm:w-8 text-center shrink-0">100%</span>
                            <button className="p-1 sm:p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white shrink-0"><Plus size={14} /></button>
                            <div className="hidden sm:block w-[1px] h-6 bg-white/10 mx-1 shrink-0"></div>
                            <div className="flex items-center gap-1 sm:gap-1.5 px-1 shrink-0">
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-black border border-white/20 cursor-pointer"></div>
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-red-500 cursor-pointer"></div>
                                <div className="hidden xs:block w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-green-500 cursor-pointer"></div>
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-500 ring-1 ring-white ring-offset-1 ring-offset-[#1a1d2d] cursor-pointer"></div>
                            </div>
                            <div className="w-[1px] h-6 bg-white/10 mx-1 shrink-0"></div>
                            <button className="p-1 sm:p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white shrink-0"><Trash2 size={16} /></button>
                        </div>

                        {/* Canvas Content */}
                        <div
                            ref={whiteboardRef}
                            className="flex-1 w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleMouseUp}
                        >
                            {/* Grid Background */}
                            <div
                                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:24px_24px] animate-infinite-grid"
                                style={{
                                    backgroundPosition: `${offset.x % 24}px ${offset.y % 24}px`
                                }}
                            ></div>

                            {/* Tagline Content */}
                            <div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75"
                                style={{
                                    transform: `translate(${offset.x}px, ${offset.y}px)`
                                }}
                            >
                                <div className="text-center px-4 relative">
                                    <h2 className="text-2xl sm:text-5xl md:text-6xl font-bold font-handwriting bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300 mb-4 select-none leading-tight">
                                        Teach Without <br /> Tech Headaches. 🚀
                                    </h2>
                                    <p className="text-slate-400 text-sm sm:text-xl max-w-xl mx-auto select-none opacity-80 px-2">
                                        Reclaim your time with AI-powered tutoring tools.
                                    </p>

                                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto">
                                        <button
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={() => router.push('/signup')}
                                            className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all flex items-center gap-2 group"
                                        >
                                            Get Started Free
                                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={() => document.getElementById('whiteboard')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-full backdrop-blur-md transition-all flex items-center gap-2 group"
                                        >
                                            Experience Whiteboard
                                            <MousePointer2 size={18} />
                                        </button>
                                    </div>

                                    {/* Content Islands - Discoverable when dragging */}

                                    {/* Week 5 Header - Top Left */}
                                    <div className="absolute top-[-400px] left-[-500px] pointer-events-none select-none">
                                        <h3 className="font-handwriting text-5xl text-white/40 border-b-2 border-white/10 pb-2 px-6 italic rotate-[-2deg]">Week 5</h3>
                                    </div>

                                    {/* Math/Andreas Island - Top Middle */}
                                    <div className="absolute top-[-600px] left-[300px] pointer-events-none select-none text-slate-500 font-handwriting text-left min-w-[300px]">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-orange-500/60 text-2xl mb-2">Prof. Sandra Smith</p>
                                            <p className="text-lg opacity-40 flex items-center gap-2 text-white/50">
                                                <ChevronRight size={14} /> Andreas
                                            </p>
                                            <p className="text-lg opacity-40">LM = 5/6 GM</p>
                                            <p className="text-lg opacity-40">NV = (348 + 5√143) / 36(72 + √143)</p>
                                            <svg className="w-48 h-20 opacity-20 -mt-8" viewBox="0 0 200 80">
                                                <path d="M 10 70 Q 100 0 190 70" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Dynamic Vector/Graph Island - Right */}
                                    <div className="absolute top-[-100px] left-[700px] pointer-events-none select-none">
                                        <svg width="400" height="400" viewBox="0 0 400 400" className="opacity-30">
                                            {/* Axes */}
                                            <path d="M 50 350 L 50 50 M 50 350 L 350 350" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            {/* Ticks */}
                                            {[100, 150, 200, 250, 300].map(p => (
                                                <React.Fragment key={p}>
                                                    <path d={`M 45 ${p} L 55 ${p}`} stroke="white" strokeWidth="1" />
                                                    <path d={`M ${p} 345 L ${p} 355`} stroke="white" strokeWidth="1" />
                                                </React.Fragment>
                                            ))}
                                            {/* Vector Arrow */}
                                            <path d="M 50 350 L 300 100" fill="none" stroke="#00EAFF" strokeWidth="6" strokeLinecap="round" />
                                            <path d="M 280 110 L 300 100 L 290 120" fill="#00EAFF" />
                                            <text x="320" y="90" fill="white" className="font-handwriting text-4xl">OA&apos; = λ</text>
                                            <text x="340" y="140" fill="white" className="font-handwriting text-6xl opacity-40">A</text>
                                        </svg>
                                    </div>

                                    {/* Sticky Notes Island - Bottom Left */}
                                    <div className="absolute top-[350px] left-[-450px] pointer-events-none select-none flex gap-6">
                                        <div className="w-40 h-40 bg-indigo-500/10 border border-indigo-500/20 p-4 flex flex-col justify-between transform -rotate-6 shadow-2xl backdrop-blur-sm">
                                            <span className="text-xs text-indigo-400/60 font-medium">01/04/26</span>
                                            <span className="font-handwriting text-xl text-indigo-100/60">Creating Project Flow</span>
                                        </div>
                                        <div className="w-40 h-40 bg-purple-500/10 border border-purple-500/20 p-4 flex flex-col justify-between transform rotate-3 shadow-2xl backdrop-blur-sm">
                                            <span className="text-xs text-purple-400/60 font-medium">01/03/26</span>
                                            <span className="font-handwriting text-xl text-purple-100/60">Module Review</span>
                                        </div>
                                        <h4 className="font-handwriting text-3xl text-white/20 self-end ml-4 mb-4">Plan for week 5</h4>
                                    </div>

                                    {/* Geometry Circle Island - Left Edge */}
                                    <div className="absolute left-[-1100px] top-[-100px] pointer-events-none select-none opacity-20">
                                        <svg width="600" height="600" viewBox="0 0 400 400">
                                            <circle cx="200" cy="200" r="160" fill="none" stroke="#A1FF00" strokeWidth="2" />
                                            <rect x="80" y="80" width="240" height="240" fill="none" stroke="#6366F1" strokeWidth="2" />
                                            <path d="M 40 200 L 360 200 M 200 40 L 200 360" stroke="white" strokeWidth="1" strokeDasharray="8,8" />
                                            <path d="M 200 200 L 320 80" stroke="#00EAFF" strokeWidth="2" />
                                            <text x="210" y="180" fill="white" className="font-handwriting text-sm italic">r = 1</text>
                                        </svg>
                                    </div>

                                    {/* Complex Derivation - Bottom Right */}
                                    <div className="absolute top-[400px] left-[600px] pointer-events-none select-none opacity-25 font-handwriting text-left text-slate-400 max-w-sm">
                                        <p className="text-xs leading-relaxed">
                                            The silver section (based on the designation golden section) is the division ratio of a distance...
                                        </p>
                                        <svg width="300" height="200" viewBox="0 0 300 200" className="mt-4">
                                            <path d="M 50 150 L 250 150 L 150 50 Z" fill="none" stroke="white" strokeWidth="1.5" />
                                            <circle cx="150" cy="116" r="66" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4" />
                                            <path d="M 150 50 L 150 150" stroke="white" strokeWidth="1" />
                                            <text x="160" y="40" fill="white" className="text-xs">b₀ = 1</text>
                                        </svg>
                                    </div>

                                    {/* Scribbles around main tagline */}
                                    <svg className="absolute -inset-20 w-[120%] h-[140%] -z-10 overflow-visible opacity-20 pointer-events-none" viewBox="0 0 600 400">
                                        {/* Rough circle around first part of tagline */}
                                        <path
                                            d="M 100 100 Q 80 50 150 40 T 300 60 T 350 120 T 250 180 T 100 150 Z"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            className="animate-pulse"
                                        />
                                        {/* Drawn arrows */}
                                        <path d="M 450 80 L 500 40 M 500 40 L 485 45 M 500 40 L 495 55" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M 50 300 L 80 340 M 80 340 L 65 335 M 80 340 L 75 325" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        {/* Little stars/sparkles */}
                                        {[{ x: 420, y: 50 }, { x: 500, y: 320 }, { x: 80, y: 60 }].map((star, i) => (
                                            <path
                                                key={i}
                                                d={`M ${star.x} ${star.y} L ${star.x + 5} ${star.y - 10} L ${star.x + 10} ${star.y} L ${star.x + 20} ${star.y + 5} L ${star.x + 10} ${star.y + 10} L ${star.x + 5} ${star.y + 20} L ${star.x} ${star.y + 10} L ${star.x - 10} ${star.y + 5} Z`}
                                                fill="#fde047"
                                                className="animate-pulse"
                                                style={{ animationDelay: `${i * 0.5}s` }}
                                            />
                                        ))}
                                    </svg>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar - Hidden on mobile/tablet */}
                    <div className="hidden lg:flex w-80 bg-[#0b0c15] border-l border-white/5 flex-col">
                        <div className="h-10 flex items-center px-4 border-b border-white/5 text-slate-400 text-xs font-semibold tracking-wider gap-2">
                            <Video size={14} /> LIVE FEEDS
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="relative aspect-video rounded-lg bg-[#1a1d2d] border border-white/5 overflow-hidden group shadow-lg">
                                {/* Feed Badge */}
                                <div className="absolute top-3 left-3 px-2 py-0.5 bg-indigo-500 rounded text-[10px] font-bold text-white z-20">
                                    Teacher
                                </div>

                                {/* Feed Content - Image as Video */}
                                <div className="absolute inset-0">
                                    <video
                                        src="/videos/teacher-vid.mp4"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                    {/* Overlay Gradient for Text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                </div>

                                {/* Audio Indicator */}
                                <div className="absolute bottom-3 right-3 p-1.5 bg-green-500/90 rounded-full text-white backdrop-blur-sm z-20 shadow-sm animate-pulse">
                                    <Mic size={14} />
                                </div>

                                {/* Name Label */}
                                <div className="absolute bottom-3 left-3 text-xs text-white font-medium z-20 text-shadow-sm">
                                    Elara Verve
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30">
                                    <div className="p-2 bg-black/60 rounded-full backdrop-blur-md text-white hover:bg-indigo-500 transition-colors cursor-pointer border border-white/10">
                                        <MoreHorizontal size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-video rounded-lg bg-[#1a1d2d] border border-white/5 overflow-hidden group shadow-lg">
                                {/* Feed Badge */}
                                <div className="absolute top-3 left-3 px-2 py-0.5 bg-indigo-500 rounded text-[10px] font-bold text-white z-20">
                                    Student
                                </div>

                                {/* Feed Content - Image as Video */}
                                <div className="absolute inset-0">
                                    <video
                                        src="/videos/student-vid.mp4"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                    {/* Overlay Gradient for Text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                </div>

                                {/* Audio Indicator */}
                                <div className="absolute bottom-3 right-3 p-1.5 bg-black/50 rounded-full text-white/50 backdrop-blur-sm z-20">
                                    <MicOff size={14} />
                                </div>

                                {/* Name Label */}
                                <div className="absolute bottom-3 left-3 text-xs text-white font-medium z-20 text-shadow-sm">
                                    Lyra
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30">
                                    <div className="p-2 bg-black/60 rounded-full backdrop-blur-md text-white hover:bg-indigo-500 transition-colors cursor-pointer border border-white/10">
                                        <MoreHorizontal size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1"></div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ToolButton({ icon: Icon, active = false, className = "" }: { icon: any, active?: boolean, className?: string }) {
    return (
        <button
            className={`p-1.5 sm:p-2 rounded-md transition-all shrink-0 ${active
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                } ${className}`}
        >
            <Icon size={18} className="sm:w-[18px] w-4" />
        </button>
    );
}
