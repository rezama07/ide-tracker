create table entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  mood varchar(255),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan Row Level Security (RLS)
alter table entries enable row level security;

-- Policy agar user hanya bisa melihat data miliknya sendiri
create policy "Users can only access their own entries"
  on entries for all
  using (auth.uid() = user_id);
