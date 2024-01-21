create table groups (
  id serial primary key,
  title text not null,
  created_at timestamptz not null default now()
);

create table mangas_groups (
  manga integer not null references mangas(id),
  groupId integer not null references groups(id)
);

create table parodies (
  id serial primary key,
  title text not null,
  created_at timestamptz not null default now()
);

create table mangas_parodies (
  manga integer not null references mangas(id),
  parody integer not null references parodies(id)
);

create table languages (
  id serial primary key,
  title text not null,
  created_at timestamptz not null default now()
);

create table mangas_languages (
  manga integer not null references mangas(id),
  language integer not null references parodies(id)
);

create table characters (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table mangas_characters (
  manga integer not null references mangas(id),
  characterId integer not null references characters(id)
);

create table profiles (
  username text not null unique,
  id uuid primary key not null unique references auth.users on delete cascade,
  email text not null
);

create table favorites (
  id serial primary key,
  manga integer not null references mangas(id),
  profile uuid not null references profiles(id)
);

create policy "upload_pages"
on storage.objects for insert to authenticated with check (
    -- restrict bucket
    bucket_id = 'pages'
);

create policy "upload_covers"
on storage.objects for insert to authenticated with check (
    -- restrict bucket
    bucket_id = 'covers'
);
