"use client"

import { useChat } from "@livekit/components-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User as UserIcon } from "lucide-react"

export default function Chat() {
    const { chatMessages, send, isSending } = useChat()
    const [message, setMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatMessages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || isSending) return

        try {
            await send(message)
            setMessage("")
        } catch (error) {
            console.error("Failed to send message:", error)
        }
    }

    return (
        <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-800">
            <div className="p-4 border-b border-neutral-800 bg-neutral-900 shrink-0">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live Chat
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 thin-scrollbar">
                {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-2 opacity-50">
                        <UserIcon className="w-8 h-8" />
                        <p className="text-xs">No messages yet</p>
                    </div>
                )}
                {chatMessages.map((msg) => {
                    const isLocal = msg.from?.isLocal
                    return (
                        <div key={msg.timestamp} className={`flex flex-col ${isLocal ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-baseline gap-2 mb-1 ${isLocal ? 'flex-row-reverse' : 'flex-row'}`}>
                                <span className={`text-[10px] font-bold ${isLocal ? 'text-indigo-400' : 'text-neutral-300'}`}>
                                    {msg.from?.name || "Unknown"}
                                </span>
                                <span className="text-[9px] text-neutral-600">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className={`px-3 py-2 rounded-lg text-sm max-w-[90%] break-words ${isLocal
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700'
                                }`}>
                                {msg.message}
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-800 bg-neutral-900 shrink-0">
                <div className="flex gap-2">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-indigo-500"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isSending || !message.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
