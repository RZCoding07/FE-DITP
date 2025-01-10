DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `get_filtered_data_master`(
    IN input_regional TEXT,
    IN input_kebun TEXT,
    IN input_afdeling TEXT,
    IN input_blok TEXT,
    IN input_bulan TEXT,
    IN input_tahun TEXT,
    IN input_filtered_by TEXT
)
BEGIN
    SET @sql = CONCAT('
    SELECT 
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Regional'', ''Kebun'', ''Afdeling'', ''Blok'', ''Bulan'', ''Tahun'') THEN regional
            ELSE NULL 
        END AS regional,
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Kebun'', ''Afdeling'', ''Blok'', ''Bulan'', ''Tahun'') THEN kebun
            ELSE NULL 
        END AS kebun,
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Afdeling'', ''Blok'', ''Bulan'', ''Tahun'') THEN afdeling
            ELSE NULL 
        END AS afdeling,
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Blok'', ''Bulan'', ''Tahun'') THEN blok
            ELSE NULL 
        END AS blok,
        CASE 
            WHEN ''', input_filtered_by, ''' = ''Bulan'' THEN bulan
            ELSE NULL 
        END AS bulan,
        CASE 
            WHEN ''', input_filtered_by, ''' = ''Tahun'' THEN tahun
            ELSE NULL 
        END AS tahun,
        ROUND(SUM(CAST(luas_ha AS DECIMAL)), 2) AS total_luas_ha,
        ROUND(SUM(CAST(jumlah_pokok_awal_tanam AS DECIMAL)), 2) AS total_jumlah_pokok_awal,
        ROUND(SUM(CAST(jumlah_pokok_sekarang AS DECIMAL)), 2) AS total_jumlah_pokok_sekarang,
        ROUND(AVG(CAST(tinggi_tanaman_cm AS DECIMAL)), 2) AS rata_rata_tinggi_tanaman,
        ROUND(AVG(CAST(jumlah_pelepah_bh AS DECIMAL)), 2) AS rata_rata_jumlah_pelepah,
        ROUND(AVG(CAST(panjang_rachis_cm AS DECIMAL)), 2) AS rata_rata_panjang_rachis,
        ROUND(AVG(CAST(lebar_petiola_cm AS DECIMAL)), 2) AS rata_rata_lebar_petiola,
        ROUND(AVG(CAST(tebal_petiola_cm AS DECIMAL)), 2) AS rata_rata_tebal_petiola,
        ROUND(AVG(CAST(jad_1_sisi AS DECIMAL)), 2) AS rata_rata_jad_1_sisi,
        ROUND(AVG(CAST(rerata_panjang_anak_daun AS DECIMAL)), 2) AS rata_rata_panjang_anak_daun,
        ROUND(AVG(CAST(rerata_lebar_anak_daun AS DECIMAL)), 2) AS rata_rata_lebar_anak_daun,
        ROUND(AVG(CAST(lingkar_batang_cm AS DECIMAL)), 2) AS rata_rata_lingkar_batang,
        ''', input_filtered_by, ''' AS filtered_by
    FROM vegetatif
    WHERE 1=1');

    -- Add WHERE conditions based on input parameters
    IF input_regional IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND LOWER(regional) LIKE LOWER(''%', input_regional, '%'')');
    END IF;
    IF input_kebun IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND LOWER(kebun) LIKE LOWER(''%', input_kebun, '%'')');
    END IF;
    IF input_afdeling IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND LOWER(afdeling) LIKE LOWER(''%', input_afdeling, '%'')');
    END IF;
    IF input_blok IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND LOWER(blok) LIKE LOWER(''%', input_blok, '%'')');
    END IF;
    IF input_bulan IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND LOWER(bulan) LIKE LOWER(''%', input_bulan, '%'')');
    END IF;
    IF input_tahun IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND LOWER(tahun) LIKE LOWER(''%', input_tahun, '%'')');
    END IF;

    -- Add GROUP BY clause based on the filter
    SET @sql = CONCAT(@sql, '
    GROUP BY 
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Regional'', ''Kebun'', ''Afdeling'', ''Blok'', ''Bulan'', ''Tahun'') THEN regional
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Kebun'', ''Afdeling'', ''Blok'', ''Bulan'', ''Tahun'') THEN kebun
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Afdeling'', ''Blok'', ''Bulan'', ''Tahun'') THEN afdeling
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Blok'', ''Bulan'', ''Tahun'') THEN blok
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' = ''Bulan'' THEN bulan
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' = ''Tahun'' THEN tahun
            ELSE NULL 
        END
    ORDER BY 
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Regional'', ''Kebun'', ''Afdeling'', ''Blok'', ''Bulan'', ''Tahun'') THEN regional
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Kebun'', ''Afdeling'', ''Blok'', ''Bulan'', ''Tahun'') THEN kebun
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Afdeling'', ''Blok'', ''Bulan'', ''Tahun'') THEN afdeling
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' IN (''Blok'', ''Bulan'', ''Tahun'') THEN blok
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' = ''Bulan'' THEN bulan
            ELSE NULL 
        END,
        CASE 
            WHEN ''', input_filtered_by, ''' = ''Tahun'' THEN tahun
            ELSE NULL 
        END');

    -- Prepare and execute the dynamic SQL
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$
DELIMITER ;