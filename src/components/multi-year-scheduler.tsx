"use client"

import type React from "react"

import { useState, useRef } from "react"
import { YearRangePicker } from "./year-range-picker"
import { MonthRangePicker } from "./month-range-picker"
import { Input } from "@/components/ui/input"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const weeks = ["W1", "W2", "W3", "W4"]

export function MultiYearScheduler() {
    const currentYear = new Date().getFullYear()
    const [startYear, setStartYear] = useState(currentYear)
    const [endYear, setEndYear] = useState(currentYear)
    const [startMonth, setStartMonth] = useState(0)
    const [endMonth, setEndMonth] = useState(11)
    const [tasks, setTasks] = useState<{ [key: string]: string }>({})
    const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({})

    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

    const handleTaskChange = (year: number, month: number, week: string, value: string) => {
        const key = `${year}-${month}-${week}`
        setTasks((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, year: number, month: number, week: string) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const nextWeekIndex = weeks.indexOf(week) + 1
            if (nextWeekIndex < weeks.length) {
                const nextWeek = weeks[nextWeekIndex]
                const nextKey = `${year}-${month}-${nextWeek}`
                inputRefs.current[nextKey]?.focus()
            } else {
                const nextMonth = month + 1
                if (nextMonth <= endMonth) {
                    const nextKey = `${year}-${nextMonth}-${weeks[0]}`
                    inputRefs.current[nextKey]?.focus()
                } else if (year < endYear) {
                    const nextKey = `${year + 1}-${startMonth}-${weeks[0]}`
                    inputRefs.current[nextKey]?.focus()
                }
            }
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-4 text-2xl font-bold">Input Pekerjaan</h1>
            <div className="mb-4 flex flex-wrap gap-4">
                <YearRangePicker
                    startYear={startYear}
                    endYear={endYear}
                    onStartYearChange={setStartYear}
                    onEndYearChange={setEndYear}
                />
                <MonthRangePicker
                    startMonth={startMonth}
                    endMonth={endMonth}
                    onStartMonthChange={setStartMonth}
                    onEndMonthChange={setEndMonth}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2"></th>
                            {years.map((year) => (
                                <th key={year} colSpan={endMonth - startMonth + 1} className="border p-2">
                                    {year}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className="border p-2"></th>
                            {years.map((year) =>
                                months.slice(startMonth, endMonth + 1).map((month) => (
                                    <th key={`${year}-${month}`} className="border p-2">
                                        {month}
                                    </th>
                                )),
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((week) => (
                            <tr key={week}>
                                <td className="border p-2 font-semibold">{week}</td>
                                {years.map((year) =>
                                    months.slice(startMonth, endMonth + 1).map((_, monthIndex) => {
                                        const actualMonthIndex = startMonth + monthIndex
                                        const key = `${year}-${actualMonthIndex}-${week}`
                                        return (
                                            <td key={key} className="border p-2">
                                                <Input
                                                    ref={(el) => {
                                                        if (el) inputRefs.current[key] = el;
                                                    }}
                                                    value={tasks[key] || ""}
                                                    onChange={(e) =>
                                                        handleTaskChange(year, actualMonthIndex, week, e.target.value)
                                                    }
                                                    onKeyDown={(e) => handleKeyDown(e, year, actualMonthIndex, week)}
                                                    className="h-8 w-full min-w-[50px]" // Tambahkan min-width di sini
                                                    placeholder="0.0"
                                                />

                                            </td>
                                        )
                                    }),
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

