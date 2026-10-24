pragma foreign_keys = on;

create table if not exists jkm_programs (
    id text primary key,
    code text not null unique,
    name text not null,
    agency text not null default 'JKM',
    category text not null,
    description text,
    assistance_type text,
    assistance_min_amount real,
    assistance_max_amount real,
    assistance_frequency text,
    assistance_description text,
    application_method text,
    official_url text,
    is_active integer not null default 1 check (is_active in (0, 1)),
    last_reviewed_at text,
    created_at text not null default current_timestamp,
    updated_at text not null default current_timestamp,

    check (assistance_min_amount is null or assistance_min_amount >= 0),
    check (assistance_max_amount is null or assistance_max_amount >= 0),
    check (
        assistance_min_amount is null
        or assistance_max_amount is null
        or assistance_min_amount <= assistance_max_amount
    )
);

create table if not exists jkm_applications (
    id text primary key,
    program_id text not null,
    external_reference text not null,
    source_system text not null,
    applicant_name text not null,
    applicant_identification_no text,
    application_data text not null default '{}' check (json_valid(application_data)),
    status text not null default 'submitted'
        check (
            status in (
                'submitted',
                'under_review',
                'additional_information_required',
                'approved',
                'rejected',
                'cancelled'
            )
        ),
    submitted_at text not null default current_timestamp,
    updated_at text not null default current_timestamp,

    foreign key (program_id) references jkm_programs(id),
    unique (source_system, external_reference)
);

create table if not exists jkm_application_status_history (
    id text primary key,
    application_id text not null,
    previous_status text,
    new_status text not null,
    changed_by text,
    remarks text,
    changed_at text not null default current_timestamp,

    foreign key (application_id) references jkm_applications(id) on delete cascade
);

create index if not exists idx_jkm_applications_program
on jkm_applications(program_id);

create index if not exists idx_jkm_applications_status
on jkm_applications(status);

create index if not exists idx_jkm_applications_source
on jkm_applications(source_system);

create index if not exists idx_jkm_status_history_application
on jkm_application_status_history(application_id);
