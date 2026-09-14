begin;

alter table public.products
  add column images text[];

update public.products
set images = case
  when nullif(btrim(image), '') is null then array[]::text[]
  else array[image]::text[]
end
where images is null;

alter table public.products
  alter column images set default array[]::text[],
  alter column images set not null,
  add constraint products_images_max_three
    check (cardinality(images) <= 3);

commit;
