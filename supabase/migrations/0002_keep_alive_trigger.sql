-- Migration 0002: Gatilho e Tabela de Keep-Alive
-- Copie e cole este código no Supabase SQL Editor

-- 1. Criar extensões
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tabela para registrar os pings automáticos de keep-alive
CREATE TABLE IF NOT EXISTS keep_alive_log (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  random_hash  text NOT NULL,
  source       text NOT NULL DEFAULT 'cron-trigger',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- 3. Limpeza automática: Manter apenas os últimos 20 registros
CREATE OR REPLACE FUNCTION trim_keep_alive_log()
RETURNS trigger AS '
BEGIN
  DELETE FROM keep_alive_log
  WHERE id NOT IN (
    SELECT id FROM keep_alive_log
    ORDER BY created_at DESC
    LIMIT 20
  );
  RETURN NEW;
END;
' LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trim_keep_alive_log_trigger ON keep_alive_log;
CREATE TRIGGER trim_keep_alive_log_trigger
  AFTER INSERT ON keep_alive_log
  FOR EACH ROW EXECUTE FUNCTION trim_keep_alive_log();

-- 4. Função que insere um hash aleatório seguro
CREATE OR REPLACE FUNCTION trigger_keep_alive_ping()
RETURNS void AS '
DECLARE
  v_random_hash text;
BEGIN
  v_random_hash := md5(random()::text || clock_timestamp()::text);
  INSERT INTO keep_alive_log (random_hash, source, created_at)
  VALUES (v_random_hash, ''supabase-ping'', now());
END;
' LANGUAGE plpgsql;

-- 5. Habilitar RLS e permitir gravações
ALTER TABLE keep_alive_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow public insert keep alive" ON keep_alive_log;
CREATE POLICY "allow public insert keep alive" ON keep_alive_log FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "allow public select keep alive" ON keep_alive_log;
CREATE POLICY "allow public select keep alive" ON keep_alive_log FOR SELECT USING (true);

-- 6. Executar o primeiro disparo de teste para gravar 1 hash aleatório inicial
SELECT trigger_keep_alive_ping();

-- 7. Confirmar
SELECT 'Keep alive configurado e testado com sucesso! ✅' AS status;
