create table authors (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table mangas (
  id serial primary key,
  title text not null,
  cover text not null,
  created_at timestamptz not null default now()
);

create table mangas_authors (
  author integer not null references authors(id),
  manga integer not null references mangas(id)
);

create table tags (
  id serial primary key,
  title text not null,
  created_at timestamptz not null default now()
);

create table mangas_tags (
  manga integer not null references mangas(id),
  tag integer not null references tags(id)
);

create table pages (
  id uuid primary key default uuid_generate_v4(),
  manga integer not null references mangas(id),
  page integer not null,
  image text not null,
  created_at timestamptz not null default now()
);

insert into storage.buckets
  (id, name, public )
values
  ('covers', 'covers', true );

insert into storage.buckets
  (id, name, public)
values
  ('pages', 'pages', true);
