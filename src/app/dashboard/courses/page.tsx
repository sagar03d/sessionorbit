"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Plus, ChevronRight, Hash, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Course {
    id: string
    name: string
    code: string
    created_at: string
}

export default function CoursesPage() {
    const router = useRouter()
    const { user, isLoading: isUserLoading } = useUser()
    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newCourse, setNewCourse] = useState({ name: '', code: '' })

    const fetchCourses = async () => {
        if (!user) return
        setIsLoading(true)

        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) {
                setCourses(data)
            }
        } catch (error) {
            console.error("Error fetching courses:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!isUserLoading && user) {
            fetchCourses()
        } else if (!isUserLoading && !user) {
            setIsLoading(false)
        }
    }, [user, isUserLoading])

    const handleCreateWrapper = async () => {
        if (!newCourse.name || !newCourse.code) return alert("All fields are required")

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('courses')
            .insert([{
                user_id: user.id,
                name: newCourse.name,
                code: newCourse.code
            }])

        if (!error) {
            fetchCourses()
            setIsDialogOpen(false)
            setNewCourse({ name: '', code: '' })
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent row click
        if (!confirm("Are you sure you want to delete this course?")) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const res = await fetch(`/api/v1/courses?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const result = await res.json()
            if (res.ok) {
                fetchCourses()
            } else {
                alert(result.error || "Delete failed")
            }
        } catch (err) {
            console.error("Delete error:", err)
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Courses</h1>
                    <p className="text-neutral-400 mt-1">Manage your course catalog</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-white text-black hover:bg-neutral-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                </Button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="text-neutral-400 pl-6">Course Name</TableHead>
                            <TableHead className="text-neutral-400 w-[200px]">Course Code</TableHead>
                            <TableHead className="text-neutral-400 w-[100px] text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-neutral-400">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-neutral-400">
                                    No courses found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            courses.map((course) => (
                                <TableRow
                                    key={course.id}
                                    className="border-neutral-800 hover:bg-neutral-800/50 cursor-pointer group"
                                    onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                                >
                                    <TableCell className="font-medium text-white pl-6">
                                        {course.name}
                                    </TableCell>
                                    <TableCell className="text-neutral-300 font-mono text-sm">
                                        <div className="flex items-center gap-2 bg-black/50 w-fit px-2 py-1 rounded">
                                            <Hash className="w-3 h-3 text-neutral-500" />
                                            {course.code}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-neutral-800"
                                                onClick={(e) => handleDelete(course.id, e)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                                        </div>
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
                        <DialogTitle>Create New Course</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Course Name</Label>
                            <Input
                                value={newCourse.name}
                                onChange={e => setNewCourse(s => ({ ...s, name: e.target.value }))}
                                className="bg-black border-neutral-700 text-white"
                                placeholder="Introduction to React"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Course Code</Label>
                            <Input
                                value={newCourse.code}
                                onChange={e => setNewCourse(s => ({ ...s, code: e.target.value }))}
                                className="bg-black border-neutral-700 text-white"
                                placeholder="REACT-101"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-neutral-700 text-white hover:bg-neutral-800 hover:text-white">Cancel</Button>
                        <Button onClick={handleCreateWrapper} className="bg-white text-black hover:bg-neutral-200">Create Course</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
