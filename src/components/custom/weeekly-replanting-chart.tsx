"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactApexChart from "react-apexcharts"
import { ApexOptions } from "apexcharts"
import { Progress } from "@/components/ui/progress"
import cookie from "js-cookie"

export default function WeeklyReport() {
  // State to handle client-side rendering
  const [isClient, setIsClient] = useState(false)

  const theme = cookie.get("theme") || "light"

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Data for Berkontrak chart
  const berkontrakData = {
    target: [5048, 5058, 2424, 1142, 3522, 850, 310, 2295, 500],
    actual: [0, 0, 0, 571, 1598, 0, 0, 0, 0],
    percentage: ["", "", "", "-50%", "-55%", "", "", "", "", "-90%"],
    categories: ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R2 eks N2", "R2 eks N14"],
  }

  // Data for Land Clearing chart
  const landClearingData = {
    target: [5048, 5058, 2424, 1142, 3522, 850, 310, 2295, 500],
    actual: [0, 0, 0, 571, 1238, 0, 0, 0, 0],
    percentage: ["", "", "", "-50%", "-65%", "", "", "", "", "-91%"],
    categories: ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R2 eks N2", "R2 eks N14"],
  }

  // Data for Menanam chart
  const menanamData = {
    target: [5048, 5058, 2424, 1142, 3522, 850, 310, 2295, 500],
    actual: [0, 0, 0, 276, 290, 0, 0, 0, 0],
    percentage: ["", "", "", "-76%", "-92%", "", "", "", "", "-97%"],
    categories: ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R2 eks N2", "R2 eks N14"],
  }

  // Common chart options

  const getChartOptions = (data: any): ApexOptions => ({
    chart: {
      type: "bar",
      height: 300,
      stacked: false,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: any, opts: any) => {
        const seriesIndex = opts.seriesIndex;
        const dataPointIndex = opts.dataPointIndex;
        const percentage = data.percentage[dataPointIndex];
        return `${val} Ha`;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: theme === "dark" ? ["#fff"] : ["#000"],
      },
      background: {
        enabled: false,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.categories,
      labels: {
        style: {
          fontSize: "12px",
          colors: theme === "dark" ? "#fff" : "#000",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: any) => val.toFixed(0),
        style: {
          fontSize: "12px",
          colors: theme === "dark" ? "#fff" : "#000",
        },
      },
    },
    colors: ["#004d40", "#4caf50"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      labels: {
        colors: theme === "dark" ? "#fff" : "#000",
      },
      markers: {
        size: 12,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",        
      },
      fillSeriesColor: false,
      theme: theme === "dark" ? "dark" : "light",
      y: {
        formatter: (val: any) => val.toLocaleString("id-ID"),
      },
    },

  });
// Helper function to determine the color of the progress bar based on percentage
const getBarColor = (value: number) => {
  if (value > 93) return "#34a853"; // Hijau
  if (value > 70) return "#46bdc6"; // Biru
  if (value > 50) return "#46bdc6"; // Kuning
  return "#46bdc6"; // Merah
};
const calculatePercentage = (value: any, total: number) => {
  if (value === "-" || value === 0) return 0
  return Number.parseFloat(((value / total) * 100).toFixed(2))
}

// Function to format the percentage display
const formatPercentage = (percentage: number) => {
  if (percentage === 0) return "0%"
  return `${percentage}%`
}


// Sample data structure matching the image
const dataWeekly = [
  { regional: "Palm Co", r1: "R1", rkap: 5048.49, berkontrak: "-", landClearing: "-", menanam: "-" },
  { regional: "Palm Co", r1: "R2", rkap: 5058.08, berkontrak: "-", landClearing: "-", menanam: "-" },
  { regional: "Palm Co", r1: "R3", rkap: 2424.45, berkontrak: "-", landClearing: "-", menanam: "-" },
  { regional: "Palm Co", r1: "R4", rkap: 1142, berkontrak: 571, landClearing: 571, menanam: 260.64 },
  { regional: "Palm Co", r1: "R5", rkap: 3521.88, berkontrak: 1597.7, landClearing: 1165.18, menanam: 277.37 },
  { regional: "Sub Total Palm Co", r1: "", rkap: 17194.9, berkontrak: 2168.7, landClearing: 1736.18, menanam: 538.01 },
  { regional: "KSO", r1: "R6", rkap: 850.5, berkontrak: "-", landClearing: "-", menanam: "-" },
  { regional: "KSO", r1: "R7", rkap: 309.6, berkontrak: "-", landClearing: "-", menanam: "-" },
  { regional: "KSO", r1: "R2 eks N2", rkap: 2294.59, berkontrak: "-", landClearing: "-", menanam: "-" },
  { regional: "KSO", r1: "R2 Sulawesi", rkap: 500, berkontrak: "-", landClearing: "-", menanam: "-" },
  { regional: "Sub Total KSO", r1: "", rkap: 3954.69, berkontrak: "-", landClearing: "-", menanam: "-" },
  { regional: "TOTAL", r1: "", rkap: 21149.59, berkontrak: 2168.7, landClearing: 1736.18, menanam: 538.01 },
]
const formatNumber = (value: any) => {
  if (!value) return '-';
  
  // Konversi nilai ke number jika belum
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  
  // Cek jika nilai bukan angka
  if (isNaN(numericValue)) return '';
  
  // Pisahkan bagian integer dan desimal
  const [integerPart, decimalPart] = String(numericValue).split('.');
  
  // Format bagian integer dengan separator ribuan
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Gabungkan kembali dengan bagian desimal jika ada
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};
// Group data by regional for proper rowspan handling
const groupedData = {
  "Palm Co": dataWeekly.filter((item) => item.r1.startsWith("R") && item.regional === "Palm Co"),
  KSO: dataWeekly.filter((item) => item.r1.startsWith("R") && item.regional === "KSO"),
  "Sub Total Palm Co": dataWeekly.filter((item) => item.regional === "Sub Total Palm Co"),
  "Sub Total KSO": dataWeekly.filter((item) => item.regional === "Sub Total KSO"),
  TOTAL: dataWeekly.filter((item) => item.regional === "TOTAL"),
}
  return (
    <div className="mx-auto p-4 mt-4">
      <div className="flex align-middle gap-5 justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#00695c] dark:text-[#35a39a]">Weekly Report</h1>
          <h2 className="text-xl text-[#689b2d] dark:text-white font-semibold">Periode : W1 Maret 2025</h2>
          <br />
          <div className="overflow-x-auto">
      <table className="w-full border border-cyan-900 bg-white dark:bg-[#0a192f] dark:text-white">
        <thead className="bg-[#1ea297] text-white">
          <tr>
            <th colSpan={2} className="px-4 py-2 border border-cyan-900">
              Regional
            </th>
            <th className="px-4 py-2 border border-cyan-900">RKAP (Ha)</th>
            <th className="px-4 py-2 border border-cyan-900">Berkontrak (Ha)</th>
            <th className="px-4 py-2 border border-cyan-900">%</th>
            <th className="px-4 py-2 border border-cyan-900">Land Clearing s.d Bi (Ha)</th>
            <th className="px-4 py-2 border border-cyan-900">%</th>
            <th className="px-4 py-2 border border-cyan-900">Menanam S.d Bi (Ha)</th>
            <th className="px-4 py-2 border border-cyan-900">%</th>
          </tr>
        </thead>
        <tbody>
          {/* Palm Co Rows */}
          <tr>
            <td rowSpan={5} className="px-4 py-2 border border-cyan-900">
              Palm Co
            </td>
            <td className="px-4 py-2 border border-cyan-900">R1</td>
            <td className="px-4 py-2 border border-cyan-900">5,048.49</td>
            <td className="px-4 py-2 border border-cyan-900">-</td>
            <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
              0%
              <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
            </td>
            <td className="px-4 py-2 border border-cyan-900">-</td>
            <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
              0%
              <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
            </td>
            <td className="px-4 py-2 border border-cyan-900">-</td>
            <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
              0%
              <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
            </td>
          </tr>
          {groupedData["Palm Co"].slice(1).map((item, index) => (
            <tr key={`palm-co-${index + 1}`}>
              <td className="px-4 py-2 border border-cyan-900">{item.r1}</td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.rkap)}</td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.berkontrak)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                {formatPercentage(calculatePercentage(item.berkontrak, item.rkap))}
                <Progress
                  value={calculatePercentage(item.berkontrak, item.rkap)}
                  className="h-2 mt-1"
                  bgColor={getBarColor(calculatePercentage(item.berkontrak, item.rkap))}
                />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.landClearing)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                {formatPercentage(calculatePercentage(item.landClearing, item.rkap))}
                <Progress
                  value={calculatePercentage(item.landClearing, item.rkap)}
                  className="h-2 mt-1"
                  bgColor={getBarColor(calculatePercentage(item.landClearing, item.rkap))}
                />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.menanam)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                {formatPercentage(calculatePercentage(item.menanam, item.rkap))}
                <Progress
                  value={calculatePercentage(item.menanam, item.rkap)}
                  className="h-2 mt-1"
                  bgColor={getBarColor(calculatePercentage(item.menanam, item.rkap))}
                />
              </td>
            </tr>
          ))}

          {/* Sub Total Palm Co */}
          {groupedData["Sub Total Palm Co"].map((item, index) => (
            <tr key={`sub-total-palm-co-${index}`} className="dark:bg-[#0f2a43]">
              <td colSpan={2} className="px-4 py-2 border border-cyan-900">
                {item.regional}
              </td>
              <td  className="px-4 py-2 border border-cyan-900">{formatNumber(item.rkap)}</td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.berkontrak)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                {formatPercentage(calculatePercentage(item.berkontrak, item.rkap))}
                <Progress
                  value={calculatePercentage(item.berkontrak, item.rkap)}
                  className="h-2 mt-1"
                  bgColor={getBarColor(calculatePercentage(item.berkontrak, item.rkap))}
                />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.landClearing)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                {formatPercentage(calculatePercentage(item.landClearing, item.rkap))}
                <Progress
                  value={calculatePercentage(item.landClearing, item.rkap)}
                  className="h-2 mt-1"
                  bgColor={getBarColor(calculatePercentage(item.landClearing, item.rkap))}
                />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.menanam)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                {formatPercentage(calculatePercentage(item.menanam, item.rkap))}
                <Progress
                  value={calculatePercentage(item.menanam, item.rkap)}
                  className="h-2 mt-1"
                  bgColor={getBarColor(calculatePercentage(item.menanam, item.rkap))}
                />
              </td>
            </tr>
          ))}

          {/* KSO Rows */}
          <tr>
            <td rowSpan={4} className="px-4 py-2 border border-cyan-900">
              KSO
            </td>
            <td className="px-4 py-2 border border-cyan-900">R6</td>
            <td className="px-4 py-2 border border-cyan-900">850.5</td>
            <td className="px-4 py-2 border border-cyan-900">-</td>
            <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
              0%
              <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
            </td>
            <td className="px-4 py-2 border border-cyan-900">-</td>
            <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
              0%
              <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
            </td>
            <td className="px-4 py-2 border border-cyan-900">-</td>
            <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
              0%
              <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
            </td>
          </tr>
          {groupedData["KSO"].slice(1).map((item, index) => (
            <tr key={`kso-${index + 1}`}>
              <td className="px-4 py-2 border border-cyan-900">{item.r1}</td>
              <td className="px-4 py-2 border border-cyan-900">{item.rkap}</td>
              <td className="px-4 py-2 border border-cyan-900">{item.berkontrak}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                0%
                <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.landClearing)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                0%
                <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.menanam)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                0%
                <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
              </td>
            </tr>
          ))}

          {/* Sub Total KSO */}
          {groupedData["Sub Total KSO"].map((item, index) => (
            <tr key={`sub-total-kso-${index}`} className="dark:bg-[#0f2a43]">
              <td colSpan={2} className="px-4 py-2 border border-cyan-900">
                {item.regional}
              </td>
              <td  className="px-4 py-2 border border-cyan-900">{formatNumber(item.rkap)}</td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.berkontrak)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                0%
                <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.landClearing)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                0%
                <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.menanam)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                0%
                <Progress value={0} className="h-2 mt-1" bgColor="bg-red-500" />
              </td>
            </tr>
          ))}

          {/* TOTAL Row */}
          {groupedData["TOTAL"].map((item, index) => (
            <tr key={`total-${index}`} className="font-bold">
              <td colSpan={2} className="px-4 py-2 border border-cyan-900">
                {item.regional}
              </td>
              <td  className="px-4 py-2 border border-cyan-900">{formatNumber(item.rkap)}</td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.berkontrak)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                {formatPercentage(calculatePercentage(item.berkontrak, item.rkap))}
                <Progress
                  value={calculatePercentage(item.berkontrak, item.rkap)}
                  className="h-2 mt-1"
                  bgColor={getBarColor(calculatePercentage(item.berkontrak, item.rkap))}
                />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.landClearing)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                {formatPercentage(calculatePercentage(item.landClearing, item.rkap))}
                <Progress
                  value={calculatePercentage(item.landClearing, item.rkap)}
                  className="h-2 mt-1"
                  bgColor={getBarColor(calculatePercentage(item.landClearing, item.rkap))}
                />
              </td>
              <td className="px-4 py-2 border border-cyan-900">{formatNumber(item.menanam)}</td>
              <td className="px-4 py-2 border border-cyan-900 min-w-[120px]">
                {formatPercentage(calculatePercentage(item.menanam, item.rkap))}
                <Progress
                  value={calculatePercentage(item.menanam, item.rkap)}
                  className="h-2 mt-1"
                  bgColor={getBarColor(calculatePercentage(item.menanam, item.rkap))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>


        <div className="mt-4 md:mt-0 max-w-xl">
          <h3 className="text-xl font-semibold text-[#00695c] dark:text-[#4ee4d7] border-b-2 border-[#00695c] dark:border-[#00695c] mb-4">Key Highlight</h3>
          <ul className="space-y-4">
            <li className="flex gap-2">
              <div className="min-w-4 h-4 border-2 border-[#00695c] dark:border-[#00695c]  mt-1"></div>
              <div>
                <span className="font-semibold text-lg">Secara PTPN IV</span> realisasi pekerjaan berkontrak seluas 2.168,7 Ha
                atau sebesar 10,25%, yaitu di Regional 4 seluas 571 Ha atau 50% dari rencana setahun seluas 1142 Ha dan
                Regional 5 seluas 1.598 Ha atau 55% dari rencana setahun seluas 3.522 Ha. Untuk Regional lain sedang
                dalam proses administrasi pengadaan.
              </div>
            </li>
            <li className="flex gap-2">
              <div className="min-w-4 h-4 border-2 border-[#00695c] dark:border-[#00695c] mt-1"></div>
              <div>
                <span className="font-semibold">Secara PTPN IV</span> realisasi pekerjaan <i>Land clearing</i> seluas
                1.809,07 Ha atau 9% yaitu di Regional 4 seluas 571 Ha atau 50% dari rencana setahun dan di Regional 5
                seluas 1.238 Ha atau 35% dari rencana setahun.
              </div>
            </li>
            <li className="flex gap-2">
              <div className="min-w-4 h-4 border-2 border-[#00695c] dark:border-[#00695c]  mt-1"></div>
              <div>
                <span className="font-semibold">Secara PTPN IV</span> realisasi pekerjaan menanam seluas 565,63 Ha atau
                3% yaitu di regional 4 seluas 276 Ha atau 23% dari rencana setahun dan Regional 5 seluas 290 Ha atau 8%
                dari rencana setahun.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Berkontrak Chart */}
      <Card className="mb-6 border-dashed border-[#00695c] dark:border-[#00695c] dark:bg-[#0a192f]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-[#00695c] dark:text-[#4ee4d7]">Berkontrak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isClient && (
              <ReactApexChart
                options={getChartOptions(berkontrakData)}
                series={[
                  {
                    name: "Renc Setahun",
                    data: berkontrakData.target,
                  },
                  {
                    name: "Real s.d Wi",
                    data: berkontrakData.actual,
                  },
                ]}
                type="bar"
                height={300}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Land Clearing Chart */}
      <Card className="mb-6 border-dashed border-[#00695c] dark:border-[#00695c dark:bg-[#0a192f]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-[#00695c] dark:text-[#4ee4d7]">Land Clearing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isClient && (
              <ReactApexChart
                options={getChartOptions(landClearingData)}
                series={[
                  {
                    name: "Renc Setahun",
                    data: landClearingData.target,
                  },
                  {
                    name: "Real s.d Wi",
                    data: landClearingData.actual,
                  },
                ]}
                type="bar"
                height={300}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Menanam Chart */}
      <Card className="mb-6 border-dashed border-[#00695c] dark:border-[#00695c] dark:bg-[#0a192f]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-[#00695c] dark:text-[#4ee4d7]">Menanam</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isClient && (
              <ReactApexChart
                options={getChartOptions(menanamData)}
                series={[
                  {
                    name: "Renc Setahun",
                    data: menanamData.target,
                  },
                  {
                    name: "Real s.d Wi",
                    data: menanamData.actual,
                  },
                ]}
                type="bar"
                height={300}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

