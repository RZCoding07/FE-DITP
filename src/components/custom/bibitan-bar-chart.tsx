import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import cookie from "js-cookie";

interface DataProps {
  r1: number;
  r2: number;
  r3: number;
  r4: number;
  r5: number;
  r6: number;
  r7: number;
  r2n2: number;
  r2n14: number;
}

// Formatter untuk angka ribuan dengan koma
const formatter = new Intl.NumberFormat("id-ID", {
  style: "decimal",
  maximumFractionDigits: 2,
});

const BarChart = ({ dataprops }: { dataprops: DataProps }) => {
  const [theme, setTheme] = useState<"light" | "dark">(cookie.get("theme") === "dark" ? "dark" : "light");

  // Define fixed regional labels
  const labels = [
    "Reg 1",
    "Reg 2",
    "Reg 3",
    "Reg 4",
    "Reg 5",
    "Reg 6",
    "Reg 7",
    "Reg 2 N2",
    "Reg 2 N14",
  ];

  // Map the data properties to series
  const series = [
    dataprops.r1,
    dataprops.r2,
    dataprops.r3,
    dataprops.r4,
    dataprops.r5,
    dataprops.r6,
    dataprops.r7,
    dataprops.r2n2,
    dataprops.r2n14,
  ];

  // Konfigurasi chart berdasarkan tema
  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent", // Background transparan
      toolbar: {
        show: true,
      },
    },
    colors: ['#22C55E'],
    theme: {
      mode: theme, // Gunakan tema dari state
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: theme === "dark" ? "#FFFFFF" : "#000000", // Warna label berdasarkan tema
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === "dark" ? "#FFFFFF" : "#000000", // Warna label berdasarkan tema
        },
        formatter: (val: number) => formatter.format(val), // Format angka dengan koma
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: [theme === "dark" ? "#FFFFFF" : "#000000"], // Warna teks dataLabels berdasarkan tema
      },
      formatter: (val: number) => formatter.format(val), // Format angka dengan koma
      offsetY: -20, // Posisi dataLabels di atas batang
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatter.format(val), // Format angka dengan koma
      },
      theme: theme, // Sesuaikan tema tooltip
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        distributed: false,
        dataLabels: {
          position: "top", // Posisi dataLabels di atas batang
        },
      },
    },
    grid: {
      borderColor: theme === "dark" ? "#555555" : "#CCCCCC", // Warna grid berdasarkan tema
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div style={{ width: "100%" }}>
      <ReactApexChart
        options={options}
        series={[{ name: "Total", data: series }]}
        type="bar"
        height={350}
        width="100%" // Full width
      />
    </div>
  );
};

export default BarChart;