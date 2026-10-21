interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// Armazenamento em memória com limpeza automática de registros expirados
const ipCache = new Map<string, RateLimitRecord>();

/**
 * Limitador de taxa (Rate Limiter) em memória com janela deslizante por IP.
 * - Protege rotas críticas contra ataques de força bruta, scraping e sobrecarga (DoS).
 * - Não requer dependências externas (como Redis) para proteção rápida na camada de aplicação.
 * 
 * @param ip Endereço IP do cliente
 * @param limit Quantidade máxima de requisições na janela (ex: 60)
 * @param windowMs Duração da janela em milissegundos (ex: 60_000 para 1 minuto)
 */
export function checkRateLimit(
  ip: string,
  limit = 60,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  const record = ipCache.get(ip);

  // Limpeza esporádica do cache para evitar vazamento de memória
  if (ipCache.size > 10_000) {
    for (const [key, val] of ipCache.entries()) {
      if (now > val.resetAt) {
        ipCache.delete(key);
      }
    }
  }

  if (!record || now > record.resetAt) {
    ipCache.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    const resetSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  record.count += 1;
  const resetSeconds = Math.ceil((record.resetAt - now) / 1000);
  return {
    allowed: true,
    remaining: limit - record.count,
    resetSeconds,
  };
}
