"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { supabase } from "@/lib/supabase"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { format, isSameDay, parseISO, startOfDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, Plus, Video, Hash } from "lucide-react"
import { useRouter } from "next/navigation"

interface Course {
    id: string
    name: string
    code: string
}

interface Batch {
    id: string
    name: string
    code: string
    course_id: string
}

interface Schedule {
    id: string
    batch_id: string
    start_time: string
    end_time: string
    batches?: Batch & { courses?: Course }
}

export default function CalendarPage() {
    const router = useRouter()
    const { user, isLoading: isUserLoading } = useUser()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [batches, setBatches] = useState<Batch[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isScheduling, setIsScheduling] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [selectedCourseId, setSelectedCourseId] = useState("")
    const [selectedBatchId, setSelectedBatchId] = useState("")
    const [startTime, setStartTime] = useState("10:00")
    const [endTime, setEndTime] = useState("11:00")

    const fetchData = async () => {
        if (!user) return
        setIsLoading(true)

        try {
            // Fetch Courses
            const { data: coursesData } = await supabase
                .from('courses')
                .select('*')
                .order('name')
            if (coursesData) setCourses(coursesData)

            // Fetch Batches
            const { data: batchesData } = await supabase
                .from('batches')
                .select('*')
                .order('name')
            if (batchesData) setBatches(batchesData)

            // Fetch Schedules
            // Note: Joining tables to get Course and Batch info
            const { data: schedulesData } = await supabase
                .from('class_schedules')
                .select(`
                    *,
                    batches (
                        *,
                        courses (*)
                    )
                `)
                .order('start_time', { ascending: true })

            if (schedulesData) {
                // Transform or cast data if needed
                setSchedules(schedulesData as any)
            }
        } catch (error) {
            console.error("Error fetching calendar data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!isUserLoading && user) {
            fetchData()
        } else if (!isUserLoading && !user) {
            // Redirect or handle unauthorized if needed, for now just stop loading
            setIsLoading(false)
        }
    }, [user, isUserLoading])

    const handleScheduleClass = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedDate || !selectedBatchId || !startTime || !endTime) return

        setIsSubmitting(true)

        // Construct DateTime
        const startDateTime = new Date(selectedDate)
        const [startH, startM] = startTime.split(':').map(Number)
        startDateTime.setHours(startH, startM, 0, 0)

        const endDateTime = new Date(selectedDate)
        const [endH, endM] = endTime.split(':').map(Number)
        endDateTime.setHours(endH, endM, 0, 0)

        // Validate
        if (endDateTime <= startDateTime) {
            alert("End time must be after start time")
            setIsSubmitting(false)
            return
        }

        const { error } = await supabase
            .from('class_schedules')
            .insert([{
                batch_id: selectedBatchId,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString()
            }])

        if (error) {
            console.error("Error scheduling class:", error)
            alert("Failed to schedule class. Please try again.")
        } else {
            setIsScheduling(false)
            setStartTime("10:00")
            setEndTime("11:00")
            setSelectedBatchId("")
            setSelectedCourseId("")
            fetchData()
        }
        setIsSubmitting(false)
    }

    // Filtered lists
    const filteredBatches = batches.filter(b => b.course_id === selectedCourseId)

    const dailySchedules = schedules.filter(s =>
        selectedDate && s.start_time && isSameDay(parseISO(s.start_time), selectedDate)
    )

    const daysWithMeetings = schedules.map(s => s.start_time ? parseISO(s.start_time) : null).filter(Boolean) as Date[]

    return (
        <div className="min-h-screen bg-black text-white p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Class Schedule</h1>
                        <p className="text-neutral-400">Manage your upcoming sessions</p>
                    </div>

                    <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-black hover:bg-neutral-200">
                                <Plus className="w-4 h-4 mr-2" /> Schedule Class
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
                            <DialogHeader>
                                <DialogTitle>Schedule New Class</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleScheduleClass} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <div className="p-2 bg-neutral-800 rounded-md text-sm text-neutral-300 border border-neutral-700">
                                        {selectedDate ? format(selectedDate, 'PPP') : 'Select a date from calendar'}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Course</Label>
                                    <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                        <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                                            <SelectValue placeholder="Select Course" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                            {courses.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Batch</Label>
                                    <Select value={selectedBatchId} onValueChange={setSelectedBatchId} disabled={!selectedCourseId}>
                                        <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                                            <SelectValue placeholder="Select Batch" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                            {filteredBatches.map(b => (
                                                <SelectItem key={b.id} value={b.id}>{b.name} ({b.code})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Time</Label>
                                        <Input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="bg-neutral-800 border-neutral-700 text-white focus:ring-offset-0"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Time</Label>
                                        <Input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="bg-neutral-800 border-neutral-700 text-white focus:ring-offset-0"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200" disabled={isSubmitting || !selectedBatchId}>
                                    {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex justify-center">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                modifiers={{
                                    hasMeeting: daysWithMeetings
                                }}
                                modifiersStyles={{
                                    hasMeeting: {
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                        color: '#60a5fa' // blue-400
                                    }
                                }}
                                styles={{
                                    caption: { color: 'white' },
                                    head_cell: { color: '#a3a3a3' },
                                    cell: { color: 'white' },
                                    day: { color: 'white' },
                                    nav_button_previous: { color: 'white' },
                                    nav_button_next: { color: 'white' },
                                }}
                                className="rdp-custom"
                            />
                        </div>
                    </div>

                    {/* Schedule Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            {selectedDate ? format(selectedDate, 'EEEE, MMMM do, yyyy') : 'Select a date'}
                        </h2>

                        <div className="space-y-4">
                            {isLoading ? (
                                <p className="text-neutral-500">Loading schedule...</p>
                            ) : dailySchedules.length === 0 ? (
                                <div className="p-8 border border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center text-neutral-500">
                                    <CalendarIcon className="w-8 h-8 opacity-20 mb-2" />
                                    <p>No classes scheduled for this day.</p>
                                    <Button variant="link" onClick={() => setIsScheduling(true)}>Schedule one now</Button>
                                </div>
                            ) : (
                                dailySchedules.map((schedule) => (
                                    <div key={schedule.id} className="group p-5 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all flex items-center justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-neutral-800 rounded-lg text-neutral-300">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-lg text-white">
                                                        {schedule.batches?.courses?.name || 'Unknown Course'}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
                                                        {schedule.batches?.name || 'Unknown Batch'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-neutral-400 flex items-center gap-2">
                                                    {format(parseISO(schedule.start_time), 'h:mm a')} - {format(parseISO(schedule.end_time), 'h:mm a')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Optional: Add button to view details or start if we can link it to a meeting room later */}
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500" title="Course Code">
                                                <Hash className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
