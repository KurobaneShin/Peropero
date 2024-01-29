insert into storage.buckets
  (id, name, public)
values
  ('avatars', 'avatars', true);

create policy "upload_profiles"
on storage.objects for insert to authenticated with check (
    -- restrict bucket
    bucket_id = 'avatars'
);

ALTER TABLE profiles
  ADD COLUMN avatar text;
