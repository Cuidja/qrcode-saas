-- Migration 0000: DEPRECADA
--
-- Esta migration criava `keep_alive_log` com colunas (pinged_at, sem random_hash) que
-- conflitavam com a 0002 e quebravam o GitHub Action de keep-alive, dependendo da ordem
-- de execução. A definição única e idempotente da tabela agora vive em
-- `0002_keep_alive_trigger.sql`, que também repara instalações criadas por esta versão antiga.
--
-- Nada a executar aqui.
SELECT 'Migration 0000 deprecada — use 0002_keep_alive_trigger.sql' AS status;
