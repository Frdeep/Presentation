import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Club Mawon — Maillot Officiel (Ghetball)",
  description:
    "Boutique officielle du Club Mawon : maillot fabriqué par Ghetball. Expérience mobile premium, swipe & cartes 3D.",
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
