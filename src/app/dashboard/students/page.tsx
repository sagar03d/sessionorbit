"use client"

import { useEffect, useState } from "react"
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
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

interface Student {
    id: string
    name: string
    mobile: string
    email: string
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({})

    const fetchStudents = async () => {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', user.id) // Ensure we only fetch this user's students
            .order('created_at', { ascending: false })

        if (data) {
            setStudents(data)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const handleSave = async () => {
        if (!currentStudent.name) return alert("Name is required")

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        if (isEditing && currentStudent.id) {
            const { error } = await supabase
                .from('students')
                .update({
                    name: currentStudent.name,
                    mobile: currentStudent.mobile,
                    email: currentStudent.email
                })
                .eq('id', currentStudent.id)

            if (!error) fetchStudents()
        } else {
            const { error } = await supabase
                .from('students')
                .insert([{
                    user_id: user.id,
                    name: currentStudent.name,
                    mobile: currentStudent.mobile,
                    email: currentStudent.email
                }])

            if (!error) fetchStudents()
        }
        setIsDialogOpen(false)
        setCurrentStudent({})
        setIsEditing(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this student?")) return

        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id)

        if (!error) fetchStudents()
    }

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.mobile && s.mobile.includes(searchQuery))
    )

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Students</h1>
                <Button onClick={() => {
                    setIsEditing(false)
                    setCurrentStudent({})
                    setIsDialogOpen(true)
                }} className="bg-white text-black hover:bg-neutral-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                </Button>
            </div>

            <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                    />
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="text-neutral-400">Name</TableHead>
                            <TableHead className="text-neutral-400">Mobile</TableHead>
                            <TableHead className="text-neutral-400">Email</TableHead>
                            <TableHead className="text-right text-neutral-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-neutral-400">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-neutral-400">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableCell className="font-medium text-white">{student.name}</TableCell>
                                    <TableCell className="text-neutral-300">{student.mobile || '-'}</TableCell>
                                    <TableCell className="text-neutral-300">{student.email || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setCurrentStudent(student)
                                                    setIsEditing(true)
                                                    setIsDialogOpen(true)
                                                }}
                                                className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(student.id)}
                                                className="h-8 w-8 p-0 text-neutral-400 hover:text-red-500"
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Student' : 'Add New Student'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                value={currentStudent.name || ''}
                                onChange={e => setCurrentStudent(s => ({ ...s, name: e.target.value }))}
                                className="bg-black border-neutral-700 text-white"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mobile Number</Label>
                            <Input
                                value={currentStudent.mobile || ''}
                                onChange={e => setCurrentStudent(s => ({ ...s, mobile: e.target.value }))}
                                className="bg-black border-neutral-700 text-white"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                value={currentStudent.email || ''}
                                onChange={e => setCurrentStudent(s => ({ ...s, email: e.target.value }))}
                                className="bg-black border-neutral-700 text-white"
                                type="email"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-neutral-700 text-white hover:bg-neutral-800 hover:text-white">Cancel</Button>
                        <Button onClick={handleSave} className="bg-white text-black hover:bg-neutral-200">Save Student</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
