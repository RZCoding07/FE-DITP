// app/components/ColorTable.tsx
import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

type RowData = {
    color: string;
    values: number[];
};

const data: RowData[] = [
    { color: "EMAS", values: [2, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { color: "HIJAU", values: [45, 33, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { color: "MERAH", values: [66, 73, 76, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { color: "HITAM", values: [36, 39, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
];

// Mapping warna ke kelas Tailwind untuk background & teks
const colorClasses: Record<string, string> = {
    HIJAU: "bg-green-100 text-green-800",
    EMAS: "bg-yellow-100 text-yellow-800",
    MERAH: "bg-red-100 text-red-800",
    HITAM: "bg-[#000000B3] text-white",
};

export function ColorTable() {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    return (

        <>
            <div className='flex justify-between align-middle items-center'>

                <h2 className='text-2xl font-semibold tracking-tight'>
                    Peringkat Bulanan Kelas TBM
                </h2>

            </div>
            <hr className='my-2 mt-4 border-cyan-400 mb-4' />


            <Table className="w-full">
                <TableHeader className="bg-gradient-to-l from-gray-900 to-slate-800 rounded-lg">
                    <TableRow>
                        <TableHead className="text-center">Kelas</TableHead>
                        {months.map((m) => (
                            <TableHead className="text-center" key={m}>{m}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                    {data.map(({ color, values }) => (
                        <TableRow key={color}>
                            <TableCell>
                                <div className={`p-2 rounded ${colorClasses[color]}`}>
                                    {color}
                                </div>
                            </TableCell>
                            {values.map((v, i) => (
                                <TableCell key={i}>
                                    <div className={`p-2 rounded ${colorClasses[color]}`}>
                                        {v}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
