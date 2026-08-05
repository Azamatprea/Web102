-- SQL schema for CampusConnect project

-- Create Posts Table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text,
  image_url text,
  upvotes integer default 0,
  author text default 'Anonymous',
  category text default 'General',
  repost_of uuid references posts(id) on delete set null
);

-- Create Comments Table
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  post_id uuid references posts(id) on delete cascade not null,
  text text not null,
  author text default 'Anonymous'
);

-- Create Chat Messages Table
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender text not null,
  message text not null
);

-- Migrations for databases created before author/category/repost_of existed.
-- Safe to re-run.
alter table posts add column if not exists author text default 'Anonymous';
alter table posts add column if not exists category text default 'General';
alter table posts add column if not exists repost_of uuid references posts(id) on delete set null;
alter table comments add column if not exists author text default 'Anonymous';

-- Note: Ensure RLS (Row Level Security) is either disabled for testing, or set up appropriate policies for open access.
-- To allow all access (not for production):
-- alter table posts disable row level security;
-- alter table comments disable row level security;
-- alter table chat_messages disable row level security;
