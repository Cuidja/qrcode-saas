-- Migration: Gatilho e Tabela para evitar pausa no Supabase Free Tier (Pausa em 7 dias sem atividade)
-- Executar em: Supabase Dashboard → SQL Editor

-- 1. Criar extensão pg_cron (se disponível)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tabela para registrar os inserts automáticos seguros de keep-alive
CREATE TABLE IF NOT EXISTS keep_alive_log (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  random_hash  text NOT NULL,
  source       text NOT NULL DEFAULT 'cron-trigger',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- 3. Limpeza automática: Manter apenas os últimos 20 registros para não lotar o banco
CREATE OR REPLACE FUNCTION trim_keep_alive_log()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM keep_alive_log
  WHERE id NOT IN (
    SELECT id FROM keep_alive_log
    ORDER BY created_at DESC
    LIMIT 20
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trim_keep_alive_log_trigger ON keep_alive_log;
CREATE TRIGGER trim_keep_alive_log_trigger
  AFTER INSERT ON keep_alive_log
  FOR EACH ROW EXECUTE FUNCTION trim_keep_alive_log();

-- 4. Função que insere um hash aleatório e seguro
CREATE OR REPLACE FUNCTION trigger_keep_alive_ping()
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_random_hash text;
BEGIN
  -- Gera hash MD5 aleatório seguro
  v_random_hash := md5(random()::text || clock_timestamp()::text);
  
  INSERT INTO keep_alive_log (random_hash, source, created_at)
  VALUES (v_random_hash, 'supabase-cron', now());
END;
$$;

-- 5. Configurar o agendamento interno pg_cron para rodar a CADA 5 DIAS às 03:00 AM UTC
-- (Garante que nunca chegue ao limite de 7 dias de inatividade do plano Free)
SELECT cron.unschedule('supabase-keep-alive-job') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'supabase-keep-alive-job');

SELECT cron.schedule(
  'supabase-keep-alive-job',
  '0 3 */5 * *', -- A cada 5 dias
  $$ SELECT trigger_keep_alive_ping(); $$
);

-- 6. Habilitar RLS e criar políticas de acesso
ALTER TABLE keep_alive_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow public insert keep alive" ON keep_alive_log;
CREATE POLICY "allow public insert keep alive" ON keep_alive_log FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "allow public select keep alive" ON keep_alive_log;
CREATE POLICY "allow public select keep alive" ON keep_alive_log FOR SELECT USING (true);

-- Teste imediato da função para inserir 1 dado inicial aleatório
SELECT trigger_keep_alive_ping();

-- Confirmar criação
SELECT 'Gatilho de Keep-Alive configurado com sucesso a cada 5/6 dias! ✅' AS status;
