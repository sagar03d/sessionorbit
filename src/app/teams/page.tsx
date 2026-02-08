
"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Plus, Users, Mail, Shield, User, Loader2, Trash2 } from "lucide-react"
import InviteTeacherModal from "./InviteTeacherModal"
import { useRouter } from "next/navigation"

export default function TeamPage() {
    const { user, profile, isLoading: isUserLoading } = useUser()
    const [members, setMembers] = useState<any[]>([])
    const [invites, setInvites] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!isUserLoading && (!user || (profile && profile.role !== 'admin' && profile.role !== 'owner'))) {
            // Redirect if not admin (unauthorized) - simplified check
            // In real app, maybe show "Contract Admin to manage team"
        }
    }, [user, profile, isUserLoading])

    const fetchData = async () => {
        if (!profile?.organization_id) return
        setIsLoading(true)
        try {
            // Fetch Members
            const { data: membersData } = await supabase
                .from('profiles')
                .select('*')
                .eq('organization_id', profile.organization_id)

            setMembers(membersData || [])

            // Fetch Invites
            const { data: invitesData } = await supabase
                .from('organization_invites')
                .select('*')
                .eq('organization_id', profile.organization_id)
                .eq('status', 'pending')

            setInvites(invitesData || [])
        } catch (error) {
            console.error("Error fetching team data:", error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isUserLoading) return;

        if (profile?.organization_id) {
            fetchData()
        } else {
            // If explicit check for organization fails or doesn't exist, stop loading
            setIsLoading(false)
        }
    }, [profile, isUserLoading])


    if (isUserLoading || isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        )
    }

    if (!profile?.organization_id) {
        const isPro = profile?.plan?.toLowerCase() === 'pro' || profile?.plan?.toLowerCase() === 'enterprise'

        return (
            <div className="min-h-screen bg-[#0B0C15] text-white p-12">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                        <Users className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">No Organization Found</h2>
                    <p className="text-slate-400 mb-8">
                        {isPro
                            ? "You don't have an organization yet. Create one to start inviting team members."
                            : "Team management is available on Pro and Enterprise plans."
                        }
                    </p>

                    {isPro ? (
                        <Button
                            onClick={() => router.push('/dashboard/settings?tab=organization')}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Organization
                        </Button>
                    ) : (
                        <Button
                            onClick={() => router.push('/pricing')}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            View Plans
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    // Determine limits
    const limit = profile.plan === 'Pro' ? 5 : 1 // Assuming profile.plan comes correctly mapped
    const seatsUsed = members.length + invites.length

    return (
        <div className="min-h-screen bg-black text-white p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Team Management</h1>
                        <p className="text-neutral-400 mt-2">Manage your organization members and invites.</p>
                    </div>
                    <Button
                        onClick={() => setIsInviteModalOpen(true)}
                        disabled={seatsUsed >= limit}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Invite Teacher
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Total Members</p>
                                <p className="text-2xl font-bold">{members.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Pending Invites</p>
                                <p className="text-2xl font-bold">{invites.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-400">Seat Usage</p>
                                <p className="text-2xl font-bold">{seatsUsed} / {limit}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Members</h2>
                    <div className="rounded-2xl border border-neutral-800 overflow-hidden">
                        {members.map((member) => (
                            <div key={member.id} className="p-4 bg-neutral-900/30 border-b border-neutral-800 last:border-0 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{member.full_name || 'Unknown'}</p>
                                        <p className="text-sm text-neutral-500">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${member.role === 'owner' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        member.role === 'admin' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            'bg-neutral-800 text-neutral-400 border-neutral-700'
                                        }`}>
                                        {member.role.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invites List */}
                {invites.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Pending Invites</h2>
                        <div className="rounded-2xl border border-neutral-800 overflow-hidden">
                            {invites.map((invite) => (
                                <div key={invite.id} className="p-4 bg-neutral-900/30 border-b border-neutral-800 last:border-0 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{invite.email}</p>
                                            <p className="text-sm text-neutral-500">Expires: {new Date(invite.expires_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
                                            PENDING
                                        </span>
                                        {/* Ability to revoke could go here */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <InviteTeacherModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInviteSent={fetchData}
                plan={profile.plan}
                seatsUsed={seatsUsed}
                seatsLimit={limit}
            />
        </div>
    )
}
