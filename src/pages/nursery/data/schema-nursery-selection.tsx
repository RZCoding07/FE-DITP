import { z } from 'zod';


// id: {
//     type: DataTypes.UUID,
//     defaultValue: uuidv4,
//     primaryKey: true,
// },
// user_id: {
//     type: DataTypes.UUID,
//     allowNull: false,
// },
// reg: {
//     type: DataTypes.STRING,
//     allowNull: false,
// },
// kebun: {
//     type: DataTypes.STRING,
//     allowNull: false,
// },
// batch: {
//     type: DataTypes.STRING,
//     allowNull: false,
// },
// varietas: {
//     type: DataTypes.STRING,
//     allowNull: false,
// },
// tgl_kecambah_datang: {
//     type: DataTypes.DATEONLY,
//     allowNull: true,
//     defaultValue: null,
// },
// tgl_kecambah_ditanam: {
//     type: DataTypes.DATEONLY,
//     allowNull: true,
//     defaultValue: null,
// },
// jumlah_kecambah_diterima: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// kecambah: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// bulan_1: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// bulan_2: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// transplanting_pn_mn: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// bulan_4: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// bulan_6: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// bulan_8: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// bulan_12: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// transplanting_mn_blok: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// bulan: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// },
// tahun: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: null,
// }
// Stok Lokasi Bibitan schema for validation and type inference
export const seleksiHasilBibitanSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
    reg: z.string(),
    kebun: z.string(),
    batch: z.string(),
    varietas: z.string(),
    tgl_kecambah_datang: z.string().nullable(),
    tgl_kecambah_ditanam: z.string().nullable(),
    jumlah_kecambah_diterima: z.number().nullable(),
    kecambah: z.number().nullable(),
    bulan_1: z.number().nullable(),
    bulan_2: z.number().nullable(),
    transplanting_pn_mn: z.number().nullable(),
    bulan_4: z.number().nullable(),
    bulan_6: z.number().nullable(),
    bulan_8: z.number().nullable(),
    bulan_12: z.number().nullable(),
    transplanting_mn_blok: z.number().nullable(),
    bulan: z.number().int(),
    tahun: z.number().int(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable()
});

export type SeleksiHasiliBibitan = z.infer<typeof seleksiHasilBibitanSchema>;
