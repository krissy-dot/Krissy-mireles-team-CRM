import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    logger.warn("ghl webhook: non-JSON body received");
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  logger.info("ghl webhook received", {
    payload,
  });

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok", route: "/api/ghl/webhook" });
}
