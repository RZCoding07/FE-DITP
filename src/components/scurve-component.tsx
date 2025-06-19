// PlantationDashboard.tsx
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TreePine, BarChart3, MapPin, Activity, Target, Users } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
// Type definitions
type MonitoringData = {
  kode_unit: string;
  nama: string;
  subregional: string;
  luas_areal_ha: number;
  jumlah_blok_tu: number;
  jumlah_blok_sudah_monev: number;
  jumlah_monev: number;
  persentase_monev: number;
  persentase_kesesuaian: number;
  rata_rata_nilai: number;
  rata_rata_bobot: number;
};

type PlantationData = {
  kode_unit: string;
  nama_unit: string;
  is_blok_tu: string;
  luas_blok_tu: number;
  jumlah_blok_tu: number;
  kode_regional: string;
};

type JobPositionData = {
  jabatan: string;
  jumlah_monev: number;
  rata_rata_nilai: number;
  rata_rata_bobot: number;
};

type DetailDialogData = {
  title: string;
  description: string;
  data: any;
  type: "kebun" | "job" | "area" | "pie";
};

type PlantationDashboardProps = {
  monitoringData: MonitoringData[];
  plantationData: PlantationData[];
  jobPositionData: JobPositionData[];
  title?: string;
  description?: string;
};

export default function PlantationDashboard({
  monitoringData,
  plantationData,
  jobPositionData,
  title = "Dashboard Monitoring Kebun",
  description = "Sistem Monitoring dan Evaluasi Perkebunan",
}: PlantationDashboardProps) {
  const [selectedRegional, setSelectedRegional] = useState<string>("all");
  const [selectedKebun, setSelectedKebun] = useState<string>("all");
  const [selectedAfdeling, setSelectedAfdeling] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<DetailDialogData | null>(null);

  // Get unique values for filters
  const regionals = useMemo(() => {
    const regions = [
      ...new Set([...monitoringData.map((d) => d.subregional), ...plantationData.map((d) => d.kode_regional)]),
    ];
    return regions.filter(Boolean);
  }, [monitoringData, plantationData]);

  const kebuns = useMemo(() => {
    const allKebuns = [
      ...monitoringData.map((d) => ({ kode: d.kode_unit, nama: d.nama })),
      ...plantationData.map((d) => ({ kode: d.kode_unit, nama: d.nama_unit })),
    ];
    return allKebuns.filter((k) => k.nama);
  }, [monitoringData, plantationData]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalArea =
      monitoringData.reduce((sum, item) => sum + (item.luas_areal_ha || 0), 0) +
      plantationData.reduce((sum, item) => sum + (item.luas_blok_tu || 0), 0);

    const totalBlocks =
      monitoringData.reduce((sum, item) => sum + (item.jumlah_blok_tu || 0), 0)

    const monitoredBlocks = monitoringData.reduce((sum, item) => sum + (item.jumlah_blok_sudah_monev || 0), 0);

    const avgMonitoringPercentage =
      monitoringData.filter((d) => d.persentase_monev > 0).reduce((sum, item) => sum + item.persentase_monev, 0) /
        monitoringData.filter((d) => d.persentase_monev > 0).length || 0;

    const totalJobMonev = jobPositionData.reduce((sum, item) => sum + item.jumlah_monev, 0);
    const activePositions = jobPositionData.filter((item) => item.jumlah_monev > 0).length;

    return {
      totalArea: totalArea.toFixed(2),
      totalBlocks,
      monitoredBlocks,
      avgMonitoringPercentage: avgMonitoringPercentage.toFixed(2),
      totalJobMonev,
      activePositions,
    };
  }, [monitoringData, plantationData, jobPositionData]);

  // Chart data
  const chartData = monitoringData
    .filter((d) => d.persentase_monev > 0)
    .map((item) => ({
      name: item.nama.replace("KEBUN ", ""),
      monitoring: item.persentase_monev,
      score: item.rata_rata_nilai,
      area: item.luas_areal_ha,
      original: item,
    }));

  const pieData = [
    { name: "Sudah Monev", value: summaryStats.monitoredBlocks, color: "#0ea5e9" },
    { name: "Belum Monev", value: summaryStats.totalBlocks - summaryStats.monitoredBlocks, color: "#64748b" },
  ];

  const areaData = plantationData.slice(0, 5).map((item) => ({
    name: item.nama_unit.replace("KEBUN ", ""),
    area: item.luas_blok_tu,
    blocks: item.jumlah_blok_tu,
    original: item,
  }));

  const jobChartData = jobPositionData
    .filter((d) => d.jumlah_monev > 0)
    .map((item) => ({
      jabatan: item.jabatan.replace("ASISTEN ", "AST. "),
      monev: item.jumlah_monev,
      nilai: item.rata_rata_nilai,
      bobot: item.rata_rata_bobot,
      original: item,
    }));

  // Handle chart click events
  const handleChartClick = (type: "kebun" | "job" | "area" | "pie", dataPoint: any, dataIndex: number) => {
    let dialogTitle = "";
    let dialogDescription = "";
    let dialogData = null;

    switch (type) {
      case "kebun":
        const kebunData = chartData[dataIndex];
        dialogTitle = `Detail ${kebunData.name}`;
        dialogDescription = "Informasi monitoring kebun";
        dialogData = kebunData.original;
        break;
      case "job":
        const jobData = jobChartData[dataIndex];
        dialogTitle = `Detail ${jobData.original.jabatan}`;
        dialogDescription = "Informasi monitoring berdasarkan jabatan";
        dialogData = jobData.original;
        break;
      case "area":
        const areaDataPoint = areaData[dataIndex];
        dialogTitle = `Detail ${areaDataPoint.name}`;
        dialogDescription = "Informasi luas area dan blok";
        dialogData = areaDataPoint.original;
        break;
      case "pie":
        dialogTitle = `Detail ${dataPoint.name}`;
        dialogDescription = "Informasi status monitoring blok";
        dialogData = { name: dataPoint.name, value: dataPoint.value };
        break;
    }

    setDialogData({
      title: dialogTitle,
      description: dialogDescription,
      data: dialogData,
      type,
    });
    setDialogOpen(true);
  };

  // ApexCharts options
  const barChartOptions : ApexOptions = {
    chart: {
      type: "bar" as const,
      height: 350,
      background: "transparent",
      foreColor: "#94a3b8",
      toolbar: {
        show: false,
      },
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const dataIndex = config.dataPointIndex;
          handleChartClick("kebun", config.w.config.series[config.seriesIndex].data[dataIndex], dataIndex);
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#0ea5e9", "#06b6d4"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.map((item) => item.name),
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Nilai",
        style: {
          color: "#94a3b8",
        },
      },
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => val.toFixed(2),
      },
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: "#94a3b8",
      },
    },
  };

  const pieChartOptions : ApexOptions = {
    chart: {
      type: "pie" as const,
      background: "transparent",
      foreColor: "#94a3b8",
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const dataIndex = config.dataPointIndex;
          handleChartClick("pie", pieData[dataIndex], dataIndex);
        },
      },
    },
    labels: pieData.map((item) => item.name),
    colors: pieData.map((item) => item.color),
    legend: {
      position: "bottom",
      labels: {
        colors: "#94a3b8",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1) + "%",
      style: {
        fontSize: "14px",
        fontFamily: "system-ui, sans-serif",
        fontWeight: "bold",
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => val + " blok",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const jobBarChartOptions : ApexOptions = {
    chart: {
      type: "bar" as const,
      height: 350,
      background: "transparent",
      foreColor: "#94a3b8",
      toolbar: {
        show: false,
      },
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const dataIndex = config.dataPointIndex;
          handleChartClick("job", config.w.config.series[config.seriesIndex].data[dataIndex], dataIndex);
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    colors: ["#0ea5e9", "#06b6d4", "#8b5cf6"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: jobChartData.map((item) => item.jabatan),
      labels: {
        style: {
          colors: "#94a3b8",
        },
        rotate: -45,
        rotateAlways: true,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Nilai",
        style: {
          color: "#94a3b8",
        },
      },
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => val.toFixed(2),
      },
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: "#94a3b8",
      },
    },
  };

  const areaChartOptions : ApexOptions = {
    chart: {
      type: "line" as const,
      height: 350,
      background: "transparent",
      foreColor: "#94a3b8",
      toolbar: {
        show: false,
      },
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const dataIndex = config.dataPointIndex;
          handleChartClick("area", config.w.config.series[config.seriesIndex].data[dataIndex], dataIndex);
        },
      },
    },
    colors: ["#0ea5e9", "#06b6d4"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    xaxis: {
      categories: areaData.map((item) => item.name),
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "Luas Area (Ha)",
          style: {
            color: "#0ea5e9",
          },
        },
        labels: {
          style: {
            colors: "#94a3b8",
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "Jumlah Blok",
          style: {
            color: "#06b6d4",
          },
        },
        labels: {
          style: {
            colors: "#94a3b8",
          },
        },
      },
    ],
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => val.toFixed(2),
      },
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: "#94a3b8",
      },
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
  };

  // Render detail dialog content based on type
  const renderDialogContent = () => {
    if (!dialogData) return null;

    switch (dialogData.type) {
      case "kebun":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Kode Unit</TableCell>
                <TableCell>{dialogData.data.kode_unit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>{dialogData.data.nama}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Subregional</TableCell>
                <TableCell>{dialogData.data.subregional}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Luas Areal (Ha)</TableCell>
                <TableCell>{dialogData.data.luas_areal_ha}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jumlah Blok TU</TableCell>
                <TableCell>{dialogData.data.jumlah_blok_tu}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jumlah Blok Sudah Monev</TableCell>
                <TableCell>{dialogData.data.jumlah_blok_sudah_monev}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jumlah Monev</TableCell>
                <TableCell>{dialogData.data.jumlah_monev}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Persentase Monev</TableCell>
                <TableCell>{dialogData.data.persentase_monev}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rata-rata Nilai</TableCell>
                <TableCell>{dialogData.data.rata_rata_nilai}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rata-rata Bobot</TableCell>
                <TableCell>{dialogData.data.rata_rata_bobot}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      case "job":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jabatan</TableCell>
                <TableCell>{dialogData.data.jabatan}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jumlah Monev</TableCell>
                <TableCell>{dialogData.data.jumlah_monev}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rata-rata Nilai</TableCell>
                <TableCell>{dialogData.data.rata_rata_nilai}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rata-rata Bobot</TableCell>
                <TableCell>{dialogData.data.rata_rata_bobot}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      case "area":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Kode Unit</TableCell>
                <TableCell>{dialogData.data.kode_unit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nama Unit</TableCell>
                <TableCell>{dialogData.data.nama_unit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Kode Regional</TableCell>
                <TableCell>{dialogData.data.kode_regional}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Luas Blok TU (Ha)</TableCell>
                <TableCell>{dialogData.data.luas_blok_tu}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jumlah Blok TU</TableCell>
                <TableCell>{dialogData.data.jumlah_blok_tu}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      case "pie":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>{dialogData.data.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jumlah Blok</TableCell>
                <TableCell>{dialogData.data.value}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Persentase</TableCell>
                <TableCell>{((dialogData.data.value / summaryStats.totalBlocks) * 100).toFixed(2)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen overflow-y-scroll bg-sky-950/40 text-white p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TreePine className="h-8 w-8 text-sky-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              <p className="text-slate-400">{description}</p>
            </div>
          </div>
          <Badge variant="outline" className="border-sky-400 text-sky-400">
            Live Data
          </Badge>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Luas Area</CardTitle>
              <MapPin className="h-4 w-4 text-sky-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summaryStats.totalArea}</div>
              <p className="text-xs text-slate-400">Hektar</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Blok</CardTitle>
              <BarChart3 className="h-4 w-4 text-sky-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summaryStats.totalBlocks}</div>
              <p className="text-xs text-slate-400">Blok TU</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Blok Termonev</CardTitle>
              <Activity className="h-4 w-4 text-sky-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summaryStats.monitoredBlocks}</div>
              <p className="text-xs text-slate-400">Dari {summaryStats.totalBlocks} blok</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Rata-rata Monitoring</CardTitle>
              <Target className="h-4 w-4 text-sky-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summaryStats.avgMonitoringPercentage}%</div>
              <p className="text-xs text-slate-400">Persentase monitoring</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Posisi Aktif</CardTitle>
              <Users className="h-4 w-4 text-sky-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summaryStats.activePositions}</div>
              <p className="text-xs text-slate-400">{summaryStats.totalJobMonev} total monev</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monitoring Progress Chart */}
          <Card className="bg-slate-950 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Progress Monitoring per Kebun</CardTitle>
              <CardDescription className="text-slate-400">
                Persentase monitoring dan nilai rata-rata (klik untuk detail)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {typeof window !== "undefined" && (
                <ReactApexChart
                  options={barChartOptions}
                  series={[
                    {
                      name: "Monitoring %",
                      data: chartData.map((item) => item.monitoring),
                    },
                    {
                      name: "Nilai Rata-rata",
                      data: chartData.map((item) => item.score),
                    },
                  ]}
                  type="bar"
                  height={350}
                />
              )}
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-slate-950 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Status Monitoring Blok</CardTitle>
              <CardDescription className="text-slate-400">
                Distribusi blok yang sudah dan belum dimonev (klik untuk detail)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {typeof window !== "undefined" && (
                <ReactApexChart
                  options={pieChartOptions}
                  series={pieData.map((item) => item.value)}
                  type="pie"
                  height={350}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Job Position Performance Chart */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Performance Monitoring per Jabatan</CardTitle>
            <CardDescription className="text-slate-400">
              Jumlah monitoring dan rata-rata nilai per posisi jabatan (klik untuk detail)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {typeof window !== "undefined" && (
              <ReactApexChart
                options={jobBarChartOptions}
                series={[
                  {
                    name: "Jumlah Monev",
                    data: jobChartData.map((item) => item.monev),
                  },
                  {
                    name: "Rata-rata Nilai",
                    data: jobChartData.map((item) => item.nilai),
                  },
                  {
                    name: "Rata-rata Bobot",
                    data: jobChartData.map((item) => item.bobot),
                  },
                ]}
                type="bar"
                height={400}
              />
            )}
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Luas Area per Kebun</CardTitle>
            <CardDescription className="text-slate-400">
              Top 5 kebun berdasarkan luas area dan jumlah blok (klik untuk detail)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {typeof window !== "undefined" && (
              <ReactApexChart
                options={areaChartOptions}
                series={[
                  {
                    name: "Luas Area (Ha)",
                    data: areaData.map((item) => item.area),
                  },
                  {
                    name: "Jumlah Blok",
                    data: areaData.map((item) => item.blocks),
                  },
                ]}
                type="line"
                height={400}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{dialogData?.title}</DialogTitle>
            <DialogDescription className="text-slate-400">{dialogData?.description}</DialogDescription>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}