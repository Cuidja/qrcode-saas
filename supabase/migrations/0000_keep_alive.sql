-- Migration: tabela de keep-alive para evitar pausa no Supabase Free tier
-- Executar em: Supabase Dashboard → SQL Editor

-- Tabela leve para registrar os pings automáticos do GitHub Actions
CREATE TABLE IF NOT EXISTS keep_alive_log (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source    text NOT NULL DEFAULT 'github-actions',
  pinged_at timestamptz NOT NULL DEFAULT now()
);

-- Manter apenas os últimos 30 registros (limpeza automática via trigger)
CREATE OR REPLACE FUNCTION trim_keep_alive_log()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM keep_alive_log
  WHERE id NOT IN (
    SELECT id FROM keep_alive_log
    ORDER BY pinged_at DESC
    LIMIT 30
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trim_keep_alive_log_trigger
  AFTER INSERT ON keep_alive_log
  FOR EACH ROW EXECUTE FUNCTION trim_keep_alive_log();

-- RLS: habilitado, mas permitir INSERT e SELECT público
-- (o ping vem do GitHub Actions usando a anon key, sem sessão de usuário)
ALTER TABLE keep_alive_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow public insert"
  ON keep_alive_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow public select"
  ON keep_alive_log FOR SELECT
  USING (true);

-- Verificar se funcionou
SELECT 'Tabela keep_alive_log criada com sucesso ✅' AS status;
