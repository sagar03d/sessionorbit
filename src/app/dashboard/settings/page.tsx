"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Loader2, User, Mail, Monitor, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"
// removed sonner import


export default function SettingsPage() {
    const router = useRouter()
    const { profile, refreshProfile } = useUser()
    const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'appearance'>('profile')

    // Profile State
    const [fullName, setFullName] = useState(profile?.full_name || "")
    const [isSavingProfile, setIsSavingProfile] = useState(false)

    // Account (Email) State
    const [email, setEmail] = useState(profile?.email || "")
    const [otp, setOtp] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [emailToken, setEmailToken] = useState("")
    const [isSendingOtp, setIsSendingOtp] = useState(false)
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

    // Appearance State
    const [bgSettings, setBgSettings] = useState<{ type: 'none' | 'blur' | 'image', imageBase64?: string }>({ type: 'none' })
    const [isSavingAppearance, setIsSavingAppearance] = useState(false)

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "")
            setEmail(profile.email || "")
        }
    }, [profile])

    useEffect(() => {
        // Load saved appearance settings
        const saved = localStorage.getItem('virtualBgSettings')
        if (saved) {
            try {
                setBgSettings(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse settings", e)
            }
        }
    }, [])

    const handleSaveProfile = async () => {
        setIsSavingProfile(true)
        try {
            const res = await fetch('/api/settings/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName })
            })

            if (!res.ok) throw new Error('Failed to update profile')

            await refreshProfile()
            alert("Profile updated successfully!")
        } catch (error) {
            console.error(error)
            alert("Failed to update profile")
        } finally {
            setIsSavingProfile(false)
        }
    }

    const handleSendOtp = async () => {
        if (!email) return alert("Please enter an email address")
        setIsSendingOtp(true)
        try {
            const res = await fetch('/api/settings/email/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to send OTP')
            }

            const data = await res.json()
            setEmailToken(data.token) // Store the signed token
            setIsOtpSent(true)
            alert(`OTP sent to ${email}`)
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Failed to send OTP")
        } finally {
            setIsSendingOtp(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp) return alert("Please enter the OTP")
        setIsVerifyingOtp(true)
        try {
            const res = await fetch('/api/settings/email/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: emailToken,
                    otp,
                    email
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Invalid OTP')
            }

            alert("Email updated successfully! Please log in again with your new email.")
            setIsOtpSent(false)
            setOtp("")
            // Force logout or redirect
            router.push('/login')
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Failed to verify OTP")
        } finally {
            setIsVerifyingOtp(false)
        }
    }

    const handleSaveAppearance = () => {
        setIsSavingAppearance(true)
        localStorage.setItem('virtualBgSettings', JSON.stringify(bgSettings))
        setTimeout(() => {
            setIsSavingAppearance(false)
            alert("Appearance settings saved!")
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

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto text-white">
            <div className="mb-8">
                <Link href="/dashboard" className="text-neutral-400 hover:text-white flex items-center gap-2 mb-4 text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-neutral-400 mt-2">Manage your account and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}
                    >
                        <User className="w-4 h-4" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'account' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Account & Security
                    </button>
                    <button
                        onClick={() => setActiveTab('appearance')}
                        className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'appearance' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}
                    >
                        <Monitor className="w-4 h-4" />
                        Appearance
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-8">

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 max-w-xl">
                            <div>
                                <h2 className="text-xl font-semibold mb-1">Public Profile</h2>
                                <p className="text-sm text-neutral-400">Manage how others see you on the platform.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-black/50 border border-neutral-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="pt-4">
                                <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="bg-white text-black hover:bg-neutral-200">
                                    {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ACCOUNT TAB */}
                    {activeTab === 'account' && (
                        <div className="space-y-6 max-w-xl">
                            <div>
                                <h2 className="text-xl font-semibold mb-1">Account Security</h2>
                                <p className="text-sm text-neutral-400">Update your email and security preferences.</p>
                            </div>

                            <div className="space-y-6 border border-neutral-800 rounded-lg p-6 bg-black/20">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300">Email Address</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isOtpSent} // Lock email when OTP is sent
                                            className="flex-1 bg-black/50 border border-neutral-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                                            placeholder="name@example.com"
                                        />
                                        {!isOtpSent && (
                                            <Button
                                                onClick={handleSendOtp}
                                                disabled={isSendingOtp || email === profile?.email}
                                                variant="outline"
                                                className="border-neutral-700 hover:bg-neutral-800 hover:text-white"
                                            >
                                                {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-neutral-500">
                                        Changing your email will require re-login.
                                    </p>
                                </div>

                                {isOtpSent && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <label className="text-sm font-medium text-neutral-300">Verification Code</label>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="flex-1 bg-black/50 border border-neutral-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 tracking-widest text-center font-mono"
                                                placeholder="000000"
                                                maxLength={6}
                                            />
                                            <Button
                                                onClick={handleVerifyOtp}
                                                disabled={isVerifyingOtp || otp.length < 6}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                                            </Button>
                                        </div>
                                        <button
                                            onClick={() => setIsOtpSent(false)}
                                            className="text-xs text-neutral-400 hover:text-white underline underline-offset-4"
                                        >
                                            Cancel / Change Email
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* APPEARANCE TAB (Legacy + New) */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-1">Meeting Appearance</h2>
                                <p className="text-sm text-neutral-400">Customize how you appear in calls.</p>
                            </div>

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

                            <div className="pt-4">
                                <Button onClick={handleSaveAppearance} disabled={isSavingAppearance} className="bg-white text-black hover:bg-neutral-200">
                                    {isSavingAppearance ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Preference
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
