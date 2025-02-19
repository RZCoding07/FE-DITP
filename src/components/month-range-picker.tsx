import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MonthRangePickerProps {
  startMonth: number
  endMonth: number
  onStartMonthChange: (month: number) => void
  onEndMonthChange: (month: number) => void
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function MonthRangePicker({
  startMonth,
  endMonth,
  onStartMonthChange,
  onEndMonthChange,
}: MonthRangePickerProps) {
  return (
    <div className="flex items-center space-x-2">
      <Select value={startMonth.toString()} onValueChange={(value) => onStartMonthChange(Number.parseInt(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Start month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={month} value={index.toString()} disabled={index > endMonth}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>to</span>
      <Select value={endMonth.toString()} onValueChange={(value) => onEndMonthChange(Number.parseInt(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="End month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={month} value={index.toString()} disabled={index < startMonth}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

