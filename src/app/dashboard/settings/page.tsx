"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const router = useRouter()
    const [bgSettings, setBgSettings] = useState<{ type: 'none' | 'blur' | 'image', imageBase64?: string }>({ type: 'none' })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        // Load saved settings
        const saved = localStorage.getItem('virtualBgSettings')
        if (saved) {
            try {
                setBgSettings(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse settings", e)
            }
        }
        setIsLoading(false)
    }, [])

    const handleSave = () => {
        setIsSaving(true)
        localStorage.setItem('virtualBgSettings', JSON.stringify(bgSettings))
        setTimeout(() => {
            setIsSaving(false)
            alert("Settings saved!")
        }, 500)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result as string
                setBgSettings({ type: 'image', imageBase64: base64 })
            }
            reader.readAsDataURL(file)
        }
    }

    if (isLoading) return <div className="p-8 text-neutral-400">Loading...</div>

    return (
        <div className="p-8 max-w-4xl mx-auto text-white">
            <div className="mb-8">
                <Link href="/dashboard" className="text-neutral-400 hover:text-white flex items-center gap-2 mb-4 text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-neutral-400 mt-2">Manage your call preferences and appearance.</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Virtual Background</h2>
                    <p className="text-sm text-neutral-400 mb-6">Choose how you appear in calls. This setting will be applied automatically when you join.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
                        {/* None Option */}
                        <button
                            onClick={() => setBgSettings({ type: 'none' })}
                            className={`h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${bgSettings.type === 'none' ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800'}`}
                        >
                            <div className="w-12 h-12 rounded border border-neutral-500 bg-neutral-700"></div>
                            <span className="font-medium">None</span>
                        </button>

                        {/* Blur Option */}
                        <button
                            onClick={() => setBgSettings({ type: 'blur' })}
                            className={`h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${bgSettings.type === 'blur' ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800'}`}
                        >
                            <div className="w-12 h-12 rounded bg-gradient-to-br from-neutral-400 to-neutral-600 blur-[2px]"></div>
                            <span className="font-medium">Blur</span>
                        </button>

                        {/* Image Upload Option */}
                        <label className={`h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${bgSettings.type === 'image' ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            {bgSettings.type === 'image' && bgSettings.imageBase64 ? (
                                <img src={bgSettings.imageBase64} alt="Preview" className="w-12 h-12 object-cover rounded" />
                            ) : (
                                <div className="w-12 h-12 flex items-center justify-center bg-neutral-700 rounded text-neutral-300">Img</div>
                            )}
                            <span className="font-medium">{bgSettings.type === 'image' ? 'Change Image' : 'Upload Image'}</span>
                        </label>
                    </div>
                </div>

                <div className="pt-6 border-t border-neutral-800 flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-white text-black hover:bg-neutral-200 min-w-[100px]">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
