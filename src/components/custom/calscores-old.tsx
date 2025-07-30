type ScoreRange = {
    skor100: string | number;
    skor90: string | number;
    skor80: string | number;
};

type PlantData = {
    fase: string;
    umur: number;
    lingkarBatang: ScoreRange;
    jumlahPelepah: ScoreRange;
    tinggiTanaman: ScoreRange;
};

type Dataset = PlantData[];

const parseRange = (range: string | number): { min: number; max: number; isMinOnly?: boolean } => {
    if (typeof range === 'number') {
        return { min: range, max: range };
    }

    if (range.includes('>=')) {
        const value = parseFloat(range.replace('>=', '').trim());
        return { min: value, max: Infinity, isMinOnly: true };
    }

    if (range.includes('<')) {
        const value = parseFloat(range.replace('<', '').trim());
        return { min: -Infinity, max: value, isMinOnly: true };
    }

    const [minStr, maxStr] = range.split('-').map(s => s.trim());
    return {
        min: parseFloat(minStr),
        max: parseFloat(maxStr)
    };
};

const getScore = (
    dataset: Dataset,
    age: number,
    value: number,
    metric: 'lingkarBatang' | 'jumlahPelepah' | 'tinggiTanaman'
): number => {
        if (!dataset || dataset.length === 0) {
        console.error('Dataset is empty');
        return 0;
    }
    const ageData = dataset.find(item => item.umur === age);
    if (!ageData) {
        console.log(`No data found for age ${age}`);
        console.log('Available ages:', dataset.map(item => item.umur));  
        return 0; // Default score if no data found    
    }

    const range = ageData[metric];

    if (typeof range.skor100 === 'number' && typeof range.skor90 === 'number' && typeof range.skor80 === 'number') {
        if (value >= range.skor100) return 100;
        if (value >= range.skor90) return 90;
        if (value >= range.skor80) return 80;
        if (value < range.skor80) return 80;
        return 80;


    }

    const score100Range = parseRange(range.skor100);
    const score90Range = parseRange(range.skor90);
    const score80Range = parseRange(range.skor80);

    if (score100Range.isMinOnly) {
        if (value >= score100Range.min) return 100;
    } else {
        if (value >= score100Range.min && value <= score100Range.max) return 100;
    }

    if (score90Range.isMinOnly) {
        if (value >= score90Range.min) return 90;
    } else {
        if (value >= score90Range.min && value <= score90Range.max) return 90;
    }

    if (score80Range.isMinOnly) {
        if (value < score80Range.max) return 80;
    } else {
        if (value >= score80Range.min && value <= score80Range.max) return 80;
    }

    // If value is below all defined ranges, return 80 as default
    

    if (value < score80Range.min) return 80;
    if (value < score90Range.min) return 90;
    if (value < score100Range.min) return 100;

    return 80;
};

export const getScoreLingkarBatang = (dataset: Dataset, age: number, value: number) =>
    getScore(dataset, age, value, 'lingkarBatang');

export const getScoreJumlahPelepah = (dataset: Dataset, age: number, value: number) =>
    getScore(dataset, age, value, 'jumlahPelepah');

export const getScoreTinggiTanaman = (dataset: Dataset, age: number, value: number) =>
    getScore(dataset, age, value, 'tinggiTanaman');

export const getScoreKerapatanPokok = (
    age: number,
    jum_pokok_awal: number,
    jum_pokok_akhir: number
) => {
    const result = (jum_pokok_akhir / jum_pokok_awal) * 100;
    return Math.min(result, 100);
};



const getColor = (
    dataset: Dataset,
    age: number,
    value: number,
    metric: 'lingkarBatang' | 'jumlahPelepah' | 'tinggiTanaman'
): 'danger' | 'warning' | 'default' => {
    const ageData = dataset.find(item => item.umur === age);
    if (!ageData) return 'default';

    const range = ageData[metric];
    let minValue: number;

    // Get the minimum value from the score ranges
    if (typeof range.skor80 === 'number') {
        minValue = range.skor80;
    } else {
        const parsed80 = parseRange(range.skor80);
        minValue = parsed80.min;
    }

    // Calculate 10% threshold
    const threshold = minValue * 0.1;

    if (value < threshold) {
        return 'danger';
    } else if (value > minValue) {
        return 'default';
    }

    return 'default';
};

export const getColorLingkarBatang = (dataset: Dataset, age: number, value: number) =>
    getColor(dataset, age, value, 'lingkarBatang');

export const getColorJumlahPelepah = (dataset: Dataset, age: number, value: number) =>
    getColor(dataset, age, value, 'jumlahPelepah');

export const getColorTinggiTanaman = (dataset: Dataset, age: number, value: number) =>
    getColor(dataset, age, value, 'tinggiTanaman');