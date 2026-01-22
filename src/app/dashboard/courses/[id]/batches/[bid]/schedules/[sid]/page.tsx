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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, ArrowLeft, UserPlus, Trash2 } from "lucide-react"
import Link from "next/link"

interface Student {
    id: string
    name: string
    email: string
    mobile: string
}

interface Schedule {
    id: string
    start_time: string
    end_time: string
}

export default function ScheduleStudentsPage({ params }: { params: Promise<{ id: string, bid: string, sid: string }> }) {
    const { id: courseId, bid: batchId, sid: scheduleId } = use(params)

    const [students, setStudents] = useState<Student[]>([])
    const [allStudents, setAllStudents] = useState<Student[]>([])
    const [schedule, setSchedule] = useState<Schedule | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState<string>("")

    const fetchData = async () => {
        setIsLoading(true)

        // Fetch Schedule Details
        const { data: scheduleData } = await supabase
            .from('class_schedules')
            .select('*')
            .eq('id', scheduleId)
            .single()

        if (scheduleData) setSchedule(scheduleData)

        // Fetch Students Enrolled in Batch
        const { data: enrolledData } = await supabase
            .from('batch_students')
            .select('student_id, students(*)')
            .eq('batch_id', batchId)

        if (enrolledData) {
            // @ts-ignore
            const mappedStudents = enrolledData.map(item => item.students).filter(Boolean) as Student[]
            setStudents(mappedStudents)
        }

        // Fetch All Students (for selection)
        // In a real app, this should be paginated or searched
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: allData } = await supabase
                .from('students')
                .select('*')
                .eq('user_id', user.id)

            if (allData) setAllStudents(allData)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [batchId, scheduleId])

    const handleAddStudent = async () => {
        if (!selectedStudentId) return alert("Please select a student")

        const { error } = await supabase
            .from('batch_students')
            .insert([{
                batch_id: batchId,
                student_id: selectedStudentId
            }])

        if (error) {
            if (error.code === '23505') { // Unique violation
                alert("Student is already enrolled in this batch")
            } else {
                alert("Failed to add student")
            }
        } else {
            fetchData()
            setIsDialogOpen(false)
            setSelectedStudentId("")
        }
    }

    const handleRemoveStudent = async (studentId: string) => {
        if (!confirm("Remove this student from the batch?")) return

        const { error } = await supabase
            .from('batch_students')
            .delete()
            .match({ batch_id: batchId, student_id: studentId })

        if (!error) fetchData()
    }

    // Filter out already enrolled students from the dropdown
    const availableStudents = allStudents.filter(s => !students.find(enrolled => enrolled.id === s.id))

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-6">
                <Link href={`/dashboard/courses/${courseId}/batches/${batchId}`} className="text-neutral-400 hover:text-white flex items-center gap-2 mb-2 text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Schedules
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            Batch Students
                        </h1>
                        <p className="text-neutral-400 mt-1">
                            {schedule && `For Schedule: ${new Date(schedule.start_time).toLocaleString()} - ${new Date(schedule.end_time).toLocaleTimeString()}`}
                        </p>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-white text-black hover:bg-neutral-200">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Enroll Student
                    </Button>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="text-neutral-400 pl-6">Name</TableHead>
                            <TableHead className="text-neutral-400">Mobile</TableHead>
                            <TableHead className="text-neutral-400">Email</TableHead>
                            <TableHead className="text-neutral-400 text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-neutral-400">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-neutral-400">
                                    No students enrolled in this batch yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableCell className="font-medium text-white pl-6">
                                        {student.name}
                                    </TableCell>
                                    <TableCell className="text-neutral-300">
                                        {student.mobile || '-'}
                                    </TableCell>
                                    <TableCell className="text-neutral-300">
                                        {student.email || '-'}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveStudent(student.id)}
                                            className="h-8 w-8 p-0 text-neutral-400 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
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
                        <DialogTitle>Enroll Student to Batch</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Select Student</Label>
                            {/* Simple select implementation */}
                            <select
                                className="w-full bg-black border border-neutral-700 text-white rounded-md p-2"
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                            >
                                <option value="">-- Select a student --</option>
                                {availableStudents.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.mobile || s.email})
                                    </option>
                                ))}
                            </select>
                            {availableStudents.length === 0 && (
                                <p className="text-xs text-neutral-500">
                                    No more students available to add. <Link href="/dashboard/students" className="underline hover:text-white">Create one here</Link>.
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-neutral-700 text-white hover:bg-neutral-800 hover:text-white">Cancel</Button>
                        <Button onClick={handleAddStudent} disabled={!selectedStudentId} className="bg-white text-black hover:bg-neutral-200">Enroll Student</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
