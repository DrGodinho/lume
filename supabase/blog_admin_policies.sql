drop policy if exists "Authenticated users can manage blog posts" on public.blog_posts;
create policy "Authenticated users can manage blog posts"
  on public.blog_posts
  for all
  to authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on table public.blog_posts to authenticated;
