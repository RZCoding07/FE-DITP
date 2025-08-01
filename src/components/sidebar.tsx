import { useEffect, useState } from 'react'
import { IconChevronsLeft, IconMenu2, IconX } from '@tabler/icons-react'
import { Layout } from './custom/layout'
import { Button } from './custom/button'
import Nav from './nav'
import { cn } from '@/lib/utils'
import { getSideLinks } from '@/data/sidelinks'
import cookie from 'js-cookie'
import logoImage from '@/assets/ptpn4.png'




interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)

  const user = cookie.get('user')
  const fullname = user ? JSON.parse(user).fullname : 'user'
  const account_type = user ? JSON.parse(user).account_type : 'user'
  const app_type = user ? JSON.parse(user).app_type : ''

  const feUrl = import.meta.env.VITE_FE_URL


  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
        className
      )}
    >
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? 'h-svh' : ''}>
        <Layout.Header
          sticky
          className='z-50 flex justify-between px-4 py-3 shadow-sm md:px-4'
        >
          <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <img src={`${logoImage}`} alt='logo' className='hide-sm' style={{ width: '35px' }} />
            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <span className='ml-2 font-bold text-md
                bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white
              '>EV4PALMS</span>
              <span className='ml-2 text-xs'>Operasional PalmCo</span>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Toggle Navigation'
            aria-controls='sidebar-menu'
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </Layout.Header>

        {/* Navigation links */}
        <Nav
          id='sidebar-menu'
          className={`z-40 h-full flex-1 overflow-auto ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-full md:py-2'}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={getSideLinks(app_type)}
          style={{ transition: 'max-height 0.5s ease', scrollbarWidth: 'thin' }}
        />


        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size='icon'
          variant='outline'
          className='absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex'
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
        <style>{`

  `}</style>
        {/* Footer */}
        <div data-sidebar='footer' className='flex flex-col gap-2 p-2 bg-white dark:bg-slate-950' style={{
          transform: 'translateY(0px)',
        }}>
          <div className={`flex ml-1 items-center ${!isCollapsed ? 'gap-2' : ''}`}>
          <img src={`${logoImage}`} alt='logo' className='hide-sm' style={{ width: '35px' }} />
  
            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'} 
      hide-sm`}
            >
              <span className='ml-2 font-medium'>{fullname}</span>
              <span className='ml-2 text-xs capitalize'>{account_type}</span>
            </div>
          </div>
        </div>

      </Layout>
    </aside>
  )
}
