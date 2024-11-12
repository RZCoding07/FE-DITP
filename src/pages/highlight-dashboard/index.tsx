import React, { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { FcTimeline } from 'react-icons/fc'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { Button } from '@/components/custom/button'
import { IconDeviceFloppy, IconPdf } from '@tabler/icons-react'
import Select from 'react-select'
interface TopNavLink {
  title: string
  href: string
  isActive: boolean
}

interface DataItem {
  id: number
  section: string
  content: string
}

export default function Dashboard() {
  const [thisWeekHighlights, setThisWeekHighlights] = useState<string>('')
  const [proyeksi2024Highlights, setProyeksi2024Highlights] =
    useState<string>('')
  const [tasksCompleted, setTasksCompleted] = useState<string>('')
  const [pendingMatters, setPendingMatters] = useState<string>('')
  const [nextWeekTasks, setNextWeekTasks] = useState<string>('')

  const [data, setData] = useState<DataItem[]>([])

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  )
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  )

  const [selectedWeek, setSelectedWeek] = useState([])
  const [weekOptions, setWeekOptions] = useState<{ value: string; label: string }[]>([])

  const customStyles = {
    theme: (theme: any) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary25: 'var(--bg-secondary)',
        primary: 'var(--text-primary)',
      },
    }),
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--bg-primary)',
      borderColor: 'var(--border-primary)',
      borderRadius: '10.5rem',
      boxShadow: 'none',
      color: 'var(--text-primary)',
      width: '250px', // Set desired width here
      minHeight: '2.5rem',
      '&:hover': {
        borderColor: 'var(--border-primary)',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#fff',
      color: 'black',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '0.5rem',
    }),
    option: (base: any, state: any) => ({
      ...base,
      color: state.isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
      backgroundColor: state.isSelected ? 'var(--bg-secondary)' : 'var(--bg-primary)',
      whiteSpace: 'nowrap', // Prevent text from wrapping
      overflow: 'hidden', // Hide overflow
      textOverflow: 'ellipsis', // Add ellipsis if text is too long
      '&:hover': {
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'var(--text-primary)',
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'var(--text-primary)',
    }),
  };
  
  const bulanName = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  function getHariIndonesia(dayOfWeek: number): string {
    const days = [
      'Minggu', // 0 for Sunday
      'Senin', // 1 for Monday
      'Selasa', // 2 for Tuesday
      'Rabu', // 3 for Wednesday
      'Kamis', // 4 for Thursday
      'Jumat', // 5 for Friday
      'Sabtu', // 6 for Saturday
    ]
    return days[dayOfWeek]
  }

  // Example usage:

  
 const currentMonth = new Date().getMonth() + 1 // JavaScript months are 0-indexed, so add 1
  const currentYear = new Date().getFullYear()

  const yearOptions = [
    { value: currentYear - 1, label: currentYear - 1 },
    { value: currentYear, label: currentYear },
    { value: currentYear + 1, label: currentYear + 1 },
  ]

  function getWeeksInMonth(month: number, year: number) {
    const weeks = []
    const daysInMonth = new Date(year, month, 0).getDate()

    let weekStart: string | null = null
    let weekCount = 1

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day)
      const dayOfWeek = currentDate.getDay() // 0 for Sunday, 6 for Saturday

      if (dayOfWeek === 6 || day === 1) {
        weekStart = currentDate.toISOString().split('T')[0]
      }

      if (dayOfWeek === 5 || day === daysInMonth) {
        const weekEnd = currentDate.toISOString().split('T')[0]
        weeks.push({ start: weekStart!, end: weekEnd })
        weekCount++
      }
    }

    return weeks
  }

  useEffect(() => {
    const weeks = getWeeksInMonth(selectedMonth, selectedYear)
    const options = weeks.map((week, index) => ({
      value: `w${index + 1}`,
      label: `W${index + 1}: ${week.start} - ${week.end}`,
    }))
    setWeekOptions(options)
  }, [selectedMonth, selectedYear])

  return (
    <Layout>
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div className='flex items-center space-x-2'>
            <FcTimeline size={40} />
            <h1 className='text-2xl font-bold tracking-tight'>
              Highlights Dashboard
            </h1>
          </div>
        </div>

        <div className='my-4 space-y-6'>
          <h2 className='text-xl font-semibold'>Weekly Highlights</h2>
          <div className='flex items-center space-x-2'>
            {/*  select yeear */}
            <Select
              styles={customStyles}
              options={yearOptions}
              defaultValue={{ value: currentYear, label: currentYear }}
            />
            <Select
              styles={customStyles}
              onChange={(selectedOption:any) => {
                setSelectedMonth(selectedOption.value)
              }}
              options={[
                ...bulanName.map((month, index) => ({
                  value: index + 1,
                  label: month,
                }))
              ]}
              defaultValue={{
                value: currentMonth,
                label: bulanName[currentMonth - 1], // -1 to get correct month label from bulanName array
              }}
            />
            <Select 
              styles={customStyles}
              options={weekOptions}
              defaultValue={weekOptions[0]}
            />
            <Button className='flex items-center rounded-full'>
              Save Highlights
              <IconDeviceFloppy className='ml-2' />
            </Button>
          </div>
          <SectionEditor
            title='This Week’s Highlights'
            value={thisWeekHighlights}
            onChange={setThisWeekHighlights}
          />

          <SectionEditor
            title='Proyeksi 2024 Highlights'
            value={proyeksi2024Highlights}
            onChange={setProyeksi2024Highlights}
          />

          <SectionEditor
            title='Tasks Completed This Week'
            value={tasksCompleted}
            onChange={setTasksCompleted}
          />

          <SectionEditor
            title='Pending Matters'
            value={pendingMatters}
            onChange={setPendingMatters}
          />

          <SectionEditor
            title='Next Week’s Tasks'
            value={nextWeekTasks}
            onChange={setNextWeekTasks}
          />
        </div>
      </Layout.Body>
    </Layout>
  )
}

// Reusable SectionEditor component with a height of 400px for the editor
interface SectionEditorProps {
  title: string
  value: string
  onChange: (value: string) => void
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  title,
  value,
  onChange,
}) => (
  <div>
    <h3 className='mb-2 text-lg font-semibold'>{title}</h3>
    <ReactQuill
      value={value}
      onChange={onChange}
      theme='snow'
      style={{ height: '200px', overflowY: 'auto' }}
    />
  </div>
)

const topNav: TopNavLink[] = []
