import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cooldown em memória: impede spam da rota de keep-alive por curiosos ou bots (mínimo 5 minutos de intervalo)
let lastExecutionTime = 0;
const COOLDOWN_MS = 5 * 60 * 1000;

export async function GET() {
  const now = Date.now();
  if (now - lastExecutionTime < COOLDOWN_MS) {
    const waitSeconds = Math.ceil((COOLDOWN_MS - (now - lastExecutionTime)) / 1000);
    return NextResponse.json(
      {
        success: true,
        message: `Ping recente já executado. Cooldown ativo por mais ${waitSeconds}s.`,
        cached: true,
      },
      { status: 200 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { success: false, error: "Supabase credentials missing" },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(url, key);

    // 1. Gera um hash aleatório e insere no banco
    const randomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const { error: insertError } = await supabase
      .from("keep_alive_log")
      .insert({
        random_hash: randomHash,
        source: "keep-alive-ping",
      });

    if (insertError) {
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    lastExecutionTime = Date.now();

    return NextResponse.json({
      success: true,
      message: "Database pinged successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
