import { MultiYearScheduler } from "@/components/multi-year-scheduler"
import { ProjectScheduler } from "@/components/project-scheduler"
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { UserNav } from '@/components/user-nav'
import ThemeSwitch from '@/components/theme-switch'

export default function InputPekerjaan() {
  return (
    <Layout>
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>
      <Layout.Body>
        <div className="grid grid-cols-1 overflow-auto">
          <div className='items-center justify-center align-middle lg:mr-4'>
            <div className='mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
              {/* Tambahkan overflow-x-auto di sini */}
              <div className="overflow-x-auto">
                <ProjectScheduler />
              </div>
            </div>
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}
