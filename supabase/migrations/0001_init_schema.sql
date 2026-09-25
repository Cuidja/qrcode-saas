-- Migration 0001: Schema completo para o SaaS de QR Codes Dinâmicos
-- Copie e cole no Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Organizações / Empresas
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- 3. Tabela Principal de QR Codes Dinâmicos
CREATE TABLE IF NOT EXISTS codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  target_url text NOT NULL,
  label text NOT NULL,
  type text NOT NULL DEFAULT 'website',
  active boolean NOT NULL DEFAULT true,
  color text DEFAULT '#0f172a',
  bg_color text DEFAULT '#ffffff',
  icon text DEFAULT 'none',
  shape text DEFAULT 'square',
  corner_style text DEFAULT 'square',
  cta_frame text DEFAULT 'bottom_banner',
  cta_text text DEFAULT 'SCAN ME',
  scans_count bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Tabela de Registros de Scans (Analytics)
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid REFERENCES codes(id) ON DELETE CASCADE,
  scanned_at timestamptz DEFAULT now(),
  user_agent text,
  ip_address text,
  country text,
  city text
);

-- 5. Índices de alta performance
CREATE INDEX IF NOT EXISTS idx_codes_slug ON codes(slug);
CREATE INDEX IF NOT EXISTS idx_scans_code_id ON scans(code_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON scans(scanned_at);

-- 6. Função RPC atômica para contagem de escaneamentos
CREATE OR REPLACE FUNCTION increment_scan_count(code_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE codes
  SET scans_count = COALESCE(scans_count, 0) + 1,
      updated_at = now()
  WHERE id = code_id;
END;
$$;

-- 7. Habilitar RLS (Row Level Security) e liberar acesso para a API pública de redirecionamento
ALTER TABLE codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for redirect route" ON codes FOR SELECT USING (true);
CREATE POLICY "Allow public insert for scans" ON scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for scan count" ON codes FOR UPDATE USING (true);
CREATE POLICY "Allow public insert/upsert for codes" ON codes FOR INSERT WITH CHECK (true);
