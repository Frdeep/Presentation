import { NextResponse } from "next/server";
import { z } from "zod";
import { adjustStock, getDb } from "@/lib/db";

export const runtime = "nodejs";

function requireAdmin(req: Request) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-key");
  return Boolean(provided && provided === expected);
}

const PatchSchema = z.object({
  variantId: z.string().min(3),
  stock: z.number().int().min(0).max(9999),
});

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const db = getDb();
  const variants = db
    .prepare(
      "SELECT id, product_id as productId, size, sku, price_cents as priceCents, currency, stock FROM product_variants ORDER BY product_id, size"
    )
    .all();

  return NextResponse.json({ ok: true, variants });
}

export async function PATCH(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const input = PatchSchema.parse(json);
    adjustStock(input.variantId, input.stock);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
