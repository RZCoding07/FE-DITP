import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import cookie from "js-cookie";

interface SumberBenih {
  sumberBenih: string;
  sum: number;
}

interface DataProps {
  sumberBenihAll: SumberBenih[];
}

// Formatter untuk angka ribuan dengan koma
const formatter = new Intl.NumberFormat("id-ID", {
  style: "decimal",
  maximumFractionDigits: 2,
});

// Fungsi untuk mengagregasi data
const aggregateData = (sumberBenihAll: SumberBenih[]) => {
  const aggregated: { [key: string]: SumberBenih } = {};

  sumberBenihAll.forEach(item => {
    if (aggregated[item.sumberBenih]) {
      aggregated[item.sumberBenih].sum += item.sum;
    } else {
      aggregated[item.sumberBenih] = { sumberBenih: item.sumberBenih, sum: item.sum };
    }
  });

  return Object.values(aggregated);
};

const BarChartSB = ({ dataprops }: { dataprops: DataProps }) => {
  const [theme, setTheme] = useState<"light" | "dark">(cookie.get("theme") === "dark" ? "dark" : "light");

  // Aggregate the data from sumberBenihAll
  const aggregatedData = aggregateData(dataprops.sumberBenihAll);

  // Map the aggregated data to series and labels
  const series = aggregatedData.map(item => item.sum);
  const labels = aggregatedData.map(item => item.sumberBenih);

  // Konfigurasi chart berdasarkan tema
  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: true,
      },
    },
    colors: ['#3B82F6'],
    labels: labels,
    theme: {
      mode: theme,
    },
    xaxis: {
      labels: {
        style: {
          colors: theme === "dark" ? "#FFFFFF" : "#000000",
        },
        formatter: (val: string) => formatter.format(parseFloat(val)),
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === "dark" ? "#FFFFFF" : "#000000",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: [theme === "dark" ? "#FFFFFF" : "#000000"],
      },
      formatter: (val: number) => formatter.format(val),
      offsetX: 10, // Sesuaikan offset untuk horizontal
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatter.format(val),
      },
      theme: theme,
    },
    plotOptions: {
      bar: {
        horizontal: true, // Ubah ke horizontal
        columnWidth: "55%",
        distributed: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    grid: {
      borderColor: theme === "dark" ? "#555555" : "#CCCCCC",
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
        width="100%"
      />
    </div>
  );
};

export default BarChartSB;