import { useEffect, useState } from 'react';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loading } from '@/components/ui/loading';

export default function ForeSightAI() {
  const apiUrl = import.meta.env.VITE_API_MASTER;

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
        <div className='mb-2 flex w-full items-center justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md  dark:from-slate-950 dark:to-slate-900 shadow-cyan-500'>
          <div className='space-y-0.5'> 
            <h2 className='text-2xl font-semibold tracking-tight'>
              Forecasting Optimized Resource Estimation & Strategy Innovation for Growth and Harvest Trends PTPN-IV
            </h2>
            <p className='text-sm text-muted-foreground'>
              AI-driven foresight for optimized resource estimation, growth and harvest trends, and strategy innovation.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className='p-6 rounded-lg shadow-lg  dark:from-slate-950 dark:to-slate-900 shadow-cyan-500'>
          <h3 className='text-xl font-semibold mb-4'>Analysis & Insights for PICA (Problem Identification & Corrective Action)</h3>
          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
            {['PICA Tekpol', 'PICA Tanaman', 'PICA TBM', 'PICA Infrastruktur'].map((category, index) => (
              <Card key={index} className='py-4 rounded-lg shadow-md bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 shadow-cyan-500'>
                <CardContent>
                  <h4 className='text-lg font-medium'>{category}</h4>
                  <p className='text-sm text-muted-foreground'>
                    Analysis and insights for {category} problems and corrective actions. 
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <h3 className='text-xl font-semibold my-5'>Modeling & Forecasting for Growth and Harvest Trends</h3>

          {/*  Weight Moving Average */}
          <Card className='py-4 rounded-lg shadow-md bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 shadow-cyan-500'>
            <CardContent>
              <h4 className='text-lg font-medium'>Weighted Moving Average</h4>
              <p className='text-sm text-muted-foreground'>
                Weighted moving average for growth and harvest trends.
              </p>
            </CardContent>
             

                      
        </Card>
        </Card>
      </Layout.Body>
    </Layout>
  );
}
