-- Migration 0003: Segurança (RLS por dono) + RPCs para o redirect público
--
-- O QUE FAZ
--   1. Adiciona codes.owner_id (padrão auth.uid()) e passa a isolar os QR Codes por usuário.
--   2. Remove as policies públicas de SELECT/INSERT/UPDATE em codes e INSERT em scans.
--   3. O redirect público (/r/[slug]) passa a usar apenas duas funções SECURITY DEFINER:
--        resolve_code(slug)  -> id, target_url, active
--        record_scan(...)    -> incrementa contador e grava o scan (nunca expõe a tabela)
--   4. Restringe colunas graváveis (scans_count e owner_id não podem ser forjados pelo cliente).
--   5. Habilita RLS em organizations.
--   6. Adiciona CHECKs (NOT VALID, não quebram linhas antigas) para URL http(s) e formato do slug.
--
-- ⚠️ ANTES DE RODAR (se já existem QR Codes em produção):
--   Linhas antigas ficam com owner_id NULL e deixam de aparecer no dashboard (o redirect continua
--   funcionando). Atribua-as ao seu usuário depois de rodar esta migration:
--       UPDATE codes SET owner_id = '<SEU-USER-UUID>' WHERE owner_id IS NULL;
--   (UUID em Supabase → Authentication → Users.)
--
-- ⚠️ ORDEM DE DEPLOY: rode esta migration ANTES de publicar a versão do app que usa
--   resolve_code/record_scan; caso contrário o redirect responderá 502.

-- 1. Dono dos QR Codes ------------------------------------------------------------------------
ALTER TABLE codes
  ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS idx_codes_owner_id ON codes(owner_id);

-- 2. Policies antigas (abertas) ----------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read for redirect route" ON codes;
DROP POLICY IF EXISTS "Allow public insert for scans" ON scans;
DROP POLICY IF EXISTS "Allow public update for scan count" ON codes;
DROP POLICY IF EXISTS "Allow public insert/upsert for codes" ON codes;

DROP POLICY IF EXISTS codes_select_own ON codes;
DROP POLICY IF EXISTS codes_insert_own ON codes;
DROP POLICY IF EXISTS codes_update_own ON codes;
DROP POLICY IF EXISTS codes_delete_own ON codes;
DROP POLICY IF EXISTS scans_select_own ON scans;
DROP POLICY IF EXISTS organizations_all_own ON organizations;

ALTER TABLE codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY codes_select_own ON codes
  FOR SELECT TO authenticated USING (owner_id = auth.uid());

CREATE POLICY codes_insert_own ON codes
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());

CREATE POLICY codes_update_own ON codes
  FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE POLICY codes_delete_own ON codes
  FOR DELETE TO authenticated USING (owner_id = auth.uid());

CREATE POLICY scans_select_own ON scans
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM codes c WHERE c.id = scans.code_id AND c.owner_id = auth.uid()));

CREATE POLICY organizations_all_own ON organizations
  FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- 3. Privilégios por coluna ---------------------------------------------------------------------
REVOKE ALL ON codes FROM anon, authenticated;
REVOKE ALL ON scans FROM anon, authenticated;
REVOKE ALL ON organizations FROM anon;

GRANT SELECT, DELETE ON codes TO authenticated;
GRANT INSERT (slug, target_url, label, type, active, color, bg_color, icon, shape, corner_style, cta_frame, cta_text, org_id)
  ON codes TO authenticated;
GRANT UPDATE (slug, target_url, label, type, active, color, bg_color, icon, shape, corner_style, cta_frame, cta_text, org_id, updated_at)
  ON codes TO authenticated;
GRANT SELECT ON scans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON organizations TO authenticated;

-- 4. Constraints (NOT VALID: valem para novas linhas, não reprovam dados legados) ----------------
ALTER TABLE codes DROP CONSTRAINT IF EXISTS codes_target_url_http;
ALTER TABLE codes ADD CONSTRAINT codes_target_url_http
  CHECK (target_url ~* '^https?://[^[:space:]]+$' AND char_length(target_url) <= 2048) NOT VALID;

ALTER TABLE codes DROP CONSTRAINT IF EXISTS codes_slug_format;
ALTER TABLE codes ADD CONSTRAINT codes_slug_format
  CHECK (slug ~ '^[A-Za-z0-9_-]{3,64}$') NOT VALID;

-- 5. Funções do redirect público ----------------------------------------------------------------
-- Substitui o RPC antigo, que aceitava qualquer id vindo do cliente.
REVOKE ALL ON FUNCTION increment_scan_count(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION resolve_code(p_slug text)
RETURNS TABLE (id uuid, target_url text, active boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.target_url, c.active
  FROM codes c
  WHERE c.slug = p_slug
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION record_scan(p_slug text, p_user_agent text, p_ip text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_id uuid;
BEGIN
  SELECT c.id INTO v_id FROM codes c WHERE c.slug = p_slug AND c.active LIMIT 1;
  IF v_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE codes SET scans_count = COALESCE(scans_count, 0) + 1 WHERE id = v_id;

  INSERT INTO scans (code_id, user_agent, ip_address)
  VALUES (v_id, NULLIF(left(p_user_agent, 512), ''), NULLIF(left(p_ip, 64), ''));
END;
$$;

REVOKE ALL ON FUNCTION resolve_code(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION record_scan(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION resolve_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION record_scan(text, text, text) TO anon, authenticated;

SELECT 'Migration 0003 aplicada: RLS por dono + RPCs do redirect ✅' AS status;
