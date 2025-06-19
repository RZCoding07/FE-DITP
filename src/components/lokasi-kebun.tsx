// src/components/LokasiKebun.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highmaps from 'highcharts/modules/map';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsTiledWebMap from 'highcharts/modules/tiledwebmap';
import HighchartsExporting from 'highcharts/modules/exporting';

// Initialize Highcharts modules
if (typeof Highcharts === 'object') {
    HighchartsMore(Highcharts);
    Highmaps(Highcharts);
    HighchartsTiledWebMap(Highcharts);
    HighchartsExporting(Highcharts);
}

interface KebunData {
    Kebun: string;
    Longitude: number;
    Latitude: number;
}

interface FormattedData {
    name: string;
    lon: number;
    lat: number;
}

const LokasiKebun: React.FC = () => {
    const [chartData, setChartData] = useState<FormattedData[]>([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_REPLANTING;

    const fetchKebunKoordinat = async () => {
        try {
            const response = await axios.get<KebunData[]>(`${apiUrl}/koordinat-kebun`);
            const formattedData = response.data.map((item) => ({
                name: item.Kebun,
                lon: item.Longitude,
                lat: item.Latitude
            }));

            setChartData(formattedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching kebun data:", error);
            setLoading(false);
        }
    };

    const options: Highcharts.Options = {
        chart: {
            type: 'map',
            margin: 0,
            height: '650px',
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        navigation: {
            buttonOptions: {
                align: 'left',
                theme: {
                    stroke: '#e6e6e6'
                }
            }
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox'
            }
        },
        mapView: {
            center: [110.251, -1.999],
            zoom: 6
        },
        tooltip: {
            pointFormat: '{point.name}'
        },
        legend: {
            enabled: true,
            title: {
                text: 'Lokasi Kebun PICA Tanaman 🌱',
                style: {
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: '18px'
                }
            },
            align: 'left',
            symbolWidth: 20,
            symbolHeight: 20,
            itemStyle: {
                textOutline: '1 1 1px rgba(255,255,255)'
            },
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderColor: '#e6e6e6',
            borderWidth: 1,
            borderRadius: 2,
            itemMarginBottom: 5,
        },
        plotOptions: {
            mappoint: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [
            {
                type: 'tiledwebmap',
                name: 'Basemap Tiles',
                provider: {
                    type: 'OpenStreetMap'
                },
                showInLegend: false
            },
            {
                type: 'mappoint',
                name: 'Lokasi Kebun',
                showInLegend: true,
                marker: {
                    symbol: 'url(/ptpn4.png)',
                    width: 25,
                    height: 25
                },
                data: chartData
            }
        ]
    };

    const cssChart: React.CSSProperties = {
        height: '100%',
        width: '100%',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    };

    useEffect(() => {
        fetchKebunKoordinat();
    }, []);

    return (
        <div className="rounded-lg" style={cssChart}>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <p>Loading map data...</p>
                </div>
            ) : (
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType={'mapChart'}
                    options={options}
                    allowChartUpdate={true}
                />
            )}
        </div>
    );
};

export default LokasiKebun;