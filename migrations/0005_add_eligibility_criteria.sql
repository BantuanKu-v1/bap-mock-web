alter table jkm_programs
add column eligibility_criteria text
check (
    eligibility_criteria is null or json_valid(eligibility_criteria)
);

alter table jkm_programs
add column eligibility_version integer not null default 1
check (eligibility_version >= 1);
