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
                            <div className="w-full h-full rounded-full bg-[#0f111a] flex items-center justify-center overflow-hidden">
                                <img
                                    src="/images/teacher1.png"
                                    alt="Teacher"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-white font-medium text-sm">Elara Verve&apos;s Class</span>

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
                                <svg width="800" height="600" viewBox="0 0 800 600" className="w-full h-full text-blue-500 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {/* Center Node */}
                                    <rect x="350" y="275" width="100" height="50" rx="10" className="fill-indigo-500/20 stroke-indigo-500" />
                                    <text x="400" y="305" textAnchor="middle" className="fill-white text-xs font-medium stroke-none">Lesson Plan</text>

                                    {/* Branches */}
                                    <path d="M 400 275 L 400 225" />
                                    <path d="M 400 325 L 400 375" />
                                    <path d="M 350 300 L 300 300" />
                                    <path d="M 450 300 L 500 300" />

                                    {/* Sub Nodes Top */}
                                    <rect x="350" y="175" width="100" height="50" rx="10" className="fill-purple-500/20 stroke-purple-500" />
                                    <text x="400" y="205" textAnchor="middle" className="fill-slate-300 text-[10px] stroke-none">Objective</text>

                                    {/* Sub Nodes Bottom */}
                                    <rect x="350" y="375" width="100" height="50" rx="10" className="fill-blue-500/20 stroke-blue-500" />
                                    <text x="400" y="405" textAnchor="middle" className="fill-slate-300 text-[10px] stroke-none">Assessment</text>

                                    {/* Sub Nodes Left */}
                                    <rect x="200" y="275" width="100" height="50" rx="10" className="fill-emerald-500/20 stroke-emerald-500" />
                                    <text x="250" y="305" textAnchor="middle" className="fill-slate-300 text-[10px] stroke-none">Materials</text>

                                    {/* Sub Nodes Right */}
                                    <rect x="500" y="275" width="100" height="50" rx="10" className="fill-amber-500/20 stroke-amber-500" />
                                    <text x="550" y="305" textAnchor="middle" className="fill-slate-300 text-[10px] stroke-none">Activities</text>

                                    {/* Connections to Sub-Sub Nodes (Visual flair) */}
                                    <path d="M 400 175 L 350 125" strokeOpacity="0.5" strokeDasharray="4 4" />
                                    <circle cx="350" cy="125" r="5" className="fill-slate-700 stroke-slate-500" />

                                    <path d="M 400 175 L 450 125" strokeOpacity="0.5" strokeDasharray="4 4" />
                                    <circle cx="450" cy="125" r="5" className="fill-slate-700 stroke-slate-500" />

                                    <path d="M 550 325 L 600 375" strokeOpacity="0.5" strokeDasharray="4 4" />
                                    <rect x="580" y="360" width="40" height="30" rx="5" className="fill-slate-800 stroke-slate-600" />
                                </svg>
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar */}
                    <div className="w-80 bg-[#0b0c15] border-l border-white/5 flex flex-col">
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
                                    <img
                                        src="/images/teacher1.png"
                                        alt="Teacher Video Feed"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
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
                                    <img
                                        src="/images/student2.jpg"
                                        alt="Student Video Feed"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
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
