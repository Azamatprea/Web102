-- SQL schema for HobbyHub project

-- Create Posts Table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text,
  image_url text,
  upvotes integer default 0
);

-- Create Comments Table
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  post_id uuid references posts(id) on delete cascade not null,
  text text not null
);

-- Create Chat Messages Table
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender text not null,
  message text not null
);

-- Note: Ensure RLS (Row Level Security) is either disabled for testing, or set up appropriate policies for open access.
-- To allow all access (not for production):
-- alter table posts disable row level security;
-- alter table comments disable row level security;
-- alter table chat_messages disable row level security;
