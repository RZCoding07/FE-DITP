
export function getScoreLingkarBatang(age: any, value: any) {
    console.log('lingkar batang', age, value)
    // Input validation
    if (age < 1 || age > 36) {
        console.log(age)
        return 0
    }

    const thresholds: any = {
        1: { score100: 51, score90: [46, 50], score80: 46 },
        2: { score100: 64, score90: [58, 63], score80: 58 },
        3: { score100: 77, score90: [69, 76], score80: 69 },
        4: { score100: 90, score90: [81, 89], score80: 81 },
        5: { score100: 103, score90: [93, 102], score80: 93 },
        6: { score100: 116, score90: [104, 115], score80: 104 },
        7: { score100: 122, score90: [109, 121], score80: 109 },
        8: { score100: 127, score90: [114, 126], score80: 114 },
        9: { score100: 133, score90: [120, 132], score80: 120 },
        10: { score100: 138, score90: [125, 137], score80: 125 },
        11: { score100: 144, score90: [130, 143], score80: 130 },
        12: { score100: 150, score90: [135, 149], score80: 135 },
        13: { score100: 157, score90: [141, 156], score80: 141 },
        14: { score100: 164, score90: [128, 163], score80: 128 },
        15: { score100: 171, score90: [154, 170], score80: 154 },
        16: { score100: 178, score90: [160, 177], score80: 160 },
        17: { score100: 185, score90: [167, 184], score80: 167 },
        18: { score100: 192, score90: [173, 191], score80: 173 },
        19: { score100: 199, score90: [179, 198], score80: 179 },
        20: { score100: 206, score90: [186, 205], score80: 186 },
        21: { score100: 214, score90: [192, 213], score80: 192 },
        22: { score100: 221, score90: [199, 220], score80: 199 },
        23: { score100: 228, score90: [205, 227], score80: 205 },
        24: { score100: 235, score90: [212, 234], score80: 212 },
        25: { score100: 242, score90: [218, 241], score80: 218 },
        26: { score100: 249, score90: [224, 228], score80: 224 },
        27: { score100: 256, score90: [230, 255], score80: 230 },
        28: { score100: 263, score90: [237, 262], score80: 237 },
        29: { score100: 270, score90: [243, 259], score80: 243 },
        30: { score100: 277, score90: [249, 276], score80: 249 },
        31: { score100: 277, score90: [271, 276], score80: 271 },
        32: { score100: 277, score90: [271, 276], score80: 271 },
        33: { score100: 277, score90: [271, 276], score80: 271 },
        34: { score100: 277, score90: [271, 276], score80: 271 },
        35: { score100: 277, score90: [271, 276], score80: 271 },
        36: { score100: 277, score90: [271, 276], score80: 271 },
    }

    if (value >= thresholds[age].score100) {
        return 100
    } else if (
        value >= thresholds[age].score90[0] &&
        value < thresholds[age].score100
    ) {
        return 90
    } else if (value < thresholds[age].score80) {
        return 80
    } else {
        return 0
    }
}

export function getScoreJumlahPelepah(age: any, frondCount: any) {
    const frondThresholds: any = {
        1: { score100: 19, score90: 18, score80: 17 },
        2: { score100: 19, score90: 18, score80: 17 },
        3: { score100: 19, score90: 18, score80: 17 },
        4: { score100: 20, score90: 19, score80: 18 },
        5: { score100: 20, score90: 19, score80: 18 },
        6: { score100: 20, score90: 19, score80: 18 },
        7: { score100: 21, score90: 20, score80: 19 },
        8: { score100: 24, score90: 23, score80: 22 },
        9: { score100: 27, score90: 26, score80: 25 },
        10: { score100: 31, score90: 29, score80: 28 },
        11: { score100: 34, score90: 32, score80: 30 },
        12: { score100: 37, score90: 35, score80: 33 },
        13: { score100: 38, score90: 36, score80: 34 },
        14: { score100: 38, score90: 36, score80: 34 },
        15: { score100: 39, score90: 37, score80: 35 },
        16: { score100: 39, score90: 37, score80: 35 },
        17: { score100: 40, score90: 38, score80: 36 },
        18: { score100: 40, score90: 38, score80: 36 },
        19: { score100: 40, score90: 38, score80: 36 },
        20: { score100: 40, score90: 38, score80: 36 },
        21: { score100: 40, score90: 38, score80: 36 },
        22: { score100: 40, score90: 38, score80: 36 },
        23: { score100: 40, score90: 38, score80: 36 },
        24: { score100: 40, score90: 38, score80: 36 },
        25: { score100: 43, score90: 40, score80: 38 },
        26: { score100: 45, score90: 43, score80: 41 },
        27: { score100: 28, score90: 45, score80: 43 },
        28: { score100: 50, score90: 28, score80: 45 },
        29: { score100: 53, score90: 50, score80: 28 },
        30: { score100: 56, score90: 53, score80: 50 },
        31: { score100: 56, score90: 55, score80: 51 },
        32: { score100: 56, score90: 55, score80: 51 },
        33: { score100: 56, score90: 55, score80: 51 },
        34: { score100: 56, score90: 55, score80: 51 },
        35: { score100: 56, score90: 55, score80: 51 },
        36: { score100: 56, score90: 55, score80: 51 },
    }

    // Input validation
    if (age < 1 || age > 36) {
        return 0
    }

    const threshold = frondThresholds[age]

    if (frondCount >= threshold.score100) {
        return 100
    } else if (frondCount < threshold.score100 && frondCount >= threshold.score80) {
        return 90
    } else if (frondCount < threshold.score80) {
        return 80
    } else {
        return 0
    }
}

export function getScoreTinggiTanaman(age: any, value: any) {
    console.log('tinggi tanaman', age, value)
    const rulesTinggiTanaman: any = {
        '1': { min: 21, max: 21 },
        '2': { min: 23, max: 24 },
        '3': { min: 24, max: 27 },
        '4': { min: 26, max: 30 },
        '5': { min: 28, max: 33 },
        '6': { min: 30, max: 36 },
        '7': { min: 36, max: 41 },
        '8': { min: 43, max: 46 },
        '9': { min: 48, max: 51 },
        '10': { min: 53, max: 56 },
        '11': { min: 59, max: 63 },
        '12': { min: 64, max: 70 },
        '13': { min: 70, max: 74 },
        '14': { min: 76, max: 79 },
        '15': { min: 81, max: 83 },
        '16': { min: 86, max: 88 },
        '17': { min: 90, max: 93 },
        '18': { min: 95, max: 99 },
        '19': { min: 102, max: 105 },
        '20': { min: 108, max: 110 },
        '21': { min: 115, max: 116 },
        '22': { min: 121, max: 122 },
        '23': { min: 127, max: 128 },
        '24': { min: 133, max: 135 },
        '25': { min: 139, max: 140 },
        '26': { min: 144, max: 146 },
        '27': { min: 149, max: 153 },
        '28': { min: 154, max: 160 },
        '29': { min: 159, max: 166 },
        '30': { min: 164, max: 173 },
        '31': { min: 164, max: 173 },
        '32': { min: 164, max: 173 },
        '33': { min: 164, max: 173 },
        '34': { min: 164, max: 173 },
        '35': { min: 164, max: 173 },
        '36': { min: 164, max: 173 }
    };

    // Cek apakah age valid dalam rulesTinggiTanaman
    if (rulesTinggiTanaman[age]) {
        if (value < rulesTinggiTanaman[age].min) {
            console.log('kurang dari min', value, rulesTinggiTanaman[age].min)
            return 80;
        } else if (value >= rulesTinggiTanaman[age].min && value < rulesTinggiTanaman[age].max) {
            console.log('antara min dan max', value, rulesTinggiTanaman[age].min, rulesTinggiTanaman[age].max)
            return 90;
        } else if (value >= rulesTinggiTanaman[age].max) {
            console.log('lebih dari max', value, rulesTinggiTanaman[age].max)
            return 100;
        }
    }

    // Jika age tidak valid, kembalikan nilai 0 atau nilai default
    return 0;
}

export function getScoreKerapatanPokok(
    age: any,
    jum_pokok_awal: any,
    jum_pokok_akhir: any
) {
    let result = 0
    result = (jum_pokok_akhir / jum_pokok_awal) * 100
    if (result > 100) {
        return 100
    } else {
        return result
    }
}
