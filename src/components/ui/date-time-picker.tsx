"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    label?: string
    disabled?: (date: Date) => boolean
}

export function DateTimePicker({ date, setDate, label, disabled }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
    const [timeValue, setTimeValue] = React.useState<string>(
        date ? format(date, "HH:mm") : "09:00"
    )

    React.useEffect(() => {
        setSelectedDate(date)
        if (date) {
            setTimeValue(format(date, "HH:mm"))
        }
    }, [date])

    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) {
            setSelectedDate(undefined)
            setDate(undefined)
            return
        }

        // Apply existing time to new date
        const [hours, minutes] = timeValue.split(':').map(Number)
        newDate.setHours(hours || 0)
        newDate.setMinutes(minutes || 0)

        setSelectedDate(newDate)
        setDate(newDate)
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value
        setTimeValue(newTime)

        if (selectedDate) {
            const [hours, minutes] = newTime.split(':').map(Number)
            const newDate = new Date(selectedDate)
            newDate.setHours(hours || 0)
            newDate.setMinutes(minutes || 0)
            setDate(newDate)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal bg-black border-neutral-700 text-white hover:bg-neutral-900 hover:text-white",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP p") : <span>{label || "Pick a date"}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-800 text-white" align="start">
                <div className="p-4 border-b border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-medium">Time</span>
                    </div>
                    <Input
                        type="time"
                        value={timeValue}
                        onChange={handleTimeChange}
                        className="bg-black border-neutral-700 text-white"
                    />
                </div>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={disabled}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    classNames={{
                        day_selected: "bg-[#00f2ff] text-black hover:bg-[#00f2ff]/80 focus:bg-[#00f2ff]",
                        day_today: "bg-white/10 text-white",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-white/5 rounded-md",
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
