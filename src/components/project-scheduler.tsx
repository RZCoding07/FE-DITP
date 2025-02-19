"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/custom/button"
import { DatePickerWithRange } from "./date-range-picker"
import { format, eachMonthOfInterval } from "date-fns"
import { Plus, Trash2 } from "lucide-react"

interface Task {
  id: string
  name: string
  weight: string
  progress: { [key: string]: string }
}

export function ProjectScheduler() {
  const [startDate, setStartDate] = useState(new Date(2025, 1)) // Feb 2025
  const [endDate, setEndDate] = useState(new Date(2026, 0)) // Jan 2026
  const [months, setMonths] = useState<Date[]>([])
  const [tasks, setTasks] = useState<Task[]>([{ id: "1", name: "", weight: "", progress: {} }])
  const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({})

  useEffect(() => {
    const monthsInRange = eachMonthOfInterval({ start: startDate, end: endDate })
    setMonths(monthsInRange)
  }, [startDate, endDate])

  const handleRangeChange = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleTaskNameChange = (id: string, value: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, name: value } : task)))
  }

  const handleWeightChange = (id: string, value: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, weight: value } : task)))
  }

  const handleProgressChange = (taskId: string, month: string, week: string, value: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, progress: { ...task.progress, [`${month}-${week}`]: value } } : task,
      ),
    )
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    taskIndex: number,
    monthIndex: number,
    weekIndex: number,
  ) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      let nextMonthIndex = monthIndex
      let nextWeekIndex = weekIndex + 1
      let nextTaskIndex = taskIndex

      if (nextWeekIndex > 3) {
        nextWeekIndex = 0
        nextMonthIndex++
      }

      if (nextMonthIndex >= months.length) {
        nextMonthIndex = 0
        nextWeekIndex = 0
        nextTaskIndex++
      }

      if (nextTaskIndex >= tasks.length) {
        addTask()
        nextTaskIndex = tasks.length
      }

      const nextKey = `${nextTaskIndex}-${nextMonthIndex}-${nextWeekIndex}`
      setTimeout(() => inputRefs.current[nextKey]?.focus(), 0)
    }
  }

  const addTask = () => {
    const newId = (Number.parseInt(tasks[tasks.length - 1].id) + 1).toString()
    setTasks([...tasks, { id: newId, name: "", weight: "", progress: {} }])
  }

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((task) => task.id !== id))
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Project Scheduler</h1>
      <div className="mb-4">
        <DatePickerWithRange startDate={startDate} endDate={endDate} onRangeChange={handleRangeChange} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Item Pekerjaan</th>
              <th className="border p-2">Bobot (%)</th>
              {months.map((month) => (
                <th key={month.toISOString()} colSpan={4} className="border p-2">
                  {format(month, "MMM-yy")}
                </th>
              ))}
              <th className="border p-2">Actions</th>
            </tr>
            <tr>
              <th className="border p-2" colSpan={2}></th>
              {months.map((month) =>
                ["W1", "W2", "W3", "W4"].map((week) => (
                  <th key={`${month.toISOString()}-${week}`} className="border p-2">
                    {week}
                  </th>
                )),
              )}
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, taskIndex) => (
              <tr key={task.id}>
                <td className="border p-2">
                  <Input
                    value={task.name}
                    onChange={(e) => handleTaskNameChange(task.id, e.target.value)}
                    className="h-8 w-full min-w-[200px]"
                    placeholder="Item Pekerjaan"
                  />
                </td>
                <td className="border p-2">
                  <Input
                    value={task.weight}
                    onChange={(e) => handleWeightChange(task.id, e.target.value)}
                    className="h-8 w-full min-w-[100px]"
                    placeholder="Bobot"
                  />
                </td>
                {months.map((month, monthIndex) =>
                  ["W1", "W2", "W3", "W4"].map((week, weekIndex) => (
                    <td key={`${month.toISOString()}-${week}`} className="border p-2">
                      <Input
                        ref={(el) => {
                          if (el) inputRefs.current[`${taskIndex}-${monthIndex}-${weekIndex}`] = el
                        }}
                        value={task.progress[`${format(month, "MMM-yy")}-${week}`] || ""}
                        onChange={(e) => handleProgressChange(task.id, format(month, "MMM-yy"), week, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, taskIndex, monthIndex, weekIndex)}
                        className="h-8 w-full text-center min-w-[60px]"
                        placeholder="0.0%"
                      />
                    </td>
                  )),
                )}
                <td className="border p-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTask(task.id)}
                    disabled={tasks.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Button onClick={addTask}>
          <Plus className="mr-2 h-4 w-4" /> Add Item Pekerjaan
        </Button>
      </div>
    </div>
  )
}

