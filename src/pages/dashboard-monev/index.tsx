import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/custom/layout";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import ThemeSwitch from "@/components/theme-switch";
import { TopNav } from "@/components/top-nav";
import PlantationDashboardMasterpiece from "@/components/plantation-dashboard-enhanced";
import type { DashboardFilters } from "@/types/api";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import cookie from "js-cookie";

// Ensure in tailwind.config.js you have:
// module.exports = {
//   darkMode: 'class',
//   // ...
// };

export default function DashboardMasterpiece() {
  const user = cookie.get('user');
  const app_type = user ? JSON.parse(user).app_type : '';
  const account_type = user ? JSON.parse(user).account_type : '';
  const rpc = user ? JSON.parse(user).rpc : '';
  const [theme, setTheme] = useState<string>(cookie.get('theme') || 'system');

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system preference
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', media.matches);
      const listener = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme]);

  let topNav: { title: string; href: string; isActive: boolean }[] = [];
  if (app_type === "all") {
    topNav = [
      { title: "Nursery", href: "/dashboard-nursery", isActive: false },
      { title: "Replanting (TU/TK/TB)", href: "/dashboard-replanting", isActive: false },
      { title: "Immature", href: "/dashboard-immature", isActive: false },
      { title: "Monica", href: "/dashboard-monica", isActive: false },
      { title: "Monev TU by KKMV", href: "/dashboard-monev", isActive: true },
      { title: "Replanting Area", href: "/dashboard-inspire", isActive: false },
    ];
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<DashboardFilters>({
    dari_tanggal: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    sampai_tanggal: format(new Date(), "yyyy-MM-dd"),
    regional: rpc || "",
    kode_unit: "",
    afdeling: "",
    blok: "",
  });

  useEffect(() => {
    const newFilters: DashboardFilters = {
      dari_tanggal: searchParams.get('dari_tanggal') || format(subDays(new Date(), 30), "yyyy-MM-dd"),
      sampai_tanggal: searchParams.get('sampai_tanggal') || format(new Date(), "yyyy-MM-dd"),
      regional: rpc !== "" ? rpc : searchParams.get('regional') || "",
      kode_unit: searchParams.get('kode_unit') || searchParams.get('kebun') || "",
      afdeling: searchParams.get('afdeling') || "",
      blok: searchParams.get('blok') || "",
    };
    setFilters(newFilters);
  }, [searchParams, rpc]);

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  useEffect(() => {
    const dari_tanggal = searchParams.get('dari_tanggal');
    const sampai_tanggal = searchParams.get('sampai_tanggal');
    if (dari_tanggal && sampai_tanggal) {
      setDateRange({
        from: new Date(dari_tanggal),
        to: new Date(sampai_tanggal),
      });
    }
  }, [searchParams]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    const params = new URLSearchParams(searchParams);
    if (range?.from) {
      params.set('dari_tanggal', format(range.from, "yyyy-MM-dd"));
    } else {
      params.delete('dari_tanggal');
    }
    if (range?.to) {
      params.set('sampai_tanggal', format(range.to, "yyyy-MM-dd"));
    } else {
      params.delete('sampai_tanggal');
    }
    setSearchParams(params);
  };

  return (
    <Layout className="bg-white text-black dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white flex flex-col h-screen">
      <div className="flex-1 flex flex-col h-full">
        <Layout.Header
          sticky
          className="top-0 z-20 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          <TopNav links={topNav} />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <ThemeSwitch />
            <UserNav />
          </div>
        </Layout.Header>
        <div className="flex-1 overflow-auto">
          <PlantationDashboardMasterpiece
            title="Monev TU (Inspire-KKMV)"
            description="Advanced Analytics & Real-time Monitoring Dashboard"
            initialFilters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>
      <Layout.Footer />
    </Layout>
  );
}
