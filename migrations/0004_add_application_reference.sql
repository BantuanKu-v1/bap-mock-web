alter table jkm_applications
add column reference_no text;

create unique index if not exists idx_jkm_applications_reference_no
on jkm_applications(reference_no);
