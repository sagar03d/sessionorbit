"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRoomContext } from '@livekit/components-react'
import { Code2, ChevronDown, Check, Copy } from 'lucide-react'

interface CodeEditorProps {
    meetingId?: string
    boardId?: string
    canWrite?: boolean
    initialData?: {
        content?: string
        language?: string
    }
}

const LANGUAGES = [
    { label: 'C/C++', value: 'cpp' },
    { label: 'C#', value: 'csharp' },
    { label: 'CSS', value: 'css' },
    { label: 'HTML', value: 'html' },
    { label: 'Java', value: 'java' },
    { label: 'Javascript', value: 'javascript' },
    { label: 'JSON', value: 'json' },
    { label: 'Markdown', value: 'markdown' },
    { label: 'Python', value: 'python' },
    { label: 'Plain Text', value: 'text' },
    { label: 'SQL', value: 'sql' }
]

export default function CodeEditor({ meetingId, boardId, canWrite, initialData }: CodeEditorProps) {
    const [content, setContent] = useState(initialData?.content || "// Share your code here...")
    const [language, setLanguage] = useState(initialData?.language || 'javascript')
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const room = useRoomContext()
    const contentRef = useRef(content)

    // Sync content ref
    useEffect(() => {
        contentRef.current = content
    }, [content])

    // Handle incoming data
    useEffect(() => {
        if (!room) return

        const handleData = (payload: Uint8Array) => {
            const decoder = new TextDecoder()
            const data = JSON.parse(decoder.decode(payload))

            if (data.type === 'code-sync' && data.boardId === boardId) {
                if (data.content !== contentRef.current) {
                    setContent(data.content)
                }
                if (data.language !== language) {
                    setLanguage(data.language)
                }
            }
        }

        room.on('dataReceived', handleData)
        return () => { room.off('dataReceived', handleData) }
    }, [room, boardId, language])

    const broadcastRef = useRef<any>(null)

    const broadcastChange = useCallback((newContent: string, newLang: string) => {
        if (!room || !canWrite) return

        // Clear existing timeout
        if (broadcastRef.current) clearTimeout(broadcastRef.current)

        broadcastRef.current = setTimeout(() => {
            const encoder = new TextEncoder()
            const payload = encoder.encode(JSON.stringify({
                type: 'code-sync',
                boardId,
                content: newContent,
                language: newLang
            }))

            room.localParticipant.publishData(payload, { reliable: true })
        }, 100) // 100ms debounce
    }, [room, boardId, canWrite])

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setContent(val)
        broadcastChange(val, language)
    }

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
        setIsLangMenuOpen(false)
        // Immediate broadcast for language changes
        if (room && canWrite) {
            const encoder = new TextEncoder()
            const payload = encoder.encode(JSON.stringify({
                type: 'code-sync',
                boardId,
                content: contentRef.current,
                language: lang
            }))
            room.localParticipant.publishData(payload, { reliable: true })
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative w-full h-full bg-[#1e1e1e] group">
            {/* Editor Area */}
            <div className="absolute inset-0">
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    readOnly={!canWrite}
                    spellCheck={false}
                    className="w-full h-full bg-transparent p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none text-neutral-300 scrollbar-thin scrollbar-thumb-white/10"
                    placeholder="Type your code here..."
                />
            </div>

            {/* Floating Toolbar */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 sm:top-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-6 sm:translate-y-0 flex flex-col sm:flex-row items-center gap-1 bg-[#0f172a]/95 p-1.5 rounded-2xl shadow-2xl border border-white/10 z-30 transition-all duration-300 backdrop-blur-md">

                {/* Language Selector */}
                <div className="relative flex items-center px-1 border-b sm:border-b-0 sm:border-r border-white/10 pb-1 sm:pb-0">
                    <button
                        onClick={() => canWrite && setIsLangMenuOpen(!isLangMenuOpen)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium text-slate-300 ${!canWrite && 'opacity-50 cursor-not-allowed'}`}
                    >
                        <Code2 className="w-4 h-4 text-indigo-400" />
                        <span className="hidden sm:inline">{LANGUAGES.find(l => l.value === language)?.label || 'Plain Text'}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Language Menu - Popover up */}
                    {isLangMenuOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-[100] py-1 max-h-64 overflow-y-auto thin-scrollbar">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.value}
                                    onClick={() => handleLanguageChange(lang.value)}
                                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-between"
                                >
                                    {lang.label}
                                    {language === lang.value && <Check className="w-3 h-3 text-indigo-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-1 px-1 pt-1 sm:pt-0">
                    <button
                        onClick={copyToClipboard}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Copy Code"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {!canWrite && (
                        <div className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                            Read Only
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
