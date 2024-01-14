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

insert into storage.buckets
  (id, name )
values
  ('cover', 'cover' );
