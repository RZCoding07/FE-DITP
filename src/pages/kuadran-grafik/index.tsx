'use client'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Controller } from 'react-hook-form'
import { customStyles } from '@/styles/select-styles'
import React, { useState, useEffect, useRef, useId } from 'react'
import cookie from 'js-cookie'
import Papa from 'papaparse'
import { BsFillCheckCircleFill, BsTrash } from 'react-icons/bs'
import readXlsxFile from 'read-excel-file'
import { FaFileExcel } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Box, CircularProgress, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import slugify from 'slugify'
import Select from 'react-select'
import axios from 'axios'
import StockAnalysisChartBar from '@/components/custom/bar-chart'
import { fetchKebun } from '@/utils/api_immature'
import { SelectOption } from '@/utils/types'
import { MONTH_NAMES } from '@/utils/constants'
import { fetchDistinctYears } from '@/utils/api_immature'
import { fetchVegetativeProc } from '@/utils/api_immature'
import ScatterChart from '@/components/custom/kuadran'
import { regionalKebunData } from '@/data/regional-kebun'
import { kebunAfdBlok } from '@/data/kebun-afd-blok'

export default function PicaTbm() {
    const [isLoadingUpload, setIsLoadingUpload] = useState(false)
    const [isUploadingDone, setIsUploadingDone] = useState(false)
    const [progressValue, setProgressValue] = useState(0)

    const [afdOptions, setAfdOptions] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [awal, setAwal] = useState([])

    const user = JSON.parse(cookie.get('user') || '{}')
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()

    const router = useNavigate()

    const bulan: any = watch('bulan')
    const tahun: any = watch('tahun')

    const [bulanOptions, setBulanOptions] = useState<SelectOption[]>([])
    const [tahunOptions, setTahunOptions] = useState<SelectOption[]>([])
    const [defaultBulan, setDefaultBulan] = useState<SelectOption | null>(null)
    const [defaultTahun, setDefaultTahun] = useState<SelectOption | null>(null)

    const [countRedBlock, setCountRedBlock] = useState(0)
    const [countBlackBlock, setCountBlackBlock] = useState(0)

    // countRedBlock and countBlackBlock TBM 1 - 4
    const [countRedBlockTbm1, setCountRedBlockTbm1] = useState(0)
    const [countRedBlockTbm2, setCountRedBlockTbm2] = useState(0)
    const [countRedBlockTbm3, setCountRedBlockTbm3] = useState(0)
    const [countRedBlockTbm4, setCountRedBlockTbm4] = useState(0)

    const [countBlackBlockTbm1, setCountBlackBlockTbm1] = useState(0)
    const [countBlackBlockTbm2, setCountBlackBlockTbm2] = useState(0)
    const [countBlackBlockTbm3, setCountBlackBlockTbm3] = useState(0)
    const [countBlackBlockTbm4, setCountBlackBlockTbm4] = useState(0)

    const apiUrl = import.meta.env.VITE_API_IMMATURE
    const rpcOptions = [
        { value: 'RPC1', label: 'RPC 1' },
        { value: 'RPC2', label: 'RPC 2' },
        { value: 'RPC3', label: 'RPC 3' },
        { value: 'RPC4', label: 'RPC 4' },
        { value: 'RPC5', label: 'RPC 5' },
        { value: 'RPC6', label: 'RPC 6' },
        { value: 'RPC7', label: 'RPC 7' },
        // { value: 'DATIM', label: 'DATIM' },
        // { value: 'DJABA', label: 'DJABA' },
        // { value: 'DSMTU', label: 'DSMTU' },
        { value: 'RPC2N2', label: 'RPC2N2' },
        { value: 'RPC2N14', label: 'RPC2N14' },
    ]

    const tbmopt = [
        { value: 'tbm1', label: 'TBM 1' },
        { value: 'tbm2', label: 'TBM 2' },
        { value: 'tbm3', label: 'TBM 3' },
        { value: 'tbm4', label: 'TBM > 3' },
    ]

    const fetchInvesAwal = async () => {
        setLoading(true)
        const tahun = new Date().getFullYear()
        try {
            const response = await axios.get(`${apiUrl}/vegetatif`, {})
            setAwal(response.data)
        } catch (error: any) {
            console.error('Error fetching Awal:', error)
            setError(error)
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 2200)
        }
    }

    function getScoreLingkarBatang(age: any, value: any) {
        // Input validation
        if (age < 1 || age > 36) {
            console.log(age)
            return 0
        }

        const thresholds: any = {
            1: { score100: 51, score90: [46, 50], score80: 46 },
            2: { score100: 64, score90: [58, 63], score80: 58 },
            3: { score100: 77, score90: [69, 76], score80: 69 },
            4: { score100: 90, score90: [81, 89], score80: 81 },
            5: { score100: 103, score90: [93, 102], score80: 93 },
            6: { score100: 116, score90: [104, 115], score80: 104 },
            7: { score100: 122, score90: [109, 121], score80: 109 },
            8: { score100: 127, score90: [114, 126], score80: 114 },
            9: { score100: 133, score90: [120, 132], score80: 120 },
            10: { score100: 138, score90: [125, 137], score80: 125 },
            11: { score100: 144, score90: [130, 143], score80: 130 },
            12: { score100: 150, score90: [135, 149], score80: 135 },
            13: { score100: 157, score90: [141, 156], score80: 141 },
            14: { score100: 164, score90: [128, 163], score80: 128 },
            15: { score100: 171, score90: [154, 170], score80: 154 },
            16: { score100: 178, score90: [160, 177], score80: 160 },
            17: { score100: 185, score90: [167, 184], score80: 167 },
            18: { score100: 192, score90: [173, 191], score80: 173 },
            19: { score100: 199, score90: [179, 198], score80: 179 },
            20: { score100: 206, score90: [186, 205], score80: 186 },
            21: { score100: 214, score90: [192, 213], score80: 192 },
            22: { score100: 221, score90: [199, 220], score80: 199 },
            23: { score100: 228, score90: [205, 227], score80: 205 },
            24: { score100: 235, score90: [212, 234], score80: 212 },
            25: { score100: 242, score90: [218, 241], score80: 218 },
            26: { score100: 249, score90: [224, 228], score80: 224 },
            27: { score100: 256, score90: [230, 255], score80: 230 },
            28: { score100: 263, score90: [237, 262], score80: 237 },
            29: { score100: 270, score90: [243, 259], score80: 243 },
            30: { score100: 277, score90: [249, 276], score80: 249 },
            31: { score100: 277, score90: [271, 276], score80: 271 },
            32: { score100: 277, score90: [271, 276], score80: 271 },
            33: { score100: 277, score90: [271, 276], score80: 271 },
            34: { score100: 277, score90: [271, 276], score80: 271 },
            35: { score100: 277, score90: [271, 276], score80: 271 },
            36: { score100: 277, score90: [271, 276], score80: 271 },
        }

        if (value >= thresholds[age].score100) {
            return 100
        } else if (
            value >= thresholds[age].score90[0] &&
            value < thresholds[age].score100
        ) {
            return 90
        } else if (value < thresholds[age].score80) {
            return 80
        } else {
            return 0
        }
    }

    function getScoreJumlahPelepah(age: any, frondCount: any) {
        const frondThresholds: any = {
            1: { score100: 19, score90: 18, score80: 17 },
            2: { score100: 19, score90: 18, score80: 17 },
            3: { score100: 19, score90: 18, score80: 17 },
            4: { score100: 20, score90: 19, score80: 18 },
            5: { score100: 20, score90: 19, score80: 18 },
            6: { score100: 20, score90: 19, score80: 18 },
            7: { score100: 21, score90: 20, score80: 19 },
            8: { score100: 24, score90: 23, score80: 22 },
            9: { score100: 27, score90: 26, score80: 25 },
            10: { score100: 31, score90: 29, score80: 28 },
            11: { score100: 34, score90: 32, score80: 30 },
            12: { score100: 37, score90: 35, score80: 33 },
            13: { score100: 38, score90: 36, score80: 34 },
            14: { score100: 38, score90: 36, score80: 34 },
            15: { score100: 39, score90: 37, score80: 35 },
            16: { score100: 39, score90: 37, score80: 35 },
            17: { score100: 40, score90: 38, score80: 36 },
            18: { score100: 40, score90: 38, score80: 36 },
            19: { score100: 40, score90: 38, score80: 36 },
            20: { score100: 40, score90: 38, score80: 36 },
            21: { score100: 40, score90: 38, score80: 36 },
            22: { score100: 40, score90: 38, score80: 36 },
            23: { score100: 40, score90: 38, score80: 36 },
            24: { score100: 40, score90: 38, score80: 36 },
            25: { score100: 43, score90: 40, score80: 38 },
            26: { score100: 45, score90: 43, score80: 41 },
            27: { score100: 28, score90: 45, score80: 43 },
            28: { score100: 50, score90: 28, score80: 45 },
            29: { score100: 53, score90: 50, score80: 28 },
            30: { score100: 56, score90: 53, score80: 50 },
            31: { score100: 56, score90: 55, score80: 51 },
            32: { score100: 56, score90: 55, score80: 51 },
            33: { score100: 56, score90: 55, score80: 51 },
            34: { score100: 56, score90: 55, score80: 51 },
            35: { score100: 56, score90: 55, score80: 51 },
            36: { score100: 56, score90: 55, score80: 51 },
        }

        // Input validation
        if (age < 1 || age > 36) {
            return 0
        }

        const threshold = frondThresholds[age]

        if (frondCount >= threshold.score100) {
            return 100
        } else if (frondCount < threshold.score100 && frondCount >= threshold.score80) {
            return 90
        } else if (frondCount < threshold.score80) {
            return 80
        } else {
            return 0
        }
    }

    function getScoreTinggiTanaman(age: any, value: any) {
        const rulesTinggiTanaman: any = {
            '1': { min: 21, max: 21 },
            '2': { min: 23, max: 24 },
            '3': { min: 24, max: 27 },
            '4': { min: 26, max: 30 },
            '5': { min: 28, max: 33 },
            '6': { min: 30, max: 36 },
            '7': { min: 36, max: 41 },
            '8': { min: 43, max: 46 },
            '9': { min: 48, max: 51 },
            '10': { min: 53, max: 56 },
            '11': { min: 59, max: 63 },
            '12': { min: 64, max: 70 },
            '13': { min: 70, max: 74 },
            '14': { min: 76, max: 79 },
            '15': { min: 81, max: 83 },
            '16': { min: 86, max: 88 },
            '17': { min: 90, max: 93 },
            '18': { min: 95, max: 99 },
            '19': { min: 102, max: 105 },
            '20': { min: 108, max: 110 },
            '21': { min: 115, max: 116 },
            '22': { min: 121, max: 122 },
            '23': { min: 127, max: 128 },
            '24': { min: 133, max: 135 },
            '25': { min: 139, max: 140 },
            '26': { min: 144, max: 146 },
            '27': { min: 149, max: 153 },
            '28': { min: 154, max: 160 },
            '29': { min: 159, max: 166 },
            '30': { min: 164, max: 173 },
            '31': { min: 164, max: 173 },
            '32': { min: 164, max: 173 },
            '33': { min: 164, max: 173 },
            '34': { min: 164, max: 173 },
            '35': { min: 164, max: 173 },
            '36': { min: 164, max: 173 }
        };

        // Cek apakah age valid dalam rulesTinggiTanaman
        if (rulesTinggiTanaman[age]) {
            if (value < rulesTinggiTanaman[age].min) {
                return 80;
            } else if (value >= rulesTinggiTanaman[age].min && value < rulesTinggiTanaman[age].max) {
                return 90;
            } else if (value >= rulesTinggiTanaman[age].max) {
                return 100;
            }
        }

        // Jika age tidak valid, kembalikan nilai 0 atau nilai default
        return 0;
    }

    function getScoreKerapatanPokok(
        age: any,
        jum_pokok_awal: any,
        jum_pokok_akhir: any
    ) {
        let result = 0
        result = (jum_pokok_akhir / jum_pokok_awal) * 100
        if (result > 100) {
            return 100
        } else {
            return result
        }
    }

    const [tbmRes, setTbmRes] = useState<any[]>([])
    const [scores, setScores] = useState<any[]>([])
    const [colorData, setColorData] = useState({
        hitam: 0,
        merah: 0,
        hijau: 0,
        emas: 0,
    })

    const [colorDataLuas, setColorDataLuas] = useState({
        hitam: 0,
        merah: 0,
        hijau: 0,
        emas: 0,
    })

    const [tbmData, setTbmData] = useState({
        tbm1: 0,
        tbm2: 0,
        tbm3: 0,
        tbm4: 0,
    })

    const [tbmDataScorePelepahBlok, setTbmDataScorePelepahBlok] = useState({
        tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
        tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
        tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
    })

    const [tbmDataScoreLingkarBlok, setTbmDataScoreLingkarBlok] = useState({
        tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
        tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
        tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
    })

    const [regionalBlackBlockCount, setRegionalBlackBlockCount] = useState<any>({});




    useEffect(() => {
        const fetchProcVegetatifDefault = async () => {

            try {
                // Reset all values to zero
                setTbmRes([]);  // reset tbmRes array
                setScores([]);  // reset scores array
                setColorData({
                    hitam: 0,
                    merah: 0,
                    hijau: 0,
                    emas: 0,
                });  // reset colorData
                setColorDataLuas({
                    hitam: 0,
                    merah: 0,
                    hijau: 0,
                    emas: 0,
                });  // reset colorDataLuas
                setTbmData({
                    tbm1: 0,
                    tbm2: 0,
                    tbm3: 0,
                    tbm4: 0,
                });  // reset tbmData
                setTbmDataScorePelepahBlok({
                    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
                    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
                    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
                });  // reset tbmDataScorePelepahBlok
                setTbmDataScoreLingkarBlok({
                    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
                    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
                    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
                });  // reset tbmDataScoreLingkarBlok

                const tbmResults: {
                    tbm1: number
                    tbm2: number
                    tbm3: number
                    tbm4: number
                } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

                const pokokSekarangResults: {
                    tbm1: number
                    tbm2: number
                    tbm3: number
                    tbm4: number
                } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

                const calJumlahPelepahResults: {
                    tbm1: number
                    tbm2: number
                    tbm3: number
                    tbm4: number
                } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

                const calLingkarBatangResults: {
                    tbm1: number
                    tbm2: number
                    tbm3: number
                    tbm4: number
                } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

                const avgPelepahResults: {
                    tbm1: number
                    tbm2: number
                    tbm3: number
                    tbm4: number
                } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

                const avgLingkarBatangResults: {
                    tbm1: number
                    tbm2: number
                    tbm3: number
                    tbm4: number
                } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

                const scoreLingkarBatangResults: {
                    tbm1: {
                        score100: number
                        score90: number
                        score80: number
                        total: number
                    }
                    tbm2: {
                        score100: number
                        score90: number
                        score80: number
                        total: number
                    }
                    tbm3: {
                        score100: number
                        score90: number
                        score80: number
                        total: number
                    }
                } = {
                    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
                    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
                    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
                }

                const scoreJumlahPelepahResults: {
                    tbm1: {
                        score100: number
                        score90: number
                        score80: number
                        total: number
                    }
                    tbm2: {
                        score100: number
                        score90: number
                        score80: number
                        total: number
                    }
                    tbm3: {
                        score100: number
                        score90: number
                        score80: number
                        total: number
                    }
                } = {
                    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
                    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
                    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
                }

                const loader = toast.loading(`Memuat data untuk Keseluruhan TBM...`, {
                    duration: 20000,
                })

                for (let i = 1; i < 5; i++) {
                    const tahunTanam = tahun.value - i;
                    const response = await fetchVegetativeProc({
                        input_tbm: 'tbm' + i,
                        input_tahun_tanam: tahunTanam,
                    });

                    setTbmRes((prev) => [...prev, Object.values(response.data)]);

                    const regionalBlackBlockCount: { [key: string]: number } = {};

                    const newScores = Object.values(response.data).map((item: any) => {
                        let age = bulan.value * i;
                        if (age > 36) {
                            age = 36;
                        }
                        const blok = item.blok;
                        const scoreLingkarBatang =
                            getScoreLingkarBatang(age, parseFloat(item.lingkar_batang_cm)) * 0.4;
                        const scoreJumlahPelepah =
                            getScoreJumlahPelepah(age, parseFloat(item.jumlah_pelepah_bh)) * 0.2;

                        const scoreTinggiBatang =
                            getScoreTinggiTanaman(age, parseFloat(item.tinggi_tanaman_cm)) * 0.1;

                        const scoreKerapatanPokok =
                            getScoreKerapatanPokok(
                                age,
                                parseFloat(item.jumlah_pokok_awal_tanam),
                                parseFloat(item.jumlah_pokok_sekarang)
                            ) * 0.3;

                        const totalSeleksian =
                            scoreLingkarBatang +
                            scoreJumlahPelepah +
                            scoreTinggiBatang +
                            scoreKerapatanPokok;

                        let colorCategory = '';

                        if (totalSeleksian < 80) {
                            colorCategory = 'black';
                            // Jika colorCategory adalah black, hitung berdasarkan regional
                            const regional = item.regional;
                            if (regionalBlackBlockCount[regional]) {
                                regionalBlackBlockCount[regional] += 1;
                            } else {
                                regionalBlackBlockCount[regional] = 1;
                            }
                        } else if (totalSeleksian >= 80 && totalSeleksian < 90) {
                            colorCategory = 'red';
                        } else if (totalSeleksian >= 90 && totalSeleksian < 97) {
                            colorCategory = 'green';
                        } else if (totalSeleksian >= 97) {
                            colorCategory = 'gold';
                        }

                        const luas = parseFloat(item.luas_ha);
                        const regional = item.regional;
                        const kebun = item.kebun;
                        const lingkar = parseFloat(item.lingkar_batang_cm);
                        const tinggi = parseFloat(item.tinggi_tanaman_cm);
                        const jumPelepah = parseFloat(item.jumlah_pelepah_bh);

                        // Menyimpan data ke state
                        setScores((prev) => [
                            ...prev,
                            {
                                [`tbm${i}`]: {
                                    regional,
                                    kebun,
                                    afdeling: item.afdeling,
                                    blok,
                                    scoreLingkarBatang,
                                    scoreJumlahPelepah,
                                    scoreTinggiBatang,
                                    scoreKerapatanPokok,
                                    totalSeleksian,
                                    colorCategory,
                                    luas,
                                    jumPelepah,
                                },
                            },
                        ]);

                        // Set color data untuk hitam, merah, hijau, emas
                        setColorData((prev) => ({
                            ...prev,
                            hitam: totalSeleksian <= 80 ? prev.hitam + 1 : prev.hitam,
                            merah: totalSeleksian > 80 && totalSeleksian <= 89 ? prev.merah + 1 : prev.merah,
                            hijau: totalSeleksian > 89 && totalSeleksian <= 96 ? prev.hijau + 1 : prev.hijau,
                            emas: totalSeleksian > 96 ? prev.emas + 1 : prev.emas,
                        }));

                        // Set color data luas per kategori
                        setColorDataLuas((prev) => ({
                            ...prev,
                            hitam: totalSeleksian <= 80 ? prev.hitam + luas : prev.hitam,
                            merah: totalSeleksian > 80 && totalSeleksian <= 89 ? prev.merah + luas : prev.merah,
                            hijau: totalSeleksian > 89 && totalSeleksian <= 96 ? prev.hijau + luas : prev.hijau,
                            emas: totalSeleksian > 96 ? prev.emas + luas : prev.emas,
                        }));

                        return {
                            [`tbm${i}`]: {
                                regional,
                                blok,
                                scoreLingkarBatang,
                                scoreJumlahPelepah,
                                scoreTinggiBatang,
                                scoreKerapatanPokok,
                                totalSeleksian,
                                colorCategory,
                                luas,
                            },
                        };
                    });

                    // Rekap jumlah blok hitam per regional
                    setRegionalBlackBlockCount((prev: any) => ({
                        ...prev,
                        [`tbm${i}`]: regionalBlackBlockCount,
                    }));

                    // Menghitung total luas dan pokok untuk rekap
                    const totalLuasHa: number = Object.values(response.data).reduce(
                        (acc: number, curr: any) => acc + parseFloat(curr.luas_ha),
                        0
                    );

                    const totalPokokSekarang: number = Object.values(response.data).reduce(
                        (acc: number, curr: any) => acc + parseFloat(curr.jumlah_pokok_sekarang),
                        0
                    );

                    const totalCalJumlahPelepah: number = Object.values(response.data).reduce(
                        (acc: number, curr: any) => acc + parseFloat(curr.cal_jumlah_pelepah),
                        0
                    );

                    const totalCalLingkarBatang: number = Object.values(response.data).reduce(
                        (acc: number, curr: any) => acc + parseFloat(curr.cal_lingkar_batang),
                        0
                    );

                    tbmResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalLuasHa;

                    pokokSekarangResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalPokokSekarang;

                    calJumlahPelepahResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalCalJumlahPelepah;

                    calLingkarBatangResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalCalLingkarBatang;

                    avgPelepahResults[`tbm${i as 1 | 2 | 3 | 4}`] =
                        totalCalJumlahPelepah / totalPokokSekarang;

                    avgLingkarBatangResults[`tbm${i as 1 | 2 | 3 | 4}`] =
                        totalCalLingkarBatang / totalPokokSekarang;

                    if (i < 4) {
                        scoreJumlahPelepahResults[`tbm${i as 1 | 2 | 3}`] = {
                            score100: newScores.filter(
                                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 100
                            ).length,
                            score90: newScores.filter(
                                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 90
                            ).length,
                            score80: newScores.filter(
                                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 80
                            ).length,
                            total: newScores.length,
                        };

                        scoreLingkarBatangResults[`tbm${i as 1 | 2 | 3}`] = {
                            score100: newScores.filter(
                                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 100
                            ).length,
                            score90: newScores.filter(
                                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 90
                            ).length,
                            score80: newScores.filter(
                                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 80
                            ).length,
                            total: newScores.length,
                        };
                    }
                }

                setTbmData(tbmResults)
                setTbmDataScorePelepahBlok(scoreJumlahPelepahResults)
                setTbmDataScoreLingkarBlok(scoreLingkarBatangResults)
                toast.success('Seluruh data TBM berhasil ditampilkan!', {
                    id: loader,
                    duration: 2000,
                })
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        if (bulan && tahun) {
            fetchProcVegetatifDefault()
        }
    }, [bulan, tahun])



    useEffect(() => {
        fetchInvesAwal()
    }, [])


    useEffect(() => {
        const fetchBulanTahun = async () => {
            try {
                const data = await fetchDistinctYears()

                const tahun = data.map((item: any) => ({
                    value: item.tahun,
                    label: item.tahun.toString(),
                }))

                const bulan = data.map((item: any) => ({
                    value: item.bulan,
                    label: MONTH_NAMES[parseInt(item.bulan) - 1],
                }))

                setTahunOptions(tahun)
                setBulanOptions(bulan)

                if (tahun.length > 0) {
                    setDefaultTahun(tahun[0])
                    setValue('tahun', tahun[0])
                }
                if (bulan.length > 0) {
                    setDefaultBulan(bulan[0])
                    setValue('bulan', bulan[0])
                }
            } catch (error) {
                console.error('Error fetching stok awal:', error)
            }
        }

        fetchBulanTahun()
    }, [setValue])


    useEffect(() => {

        const tbm1Data = scores.filter((score: any) => {
            const tbmKey = Object.keys(score)[0];
            return tbmKey === 'tbm1';
        });

        const tbm2Data = scores.filter((score: any) => {
            const tbmKey = Object.keys(score)[0];
            return tbmKey === 'tbm2';
        });

        const tbm3Data = scores.filter((score: any) => {
            const tbmKey = Object.keys(score)[0];
            return tbmKey === 'tbm3';
        });

        const tbm4Data = scores.filter((score: any) => {
            const tbmKey = Object.keys(score)[0];
            return tbmKey === 'tbm4';
        });

        const tbm1RedData = tbm1Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
        const tbm1BlackData = tbm1Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

        const tbm2RedData = tbm2Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
        const tbm2BlackData = tbm2Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

        const tbm3RedData = tbm3Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
        const tbm3BlackData = tbm3Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

        const tbm4RedData = tbm4Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
        const tbm4BlackData = tbm4Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

        const dataColorRed = scores.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
        rpcOptions.forEach((rpc) => {
            const tbmallRed = dataColorRed.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            const tbm1Red = tbm1RedData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            const tbm2Red = tbm2RedData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            const tbm3Red = tbm3RedData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            const tbm4Red = tbm4RedData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            setCountRedBlock((prev: any) => ({
                ...prev,
                [rpc.value]: tbmallRed.length,
            }))
            setCountRedBlockTbm1((prev: any) => ({
                ...prev,
                [rpc.value]: tbm1Red.length,
            }))
            setCountRedBlockTbm2((prev: any) => ({
                ...prev,
                [rpc.value]: tbm2Red.length,
            }))

            setCountRedBlockTbm3((prev: any) => ({
                ...prev,
                [rpc.value]: tbm3Red.length,
            }))
            setCountRedBlockTbm4((prev: any) => ({
                ...prev,
                [rpc.value]: tbm4Red.length,
            }))


            const dataColorBlack = scores.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

            const tbmallBlack = dataColorBlack.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            const tbm1Black = tbm1BlackData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            const tbm2Black = tbm2BlackData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            const tbm3Black = tbm3BlackData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            const tbm4Black = tbm4BlackData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
            setCountBlackBlock((prev: any) => ({
                ...prev,
                [rpc.value]: tbmallBlack.length,
            }))
            setCountBlackBlockTbm1((prev: any) => ({
                ...prev,
                [rpc.value]: tbm1Black.length,
            }))
            setCountBlackBlockTbm2((prev: any) => ({
                ...prev,
                [rpc.value]: tbm2Black.length,
            }))
            setCountBlackBlockTbm3((prev: any) => ({
                ...prev,
                [rpc.value]: tbm3Black.length,
            }))
            setCountBlackBlockTbm4((prev: any) => ({
                ...prev,
                [rpc.value]: tbm4Black.length,
            }))
        })

    }, [scores])

    const tbmOpt = [
        { value: 'keseluruhan-tbm', label: 'Keseluruhan TBM' },
        { value: 'tbm1', label: 'TBM 1' },
        { value: 'tbm2', label: 'TBM 2' },
        { value: 'tbm3', label: 'TBM 3' },
        { value: 'tbm4', label: 'TBM > 3' },
    ]
    const [selectedRpc, setSelectedRpc] = useState<string | null>(null);
    const [kebunOptions, setKebunOptions] = useState<any[]>([]);


    const handleRpcChange = (selectedOption: any) => {
        setSelectedRpc(selectedOption.value);
        const selectedRegional = regionalKebunData.regionals.find(
            (regional) => regional.name === selectedOption.value
        );
        setValue('kebun', null);
        setKebunOptions(
            selectedRegional ? selectedRegional.kebuns.map((kebun) => ({ value: kebun, label: kebun })) : []
        );
    };


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
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="items-baseline flex justify-between">
                                <h2 className='text-xl font-semibold'>
                                    Kuadran Grafik PICA (Problem Idendification & Corrective Action)

                                </h2>
                                <div className='-ml-5 flex gap-4'>
                                    {/* <h2 className='text-lg mt-1 ml-5 mr-2'>Pilih Tahun : </h2> */}
                                    <Controller
                                        name='tahun'
                                        control={control}
                                        defaultValue={defaultTahun}
                                        render={({ field }) => (
                                            <Select {...field} styles={customStyles} options={tahunOptions} />
                                        )}
                                    />

                                    {/* <h2 className='text-lg mt-1 ml-5 mr-2'>Pilih Bulan : </h2> */}

                                    <Controller
                                        name='bulan'
                                        control={control}
                                        defaultValue={defaultBulan}
                                        render={({ field }) => (
                                            <Select {...field} styles={customStyles} options={bulanOptions} />
                                        )}
                                    />

                                    {/* RPC */}
                                    <Controller
                                        name='rpc'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                styles={customStyles}
                                                placeholder='Pilih RPC'
                                                isSearchable
                                                options={rpcOptions}
                                                onChange={(selectedOption) => {
                                                    field.onChange(selectedOption); // Update form value
                                                    handleRpcChange(selectedOption); // Custom handler function
                                                }}
                                            />
                                        )}
                                    />

                                    <h2 className='text-lg mt-1 ml-5 mr-2'>Sortir berdasarkan : </h2>
                                    <Controller
                                        name='tbm'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                            {...field}
                                                styles={customStyles}
                                                placeholder='Pilih TBM'
                                                isSearchable
                                                defaultValue={{ value: 'keseluruhan-tbm', label: 'Keseluruhan TBM' }}
                                                options={tbmOpt}
                                                // onChange={(selectedOption) => {}
                                            />
                                        )}
                                    />

                                </div>
                            </div>


                        </CardTitle>
                        <div className='flex items-center justify-between'>
                            <p className='text-muted-foreground'>
                                Kuadran Grafik PICA (Problem Identification & Corrective Action) Investasi
                                Tanaman
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>

                        <div className='items-center justify-center align-middle mr-1 pb-5'>
                            <div className='rounded-lg border border-cyan-500 bg-white p-3 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-cyan-700 dark:to-cyan-600'>
                                <ScatterChart />
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </Layout.Body>
        </Layout>
    )
}
