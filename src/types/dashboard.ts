// Basic data types
export type ColorCategory = "gold" | "green" | "red" | "black";

export type TbmType = "tbm1" | "tbm2" | "tbm3" | "tbm4";

export type SelectOption = {
  value: string;
  label: string;
};

// Color data types
export type ColorData = {
  gold: number;
  green: number;
  red: number;
  black: number;
};

export type ColorDataLuas = {
  gold: number;
  green: number;
  red: number;
  black: number;
};

export type ColorDataLuasDonat = {
  gold: string;
  green: string;
  red: string;
  black: string;
};

// TBM data types
export type TbmData = {
  tbm1: number;
  tbm2: number;
  tbm3: number;
  tbm4: number;
};

export type TbmScoreData = {
  score100: number;
  score90: number;
  score80: number;
  total: number;
};

export type TbmDataScoreBlok = {
  tbm1: TbmScoreData;
  tbm2: TbmScoreData;
  tbm3: TbmScoreData;
};

// Regional and block data
export type RegionalBlackBlockCount = Record<string, Record<string, number>>;

export type CategoryFilter = {
  category: string;
  filter: number;
};

export type CategoryFilterLuas = {
  category: string;
  filter: string;
};

// Color count data by TBM level
export type TbmColorCount = Record<ColorCategory, number>;

export type TbmLuasByColor = Record<ColorCategory, number>;

export type TbmDataRegional = Record<string, Record<ColorCategory, number>>;

// Kebun color data
export type ColorCountKebun = Array<{
  category: string;
  sumColor: number;
  sumLuas: string;
  filterBlok: number;
  filterLuas: string;
}>;

// Card selection types
export type SelectedCard = {
  type: string;
  name: string;
  ctg: string;
  circular: string;
  val: number;
};

export type SelectedCardTbm = {
  title: string;
  circular: ColorCategory;
} | null;

// Event selection type
export type SelectedEvent = {
  name: string;
  value: string;
  color: string;
  categories: string[];
  allData: any[];
  countBlok: CategoryFilter[];
  sumLuasBlok: CategoryFilterLuas[];
  selectedCategory: string;
} | null;

// Score data types
export type ScoreItem = {
  regional: string;
  kebun: string;
  afdeling: string;
  blok: string;
  luas: number;
  jumPelepah: number;
  scoreLingkarBatang: number;
  scoreJumlahPelepah: number;
  scoreTinggiBatang: number;
  scoreKerapatanPokok: number;
  totalSeleksian: number;
  colorCategory: ColorCategory;
};

export type Score = {
  [key in TbmType]: ScoreItem;
};

export type ScoreKebun = {
  [key in TbmType]: {
    regional: string;
    kebun: string;
    luas: number;
    totalSeleksiKebun: number;
    colorCategory: ColorCategory;
  };
};

export type ScoreRegional = {
  [key in TbmType]: {
    regional: string;
    totalSeleksiRegional: number;
  };
};

// Dashboard props types
export type DashboardHeaderProps = {
  fullname: string;
  control: any;
  tahunOptions: SelectOption[];
  bulanOptions: SelectOption[];
  defaultTahun: SelectOption;
  defaultBulan: SelectOption;
  onDownload: () => void;
};

export type SummaryProps = {
  dataProps: {
    tbm1DataRegional: TbmDataRegional;
    tbm2DataRegional: TbmDataRegional;
    tbm3DataRegional: TbmDataRegional;
    tbm4DataRegional: TbmDataRegional;
    tbmData: TbmData;
    tbmDataScorePelepahBlok: TbmDataScoreBlok;
    tbmDataScoreLingkarBlok: TbmDataScoreBlok;
    data: ColorData;
    dataLuas: ColorDataLuas;
    score: Score[];
    dataTbm: TbmData & { tahun: SelectOption };
  };
  onCardClick: (cardData: SelectedCard) => void;
};

export type STbmProps = {
  dataProps: {
    tbmData: TbmData;
    rpc: SelectOption;
    data: ColorData;
    dataLuas: ColorDataLuas;
    dataDnt: ColorData;
    dataLuasDnt: ColorDataLuasDonat;
    score: Score[];
    tbm1ColorCount: TbmColorCount;
    tbm2ColorCount: TbmColorCount;
    tbm3ColorCount: TbmColorCount;
    tbm4ColorCount: TbmColorCount;
    tbm1LuasByColor: TbmLuasByColor;
    tbm2LuasByColor: TbmLuasByColor;
    tbm3LuasByColor: TbmLuasByColor;
    tbm4LuasByColor: TbmLuasByColor;
    ctg: string;
    title: string;
    dataTbm: TbmData & { tahun: SelectOption };
  };
  onCardTbmClick: (cardData: SelectedCardTbm) => void;
};

export type DonutChartTbmProps = {
  dataprops: {
    rpc: SelectOption;
    kebun: SelectOption;
    data: ColorData;
    dataLuas: ColorDataLuas;
    dataDnt: ColorData;
    dataLuasDnt: ColorDataLuasDonat;
    tbm1ColorCount: TbmColorCount;
    tbm2ColorCount: TbmColorCount;
    tbm3ColorCount: TbmColorCount;
    tbm4ColorCount: TbmColorCount;
    tbm1LuasByColor: TbmLuasByColor;
    tbm2LuasByColor: TbmLuasByColor;
    tbm3LuasByColor: TbmLuasByColor;
    tbm4LuasByColor: TbmLuasByColor;
    blok: string;
    ctg: string;
    title: string;
  };
};

export type StockAnalysisChartProps = {
  dataprops: {
    dataset: any[];
    untuk: string;
    score: Score[];
    rpc?: SelectOption;
    kebun?: SelectOption;
    afd?: SelectOption;
    ctg?: string;
    title: string;
    color: string;
    val: number;
  };
  onEventClick: (eventData: SelectedEvent) => void;
};

export type StockAnalysisChartKebunProps = {
  dataprops: {
    rpc?: SelectOption;
    kebun?: SelectOption;
    afd?: SelectOption;
    datasets: any[];
    score: Score[];
    dataset: CategoryFilter[] | CategoryFilterLuas[];
    untuk: string;
    categories: string[];
    title: string;
    color: string;
    val: number;
    category: string;
  };
  onEventClick: (eventData: SelectedEvent) => void;
};

export type StockAnalysisChartKebunColorProps = {
  isColorGraphVisible: boolean;
  onHideColorGraph: () => void;
  dataprops: {
    rpc?: SelectOption;
    kebun?: SelectOption;
    afd?: SelectOption;
    blok?: SelectOption;
    datasets: any[];
    score: Score[];
    color: string;
    dataset: ColorCountKebun;
    untuk: string;
    categories: string[];
    title: string;
    val: number;
    category: string;
  };
  onEventClick: (eventData: SelectedEvent) => void;
};

export type StockAnalysisChartBarProps = {
  dataProps: {
    rpc?: SelectOption;
    kebun?: SelectOption;
    afd?: SelectOption;
    blok?: SelectOption;
    ctg: string;
    title: string;
    countBlackBlock: Record<string, number>;
    countRedBlock: Record<string, number>;
    countBlackBlockTbm1: Record<string, number>;
    countRedBlockTbm1: Record<string, number>;
    countBlackBlockTbm2: Record<string, number>;
    countRedBlockTbm2: Record<string, number>;
    countBlackBlockTbm3: Record<string, number>;
    countRedBlockTbm3: Record<string, number>;
    countBlackBlockTbm4: Record<string, number>;
    countRedBlockTbm4: Record<string, number>;
  };
};

// API and helper function types
export type FetchVegetativeProcParams = {
  input_tbm: string;
  input_tahun_tanam: string;
  input_bulan: number;
  input_tahun: number;
};

export type ProcessScoreDataParams = {
  data: any;
  bulanValue: string;
  i: number;
  getScoreLingkarBatang: (value: number, tbmLevel: number) => number;
  getScoreJumlahPelepah: (value: number, tbmLevel: number) => number;
  getScoreTinggiTanaman: (value: number, tbmLevel: number) => number;
  getScoreKerapatanPokok: (value: number) => number;
};

export type ProcessScoreDataResult = {
  newScores: Score[];
  newScoresKebun: ScoreKebun[];
  newScoresRegional: ScoreRegional[];
  newRegionalBlackBlockCount: Record<string, number>;
  tbmResultsUpdate: Partial<TbmData>;
  scoreJumlahPelepahResultsUpdate: Partial<TbmScoreData>;
  scoreLingkarBatangResultsUpdate: Partial<TbmScoreData>;
};

