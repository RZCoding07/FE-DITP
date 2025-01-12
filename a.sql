BEGIN
    DECLARE sql_query TEXT;

    -- Initialize the base query
    SET sql_query = CONCAT(
        'SELECT 
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
            tahun_tanam,
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
            ROUND(SUM(CAST(cal_jumlah_pelepah AS DECIMAL)), 2) AS total_cal_jumlah_pelepah, // cal ini perkalian antara jumlah pelepah dan jumlah pokok sekarang
            ROUND(SUM(CAST(cal_lingkar_batang AS DECIMAL)), 2) AS total_cal_lingkar_batang, // cal ini perkalian antara lingkar batang dan jumlah pokok sekarang
            ROUND(SUM(CAST(cal_tinggi_tanaman AS DECIMAL)), 2) AS total_cal_tinggi_tanaman, // cal ini perkalian antara tinggi tanaman dan jumlah pokok sekarang
            ''', input_filtered_by, ''' AS filtered_by
        FROM vw_vegetatif
        WHERE 1=1'
    );

    -- Si Paling Dinamis
    IF input_regional IS NOT NULL THEN
        SET sql_query = CONCAT(sql_query, ' AND LOWER(regional) LIKE LOWER(\'%', input_regional, '%\')');
    END IF;
    IF input_kebun IS NOT NULL THEN
        SET sql_query = CONCAT(sql_query, ' AND LOWER(kebun) LIKE LOWER(\'%', input_kebun, '%\')');
    END IF;
    IF input_afdeling IS NOT NULL THEN
        SET sql_query = CONCAT(sql_query, ' AND LOWER(afdeling) LIKE LOWER(\'%', input_afdeling, '%\')');
    END IF;
    IF input_blok IS NOT NULL THEN
        SET sql_query = CONCAT(sql_query, ' AND LOWER(blok) LIKE LOWER(\'%', input_blok, '%\')');
    END IF;
    IF input_bulan IS NOT NULL THEN
        SET sql_query = CONCAT(sql_query, ' AND LOWER(bulan) LIKE LOWER(\'%', input_bulan, '%\')');
    END IF;
    IF input_tahun IS NOT NULL THEN
        SET sql_query = CONCAT(sql_query, ' AND LOWER(tahun) LIKE LOWER(\'%', input_tahun, '%\')');
    END IF;
    IF input_tahun_tanam IS NOT NULL THEN
        SET sql_query = CONCAT(sql_query, ' AND tahun_tanam = ', input_tahun_tanam);
    END IF;

    -- Add GROUP BY clause
    SET sql_query = CONCAT(sql_query, '
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
            END,
            tahun_tanam
    ');

    -- Add ORDER BY clause
    SET sql_query = CONCAT(sql_query, '
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
            END,
            tahun_tanam
    ');

    -- Prepare and execute the dynamic query
    PREPARE stmt FROM sql_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END