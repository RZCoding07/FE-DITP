export const customStyles = {
    theme: (theme: any) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary25: 'var(--bg-secondary)',
        primary: 'var(--text-primary)',
      },
    }),
    
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'var(--bg-primary)',
      borderColor: 'var(--border-primary)',
      borderRadius: '10.5rem',
      boxShadow: 'none',
      color: 'var(--text-primary)',
      width: '100%', // Set desired width here
      minHeight: '2.5rem',
      '&:hover': {
        borderColor: 'var(--border-primary)',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#fff',
      color: 'black',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '0.5rem',
    }),
    option: (base: any, state: any) => ({
      ...base,
      color: state.isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
      backgroundColor: state.isSelected
        ? 'var(--bg-secondary)'
        : 'var(--bg-primary)',
      whiteSpace: 'nowrap', // Prevent text from wrapping
      overflow: 'hidden', // Hide overflow
      textOverflow: 'ellipsis', // Add ellipsis if text is too long
      '&:hover': {
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'var(--text-primary)',
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'var(--text-primary)',
    }),
    placeholder: (provided: any, state: any) => ({
      ...provided,
      color: state.theme.mode === 'dark' ? 'white' : 'var(--text-secondary)',
      whiteSpace: 'nowrap',  // Menghindari teks melompat ke baris berikutnya
      overflow: 'hidden',    // Menyembunyikan teks yang melampaui batas
      textOverflow: 'ellipsis',  // Menambahkan elipsis di akhir teks
      maxWidth: '200px',    // Tentukan batas lebar maksimal sesuai kebutuhan
      width: '100%',        // Pastikan lebar placeholder responsif
    }),
  }
  