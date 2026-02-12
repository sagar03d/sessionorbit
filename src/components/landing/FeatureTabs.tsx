"use client";

import React, { useState, useRef, useEffect } from "react";
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
    MoreHorizontal
} from "lucide-react";

export default function FeatureTabs() {
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
                                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:24px_24px]"
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
                                    <h2 className="text-2xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300 mb-4 select-none leading-tight">
                                        Teach Without <br /> Tech Headaches. 🚀
                                    </h2>
                                    <p className="text-slate-400 text-sm sm:text-xl max-w-xl mx-auto select-none opacity-80 px-2">
                                        Reclaim your time with AI-powered tutoring tools.
                                    </p>

                                    {/* Drawing Overlay */}
                                    <svg className="absolute top-0 left-0 w-full h-full -z-10 overflow-visible" viewBox="0 0 400 200">
                                        {/* Squiggly Underline */}
                                        <path
                                            d="M 50 140 Q 150 160 250 140 T 350 150"
                                            fill="none"
                                            stroke="url(#grad1)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray="400"
                                            strokeDashoffset={400 - (scrollProgress * 400)}
                                            className="opacity-60"
                                        />
                                        {/* Sparkle */}
                                        <path
                                            d="M 360 40 L 370 20 L 380 40 L 400 50 L 380 60 L 370 80 L 360 60 L 340 50 Z"
                                            fill="url(#grad2)"
                                            className="transition-all duration-300"
                                            style={{
                                                transformOrigin: '370px 50px',
                                                transform: `scale(${scrollProgress})`,
                                                opacity: scrollProgress
                                            }}
                                        />
                                        <defs>
                                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                                                <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                                            </linearGradient>
                                            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
                                                <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                                            </linearGradient>
                                        </defs>
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
