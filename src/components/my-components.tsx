import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema untuk form validation
const formSchema = z.object({
  kode: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

// Format date as DD/MM/YYYY
const formatDate = (date: Date) => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Fungsi untuk mendapatkan minggu dari Jumat ke Sabtu dalam setahun
const getWeeksBetweenDates = (startDate: Date, endDate: Date) => {
  const weeks = [];
  let currentDate = new Date(startDate);

  // Set currentDate ke Jumat terdekat
  while (currentDate.getDay() !== 5) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  while (currentDate <= endDate) {
    const startOfWeek = new Date(currentDate);
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Sabtu

    weeks.push({ start: startOfWeek, end: endOfWeek });

    // Pindah ke minggu berikutnya
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
};

const MyComponent = () => {
  const [pkWeekOptions, setPkWeekOptions] = useState<{ [key: string]: { value: string; label: string }[] }>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode: '',
    },
  });

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // 1 Januari tahun ini
    const endDate = new Date(currentYear, 11, 31); // 31 Desember tahun ini

    const weeks = getWeeksBetweenDates(startDate, endDate);

    setPkWeekOptions({
      dummyPk: weeks.map((week, index) => ({
        value: `w${index + 1}`,
        label: `W${index + 1}: ${formatDate(week.start)} - ${formatDate(week.end)}`,
      })),
    });
  }, []);

  return (
    <div>
      <form>
        <input {...form.register('kode')} placeholder="Kode" />
        <button type="submit">Submit</button>
      </form>

      <div>
        <h3>Week Options</h3>
        <ul>
          {pkWeekOptions.dummyPk?.map((option) => (
            <li key={option.value}>{option.label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyComponent;