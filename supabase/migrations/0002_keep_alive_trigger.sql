-- Migration 0002: Tabela, trigger e função de Keep-Alive (definição única e idempotente)
-- Pode ser executada em bancos novos OU em bancos onde a antiga 0000 já criou a tabela.

-- 1. Tabela (formato canônico) ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS keep_alive_log (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  random_hash  text NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text),
  source       text NOT NULL DEFAULT 'cron-trigger',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Reparo para instalações criadas pela 0000 antiga (que tinha pinged_at e não tinha random_hash)
ALTER TABLE keep_alive_log
  ADD COLUMN IF NOT EXISTS random_hash text NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text);
ALTER TABLE keep_alive_log
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- 2. Limpeza: manter apenas os últimos 20 registros --------------------------------------------
-- SECURITY DEFINER: o ping chega com a chave anon, que não tem (nem deve ter) policy de SELECT/DELETE.
-- Statement-level: uma limpeza por INSERT, não uma por linha.
CREATE OR REPLACE FUNCTION trim_keep_alive_log()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM keep_alive_log
  WHERE id NOT IN (
    SELECT id FROM keep_alive_log
    ORDER BY id DESC
    LIMIT 20
  );
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trim_keep_alive_log_trigger ON keep_alive_log;
CREATE TRIGGER trim_keep_alive_log_trigger
  AFTER INSERT ON keep_alive_log
  FOR EACH STATEMENT EXECUTE FUNCTION trim_keep_alive_log();

-- 3. Função de ping manual ----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_keep_alive_ping()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO keep_alive_log (random_hash, source)
  VALUES (md5(random()::text || clock_timestamp()::text), 'supabase-ping');
END;
$$;

REVOKE ALL ON FUNCTION trigger_keep_alive_ping() FROM PUBLIC, anon, authenticated;

-- 4. RLS: o Action só precisa INSERIR. Leitura pública removida (não há motivo para expor). -------
ALTER TABLE keep_alive_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow public insert" ON keep_alive_log;
DROP POLICY IF EXISTS "allow public select" ON keep_alive_log;
DROP POLICY IF EXISTS "allow public select keep alive" ON keep_alive_log;
DROP POLICY IF EXISTS "allow public insert keep alive" ON keep_alive_log;

CREATE POLICY "allow public insert keep alive" ON keep_alive_log
  FOR INSERT TO anon, authenticated WITH CHECK (true);

REVOKE ALL ON keep_alive_log FROM anon, authenticated;
GRANT INSERT (random_hash, source) ON keep_alive_log TO anon, authenticated;

-- 5. Primeiro disparo de teste ---------------------------------------------------------------------
SELECT trigger_keep_alive_ping();

SELECT 'Keep alive configurado e testado com sucesso! ✅' AS status;
