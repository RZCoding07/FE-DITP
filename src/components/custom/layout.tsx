import * as React from 'react'
import { cn } from '@/lib/utils'

const LayoutContext = React.createContext<{
  offset: number
  fixed: boolean
} | null>(null)

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  fixed?: boolean
}

const Layout = ({ className, fixed = false, ...props }: LayoutProps) => {
  const divRef = React.useRef<HTMLDivElement>(null)
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const div = divRef.current

    if (!div) return
    const onScroll = () => setOffset(div.scrollTop)

    // clean up code
    div.addEventListener('scroll', onScroll, { passive: true })
    
    // Clean up scroll event listener when component unmounts
    return () => div.removeEventListener('scroll', onScroll)
  }, []) // Empty dependency array to run only once on mount

  return (
    <LayoutContext.Provider value={{ offset, fixed }}>
      <div
        ref={divRef}
        data-layout='layout'
        className={cn(
          'overflow-auto',
          fixed && 'flex flex-col',
          className
        )}
        {...props}
        style={{height: '100%'}}
      />
    </LayoutContext.Provider>
  )
}
Layout.displayName = 'Layout'

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  sticky?: boolean
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>( 
  ({ className, sticky, ...props }, ref) => {
    const contextVal = React.useContext(LayoutContext)
    if (contextVal === null) {
      throw new Error(
        `Layout.Header must be used within ${Layout.displayName}.`
      )
    }

    return (
      <div
        ref={ref}
        data-layout='header'
        className={cn(
          `z-10 flex h-[var(--header-height)] items-center gap-4 bg-background p-4 md:px-8`,
          contextVal.offset > 10 && sticky ? 'shadow' : 'shadow-none',
          contextVal.fixed && 'flex-none',
          sticky && 'sticky top-0',
          className
        )}
        {...props}
      />
    )
  }
)
Header.displayName = 'Header'

const Body = React.forwardRef< HTMLDivElement, React.HTMLAttributes<HTMLDivElement> >(({ className, ...props }, ref) => {
  const contextVal = React.useContext(LayoutContext)
  if (contextVal === null) {
    throw new Error(`Layout.Body must be used within ${Layout.displayName}.`)
  }

  return (
    <div className="relative min-h-screen sm:min-h-[120vh] md:min-h-[140vh] lg:min-h-[160vh] xl:min-h-[180vh]">
      <div
        className={cn(
          'absolute opacity-50 inset-0 bg-gray-50 bg-[url("/bginvestasi.jpeg")] bg-cover bg-center  dark:bg-gradient dark:from-slate-950 dark:to-slate-900 ',
          contextVal && contextVal.fixed && 'fixed'
        )}
        style={{
          filter: 'blur(5px)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div
        ref={ref}
        data-layout='body'
        className={cn(
          'relative z-10 p-6 px-4 py-6 md:overflow-hidden md:px-8',
          contextVal && contextVal.fixed && 'flex-1',
          className
        )}
        {...props}
      />
    </div>
  )
})


interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

const Footer = React.forwardRef<HTMLDivElement, FooterProps>(({ 
  className, 
  message = "Jika ada gangguan teknis atau perlu penjelasan program EV4PALMS, silakan hubungi 0878-9719-1769 (Muhammad Rizky Lubis) IT Operasional Palm Co PT. Perkebunan Nusantara IV", 
  ...props 
}, ref) => {
  const contextVal = React.useContext(LayoutContext)
  if (contextVal === null) {
    throw new Error(`Layout.Footer must be used within ${Layout.displayName}.`)
  }

  return (
    <div
      ref={ref}
      data-layout='footer'
      className={cn(
        'z-10 bg-white dark:bg-slate-950 dark:text-white py-1 fixed bottom-0 left-0 right-0 border-t-2 shadow-lg border-cyan-800 p-4 md:px-8',
        contextVal.fixed && 'flex-none',
        className
      )}
      {...props}
    >
      <div className="overflow-hidden whitespace-nowrap">
        <div
          className="text-md font-bold inline-block animate-marquee"
          style={{
            animation: 'marquee 45s linear infinite',
            minWidth: '100%',
          }}
        >
          {message}
        </div>
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}
        </style>
      </div>
    </div>
  )
})
Footer.displayName = 'Footer'

// Add to Layout component
Layout.Footer = Footer

Body.displayName = 'Body'

Layout.Header = Header
Layout.Body = Body

export { Layout }
