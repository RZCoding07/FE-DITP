import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'

import axios from 'axios'
import { Loading } from '@/components/ui/loading'

export default function ForeSightAI() {
  const apiUrl = import.meta.env.VITE_API_MASTER


  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex w-full items-center justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 shadow-cyan-500'>
            <div className='space-y-0.5'> 
                <h2 className='text-2xl font-semibold tracking-tight'>
                Forecasting Optimized Resource Estimation & Strategy Innovation for Growth and Harvest Trends
                </h2>
                <p className='text-sm text-muted-foreground'>
                AI-driven foresight for optimized resource estimation, growth and harvest trends, and strategy innovation.  
                </p>
            </div>
        </div>

        

      </Layout.Body>
    </Layout>
  )
}
