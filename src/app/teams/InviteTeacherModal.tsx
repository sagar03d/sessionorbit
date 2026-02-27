
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, Loader2, X, Send } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function InviteTeacherModal({ isOpen, onClose, onInviteSent, plan, seatsUsed, seatsLimit }: any) {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    if (!isOpen) return null

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: any = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const res = await fetch('/api/organizations/invite', {
                method: 'POST',
                headers,
                body: JSON.stringify({ email, role: 'teacher' })
            })

            const data = await res.json()

            if (data.error) {
                setError(data.error)
            } else {
                setEmail("")
                onInviteSent()
                onClose()
            }
        } catch (err) {
            setError("Failed to send invite.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Invite Teacher
                    </h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm space-y-1">
                    <p className="font-medium text-blue-400">Plan Status: {plan}</p>
                    <div className="flex justify-between text-blue-300">
                        <span>Seats Used:</span>
                        <span>{seatsUsed} / {seatsLimit}</span>
                    </div>
                </div>

                <form onSubmit={handleInvite} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Teacher's Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="colleague@school.com"
                            className="w-full px-4 py-2 rounded-lg bg-black border border-neutral-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent border-neutral-700 hover:bg-neutral-800">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                            Send Invite
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
