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
        <div className="flex flex-col h-full bg-[#1e1e1e] text-neutral-300 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Editor</span>
                    </div>

                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => canWrite && setIsLangMenuOpen(!isLangMenuOpen)}
                            className={`flex items-center gap-2 px-3 py-1 rounded bg-[#3c3c3c] hover:bg-[#4a4a4a] transition-colors text-xs font-medium ${!canWrite && 'opacity-50 cursor-not-allowed'}`}
                        >
                            {LANGUAGES.find(l => l.value === language)?.label || 'Plain Text'}
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {isLangMenuOpen && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-[#2d2d2d] border border-white/10 rounded shadow-2xl z-[100] py-1 max-h-64 overflow-y-auto thin-scrollbar">
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.value}
                                        onClick={() => handleLanguageChange(lang.value)}
                                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#3c3c3c] flex items-center justify-between"
                                    >
                                        {lang.label}
                                        {language === lang.value && <Check className="w-3 h-3 text-blue-400" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={copyToClipboard}
                    className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Code"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative overflow-hidden">
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    readOnly={!canWrite}
                    spellCheck={false}
                    className="absolute inset-0 w-full h-full bg-transparent p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none scrollbar-thin scrollbar-thumb-white/10"
                    placeholder="Type your code here..."
                />
            </div>

            {/* Footer / Status */}
            <div className="px-4 py-1.5 bg-[#007acc] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider">
                    <span>{language}</span>
                    <span>UTF-8</span>
                </div>
                {!canWrite && (
                    <span className="text-[10px] font-bold uppercase italic opacity-80">Read Only</span>
                )}
            </div>
        </div>
    )
}
