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
