import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const Summary =(dataProps:any) => {
  const data = [
    {
      show: true,
      name: "Hijau",
      progress: dataProps.data.hijau,
      circular: "green",
      image: "/2.png",
      color: "#00a300",
      textColor: "#ffffff",
    },
    {
      show: true,
      name: "Kuning",
      progress:  dataProps.data.kuning.toLocaleString('id-ID'),
      circular: "yellow",
      image: "/2.png",
      color: "#FFFF00",
      textColor: "#000000",
    },
    {
      show: true,
      name: "Orange",
      progress: dataProps.data.oren.toLocaleString('id-ID'),
      circular: "orange",
      image: "/2.png",
      color: "#FFA500",
      textColor: "#ffffff",
    },

    {
      show: true,
      name: "Hitam",
      progress: dataProps.data.hitam.toLocaleString('id-ID'),
      circular: "black",
      image: "/2.png",
      color: "#000000",
      textColor: "#ffffff",
    }
  ];

  const dataTbm = [
    {
      show: true,
      name: "TBM 1",
      progress: dataProps.data.hijau,
      circular: "green",
      image: "/2.png",
      color: "#00a300",
      textColor: "#ffffff",
    },
    {
      show: true,
      name: "TBM 2",
      progress:  dataProps.data.kuning.toLocaleString('id-ID'),
      circular: "yellow",
      image: "/2.png",
      color: "#FFFF00",
      textColor: "#000000",
    },
    {
      show: true,
      name: "TBM 3",
      progress: dataProps.data.oren.toLocaleString('id-ID'),
      circular: "orange",
      image: "/2.png",
      color: "#FFA500",
      textColor: "#ffffff",
    },

    {
      show: true,
      name: "TBM > 3",
      progress: dataProps.data.hitam.toLocaleString('id-ID'),
      circular: "black",
      image: "/2.png",
      color: "#000000",
      textColor: "#ffffff",
    }
  ];

  return (
<div className="grid gap-4 lg:grid-cols-4 2xl:grid-cols-4">
  {dataTbm.map((item, i) => (
    item.show ? (
      <Card
        key={i}
        className="shadow-lg bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-transparent py-2"
      >
        <CardContent className="flex items-center px-2 py-2">
          <div className="relative h-10 w-10 mr-2 float-end">
          <img width="64" height="64" src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-oil-oil-gas-flaticons-flat-flat-icons.png" alt="external-oil-oil-gas-flaticons-flat-flat-icons"/>
          </div>
          <div>
            <p
              className="text-sm capitalize font-semibold"
            >
             {item.name}
            </p>
            <p
              className="font-semibold"
            >
              {item.progress}
            </p>
          </div>
        </CardContent>
      </Card>
    ) : null
  ))}
  {data.map((item, i) => (
    item.show ? (
      <Card
        key={i}
        className="shadow-lg py-1"
        style={{
          background: `linear-gradient(135deg, ${item.color} 55%, ${item.color}29 45%)`,
          borderColor: item.color
        }}
      >
        <CardContent className="flex items-center px-2 py-2">
          <div className="relative h-10 w-10 mr-2">
            <img src={item.image} alt={item.name} />
          </div>
          <div>
            <p
              className="text-sm capitalize font-semibold"
              style={{ color: `${item.textColor}` }}
            >
              {item.name}
            </p>
            <p
              className="font-semibold"
              style={{ color: `${item.textColor}` }}
            >
              {item.progress}
            </p>
          </div>
        </CardContent>
      </Card>
    ) : null
  ))}
</div>

  );
};