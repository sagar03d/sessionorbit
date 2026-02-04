"use client";

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
    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

            {/* Main Interface Container */}
            <div className="relative w-full rounded-xl bg-[#0f111a] border border-white/10 shadow-2xl overflow-hidden min-h-[700px] flex flex-col font-sans">

                {/* Top Header */}
                <div className="h-14 border-b border-white/5 bg-[#0f111a] flex items-center justify-between px-4 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                            <div className="w-full h-full rounded-full bg-[#0f111a] flex items-center justify-center">
                                <span className="text-indigo-400 font-bold text-xs">M</span>
                            </div>
                        </div>
                        <span className="text-white font-medium text-sm">Peter Tabichi&apos;s Class</span>

                        <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

                        <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-red-400 text-xs font-medium">Recording...</span>
                        </div>

                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-slate-300 text-xs transition-colors">
                            <UserPlus size={14} />
                            Invite
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-slate-300 text-xs transition-colors">
                            <Save size={14} />
                            SAVE DATA
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors">
                            <Settings size={18} />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-red-500/10 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* Tab & Content Area */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Main Canvas Area */}
                    <div className="flex-1 flex flex-col relative bg-[#13151f]">
                        {/* Canvas Tabs */}
                        <div className="h-10 border-b border-white/5 bg-[#0f111a] flex items-end px-2">
                            <button className="px-4 py-2 bg-[#13151f] text-white text-xs font-medium rounded-t-md border-t border-x border-white/5 relative top-[1px]">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 text-slate-400"><Square size={12} /></span>
                                    Whiteboard
                                </div>
                            </button>
                            <button className="px-3 py-2 text-slate-500 hover:text-slate-300 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Toolbar */}
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-[#1a1d2d] border border-white/10 rounded-lg p-1.5 flex items-center gap-1 shadow-xl">
                            <ToolButton icon={MousePointer2} />
                            <ToolButton icon={Hand} />
                            <ToolButton icon={Pen} active />
                            <ToolButton icon={Eraser} />
                            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                            <ToolButton icon={Square} />
                            <ToolButton icon={Circle} />
                            <ToolButton icon={Triangle} />
                            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                            <ToolButton icon={Type} />
                            <ToolButton icon={StickyNote} />
                            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                            <ToolButton icon={Undo2} />
                            <ToolButton icon={Redo2} />
                            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                            <button className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white"><Minus size={14} /></button>
                            <span className="text-[10px] text-slate-400 w-8 text-center">100%</span>
                            <button className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white"><Plus size={14} /></button>
                            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                            <div className="flex items-center gap-1.5 px-1">
                                <div className="w-4 h-4 rounded-full bg-black border border-white/20 cursor-pointer"></div>
                                <div className="w-4 h-4 rounded-full bg-red-500 cursor-pointer"></div>
                                <div className="w-4 h-4 rounded-full bg-green-500 cursor-pointer"></div>
                                <div className="w-4 h-4 rounded-full bg-blue-500 ring-1 ring-white ring-offset-1 ring-offset-[#1a1d2d] cursor-pointer"></div>
                            </div>
                            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                            <button className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white"><Trash2 size={16} /></button>
                            <button className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white"><Download size={16} /></button>
                        </div>

                        {/* Canvas Content (Venn Diagram) */}
                        <div className="flex-1 w-full h-full relative overflow-hidden">
                            {/* Grid Background */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:24px_24px]"></div>

                            {/* SVG Drawing */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <svg width="800" height="600" viewBox="0 0 800 600" className="w-full h-full text-blue-500 stroke-current" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    {/* Circle 1 */}
                                    <circle cx="300" cy="300" r="180" />
                                    {/* Circle 2 */}
                                    <circle cx="500" cy="300" r="180" />

                                    {/* Hatching in Intersection (Manual Approximation for visuals) */}
                                    <path d="M 400 200 L 460 200" strokeOpacity="0.5" />
                                    <path d="M 390 230 L 470 230" strokeOpacity="0.5" />
                                    <path d="M 380 260 L 480 260" strokeOpacity="0.5" />
                                    <path d="M 375 290 L 485 290" strokeOpacity="0.5" />
                                    <path d="M 375 320 L 485 320" strokeOpacity="0.5" />
                                    <path d="M 380 350 L 480 350" strokeOpacity="0.5" />
                                    <path d="M 390 380 L 470 380" strokeOpacity="0.5" />
                                    <path d="M 400 410 L 460 410" strokeOpacity="0.5" />
                                </svg>
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar */}
                    <div className="w-80 bg-[#0b0c15] border-l border-white/5 flex flex-col">
                        <div className="h-10 flex items-center px-4 border-b border-white/5 text-slate-400 text-xs font-semibold tracking-wider gap-2">
                            <Video size={14} /> LIVE FEEDS
                        </div>

                        <div className="p-4">
                            <div className="relative aspect-video rounded-lg bg-[#1a1d2d] border border-white/5 overflow-hidden group">
                                {/* Feed Badge */}
                                <div className="absolute top-3 left-3 px-2 py-0.5 bg-indigo-500 rounded text-[10px] font-bold text-white z-10">
                                    Teacher
                                </div>

                                {/* Feed Content */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                        PT
                                    </div>
                                </div>

                                {/* Audio Indicator */}
                                <div className="absolute bottom-3 right-3 p-1.5 bg-black/50 rounded-full text-white/50 backdrop-blur-sm">
                                    <MicOff size={14} />
                                </div>

                                {/* Name Label */}
                                <div className="absolute bottom-3 left-3 text-xs text-slate-400 font-medium">
                                    Peter Tabichi
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="p-2 bg-black/50 rounded-full backdrop-blur-sm text-white hover:bg-indigo-500 transition-colors cursor-pointer">
                                        <MoreHorizontal size={16} />
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="relative aspect-video rounded-lg bg-[#1a1d2d] border border-white/5 overflow-hidden group">
                                {/* Feed Badge */}
                                <div className="absolute top-3 left-3 px-2 py-0.5 bg-indigo-500 rounded text-[10px] font-bold text-white z-10">
                                    Student
                                </div>

                                {/* Feed Content */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                        J
                                    </div>
                                </div>

                                {/* Audio Indicator */}
                                <div className="absolute bottom-3 right-3 p-1.5 bg-black/50 rounded-full text-white/50 backdrop-blur-sm">
                                    <MicOff size={14} />
                                </div>

                                {/* Name Label */}
                                <div className="absolute bottom-3 left-3 text-xs text-slate-400 font-medium">
                                    John
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="p-2 bg-black/50 rounded-full backdrop-blur-sm text-white hover:bg-indigo-500 transition-colors cursor-pointer">
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

function ToolButton({ icon: Icon, active = false }: { icon: any, active?: boolean }) {
    return (
        <button
            className={`p-2 rounded-md transition-all ${active
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon size={18} />
        </button>
    );
}
