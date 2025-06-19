import { Step } from "react-joyride";

export const langkah: Step[] = [
    {
        target: "#login-feature",
        content: "Silahkan masuk ke akun Anda untuk mengakses fitur-fitur aplikasi.",
        disableBeacon: true,
        placement: "bottom",
    }

]


export const langkahDashboard: Step[] = [
    {
        target: "#dashboard",
        content: "Selamat datang di halaman dashboard!",
        disableBeacon: true,
        placement: "bottom",
    },
    {
        target: "#dashboard-feature",
        content: "Di sini Anda dapat melihat ringkasan data dan fitur-fitur utama aplikasi.",
        disableBeacon: true,
        placement: "bottom",
    },
    {
        target: "#dashboard-chart",
        content: "Grafik ini menunjukkan data terkini dari aplikasi.",
        disableBeacon: true,
        placement: "bottom",
    },
]
