import { FcTimeline } from "react-icons/fc";

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon:<img width="20" height="20" src="https://img.icons8.com/color/28/doughnut-chart--v1.png" alt="doughnut-chart--v1"/>
  },
  {
    title: 'Nursery',
    href: '/nursery',
    icon: <img width="20" height="20" src="https://img.icons8.com/3d-fluency/20/sprout.png" alt="sprout"/>
  },
  {
    title: 'Replanting',
    href: '/replanting',
    icon: <img width="20" height="20" src="https://img.icons8.com/3d-fluency/20/hand-planting.png" alt="hand-planting"/>
  },
  {
    title: 'Immature',
    href: '/immature',
    icon: <img width="20" height="20" src="https://img.icons8.com/color/20/growing-plant.png" alt="growing-plant"/>
  },

  {
    title: 'Task Scheduler',
    href: '/task-scheduler',
    icon: <img width="20" height="20" src="https://img.icons8.com/arcade/20/task.png" alt="task"/>
  },
  {
    title: 'Highlights Dashboard',
    href: '/highlights-dashboard',
    icon: <FcTimeline size={20} />
  },
  {
    title: 'Data Users',
    href: '/users',
    icon: <img width="20" height="20" src="https://img.icons8.com/color/20/conference-call--v1.png" alt="conference-call--v1"/>
  },
  {
    title: 'FORESIGHT-AI',
    label: 'Coming Soon ',
    href: '/foresight-ai',
    icon: <img width="20" height="20" src="https://img.icons8.com/3d-fluency/94/goprod.png" alt="goprod"/>
  },
  {
    title: 'Investasi Awal',
    href: '/investasi-awal',
    icon: <img width="20" height="20" src="https://img.icons8.com/fluency/20/money-circulation.png" alt="money-circulation"/>
  },
  {
    title: 'Sumber IPS',
    href: '/sumber-ips',
    icon: <img width="20" height="20" src="https://img.icons8.com/color/20/growing-money--v2.png" alt="growing-money--v2"/>
  },
  {
    title: 'Monitoring SPPBJ',
    href: '/monitoring-sppbj',
    icon: <img width="20" height="20" src="https://img.icons8.com/arcade/20/system-task.png" alt="system-task"/>
  },

  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <img width="20" height="20" src="https://img.icons8.com/3d-fluency/94/gear--v2.png" alt="gear--v2"/>
  },
]
