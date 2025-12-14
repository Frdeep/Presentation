import { NextResponse } from "next/server";
import { listProducts } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const products = listProducts();
  return NextResponse.json({ products });
}
