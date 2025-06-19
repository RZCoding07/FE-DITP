import { Separator } from '@/components/ui/separator'

interface ContentSectionProps {
  title: string
  desc: string
  children: JSX.Element
}

export default function ContentSection({
  title,
  desc,
  children,
}: ContentSectionProps) {
  return (
    <div className='flex flex-1 flex-col space-y-4 rounded-lg border bg-card shadow-sm p-5 md:max-h-[calc(100vh-4rem)] md:overflow-hidden lg:max-h-[calc(100vh-4rem)] lg:overflow-hidden lg:rounded-lg lg:border lg:bg-card lg:p-6'>
      <div className='flex-none'>
        <div className='flex flex-1 flex-col'>
          <div className='flex-none'>
            <h3 className='text-lg font-medium'>{title}</h3>
            <p className='text-sm text-muted-foreground'>{desc}</p>
          </div>
          <Separator className='my-4 flex-none' />
          <div className='faded-bottom -mx-4 flex- overflow-y-scroll px-4 md:pb-16'>
            <div className='lg:max-w-xl'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
