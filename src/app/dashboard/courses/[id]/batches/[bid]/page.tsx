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
import { Plus, ChevronRight, ArrowLeft, Calendar, Clock, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DateTimePicker } from "@/components/ui/date-time-picker"

interface Schedule {
    id: string
    start_time: string
    end_time: string
}

interface Batch {
    id: string
    name: string
    code: string
}

interface Course {
    id: string
    name: string
}

interface Student {
    id: string
    name: string
    email: string
    mobile: string
}

export default function SchedulesPage({ params }: { params: Promise<{ id: string, bid: string }> }) {
    const { id: courseId, bid: batchId } = use(params)

    const router = useRouter()
    const [batch, setBatch] = useState<Batch | null>(null)
    const [course, setCourse] = useState<Course | null>(null)
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [students, setStudents] = useState<Student[]>([]) // Batch students
    const [isLoading, setIsLoading] = useState(true)

    // Schedule States
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newSchedule, setNewSchedule] = useState<{ start: Date | undefined, end: Date | undefined }>({ start: undefined, end: undefined })
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)

    // Student States
    const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false)
    const [studentSearchQuery, setStudentSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Student[]>([])
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
    const [newStudentMode, setNewStudentMode] = useState(false)
    const [newStudentData, setNewStudentData] = useState({ name: '', email: '', mobile: '' })

    // Attendance Handlers
    const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false)
    const [currentScheduleId, setCurrentScheduleId] = useState<string | null>(null)
    const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({}) // studentId -> status

    const fetchData = async () => {
        setIsLoading(true)

        // Fetch Context
        const { data: batchData } = await supabase
            .from('batches')
            .select('*, courses(name, id)')
            .eq('id', batchId)
            .single()

        if (batchData) {
            setBatch({ id: batchData.id, name: batchData.name, code: batchData.code })
            // @ts-ignore
            setCourse(batchData.courses)
        }

        // Fetch Schedules
        const { data: scheduleData } = await supabase
            .from('class_schedules')
            .select('*')
            .eq('batch_id', batchId)
            .order('start_time', { ascending: true })

        if (scheduleData) setSchedules(scheduleData)

        // Fetch Enrolled Students
        const { data: batchStudents } = await supabase
            .from('batch_students')
            .select('student_id, students(*)')
            .eq('batch_id', batchId)

        if (batchStudents) {
            // Flatten the structure
            const enrolled = batchStudents.map((bs: any) => bs.students).filter(Boolean)
            setStudents(enrolled)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [batchId])

    const handleStartClass = async (schedule: Schedule, e: React.MouseEvent) => {
        e.stopPropagation()

        // @ts-ignore
        if (schedule.room_code) {
            // @ts-ignore
            window.open(`/room/${schedule.room_code}`, '_blank')
            return
        }

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                alert("Please login first")
                return
            }

            const res = await fetch('/api/meetings/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    scheduleId: schedule.id,
                    batchId: batchId
                })
            })

            if (!res.ok) throw new Error("Failed to start class")

            const data = await res.json()
            if (data.hostUrl) {
                window.open(data.hostUrl, '_blank')
            }

            fetchData()

        } catch (err) {
            alert("Error starting class")
            console.error(err)
        }
    }

    // -- Schedule Handlers --
    const handleCreate = async () => {
        if (!newSchedule.start || !newSchedule.end) return alert("Start and End times are required")

        const { error } = await supabase
            .from('class_schedules')
            .insert([{
                batch_id: batchId,
                start_time: newSchedule.start.toISOString(),
                end_time: newSchedule.end.toISOString()
            }])

        if (!error) {
            fetchData()
            setIsDialogOpen(false)
            setNewSchedule({ start: undefined, end: undefined })
        }
    }

    const handleEditClick = (schedule: Schedule) => {
        setEditingSchedule(schedule)
        setNewSchedule({
            start: new Date(schedule.start_time),
            end: new Date(schedule.end_time)
        })
        setIsDialogOpen(true)
    }

    const handleUpdateSchedule = async () => {
        if (!editingSchedule) return
        if (!newSchedule.start || !newSchedule.end) return alert("Start and End times are required")

        const { error } = await supabase
            .from('class_schedules')
            .update({
                start_time: newSchedule.start.toISOString(),
                end_time: newSchedule.end.toISOString()
            })
            .eq('id', editingSchedule.id)

        if (!error) {
            fetchData()
            setIsDialogOpen(false)
            setEditingSchedule(null)
            setNewSchedule({ start: undefined, end: undefined })
        }
    }

    const handleDeleteSchedule = async (id: string) => {
        if (!confirm("Are you sure you want to delete this schedule?")) return

        try {
            const res = await fetch(`/api/v1/schedules?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchData()
            } else {
                alert("Failed to delete schedule")
            }
        } catch (e) {
            console.error(e)
            alert("Error deleting schedule")
        }
    }

    const handleOpenAttendance = async (scheduleId: string) => {
        setCurrentScheduleId(scheduleId)
        setAttendanceDialogOpen(true)
        setAttendanceMap({}) // Reset

        // Fetch existing attendance for this schedule
        const { data } = await supabase
            .from('student_attendance')
            .select('student_id, status')
            .eq('schedule_id', scheduleId)

        if (data) {
            const map: Record<string, string> = {}
            data.forEach((r: any) => map[r.student_id] = r.status)
            setAttendanceMap(map)
        }
    }

    const handleUpdateAttendance = async (studentId: string, status: string) => {
        if (!currentScheduleId) return

        // Optimistic update
        setAttendanceMap(prev => ({ ...prev, [studentId]: status }))

        const { error } = await supabase
            .from('student_attendance')
            .upsert({
                schedule_id: currentScheduleId,
                student_id: studentId,
                status: status
            }, { onConflict: 'schedule_id, student_id' })

        if (error) {
            // Revert on error (simplified)
            alert("Failed to update status")
        }
    }

    // -- Student Handlers --
    const handleSearchStudents = async (query: string) => {
        setStudentSearchQuery(query)
        if (query.length < 2) {
            setSearchResults([])
            return
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', user.id)
            .ilike('name', `%${query}%`)
            .limit(5)

        if (data) setSearchResults(data)
    }

    const handleAddExistingStudent = async () => {
        if (!selectedStudentId) return

        const { error } = await supabase
            .from('batch_students')
            .insert([{
                batch_id: batchId,
                student_id: selectedStudentId
            }])

        if (!error) {
            fetchData()
            setIsStudentDialogOpen(false)
            setSelectedStudentId(null)
            setStudentSearchQuery('')
        } else {
            alert("Failed to add student. They might already be in this batch.")
        }
    }

    const handleCreateAndAddStudent = async () => {
        if (!newStudentData.name) return alert("Name is required")

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Create Student
        const { data: student, error: createError } = await supabase
            .from('students')
            .insert([{
                user_id: user.id,
                name: newStudentData.name,
                email: newStudentData.email,
                mobile: newStudentData.mobile
            }])
            .select()
            .single()

        if (createError || !student) {
            return alert("Failed to create student")
        }

        // 2. Add to Batch
        const { error: linkError } = await supabase
            .from('batch_students')
            .insert([{
                batch_id: batchId,
                student_id: student.id
            }])

        if (!linkError) {
            fetchData()
            setIsStudentDialogOpen(false)
            setNewStudentMode(false)
            setNewStudentData({ name: '', email: '', mobile: '' })
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12">
            {/* Header */}
            <div>
                <Link href={`/dashboard/courses/${courseId}`} className="text-neutral-400 hover:text-white flex items-center gap-2 mb-2 text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Batches
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            {batch?.name}
                            <span className="text-neutral-500 font-normal text-xl">/ Details</span>
                        </h1>
                        <p className="text-neutral-400 mt-1">Manage schedules and students for {batch?.code}</p>
                    </div>
                </div>
            </div>

            {/* Schedules Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Class Schedules</h2>
                    <Button onClick={() => {
                        setEditingSchedule(null)
                        setNewSchedule({ start: undefined, end: undefined })
                        setIsDialogOpen(true)
                    }} className="bg-white text-black hover:bg-neutral-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Schedule
                    </Button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-neutral-800 hover:bg-neutral-900">
                                <TableHead className="text-neutral-400 pl-6">Start Time</TableHead>
                                <TableHead className="text-neutral-400">End Time</TableHead>
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
                            ) : schedules.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-neutral-400">
                                        No schedules found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                schedules.map((schedule) => (
                                    <TableRow
                                        key={schedule.id}
                                        className="border-neutral-800 hover:bg-neutral-800/50 group"
                                    >
                                        <TableCell className="font-medium text-white pl-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-neutral-500" />
                                                {new Date(schedule.start_time).toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-neutral-300">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-neutral-500" />
                                                {new Date(schedule.end_time).toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 text-sm">
                                                {/* Start Class (Visible if within 30 min of start) */}
                                                {(() => {
                                                    const start = new Date(schedule.start_time).getTime()
                                                    const end = new Date(schedule.end_time).getTime()
                                                    const now = new Date().getTime()

                                                    // Show if now is between start-30m and end
                                                    const isLive = now >= start - 30 * 60 * 1000 && now <= end + 15 * 60 * 1000 // Allow 15m buffer after end

                                                    if (isLive) {
                                                        // @ts-ignore
                                                        const isActive = !!schedule.room_code

                                                        return (
                                                            <Button
                                                                size="sm"
                                                                className={`${isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white border-none ${!isActive && 'animate-pulse'}`}
                                                                onClick={(e) => handleStartClass(schedule, e)}
                                                            >
                                                                {isActive ? 'Join Class' : 'Start Class'}
                                                            </Button>
                                                        )
                                                    }
                                                    return null
                                                })()}

                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleOpenAttendance(schedule.id)
                                                    }}
                                                >
                                                    Attendance
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-neutral-400 hover:text-white"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleEditClick(schedule)
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-neutral-400 hover:text-red-500"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteSchedule(schedule.id)
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Students Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Enrolled Students</h2>
                    <Button onClick={() => setIsStudentDialogOpen(true)} variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Student
                    </Button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-neutral-800 hover:bg-neutral-900">
                                <TableHead className="text-neutral-400 pl-6">Name</TableHead>
                                <TableHead className="text-neutral-400">Email</TableHead>
                                <TableHead className="text-neutral-400">Mobile</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-neutral-400">
                                        No students enrolled in this batch.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student) => (
                                    <TableRow key={student.id} className="border-neutral-800">
                                        <TableCell className="font-medium text-white pl-6">{student.name}</TableCell>
                                        <TableCell className="text-neutral-300">{student.email}</TableCell>
                                        <TableCell className="text-neutral-300">{student.mobile}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Schedule Dialog (Create & Edit) */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white overflow-visible">
                    <DialogHeader>
                        <DialogTitle>{editingSchedule ? 'Edit Class Schedule' : 'Add Class Schedule'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <DateTimePicker
                                date={newSchedule.start}
                                setDate={(date) => setNewSchedule(s => ({ ...s, start: date }))}
                                label="Pick start time"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <DateTimePicker
                                date={newSchedule.end}
                                setDate={(date) => setNewSchedule(s => ({ ...s, end: date }))}
                                label="Pick end time"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-neutral-700 text-white hover:bg-neutral-800 hover:text-white">Cancel</Button>
                        <Button onClick={editingSchedule ? handleUpdateSchedule : handleCreate} className="bg-white text-black hover:bg-neutral-200">
                            {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Student Dialog */}
            <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Add Student to Batch</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        {newStudentMode ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={newStudentData.name}
                                        onChange={e => setNewStudentData(s => ({ ...s, name: e.target.value }))}
                                        className="bg-black border-neutral-700 text-white"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={newStudentData.email}
                                        onChange={e => setNewStudentData(s => ({ ...s, email: e.target.value }))}
                                        className="bg-black border-neutral-700 text-white"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mobile</Label>
                                    <Input
                                        value={newStudentData.mobile}
                                        onChange={e => setNewStudentData(s => ({ ...s, mobile: e.target.value }))}
                                        className="bg-black border-neutral-700 text-white"
                                        placeholder="+1 234..."
                                    />
                                </div>
                                <Button variant="ghost" onClick={() => setNewStudentMode(false)} className="text-neutral-400 hover:text-white p-0 h-auto">
                                    &larr; Back to search
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Search Existing Students</Label>
                                    <Input
                                        placeholder="Type name to search..."
                                        value={studentSearchQuery}
                                        onChange={e => handleSearchStudents(e.target.value)}
                                        className="bg-black border-neutral-700 text-white"
                                    />
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="border border-neutral-800 rounded-md bg-black/50 max-h-40 overflow-y-auto">
                                        {searchResults.map(s => (
                                            <div
                                                key={s.id}
                                                onClick={() => setSelectedStudentId(s.id)}
                                                className={`p-2 cursor-pointer flex justify-between items-center ${selectedStudentId === s.id ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
                                            >
                                                <span>{s.name}</span>
                                                <span className="text-xs text-neutral-600">{s.email}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <p className="text-sm text-neutral-500 mb-2">Can't find the student?</p>
                                    <Button variant="outline" onClick={() => setNewStudentMode(true)} className="w-full border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                                        Create New Student
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStudentDialogOpen(false)} className="border-neutral-700 text-white hover:bg-neutral-800 hover:text-white">Cancel</Button>
                        {!newStudentMode && (
                            <Button onClick={handleAddExistingStudent} disabled={!selectedStudentId} className="bg-white text-black hover:bg-neutral-200 disabled:opacity-50">
                                Add Selected
                            </Button>
                        )}
                        {newStudentMode && (
                            <Button onClick={handleCreateAndAddStudent} className="bg-white text-black hover:bg-neutral-200">
                                Create & Add
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Attendance Dialog - NEW */}
            <Dialog open={attendanceDialogOpen} onOpenChange={setAttendanceDialogOpen}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Attendance & Cancellation</DialogTitle>
                    </DialogHeader>

                    <div className="py-2">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-neutral-800">
                                    <TableHead className="text-neutral-400">Student</TableHead>
                                    <TableHead className="text-neutral-400 text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map(student => {
                                    const status = attendanceMap[student.id] || 'scheduled'
                                    return (
                                        <TableRow key={student.id} className="border-neutral-800">
                                            <TableCell className="font-medium text-white">{student.name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant={status === 'present' ? 'default' : 'outline'}
                                                        className={`h-7 text-xs ${status === 'present' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-neutral-700 text-neutral-400'}`}
                                                        onClick={() => handleUpdateAttendance(student.id, 'present')}
                                                    >
                                                        Present
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={status === 'absent' ? 'default' : 'outline'}
                                                        className={`h-7 text-xs ${status === 'absent' ? 'bg-neutral-600 hover:bg-neutral-700 text-white' : 'border-neutral-700 text-neutral-400'}`}
                                                        onClick={() => handleUpdateAttendance(student.id, 'absent')}
                                                    >
                                                        Absent
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={status === 'cancelled' ? 'default' : 'outline'}
                                                        className={`h-7 text-xs ${status === 'cancelled' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-neutral-700 text-neutral-400'}`}
                                                        onClick={() => handleUpdateAttendance(student.id, 'cancelled')}
                                                    >
                                                        Cancelled
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setAttendanceDialogOpen(false)} className="bg-white text-black hover:bg-neutral-200">Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
