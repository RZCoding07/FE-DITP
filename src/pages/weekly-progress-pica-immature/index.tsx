import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/custom/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ThemeSwitch from '@/components/theme-switch'
import { Link, useNavigate, useParams } from 'react-router-dom'
import WeeklyDateList from '@/components/custom/weekly-data-list'

export default function UpdateProgressWeekly() {
    const { id, start_date, end_date } = useParams()
    const navigate = useNavigate()

    const decodeBase64 = (base64Str: string): string => {
        return atob(base64Str); // Mengonversi base64 ke string
    };

    const decodedStartDate = decodeBase64(start_date || '')
    const decodedEndDate = decodeBase64(end_date || '')

    // convert to date object
    const startDate = new Date(decodedStartDate)
    const endDate = new Date(decodedEndDate)



    return (
        <Layout>
            <Layout.Header sticky>
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body>
                <WeeklyDateList id={id} startDate={startDate} endDate={endDate} />

            </Layout.Body>
        </Layout>
    )
}