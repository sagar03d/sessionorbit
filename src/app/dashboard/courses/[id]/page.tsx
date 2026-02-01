"use client"

import { useEffect, useState, use } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useUser } from "@/hooks/useUser"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Plus, ChevronRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Batch {
    id: string
    name: string
    code: string
    course_id: string
}

interface Course {
    id: string
    name: string
    code: string
}

export default function BatchesPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15+ async params unwrap
    const { id: courseId } = use(params)

    const router = useRouter()
    const [course, setCourse] = useState<Course | null>(null)
    const [batches, setBatches] = useState<Batch[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newBatch, setNewBatch] = useState({ name: '', code: '' })

    const fetchData = async () => {
        setIsLoading(true)
        if (!user) return

        try {
            // Fetch batches via API
            const res = await fetch(`/api/v1/batches?courseId=${courseId}`)
            const result = await res.json()

            if (res.ok && result.data) {
                setBatches(result.data)
            }

            // Fetch course details (still via Supabase for now or create API? 
            // Existing Courses API doesn't support get-one easily without update.
            // But we can misuse list with filter? 
            // Actually, we can just use the existing `courses` API if we update it to support fetching one?
            // OR, for now, we try Supabase direct for course details? 
            // NO, Supabase direct details will ALSO fail in Prod!
            // We need to fetch course details via API too.
            // Let's assume we can add `?id=` support to `courses` endpoint or just fetch all and find?
            // "Fetch all and find" is inefficient but simple for now given existing API.
            // Ideally we update `courses` API.
            // Let's use `courses` API and filter client side for 1 item (MVP).

            const courseRes = await fetch('/api/v1/courses')
            const courseResult = await courseRes.json()
            if (courseRes.ok && courseResult.data) {
                const found = courseResult.data.find((c: any) => c.id === courseId)
                if (found) setCourse(found)
            }

        } catch (e) {
            console.error("Fetch error:", e)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (user) fetchData()
    }, [courseId, user])

    const handleCreate = async () => {
        if (!newBatch.name || !newBatch.code) return alert("All fields are required")
        if (!user) return

        try {
            const res = await fetch('/api/v1/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId,
                    name: newBatch.name,
                    code: newBatch.code
                })
            })
            const result = await res.json()

            if (res.ok) {
                fetchData() // Refresh list
                setIsDialogOpen(false)
                setNewBatch({ name: '', code: '' })
            } else {
                alert(result.error || "Failed to create batch")
            }
        } catch (e) {
            console.error("Create failed", e)
            alert("Create failed")
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard/courses" className="text-neutral-400 hover:text-white flex items-center gap-2 mb-2 text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            {course?.name}
                            <span className="text-neutral-500 font-normal text-xl">/ Batches</span>
                        </h1>
                        <p className="text-neutral-400 mt-1">Manage batches for {course?.code}</p>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-white text-black hover:bg-neutral-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Batch
                    </Button>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="text-neutral-400 pl-6">Batch Name</TableHead>
                            <TableHead className="text-neutral-400">Batch Code</TableHead>
                            <TableHead className="text-neutral-400 text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-neutral-400">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : batches.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-neutral-400">
                                    No batches found for this course.
                                </TableCell>
                            </TableRow>
                        ) : (
                            batches.map((batch) => (
                                <TableRow
                                    key={batch.id}
                                    className="border-neutral-800 hover:bg-neutral-800/50 cursor-pointer group"
                                    onClick={() => router.push(`/dashboard/courses/${courseId}/batches/${batch.id}`)}
                                >
                                    <TableCell className="font-medium text-white pl-6">
                                        {batch.name}
                                    </TableCell>
                                    <TableCell className="text-neutral-300">
                                        {batch.code}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Create New Batch</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Batch Name</Label>
                            <Input
                                value={newBatch.name}
                                onChange={e => setNewBatch(s => ({ ...s, name: e.target.value }))}
                                className="bg-black border-neutral-700 text-white"
                                placeholder="Morning Batch A"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Batch Code</Label>
                            <Input
                                value={newBatch.code}
                                onChange={e => setNewBatch(s => ({ ...s, code: e.target.value }))}
                                className="bg-black border-neutral-700 text-white"
                                placeholder="BATCH-A-2024"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-neutral-700 text-white hover:bg-neutral-800 hover:text-white">Cancel</Button>
                        <Button onClick={handleCreate} className="bg-white text-black hover:bg-neutral-200">Create Batch</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
