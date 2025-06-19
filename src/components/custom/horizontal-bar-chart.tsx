import React, { useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import cookie from "js-cookie";

interface StockAnalysisChartProps {
  dataprops: any;
  onEventClick: (data: any) => void;
}

export const StockAnalysisChart: React.FC<StockAnalysisChartProps> = React.memo(({ dataprops, onEventClick }) => {
  let filteredTbm = dataprops.ctg;
  let score = dataprops.scoreAll;
  let kebunOptions = dataprops.kebunOptions;
  let color = dataprops.color || "default"; // Default color if not provided

  // Initialize variables
  let categories: string[] = [];
  let seriesData: number[] = [];
  let missingInOptions: string[] = [];

  const getGradientColors = () => {
    switch (color) {
      case "gold":
        return ["#FFD700", "#FFA500"]; // Gold to Orange gradient
      case "green":
        return ["#ABE5A1", "#2E8B57"]; // Light Green to Sea Green
      case "red":
        return ["#FF7F7F", "#FF0000"]; // Light Red to Red
      case "black":
        return ["#808080", "#000000"]; // Gray to Black
      default: // "default" case
        return ["#00b0ff", "#ABE5A1"]; // Original blue gradient
    }
  };

  const gradientColors = getGradientColors();

  if (dataprops.untuk === "luasan") {
    if (filteredTbm !== 'tbm-all') {
      score = score.filter((item: any) => item.vw_fase_tbm === dataprops.ctg);
    }

    if (dataprops.rpc.value === 'all') {
      categories = ["RPC1", "RPC2", "RPC3", "RPC4", "RPC5", "RPC6", "RPC7", "RPC2N2", "RPC2N14"];
      const regionalMap = new Map<string, number>();
      categories.forEach(reg => regionalMap.set(reg, 0));

      // Sum luas by regional
      score.forEach((item: any) => {
        if (regionalMap.has(item.regional)) {
          regionalMap.set(item.regional, (regionalMap.get(item.regional) || 0) + item.luas);
        }
      });

      // Convert to series data in the correct order with 2 decimal places
      seriesData = categories.map(reg => parseFloat((regionalMap.get(reg) || 0).toFixed(2)));

    } else if (dataprops.rpc.value !== 'all' && dataprops.kebun == null) {
      const filteredKebun = score.filter((item: any) => item.regional === dataprops.rpc.value);
    
      // Use Set to ensure uniqueness of kebun names
      categories = Array.from(new Set(kebunOptions));
    
      const kebunMap = new Map<string, number>();
      kebunOptions.forEach((kebun: string) => kebunMap.set(kebun, 0));
    
      filteredKebun.forEach((item: any) => {
        if (item.kebun) {
          kebunMap.set(item.kebun, (kebunMap.get(item.kebun) || 0) + item.luas);
        }
      });
    
      seriesData = categories.map((option: string) => parseFloat((kebunMap.get(option) || 0).toFixed(2))) as number[];
    
      // Check for missing kebun names in options
      const missingInOptions = filteredKebun
        .map((item: any) => item.kebun)
        .filter((name: any) => !categories.includes(name));
    
      if (missingInOptions.length > 0) {
        console.warn("Missing kebun options:", missingInOptions);
      }
    }
     else if (dataprops.kebun !== null && dataprops.afd == null) {

      const filteredAfd = score.filter(
        (item: any) =>
          item.regional === dataprops.rpc.value &&
          item.kebun === dataprops.kebun.value
      );



      console.log("filteredAfd", filteredAfd);

      // Get unique afdeling names and sort them
      const afdNames: string[] = Array.from(new Set(filteredAfd.map((item: any) => item.afdeling as string))) as string[];
      categories = afdNames as string[];

      // Sum luas by afdeling
      const afdMap = new Map<string, number>();
      afdNames.forEach(afd => afdMap.set(afd as string, 0));

      filteredAfd.forEach((item: any) => {
        afdMap.set(item.afdeling, (afdMap.get(item.afdeling) || 0) + item.luas);
      });

      // Convert to series data with 2 decimal places
      seriesData = afdNames.map((afd: string) => parseFloat((afdMap.get(afd) || 0).toFixed(2))) as number[];

    } else if (dataprops.afd !== null) {
      // Group by blok within selected afdeling
      const filteredBlok = score.filter(
        (item: any) =>
          item.afdeling === dataprops.afd.value &&
          item.kebun === dataprops.kebun.value &&
          item.regional === dataprops.rpc.value
      );

      // Get unique blok names and sort them
      const blokNames: string[] = [...new Set<string>(filteredBlok.map((item: any) => item.blok as string))].sort();
      categories = blokNames as string[];

      // Sum luas by blok
      const blokMap = new Map<string, number>();
      blokNames.forEach(blok => blokMap.set(blok as string, 0));

      filteredBlok.forEach((item: any) => {
        blokMap.set(item.blok, (blokMap.get(item.blok) || 0) + item.luas);
      });

      // Convert to series data with 2 decimal places
      seriesData = blokNames.map((blok: string) => parseFloat((blokMap.get(blok) || 0).toFixed(2))) as number[];
    }
  } else if (dataprops.untuk === 'blok') {
    // Filter data based on TBM category
    if (filteredTbm !== 'tbm-all') {
      score = score.filter((item: any) => item.vw_fase_tbm === dataprops.ctg);
    }

    // Process data based on selection level
    if (dataprops.rpc.value === 'all') {
      // Count by regional
      categories = ["RPC1", "RPC2", "RPC3", "RPC4", "RPC5", "RPC6", "RPC7", "RPC2N2", "RPC2N14"];

      // Create a map for counting blocks per regional
      const regionalCountMap = new Map<string, Set<string>>();
      categories.forEach(reg => regionalCountMap.set(reg, new Set()));

      // Count unique blocks per regional
      score.forEach((item: any) => {
        if (regionalCountMap.has(item.regional) && item.blok) {
          const blockSet = regionalCountMap.get(item.regional)!;
          blockSet.add(`${item.kebun}-${item.afdeling}-${item.blok}`);
        }
      });

      // Convert to count data
      seriesData = categories.map(reg => regionalCountMap.get(reg)?.size || 0);

    } else if (dataprops.rpc.value !== 'all' && dataprops.kebun == null) {
      // Count by kebun within selected regional
      const filteredKebun = score.filter((item: any) => item.regional === dataprops.rpc.value);

      // Create a map for counting blocks per kebun based on kebunOptions order
      const kebunCountMap = new Map<string, Set<string>>();

      // Initialize with kebunOptions to maintain correct order
      kebunOptions.forEach((kebun: any) => kebunCountMap.set(kebun, new Set()));

      // Count unique blocks per kebun
      filteredKebun.forEach((item: any) => {
        if (item.blok && item.kebun) {
          const blockSet = kebunCountMap.get(item.kebun);
          if (blockSet) {
            // Use consistent format for block identification
            blockSet.add(`${item.afdeling}-${item.blok}`);
          }
        }
      });

      // Find items in data that are not in kebunOptions
      // Check for missing kebun names in options
      const missingInOptions = filteredKebun
        .map((item: any) => item.kebun)
        .filter((name: any) => !kebunOptions.includes(name));

      if (missingInOptions.length > 0) {
        console.warn("Missing kebun options:", missingInOptions);
      }
      // Convert to count data in kebunOptions order
      categories = kebunOptions;
      seriesData = kebunOptions.map((kebun: any) => kebunCountMap.get(kebun)?.size || 0);
    }
    else if (dataprops.kebun !== null && dataprops.afd == null) {
      // Count by afdeling within selected kebun
      const filteredAfd = score.filter(
        (item: any) =>
          item.kebun === dataprops.kebun.value &&
          item.regional === dataprops.rpc.value
      );
      const afdNames: string[] = [...new Set(filteredAfd.map((item: any) => item.afdeling))].sort() as string[];
      categories = afdNames;

      const afdCountMap = new Map<string, Set<string>>();
      afdNames.forEach(afd => afdCountMap.set(afd, new Set()));

      filteredAfd.forEach((item: any) => {
        if (item.blok) {
          const blockSet = afdCountMap.get(item.afdeling)!;
          blockSet.add(item.blok);
        }
      });

      seriesData = afdNames.map(afd => afdCountMap.get(afd)?.size || 0);

    } else if (dataprops.afd !== null) {
      const filteredBlok = score.filter(
        (item: any) =>
          item.afdeling === dataprops.afd.value &&
          item.kebun === dataprops.kebun.value &&
          item.regional === dataprops.rpc.value
      );

      // Get unique blok names and sort them
      const blokNames: string[] = [...new Set(filteredBlok.map((item: any) => item.blok))].sort() as string[];
      categories = blokNames;

      // For block level, we just count the occurrences (1 per block)
      const blokCountMap = new Map<string, number>();
      blokNames.forEach(blok => blokCountMap.set(blok, 0));

      filteredBlok.forEach((item: any) => {
        if (item.blok) {
          blokCountMap.set(item.blok, (blokCountMap.get(item.blok) || 0) + 1);
        }
      });

      // Convert to count data
      seriesData = blokNames.map(blok => blokCountMap.get(blok) || 0);
    }
  }

  const theme = cookie.get("theme") || "light";

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        height: 426,
        type: "bar",
        mode: theme,
        stacked: false
      },
      dataLabels: {
        enabled: true,
        offsetX: 5,
        formatter: function (val: number) {
          return dataprops.untuk === "luasan" ? parseFloat(val.toString()).toFixed(2) : val.toString();
        },
      },
      stroke: {
        width: [1],
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
          
        },
      

      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: theme === "dark" ? "#ffffff" : "#000000",
            fontSize: "12px",
            fontFamily: "Arial, sans-serif",
          },
        },
        title: {
          text: dataprops.untuk === "luasan" ? 'Luasan' : dataprops.untuk || "Count",
          style: {
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      yaxis: {
        axisTicks: { show: true },
        axisBorder: {
          show: true,
          color: theme === "dark" ? "#ffffff" : "#000000",
        },
        
        labels: {
          style: {
            colors: theme === "dark" ? "#ffffff" : "#000000",
          },
          
        },
        title: {
          text: dataprops.rpc.value === 'all' ? 'Regional' :
            (dataprops.kebun == null ? 'Kebun' :
              (dataprops.afd == null ? 'Afdeling' : 'Blok')),
          style: {
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
          offsetX: 5,
        },
      },
      tooltip: {
        enabled: true,
        theme: theme,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: [gradientColors[1]], // Second color for gradient
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 80],
        },
      },
      legend: {
        horizontalAlign: "center",
        offsetX: 40,
      },
    }),
    [categories, theme, dataprops.rpc.value, dataprops.kebun, dataprops.afd, dataprops.untuk, , color],
  );

  const series = useMemo(
    () => [
      {
        name: "Total:",
        type: "bar",
        data: seriesData,
        color: gradientColors[0],
      },
    ],
    [seriesData, gradientColors],
  );

  return (
    <div id="chart">
      <style>{`
        .apexcharts-menu {
          background-color: ${theme === "dark" ? "#333" : "#fff"} !important;
          color: ${theme === "dark" ? "#fff" : "#000"} !important;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .apexcharts-menu-item {
          padding: 10px 15px;
          font-size: 14px;
          cursor: pointer;
          color: ${theme === "dark" ? "#fff" : "#000"} !important;
        }
        .apexcharts-menu-item:hover {
          background-color: ${theme === "dark" ? "#555" : "#f0f0f0"} !important;
          color: ${theme === "dark" ? "#ffcc00" : "#007BFF"} !important;
        }

      `}</style>

      <h2 className="text-xl font-semibold text-center capitalize">
        {dataprops.untuk === "luasan" ? `Total ${dataprops.untuk} ${dataprops.title}` : `Total Blok ${dataprops.title}`}
      </h2>

      <small className="text-center dark:text-gray-300 text-gray-600 float-right -mt-5">
        {missingInOptions.length > 0 ? (
          <span className="text-red-500">Warning: Items ada di vegetatif tetapi tidak ada di areal statement SAP: {missingInOptions.join(", ")}</span>
        ) : ''}
        <br />
      </small>

      <ReactApexChart options={options} series={series} type="bar" height={426} />
    </div>
  );
});

export default StockAnalysisChart;