-- BWE
insert into jkm_programs (
    id,
    code,
    name,
    agency,
    category,
    description,
    assistance_type,
    assistance_min_amount,
    assistance_max_amount,
    assistance_frequency,
    assistance_description,
    application_method,
    official_url,
    is_active,
    last_reviewed_at
)
values (
    'jkm-program-bwe',
    'BWE',
    'Bantuan Warga Emas',
    'JKM',
    'Elderly Assistance',
    'Monthly financial assistance for eligible Malaysian senior citizens aged 60 and above, subject to income, residence, living arrangement and JKM assessment requirements.',
    'monthly',
    600,
    600,
    'monthly',
    'RM600 per month per eligible recipient.',
    'Online through eBantuanJKM or physical submission at the relevant JKM office.',
    'https://ebantuanjkm.jkm.gov.my/spbk/login.jsp',
    1,
    '2026-09-14'
);

-- BA
insert into jkm_programs (
    id,
    code,
    name,
    agency,
    category,
    description,
    assistance_type,
    assistance_min_amount,
    assistance_max_amount,
    assistance_frequency,
    assistance_description,
    application_method,
    official_url,
    is_active,
    last_reviewed_at
)
values (
    'jkm-program-ba',
    'BA',
    'Bantuan Am Persekutuan',
    'JKM',
    'General Welfare Assistance',
    'Monthly financial assistance for eligible Malaysian citizens residing in Federal Territories who are in need and are not covered under other JKM monthly assistance schemes.',
    'monthly',
    150,
    500,
    'monthly',
    'RM150 to RM500 per month per eligible family, subject to JKM assessment.',
    'Online through eBantuanJKM or physical submission at the relevant JKM office.',
    'https://ebantuanjkm.jkm.gov.my/spbk/login.jsp',
    1,
    '2026-09-15'
);

-- BAT
insert into jkm_programs (
    id,
    code,
    name,
    agency,
    category,
    description,
    assistance_type,
    assistance_min_amount,
    assistance_max_amount,
    assistance_frequency,
    assistance_description,
    application_method,
    official_url,
    is_active,
    last_reviewed_at
)
values (
    'jkm-program-bat',
    'BAT',
    'Bantuan Alat Sokong / Alat Tiruan',
    'JKM',
    'Financial Assistance',
    'One-off financial assistance for eligible individuals requiring prosthetic or assistive equipment, subject to applicable income requirements, recommendations and approval.',
    'one_off',
    null,
    20000,
    'one_off',
    'Based on the approved cost of prosthetic or assistive equipment. Assistance up to RM10,000 follows the applicable approval process; amounts above RM10,000 and up to RM20,000 require higher-level approval.',
    'Online through eBantuanJKM or physical submission at the relevant JKM office.',
    'https://ebantuanjkm.jkm.gov.my/spbk/login.jsp',
    1,
    '2026-09-15'
);

-- BPT
insert into jkm_programs (
    id,
    code,
    name,
    agency,
    category,
    description,
    assistance_type,
    assistance_min_amount,
    assistance_max_amount,
    assistance_frequency,
    assistance_description,
    application_method,
    official_url,
    is_active,
    last_reviewed_at
)
values (
    'jkm-program-bpt',
    'BPT',
    'Bantuan Penjagaan OKU Terlantar / Pesakit Kronik Terlantar',
    'JKM',
    'Care / Financial Assistance',
    'Monthly financial assistance for eligible caregivers of bedridden persons with disabilities or chronic patients, and eligible patients under applicable circumstances.',
    'monthly',
    500,
    500,
    'monthly',
    'RM500 per month per eligible recipient, subject to the applicable BPT category and JKM assessment.',
    'Online through eBantuanJKM or physical submission at the relevant JKM office.',
    'https://ebantuanjkm.jkm.gov.my/spbk/login.jsp',
    1,
    '2026-09-15'
);
