import React, { useState, useEffect } from "react";
import { Tooltip, Pagination } from "@mui/material";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import Cookies from "js-cookie";
// Import the InputField from shadcn
import { Input } from "../ui/input";

const months = ['Apr', 'Ags', 'Des'];

const initialData = [
  { regional: 'RPC2', kebun: 'Panai Jaya', months: ['yellow', 'red', 'yellow'] },
  { regional: 'RPC2', kebun: 'Bahjambi', months: ['green', 'green', 'yellow'] },
  { regional: 'RPC2', kebun: 'Sosa', months: ['yellow', 'yellow', 'red'] },
  { regional: 'RPC2', kebun: 'Marihat', months: ['yellow', '', '',] },
  { regional: 'RPC3', kebun: 'Sei Intan', months: ['green', 'green', ''] }
];

const getColorClass = (status: string) => {
  switch (status) {
    case 'green':
      return 'bg-green-500';
    case 'yellow':
      return 'bg-yellow-500';
    case 'red':
      return 'bg-red-500';
    default:
      return 'bg-white';
  }
};

const MonthlyStatusTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [rowsPerPage] = useState(5);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = Cookies.get('theme') as 'light' | 'dark' | undefined;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      Cookies.set('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    Cookies.set('theme', newTheme);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value.toLowerCase());
    setPage(1); 
  };

  const filteredData = initialData.filter(row => 
    row.regional.toLowerCase().includes(search) ||
    row.kebun.toLowerCase().includes(search)
  );

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const tableBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const headerTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const searchFieldBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const emptyCellBg = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200';

  return (
    <div className={`p-6 ${bgColor}`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Histori Pengukuran Vegetatif</h2>
      <div className="mb-4 flex justify-between items-center">
        {/* Replace TextField with InputField from shadcn */}
        <Input
          onChange={handleSearchChange}
          placeholder="Cari Regional atau Kebun"
          className={`w-1/3 ${searchFieldBg} ${textColor}`}
          style={{ cursor: 'pointer', backgroundColor: searchFieldBg, color: textColor }}
        />
      </div>

      <Table className={`w-full ${tableBgColor}`}>
        <TableHeader>
          <TableRow className={theme === 'dark' ? 'hover:bg-gray-950 bg-gray-700' : 'hover:bg-gray-200'}>
            <TableHead className={headerTextColor}>No</TableHead>
            <TableHead className={headerTextColor}>Regional</TableHead>
            <TableHead className={headerTextColor}>Kebun</TableHead>
            {months.map((month, index) => (
              <TableHead key={index} className={headerTextColor}>{month}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}>
              <TableCell className={textColor}>{(page - 1) * rowsPerPage + rowIndex + 1}</TableCell>
              <TableCell className={textColor}>{row.regional}</TableCell>
              <TableCell className={textColor}>{row.kebun}</TableCell>
              {row.months.map((status, monthIndex) => (
                <TableCell key={monthIndex} className="p-1">
                  <Tooltip title={`Pica: 4.14, Cashcost: 3036, Bulan: ${months[monthIndex]}`}>
                    <span className={`block w-full h-8 rounded-lg ${status ? getColorClass(status) : emptyCellBg}`}></span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center">
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          color={theme === 'dark' ? 'primary' : 'standard'}
          sx={{
            '& .MuiPaginationItem-root': {
              color: theme === 'dark' ? 'white' : 'black',
            },
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: theme === 'dark' ? '#3b82f6' : '#e5e7eb',
              color: theme === 'dark' ? 'white' : 'black',
            },
          }}
        />
      </div>
    </div>
  );
};

export default MonthlyStatusTable;
