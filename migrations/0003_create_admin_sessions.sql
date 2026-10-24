create table if not exists admin_sessions (
    id text primary key,
    token_hash text not null unique,
    created_at text not null default current_timestamp,
    expires_at text text not null
);

create index if not exists idx_admin_sessions_expires_at
on admin_sessions (expires_at);
