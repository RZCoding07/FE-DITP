
//match kebun in array b with array a, use similiarity, then generate the matching rows as table:
const a = [
    {
        "kode": "2ado",
        "kebun": "kebun adolina"
    },
    {
        "kode": "1kas",
        "kebun": "kebun aek nabara selatan"
    },
    {
        "kode": "1kan",
        "kebun": "kebun aek nabara utara"
    },
    {
        "kode": "2aba",
        "kebun": "kebun air batu"
    },
    {
        "kode": "3ka1",
        "kebun": "kebun air molek i"
    },
    {
        "kode": "3ka2",
        "kebun": "kebun air molek ii"
    },
    {
        "kode": "2kat",
        "kebun": "kebun air tenang"
    },
    {
        "kode": "2aja",
        "kebun": "kebun ajamu"
    },
    {
        "kode": "1kam",
        "kebun": "kebun ambalutu"
    },
    {
        "kode": "2kat",
        "kebun": "kebun asera"
    },
    {
        "kode": "4bkc",
        "kebun": "kebun b. cermin"
    },
    {
        "kode": "4bkk",
        "kebun": "kebun b. kausar"
    },
    {
        "kode": "2ulu",
        "kebun": "kebun bah birong ulu"
    },
    {
        "kode": "2baj",
        "kebun": "kebun bah jambi"
    },
    {
        "kode": "2bal",
        "kebun": "kebun balimbingan"
    },
    {
        "kode": "1kbb",
        "kebun": "kebun bandar betsy"
    },
    {
        "kode": "2kbk",
        "kebun": "kebun bandar klippa"
    },
    {
        "kode": "1kbs",
        "kebun": "kebun bandar selamat"
    },
    {
        "kode": "1kbn",
        "kebun": "kebun bangun"
    },
    {
        "kode": "6kbr",
        "kebun": "kebun baru"
    },
    {
        "kode": "2bap",
        "kebun": "kebun batang laping"
    },
    {
        "kode": "2kbs",
        "kebun": "kebun batang serangan"
    },
    {
        "kode": "1kbu",
        "kebun": "kebun batang toru"
    },
    {
        "kode": "4bhr",
        "kebun": "kebun batanghari"
    },
    {
        "kode": "7kbr",
        "kebun": "kebun bekri"
    },
    {
        "kode": "7kbn",
        "kebun": "kebun bentayan"
    },
    {
        "kode": "2ber",
        "kebun": "kebun berangir"
    },
    {
        "kode": "7kbt",
        "kebun": "kebun betung"
    },
    {
        "kode": "7kbk",
        "kebun": "kebun betung krawo"
    },
    {
        "kode": "2bul",
        "kebun": "kebun bukit lima"
    },
    {
        "kode": "1kbt",
        "kebun": "kebun bukit tujuh"
    },
    {
        "kode": "4bun",
        "kebun": "kebun bunut"
    },
    {
        "kode": "6kcg",
        "kebun": "kebun cot girek"
    },
    {
        "kode": "5kds",
        "kebun": "kebun danau salak"
    },
    {
        "kode": "2doi",
        "kebun": "kebun dolok ilir"
    },
    {
        "kode": "2dos",
        "kebun": "kebun dolok sinumbah"
    },
    {
        "kode": "4drl",
        "kebun": "kebun durian luncuk"
    },
    {
        "kode": "1kdh",
        "kebun": "kebun dusun hulu"
    },
    {
        "kode": "2gub",
        "kebun": "kebun gunung bayu"
    },
    {
        "kode": "5kgs",
        "kebun": "kebun gunung mas"
    },
    {
        "kode": "5kgm",
        "kebun": "kebun gunung meliau"
    },
    {
        "kode": "1kgm",
        "kebun": "kebun gunung monako"
    },
    {
        "kode": "1kgp",
        "kebun": "kebun gunung pamela"
    },
    {
        "kode": "1kgr",
        "kebun": "kebun gunung para"
    },
    {
        "kode": "1khg",
        "kebun": "kebun hapesong"
    },
    {
        "kode": "1khp",
        "kebun": "kebun huta padang"
    },
    {
        "kode": "6kju",
        "kebun": "kebun julok rayeuk utara"
    },
    {
        "kode": "2kkm",
        "kebun": "kebun keera maroangin"
    },
    {
        "kode": "5kby",
        "kebun": "kebun kembayan"
    },
    {
        "kode": "2kks",
        "kebun": "kebun kuala sawit"
    },
    {
        "kode": "1klj",
        "kebun": "kebun labuhan haji"
    },
    {
        "kode": "4lgn",
        "kebun": "kebun lagan"
    },
    {
        "kode": "6klm",
        "kebun": "kebun lama"
    },
    {
        "kode": "2lar",
        "kebun": "kebun laras"
    },
    {
        "kode": "2klr",
        "kebun": "kebun limau mungkur"
    },
    {
        "kode": "5klk",
        "kebun": "kebun longkali"
    },
    {
        "kode": "3kld",
        "kebun": "kebun lubuk dalam"
    },
    {
        "kode": "2kl1",
        "kebun": "kebun luwu i"
    },
    {
        "kode": "2kl2",
        "kebun": "kebun luwu ii"
    },
    {
        "kode": "2mat",
        "kebun": "kebun marihat"
    },
    {
        "kode": "2mar",
        "kebun": "kebun marjandi"
    },
    {
        "kode": "2may",
        "kebun": "kebun mayang"
    },
    {
        "kode": "2kmt",
        "kebun": "kebun melati"
    },
    {
        "kode": "1kmm",
        "kebun": "kebun membang muda"
    },
    {
        "kode": "2mep",
        "kebun": "kebun meranti paham"
    },
    {
        "kode": "1kms",
        "kebun": "kebun merbau selatan"
    },
    {
        "kode": "5kng",
        "kebun": "kebun ngabang"
    },
    {
        "kode": "4oph",
        "kebun": "kebun ophir"
    },
    {
        "kode": "2pab",
        "kebun": "kebun pabatu"
    },
    {
        "kode": "2pdm",
        "kebun": "kebun padang matinggi"
    },
    {
        "kode": "7kpr",
        "kebun": "kebun padang ratu"
    },
    {
        "kode": "5kpm",
        "kebun": "kebun pamukan"
    },
    {
        "kode": "2paj",
        "kebun": "kebun panai jaya"
    },
    {
        "kode": "5kpd",
        "kebun": "kebun pandawa"
    },
    {
        "kode": "4plk",
        "kebun": "kebun pangkalan lima puluh"
    },
    {
        "kode": "5kpr",
        "kebun": "kebun parindu"
    },
    {
        "kode": "2pam",
        "kebun": "kebun pasir mandoge"
    },
    {
        "kode": "2kpa",
        "kebun": "kebun patumbak"
    },
    {
        "kode": "5kpl",
        "kebun": "kebun pelaihari"
    },
    {
        "kode": "1kpm",
        "kebun": "kebun pulau mandi"
    },
    {
        "kode": "6kpt",
        "kebun": "kebun pulau tiga"
    },
    {
        "kode": "2pur",
        "kebun": "kebun pulu raja"
    },
    {
        "kode": "1krb",
        "kebun": "kebun rambutan"
    },
    {
        "kode": "1krp",
        "kebun": "kebun rantau prapat"
    },
    {
        "kode": "7krs",
        "kebun": "kebun rejo sari"
    },
    {
        "kode": "5krb",
        "kebun": "kebun rimba belian"
    },
    {
        "kode": "4rdu",
        "kebun": "kebun rimbo dua"
    },
    {
        "kode": "4rsa",
        "kebun": "kebun rimbo satu"
    },
    {
        "kode": "1ksg",
        "kebun": "kebun sarang giting"
    },
    {
        "kode": "2ksh",
        "kebun": "kebun sawit hulu"
    },
    {
        "kode": "2sal",
        "kebun": "kebun sawit langkat"
    },
    {
        "kode": "2kss",
        "kebun": "kebun sawit seberang"
    },
    {
        "kode": "1ksb",
        "kebun": "kebun sei baruhur"
    },
    {
        "kode": "3kbe",
        "kebun": "kebun sei berlian"
    },
    {
        "kode": "3ksn",
        "kebun": "kebun sei buatan"
    },
    {
        "kode": "1kdp",
        "kebun": "kebun sei dadap"
    },
    {
        "kode": "1ksd",
        "kebun": "kebun sei daun"
    },
    {
        "kode": "3ksg",
        "kebun": "kebun sei galuh"
    },
    {
        "kode": "3kgo",
        "kebun": "kebun sei garo"
    },
    {
        "kode": "3ksi",
        "kebun": "kebun sei intan"
    },
    {
        "kode": "1ksk",
        "kebun": "kebun sei kebara"
    },
    {
        "kode": "3ksk",
        "kebun": "kebun sei kencana"
    },
    {
        "kode": "2sko",
        "kebun": "kebun sei kopas"
    },
    {
        "kode": "3ksl",
        "kebun": "kebun sei lindai"
    },
    {
        "kode": "1ksm",
        "kebun": "kebun sei meranti"
    },
    {
        "kode": "3ksp",
        "kebun": "kebun sei pagar"
    },
    {
        "kode": "1ksp",
        "kebun": "kebun sei putih"
    },
    {
        "kode": "3ksr",
        "kebun": "kebun sei rokan"
    },
    {
        "kode": "3kss",
        "kebun": "kebun sei siasam"
    },
    {
        "kode": "1ksl",
        "kebun": "kebun sei silau"
    },
    {
        "kode": "3kst",
        "kebun": "kebun sei tapung"
    },
    {
        "kode": "7ksn",
        "kebun": "kebun senabing"
    },
    {
        "kode": "3ksb",
        "kebun": "kebun seri batu langkah"
    },
    {
        "kode": "1ksa",
        "kebun": "kebun silau dunia"
    },
    {
        "kode": "1ksu",
        "kebun": "kebun sintang (kebun karet)"
    },
    {
        "kode": "4ssl",
        "kebun": "kebun sisumut"
    },
    {
        "kode": "2osa",
        "kebun": "kebun solsel"
    },
    {
        "kode": "1kka",
        "kebun": "kebun sosa"
    },
    {
        "kode": "5ksd",
        "kebun": "kebun sungai dekan"
    },
    {
        "kode": "7ksl",
        "kebun": "kebun sungai lengi"
    },
    {
        "kode": "4tlb",
        "kebun": "kebun t. lebar"
    },
    {
        "kode": "5ktb",
        "kebun": "kebun tabara"
    },
    {
        "kode": "5ktj",
        "kebun": "kebun tajati"
    },
    {
        "kode": "7kto",
        "kebun": "kebun talopino"
    },
    {
        "kode": "3ktm",
        "kebun": "kebun tamora"
    },
    {
        "kode": "2tiu",
        "kebun": "kebun tanah itam ulu"
    },
    {
        "kode": "3ktp",
        "kebun": "kebun tanah putih"
    },
    {
        "kode": "1ktr",
        "kebun": "kebun tanah raja"
    },
    {
        "kode": "2kte",
        "kebun": "kebun tandem"
    },
    {
        "kode": "3kta",
        "kebun": "kebun tandun"
    },
    {
        "kode": "2ktg",
        "kebun": "kebun tanjung garbus"
    },
    {
        "kode": "2ktj",
        "kebun": "kebun tanjung jati"
    },
    {
        "kode": "3ktn",
        "kebun": "kebun tanjung medan"
    },
    {
        "kode": "3kte",
        "kebun": "kebun terantam"
    },
    {
        "kode": "2tim",
        "kebun": "kebun timur"
    },
    {
        "kode": "2tin",
        "kebun": "kebun tinjowan"
    },
    {
        "kode": "2ton",
        "kebun": "kebun tonduhan"
    },
    {
        "kode": "1kto",
        "kebun": "kebun torgamba"
    },
    {
        "kode": "6kts",
        "kebun": "kebun tualang sawit"
    }
]

const b = [
    {
        "kebun": "kebun adolina"
    },
    {
        "kebun": "kebun aek nabara selatan"
    },
    {
        "kebun": "kebun aek nabara utara"
    },
    {
        "kebun": "kebun air batu"
    },
    {
        "kebun": "kebun air tenang"
    },
    {
        "kebun": "kebun ajamu"
    },
    {
        "kebun": "kebun ambalutu"
    },
    {
        "kebun": "kebun bah birung ulu"
    },
    {
        "kebun": "kebun bah jambi"
    },
    {
        "kebun": "kebun balimbingan"
    },
    {
        "kebun": "kebun bandar betsy"
    },
    {
        "kebun": "kebun bangun"
    },
    {
        "kebun": "kebun baru"
    },
    {
        "kebun": "kebun batang serangan"
    },
    {
        "kebun": "kebun batang toru"
    },
    {
        "kebun": "kebun bekri"
    },
    {
        "kebun": "kebun beringin"
    },
    {
        "kebun": "kebun betung krawo"
    },
    {
        "kebun": "kebun bukit cermin"
    },
    {
        "kebun": "kebun bukit kausar"
    },
    {
        "kebun": "kebun bukit lima"
    },
    {
        "kebun": "kebun bunut"
    },
    {
        "kebun": "kebun cot girek"
    },
    {
        "kebun": "kebun danau salak"
    },
    {
        "kebun": "kebun dolok ilir"
    },
    {
        "kebun": "kebun dolok sinumbah"
    },
    {
        "kebun": "kebun durian luncuk"
    },
    {
        "kebun": "kebun dusun hulu"
    },
    {
        "kebun": "kebun gunung bayu"
    },
    {
        "kebun": "kebun gunung mas"
    },
    {
        "kebun": "kebun gunung meliau"
    },
    {
        "kebun": "kebun gunung monaco"
    },
    {
        "kebun": "kebun gunung pamela"
    },
    {
        "kebun": "kebun gunung para"
    },
    {
        "kebun": "kebun hapesong"
    },
    {
        "kebun": "kebun huta padang"
    },
    {
        "kebun": "kebun inti / kkpa sei tapung"
    },
    {
        "kebun": "kebun inti lubuk dalam"
    },
    {
        "kebun": "kebun inti sei  buatan"
    },
    {
        "kebun": "kebun inti/kkpa air molek ii"
    },
    {
        "kebun": "kebun inti/kkpa sei pagar"
    },
    {
        "kebun": "kebun keera maroangin"
    },
    {
        "kebun": "kebun kembayan"
    },
    {
        "kebun": "kebun labuhan haji"
    },
    {
        "kebun": "kebun lama"
    },
    {
        "kebun": "kebun laras"
    },
    {
        "kebun": "kebun limau mungkur"
    },
    {
        "kebun": "kebun longkali"
    },
    {
        "kebun": "kebun luwu i"
    },
    {
        "kebun": "kebun marihat"
    },
    {
        "kebun": "kebun marjandi"
    },
    {
        "kebun": "kebun melati"
    },
    {
        "kebun": "kebun membang muda"
    },
    {
        "kebun": "kebun meranti paham"
    },
    {
        "kebun": "kebun merbau selatan"
    },
    {
        "kebun": "kebun ngabang"
    },
    {
        "kebun": "kebun pabatu"
    },
    {
        "kebun": "kebun padang matinggi"
    },
    {
        "kebun": "kebun padang ratu"
    },
    {
        "kebun": "kebun pamukan"
    },
    {
        "kebun": "kebun pandawa"
    },
    {
        "kebun": "kebun parindu"
    },
    {
        "kebun": "kebun pulau mandi"
    },
    {
        "kebun": "kebun pulu raja"
    },
    {
        "kebun": "kebun rambutan"
    },
    {
        "kebun": "kebun rantau prapat"
    },
    {
        "kebun": "kebun rejosari"
    },
    {
        "kebun": "kebun rimba belian"
    },
    {
        "kebun": "kebun rimbo bujang dua"
    },
    {
        "kebun": "kebun sarang giting"
    },
    {
        "kebun": "kebun sawit hulu"
    },
    {
        "kebun": "kebun sawit seberang"
    },
    {
        "kebun": "kebun sei  berlian"
    },
    {
        "kebun": "kebun sei dadap"
    },
    {
        "kebun": "kebun sei daun"
    },
    {
        "kebun": "kebun sei kebara"
    },
    {
        "kebun": "kebun sei putih"
    },
    {
        "kebun": "kebun sei siasam"
    },
    {
        "kebun": "kebun sei silau"
    },
    {
        "kebun": "kebun silau dunia"
    },
    {
        "kebun": "kebun sintang"
    },
    {
        "kebun": "kebun solok selatan"
    },
    {
        "kebun": "kebun sungai dekan"
    },
    {
        "kebun": "kebun sungai lengi"
    },
    {
        "kebun": "kebun tabara"
    },
    {
        "kebun": "kebun tajati"
    },
    {
        "kebun": "kebun tanah itam ulu"
    },
    {
        "kebun": "kebun tanah raja"
    },
    {
        "kebun": "kebun tandem"
    },
    {
        "kebun": "kebun tanjung garbus"
    },
    {
        "kebun": "kebun tanjung medan"
    },
    {
        "kebun": "kebun terantam"
    },
    {
        "kebun": "kebun timur"
    },
    {
        "kebun": "kebun tinjowan"
    },
    {
        "kebun": "kebun tonduhan"
    },
    {
        "kebun": "kebun tualang sawit"
    }
]