import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

export type ProductVariant = {
  id: string;
  productId: string;
  size: string;
  sku: string;
  priceCents: number;
  currency: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  manufacturer: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  variants: ProductVariant[];
};

let dbSingleton: Database.Database | null = null;

function getDbFilePath() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  return path.join(dataDir, "club-mawon.sqlite");
}

export function getDb() {
  if (dbSingleton) return dbSingleton;

  const db = new Database(getDbFilePath());
  db.pragma("journal_mode = WAL");

  // Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      size TEXT NOT NULL,
      sku TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      currency TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      UNIQUE(product_id, size),
      UNIQUE(sku),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT,
      city TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT NOT NULL,
      status TEXT NOT NULL,
      total_cents INTEGER NOT NULL,
      currency TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      size TEXT NOT NULL,
      sku TEXT NOT NULL,
      unit_price_cents INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      line_total_cents INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(variant_id) REFERENCES product_variants(id)
    );
  `);

  seedIfNeeded(db);
  dbSingleton = db;
  return dbSingleton;
}

function seedIfNeeded(db: Database.Database) {
  const hasProducts = db
    .prepare("SELECT COUNT(*) as c FROM products")
    .get() as { c: number };
  if (hasProducts.c > 0) return;

  const now = new Date().toISOString();

  const productId = "prod_mawon_jersey_2025";
  db.prepare(
    "INSERT INTO products (id, name, manufacturer, description, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    productId,
    "Maillot Officiel Club Mawon",
    "Ghetball",
    "Le maillot officiel du Club Mawon, fabriqué par Ghetball. Coupe moderne, respirant, pensé pour le match et la ville.",
    "/maillot-mawon.svg",
    now
  );

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const insertVariant = db.prepare(
    "INSERT INTO product_variants (id, product_id, size, sku, price_cents, currency, stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );

  for (const size of sizes) {
    insertVariant.run(
      `var_${productId}_${size}`,
      productId,
      size,
      `MAWON-${size}-OFFICIAL`,
      5500,
      "EUR",
      25,
      now
    );
  }
}

export function listProducts(): Product[] {
  const db = getDb();
  const products = db
    .prepare(
      "SELECT id, name, manufacturer, description, image_url as imageUrl, created_at as createdAt FROM products ORDER BY created_at DESC"
    )
    .all() as Omit<Product, "variants">[];

  const variants = db
    .prepare(
      "SELECT id, product_id as productId, size, sku, price_cents as priceCents, currency, stock FROM product_variants"
    )
    .all() as ProductVariant[];

  const byProduct = new Map<string, ProductVariant[]>();
  for (const v of variants) {
    const arr = byProduct.get(v.productId) ?? [];
    arr.push(v);
    byProduct.set(v.productId, arr);
  }

  return products.map((p) => ({
    ...p,
    variants: (byProduct.get(p.id) ?? []).sort((a, b) => a.size.localeCompare(b.size)),
  }));
}

export function getVariant(variantId: string): ProductVariant | null {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT id, product_id as productId, size, sku, price_cents as priceCents, currency, stock FROM product_variants WHERE id = ?"
    )
    .get(variantId) as ProductVariant | undefined;
  return row ?? null;
}

export function adjustStock(variantId: string, newStock: number) {
  const db = getDb();
  db.prepare("UPDATE product_variants SET stock = ? WHERE id = ?").run(
    newStock,
    variantId
  );
}

export type CreateOrderInput = {
  email: string;
  fullName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  items: Array<{ variantId: string; quantity: number }>;
};

export function createOrder(input: CreateOrderInput): {
  orderId: string;
  totalCents: number;
  currency: string;
} {
  const db = getDb();

  const now = new Date().toISOString();
  const orderId = `ord_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;

  const getVariantStmt = db.prepare(
    "SELECT id, product_id as productId, size, sku, price_cents as priceCents, currency, stock FROM product_variants WHERE id = ?"
  );
  const decStockStmt = db.prepare(
    "UPDATE product_variants SET stock = stock - ? WHERE id = ? AND stock >= ?"
  );

  const orderItemsToInsert: Array<{
    id: string;
    variantId: string;
    size: string;
    sku: string;
    unitPriceCents: number;
    quantity: number;
    lineTotalCents: number;
  }> = [];

  let currency: string | null = null;
  let totalCents = 0;

  const tx = db.transaction(() => {
    for (const item of input.items) {
      const variant = getVariantStmt.get(item.variantId) as ProductVariant | undefined;
      if (!variant) throw new Error("VARIANT_NOT_FOUND");
      if (item.quantity <= 0) throw new Error("INVALID_QUANTITY");

      currency = currency ?? variant.currency;
      if (currency !== variant.currency) throw new Error("MIXED_CURRENCY");

      const lineTotal = variant.priceCents * item.quantity;
      totalCents += lineTotal;

      orderItemsToInsert.push({
        id: `oi_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`,
        variantId: variant.id,
        size: variant.size,
        sku: variant.sku,
        unitPriceCents: variant.priceCents,
        quantity: item.quantity,
        lineTotalCents: lineTotal,
      });
    }

    // Reserve stock
    for (const item of input.items) {
      const res = decStockStmt.run(item.quantity, item.variantId, item.quantity);
      if (res.changes !== 1) throw new Error("OUT_OF_STOCK");
    }

    db.prepare(
      `INSERT INTO orders (
          id, email, full_name, phone,
          address_line1, address_line2, city, postal_code, country,
          status, total_cents, currency, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      orderId,
      input.email,
      input.fullName,
      input.phone ?? null,
      input.addressLine1,
      input.addressLine2 ?? null,
      input.city,
      input.postalCode,
      input.country,
      "pending",
      totalCents,
      currency ?? "EUR",
      now
    );

    const insertItem = db.prepare(
      `INSERT INTO order_items (
          id, order_id, variant_id, size, sku,
          unit_price_cents, quantity, line_total_cents, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const oi of orderItemsToInsert) {
      insertItem.run(
        oi.id,
        orderId,
        oi.variantId,
        oi.size,
        oi.sku,
        oi.unitPriceCents,
        oi.quantity,
        oi.lineTotalCents,
        now
      );
    }
  });

  tx();

  return { orderId, totalCents, currency: currency ?? "EUR" };
}
