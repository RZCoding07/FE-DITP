import React, { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import {
    IconBrowserCheck,
    IconExclamationCircle,
    IconNotification,
    IconPalette,
    IconTool,
    IconUser,
} from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { Separator } from '@/components/ui/separator'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import cookie from 'js-cookie'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import katex from 'katex';
import 'katex/dist/katex.min.css';
import { data } from "@/data/tbm-param";
import {
    dataOne,
    dataTwo,
    dataThree,
    dataFour,
    dataFive
} from "@/data/tbm-params";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function Settings() {
    const user = cookie.get('user')
    const fullname = user ? JSON.parse(user).fullname : 'user'
    const account_type = user ? JSON.parse(user).account_type : 'user'
    const app_type = user ? JSON.parse(user).app_type : ''




    interface MathRendererProps {
        expression: string;  // Ekspresi LaTeX sebagai string
    }

    const MathRenderer: React.FC<MathRendererProps> = ({ expression }) => {
        const mathContainerRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            if (mathContainerRef.current) {
                // Render ekspresi matematika menggunakan KaTeX
                katex.render(expression, mathContainerRef.current, {
                    throwOnError: false,  // Jangan tampilkan error jika terjadi kesalahan
                });
            }
        }, [expression]);

        return <div style={{ fontSize: '11px' }} ref={mathContainerRef}></div>;
    };

    const [varietas, setVarietas] = React.useState<string>('DP Yangambi');


    const options = [
        // dataOne
        { value: 'DP Yangambi', label: 'DP Yangambi' },
        { value: 'DP PPKS 718', label: 'DP PPKS 718' },
        { value: 'DP 239', label: 'DP 239' },
        // dataTwo
        { value: 'DP Langkat', label: 'DP Langkat' },
        // dataThree
        { value: 'DP Simalungun', label: 'DP Simalungun' },
        { value: 'DP Avros', label: 'DP Avros' },
        { value: 'DP 540', label: 'DP 540' },
        { value: 'Lonsum', label: 'Lonsum' },
        { value: 'Dami Mas', label: 'Dami Mas' },
        { value: 'Bina Sawit Makmur', label: 'Bina Sawit Makmur' },
        { value: 'Sarana Inti Pratama', label: 'Sarana Inti Pratama' },
        { value: 'Panca Surya Garden', label: 'Panca Surya Garden' },
        // dataFour
        { value: 'SF Lame', label: 'SF Lame' },
        { value: 'SF MTG', label: 'SF MTG' },
        { value: 'Bakrie', label: 'Bakrie' },
        { value: 'Topaz', label: 'Topaz' },
        { value: 'Sriwijaya Sampoerna', label: 'Sriwijaya Sampoerna' },
        { value: 'Verdant', label: 'Verdant' },
        // dataFive
        { value: 'SF Yangambi', label: 'SF Yangambi' },

    ];


    const [dataRules, setDataRules] = React.useState<any[]>([]);

    useEffect(() => {
        setDataRules(dataOne);
    }
        , []);

    const handleVarietasChange = (varietas: string) => {
        setVarietas(varietas);
        if (varietas === "DP Yangambi" || varietas === "DP PPKS 718" || varietas === "DP 239") {
            setDataRules(dataOne);
        } else if (varietas === "DP Langkat") {
            setDataRules(dataTwo);
        } else if (varietas === "DP Simalungun" || varietas === "DP Avros" || varietas === "DP 540" || varietas === "Lonsum" || varietas === "Dami Mas" || varietas === "Bina Sawit Makmur" || varietas === "Sarana Inti Pratama" || varietas === "Panca Surya Garden") {
            setDataRules(dataThree);
        } else if (varietas === "SF Lame" || varietas === "SF MTG" || varietas === "SF Yangambi" || varietas === "Bakrie" || varietas === "Topaz" || varietas === "Sriwijaya Sampoerna" || varietas === "Verdant") {
            setDataRules(dataFour);
        } else if (varietas === "DP 239") {
            setDataRules(dataFive);
        }
    }


    const latexExpression = '\\text{Bobot Nilai Kerapatan Pokok} = \\left( \\frac{\\text{Jumlah Pokok Akhir}}{\\text{Jumlah Pokok Awal}} \\times 100\\right) \\times  30\\%';


    return (
        <Layout fixed>
            {/* ===== Top Heading ===== */}
            <Layout.Header>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body className='min-h-[670vh]'>

                <div className='rounded-lg bg-gradient-to-r from-cyan-700 to-green-700 p-6 shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                        <h1 className='text-2xl  font-semibold'>EV4PALMS  |                            <span className='capitalize text-green-100'> PICA Immature </span>
                        </h1>

                    </div>
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>

                        <p className='text-white'>
                            Evolution for Palm Agribusiness Lifecycle Management System
                        </p>
                    </div>
                </div>
                <div className='rounded-lg bg-white dark:bg-slate-950/60 mt-5 p-6 shadow-lg'>
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 h-full'>
                        <div>
                            <h1 className='text-xl'>Hai {fullname}, Selamat Datang di EV4PALMS ! 👋</h1>

                        </div>
                        <div className=''>
                            <p className='text-muted-foreground text-white'>
                                *Anda dapat mengakses  <span className='capitalize'><b>PICA Immature </b></span> dengan akun {account_type}. <br />
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col lg:flex-row rounded-lg'>
                        <img src={'./pica.png'} alt="Logo" className='w-1/2 rounded-2xl shadow-2xl border-2 border-cyan-900' />
                        <div className="mx-10">
                            <h2 className='text-left  text-4xl dark:text-cyan-400 font-semibold'>Workflow Program
                                <span className='capitalize text-green-300'> PICA Immature </span>
                            </h2>
                            <p className='text-xl mt-5'>PICA Adalah kepanjangan Problem Identification Corrective Action yang menjadi bagian tak terpisahkan dalam
                                pelaksanaan siklus PDCA (Plan, Do, Check, Act) agar mencapai tujuan / melampaui target yang telah ditetapkan.</p>
                            <h2 className='text-left  text-2xl dark:text-cyan-400 font-semibold mt-5'>Tujuan Pelaksanaan
                                <span className='capitalize text-green-300'> PICA Immature </span>

                                <ol className='list-decimal list-inside mt-5 dark:text-white font-normal text-lg space-y-3'>
                                    <li>Memberikan pedoman kepada seluruh region untuk melaksanakan identifikasi masalah yang terjadi dengan menggunakan metode PICA.</li>
                                    <li>Pelaksanaan PDCA yang baik merupakan proses Identifikasi Masalah dan Perbaikan yang baik agar proses perbaikan terlaksana berkesinambungan (Continuous
                                        Improvement).</li>
                                    <li>
                                        Tindakan lanjutan yang dilakukan adalah tindakan preventive (pencegahan) untuk menghilangkan penyebab potensi ketidaksesuaian atau masalah yang sama
                                        tidak terulang kembali.
                                    </li>
                                </ol>
                            </h2>
                        </div>
                    </div>
                    <div className='flex flex-col lg:flex-row rounded-lg'>
                        <h2 className='text-center mt-5 text-4xl dark:text-cyan-400 font-semibold'>Clustering
                            <span className='capitalize text-green-300'> PICA Immature </span>
                        </h2>
                        <div className="">
                            <div className="mx-auto mt-4">

                            </div>
                        </div>

                    </div>
                    <div className="grid h-full mb-6">
                        <div className="w-full">
                            <p className='text-lg mt-3'>
                                Clustering PICA Immature adalah pengelompokan tanaman kelapa sawit berdasarkan umur tanaman dan varietas. Pengelompokan ini bertujuan untuk mempermudah dalam melakukan pengukuran vegetatif pada tanaman kelapa sawit. Pengelompokan ini dilakukan dengan menggunakan metode clustering yang mengelompokkan tanaman kelapa sawit berdasarkan umur dan varietasnya. Adapun penilaian pengukuran vegetatif yang dilakukan adalah sebagai berikut:
                            </p>
                            <br />
                            <div className="overflow-x-hidden rounded-lg border border-gray-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/70">
                                <>
                                    <div className="flex flex-col items-center justify-center w-full mb-4">
                                        <div className="flex items-center justify-between w-full">
                                            <h1 className="text-xl font-semibold">Varietas {varietas}</h1>
                                            <div className="flex items-center space-x-2">
                                                <label htmlFor="varietas" className="text-sm font-medium">Pilih Varietas:</label>
                                                <Select defaultValue={options[0].value} onValueChange={handleVarietasChange}>
                                                    <SelectTrigger className="w-[180px]" id="varietas">
                                                        <SelectValue placeholder="Pilih Varietas" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {options.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-[60%_40%] gap-4">
                                        <div className="rounded-md borders">
                                            <Table>
                                                <TableHeader className="bg-cyan-700 text-[14px] text-center">
                                                    <TableRow>
                                                        <TableHead rowSpan={2} className="text-white border-r text-center">
                                                            Fase
                                                        </TableHead>
                                                        <TableHead rowSpan={2} className="text-white border-r">
                                                            Umur
                                                        </TableHead>
                                                        <TableHead colSpan={12} className="text-center text-white border-b">
                                                            Parameter
                                                        </TableHead>
                                                    </TableRow>
                                                    <TableRow>

                                                        <TableHead colSpan={3} className="text-center text-white border-r bg-cyan-600">
                                                            Lingkar Batang
                                                        </TableHead>
                                                        <TableHead colSpan={3} className="text-center text-white bg-cyan-600 border-r">
                                                            Jumlah Pelepah
                                                        </TableHead>
                                                        <TableHead colSpan={3} className="text-center text-white bg-cyan-600">
                                                            Tinggi Tanaman
                                                        </TableHead>
                                                    </TableRow>
                                                    <TableRow className="text-white text-center">
                                                        <TableHead className="border-r" />
                                                        <TableHead className="border-r" />

                                                        <TableHead className="border-r bg-cyan-700">Skor 100</TableHead>
                                                        <TableHead className="border-r bg-cyan-700">Skor 90</TableHead>
                                                        <TableHead className="border-r bg-cyan-700">Skor 80</TableHead>
                                                        <TableHead className="border-r bg-cyan-700">Skor 100</TableHead>
                                                        <TableHead className="border-r bg-cyan-700">Skor 90</TableHead>
                                                        <TableHead className="border-r bg-cyan-700">Skor 80</TableHead>
                                                        <TableHead className="border-r bg-cyan-700">Skor 100</TableHead>
                                                        <TableHead className="border-r bg-cyan-700">Skor 90</TableHead>
                                                        <TableHead className="border-r bg-cyan-700">Skor 80</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="text-lg text-center">
                                                    {dataRules.map((row, index) => (
                                                        <TableRow key={`${row.fase}-${row.umur}`} className={index % 2 === 0 ? "bg-transparent" : "bg-gray-100 dark:bg-slate-900"}>
                                                            <TableCell className="border-r border-l font-medium">{row.fase}</TableCell>
                                                            <TableCell className="border-r text-center">{row.umur}</TableCell>

                                                            <TableCell className="border-r text-center">{row.lingkarBatang.skor100}</TableCell>
                                                            <TableCell className="border-r text-center">{row.lingkarBatang.skor90}</TableCell>
                                                            <TableCell className="border-r text-center">{row.lingkarBatang.skor80}</TableCell>
                                                            <TableCell className="border-r text-center">{row.jumlahPelepah.skor100}</TableCell>
                                                            <TableCell className="border-r text-center">{row.jumlahPelepah.skor90}</TableCell>
                                                            <TableCell className="border-r text-center">{row.jumlahPelepah.skor80}</TableCell>
                                                            <TableCell className="border-r text-center">{row.tinggiTanaman.skor100}</TableCell>
                                                            <TableCell className="border-r text-center">{row.tinggiTanaman.skor90}</TableCell>
                                                            <TableCell className="border-r text-center">{row.tinggiTanaman.skor80}</TableCell>

                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="text-lg mr-5">
                                            <h2 className='font-semibold'>Perumusan Perhitungan Pengukuran Vegetatif</h2>
                                            <p className="text-lg my-2">Perumusan perhitungan pengukuran vegetatif pada tanaman kelapa sawit dilakukan dengan menggunakan metode skor. Skor ini diperoleh dari pengukuran langsung pada lapangan. Berikut adalah rumus perhitungan skor pada parameter vegetatif tanaman kelapa sawit:</p>
                                            <h3 className="my-2 text-lg">1. Kerapatan Pokok</h3>
                                            <MathRenderer expression={latexExpression}
                                            />
                                            <h3 className="my-2 text-lg">2. Lingkar Batang</h3>
                                            <p className="text-lg my-2">
                                                Skor Lingkar Batang = Total Skor x 40%
                                            </p>
                                            <h3 className="my-2 text-lg">3. Jumlah Pelepah</h3>
                                            <p className="text-lg my-2">Bobot Nilai Jumlah Pelepah = Total Skor x 20%
                                            </p>
                                            <h3 className="my-2 text-lg">4. Tinggi Tanaman</h3>
                                            <p className="text-lg my-2">Bobot Nilai Tinggi Tanaman = Total Skor x 10%
                                            </p>
                                            <hr className="border my-3" />
                                            <h2>Kelas Blok</h2>
                                            <p className="text-lg my-2">
                                                Kelas blok merupakan hasil dari perhitungan skor vegetatif yang telah dilakukan. Berikut adalah kriteria kelas blok berdasarkan skor vegetatif:
                                            </p>
                                            <Table>
                                                <TableHeader className="bg-slate-900 text-lg text-center">
                                                    <TableRow>
                                                        <TableHead className="text-white border-r text-center">
                                                            Skor
                                                        </TableHead>
                                                        <TableHead className="text-white border-r text-center">
                                                            Kriteria
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="text-lg text-center">
                                                    <TableRow className="text-white bg-yellow-500">
                                                        <TableCell className="border-r border-l font-medium">A</TableCell>
                                                        <TableCell className="border-r text-center">Skor {'>'} 92 - 100</TableCell>
                                                    </TableRow>
                                                    <TableRow className="text-white bg-green-700">
                                                        <TableCell className="border-r border-l font-medium">B</TableCell>
                                                        <TableCell className="border-r text-center">Skor {'>'} 87 - 92</TableCell>
                                                    </TableRow>
                                                    <TableRow className="text-white bg-red-800">
                                                        <TableCell className="border-r border-l font-medium">C</TableCell>
                                                        <TableCell className="border-r text-center">Skor {'>'} 82 - 87</TableCell>
                                                    </TableRow>
                                                    <TableRow className="text-white bg-black">
                                                        <TableCell className="border-r border-l font-medium">D</TableCell>
                                                        <TableCell className="border-r text-center">Skor {'<'} 82</TableCell>
                                                    </TableRow>

                                                </TableBody>
                                            </Table>


                                        </div>



                                    </div>

                                </>

                            </div>
                            <div className='flex flex-col lg:flex-row rounded-lg mb-5'>
                                <h2 className='text-center mt-5 text-4xl dark:text-cyan-400 font-semibold'>Empat Kuadran Korelasi
                                    <span className='capitalize text-green-300'> PICA dengan Serapan Biaya </span>
                                </h2>

                            </div>
                            <div className='flex flex-col lg:flex-row rounded-lg'>
                                <img src={'./kuadran.png'} alt="Logo" className='rounded-2xl shadow-2xl border-2 border-cyan-900' width="100%" />
                            </div>
                            <div className="grid grid-cols-3 text-center gap-4 mt-5">
                                <div className='text-center'>
                                    <h2 className='text-center mt-5 text-4xl dark:text-cyan-400 font-semibold'>
                                        Gambar Penampang Daun
                                        <br />
                                        <span className='capitalize text-green-300'> Kelapa Sawit </span>
                                    </h2>
                                    <div className='flex flex-col lg:flex-row rounded-lg items-stretch'>
                                        <img src={'./kriteria.jpeg'} alt="Logo" className='rounded-2xl shadow-2xl border-2 border-cyan-900 flex-grow' />
                                    </div>
                                </div>
                                <div>
                                    <h2 className='text-center mt-5 text-4xl dark:text-cyan-400 font-semibold'>
                                        Pengukuran
                                        <br />
                                        <span className='capitalize text-green-300'> diameter batang </span>
                                    </h2>
                                    <div className='flex flex-col lg:flex-row rounded-lg items-stretch'>
                                        <img src={'./diameter-batang.jpeg'} alt="Logo" className='rounded-2xl shadow-2xl border-2 border-cyan-900 flex-grow' />
                                    </div>
                                </div>
                                <div>
                                    <h2 className='text-center mt-5 text-4xl dark:text-cyan-400 font-semibold'>
                                        Pengukuran
                                        <br />
                                        <span className='capitalize text-green-300'> tinggi tanaman </span>
                                    </h2>
                                    <div className='flex flex-col lg:flex-row rounded-lg items-stretch'>
                                        <img src={'./tinggi-tanaman.jpeg'} alt="Logo" className='rounded-2xl shadow-2xl border-2 border-cyan-900 flex-grow' />
                                    </div>
                                </div>
                            </div>

                        </div>


                    </div>
                </div>


            </Layout.Body>
            <Layout.Footer/>
        </Layout>
    )
}

const sidebarNavItems = [
    {
        title: 'Profile',
        icon: <IconUser size={18} />,
        href: '/settings',
    },

    {
        title: 'Appearance',
        icon: <IconPalette size={18} />,
        href: '/settings/appearance',
    },
]
