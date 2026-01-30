"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRoomContext } from '@livekit/components-react'
import { supabase } from '@/lib/supabase'

// Dynamic import for Excalidraw (it's client-only)
const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium animate-pulse">Loading Infinite Board...</p>
                </div>
            </div>
        ),
    },
)

interface ExcalidrawBoardProps {
    meetingId?: string
    boardId?: string
    canWrite?: boolean
    initialData?: {
        elements?: any[]
        appState?: any
    }
}

export default function ExcalidrawBoard({ meetingId, boardId, canWrite, initialData }: ExcalidrawBoardProps) {
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
    const room = useRoomContext()
    const lastSceneRef = useRef<{ elements: any[]; appState: any } | null>(null)
    const isRemoteUpdateRef = useRef(false)
    const saveTimeoutRef = useRef<any>(null)

    // Initial data load
    useEffect(() => {
        if (excalidrawAPI && initialData?.elements) {
            excalidrawAPI.updateScene({
                elements: initialData.elements,
                appState: initialData.appState || {},
                commitToHistory: false
            })
        }
    }, [excalidrawAPI, initialData])

    // Broadcast changes to LiveKit
    const broadcastScene = useCallback((elements: any[], appState: any) => {
        if (!room || !canWrite) return

        const encoder = new TextEncoder()
        const payload = encoder.encode(JSON.stringify({
            type: 'excalidraw-sync',
            boardId,
            elements,
            appState: {
                viewBackgroundColor: appState.viewBackgroundColor,
                currentItemFontFamily: appState.currentItemFontFamily,
                // Only sync essential state to reduce payload size
            }
        }))

        room.localParticipant.publishData(payload, { reliable: true })
    }, [room, boardId, canWrite])

    // Save to DB (Debounced)
    const saveToDb = useCallback((elements: any[], appState: any) => {
        if (!meetingId || !boardId || !canWrite) return

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

        saveTimeoutRef.current = setTimeout(async () => {
            const { data } = await supabase
                .from('meetings')
                .select('whiteboard_data')
                .eq('id', meetingId)
                .single()

            const currentData = data?.whiteboard_data || {}
            const updatedData = {
                ...currentData,
                [boardId]: {
                    type: 'excalidraw',
                    elements,
                    appState
                }
            }

            await supabase
                .from('meetings')
                .update({ whiteboard_data: updatedData })
                .eq('id', meetingId)
        }, 3000) // 3s debounce for DB saves
    }, [meetingId, boardId, canWrite])

    // Handle scene updates from local interactions
    const onChange = (elements: readonly any[], appState: any) => {
        if (isRemoteUpdateRef.current) return

        // Check if anything meaningful changed to avoid spamming
        // Excalidraw fires onChange for cursors, etc.
        // We only broadcast if elements changed or specific appState
        broadcastScene([...elements], appState)
        saveToDb([...elements], appState)
    }

    // Handle incoming data from LiveKit
    useEffect(() => {
        if (!room || !excalidrawAPI) return

        const handleData = (payload: Uint8Array) => {
            const decoder = new TextDecoder()
            try {
                const data = JSON.parse(decoder.decode(payload))

                if (data.type === 'excalidraw-sync' && data.boardId === boardId) {
                    isRemoteUpdateRef.current = true
                    excalidrawAPI.updateScene({
                        elements: data.elements,
                        appState: { ...excalidrawAPI.getAppState(), ...data.appState },
                        commitToHistory: false
                    })
                    setTimeout(() => {
                        isRemoteUpdateRef.current = false
                    }, 50)
                }
            } catch (e) {
                console.error("Failed to parse Excalidraw sync data", e)
            }
        }

        room.on('dataReceived', handleData)
        return () => { room.off('dataReceived', handleData) }
    }, [room, excalidrawAPI, boardId])

    return (
        <div className="w-full h-full bg-white overflow-hidden relative">
            <Excalidraw
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                onChange={onChange}
                viewModeEnabled={!canWrite}
                theme="light"
                gridModeEnabled={false}
                UIOptions={{
                    canvasActions: {
                        loadScene: false,
                        saveAsImage: true,
                        export: { saveFileToDisk: true },
                    }
                }}
            />
        </div>
    )
}
