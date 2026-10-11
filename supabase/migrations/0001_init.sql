-- Erweiterung für Vektor-Suche (falls noch nicht aktiviert)
create extension if not exists vector with schema extensions;

-- Notebook: Projekt, das mehrere Quellen enthält
create table notebooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz not null default now()
);

-- Quelle: hochgeladene Datei oder eingefügter Text eines Notebooks
create table sources (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references notebooks (id) on delete cascade,
  name text not null,
  type text not null check (type in ('pdf', 'text')),
  storage_path text,
  status text not null default 'pending' check (status in ('pending', 'processed', 'error')),
  error_message text,
  selected boolean not null default true,
  created_at timestamptz not null default now()
);

create index sources_notebook_id_idx on sources (notebook_id);

-- Chunk: Textstück einer Quelle mit Embedding (text-embedding-3-small = 1536 Dimensionen)
create table chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources (id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  page integer,
  embedding extensions.vector(1536) not null
);

create index chunks_source_id_idx on chunks (source_id);

-- Ähnlichkeitssuche über Cosine-Distanz
create index chunks_embedding_idx on chunks using hnsw (embedding extensions.vector_cosine_ops);

-- Zugriff nur serverseitig über den Secret-Key: RLS an, keine Policies
alter table notebooks enable row level security;
alter table sources enable row level security;
alter table chunks enable row level security;
