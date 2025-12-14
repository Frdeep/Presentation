import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Club Mawon — Démo Boutique (Ghetball × Deepgital)",
  description:
    "Démo visuelle de boutique e-commerce pour le Club Mawon (basket) : design premium, SEO et stratégie social media par Deepgital. Aucun paiement réel.",
  applicationName: "Club Mawon",
  metadataBase: new URL("http://localhost:3000"),
};

export const viewport: Viewport = {
  themeColor: "#E11D48",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${outfit.variable} antialiased`}>{children}</body>
    </html>
  );
}
