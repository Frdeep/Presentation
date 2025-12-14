import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/db";

export const runtime = "nodejs";

const CheckoutSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  phone: z.string().min(5).optional(),
  addressLine1: z.string().min(4),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().min(2).default("FR"),
  items: z
    .array(
      z.object({
        variantId: z.string().min(3),
        quantity: z.number().int().min(1).max(9),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = CheckoutSchema.parse(json);

    const res = createOrder({
      email: input.email,
      fullName: input.fullName,
      phone: input.phone,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      postalCode: input.postalCode,
      country: input.country,
      items: input.items,
    });

    return NextResponse.json({ ok: true, ...res });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    const status =
      message === "OUT_OF_STOCK" || message === "VARIANT_NOT_FOUND"
        ? 409
        : 400;
    return NextResponse.json(
      { ok: false, error: message },
      {
        status,
      }
    );
  }
}
