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
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <img width="20" height="20" src="https://img.icons8.com/3d-fluency/94/gear--v2.png" alt="gear--v2"/>
  },
]
