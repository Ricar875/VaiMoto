create table corridas (
  id uuid primary key default gen_random_uuid(),
  passageiro_nome text,
  origem_lat double precision,
  origem_lng double precision,
  destino_lat double precision,
  destino_lng double precision,
  status text default 'pendente', -- pendente | aceita | em_andamento | concluida | cancelada
  motorista_id uuid,
  motorista_nome text,
  motorista_lat double precision,
  motorista_lng double precision,
  created_at timestamp with time zone default now()
);

alter table corridas enable row level security;

create policy "leitura publica" on corridas for select using (true);
create policy "insercao publica" on corridas for insert with check (true);
create policy "atualizacao publica" on corridas for update using (true);
