import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface YearRangePickerProps {
  startYear: number
  endYear: number
  onStartYearChange: (year: number) => void
  onEndYearChange: (year: number) => void
}

export function YearRangePicker({ startYear, endYear, onStartYearChange, onEndYearChange }: YearRangePickerProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 5 + i)

  return (
    <div className="flex items-center space-x-2">
      <Select value={startYear.toString()} onValueChange={(value) => onStartYearChange(Number.parseInt(value))}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Start year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()} disabled={year > endYear}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>to</span>
      <Select value={endYear.toString()} onValueChange={(value) => onEndYearChange(Number.parseInt(value))}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="End year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()} disabled={year < startYear}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

