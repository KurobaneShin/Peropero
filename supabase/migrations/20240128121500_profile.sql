insert into storage.buckets
  (id, name, public)
values
  ('profiles', 'profiles', true);

create policy "upload_profiles"
on storage.objects for insert to authenticated with check (
    -- restrict bucket
    bucket_id = 'profiles'
);
