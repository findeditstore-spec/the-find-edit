import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { WishlistProvider } from "./lib/wishlist-context";
import { ComparisonProvider } from "./lib/comparison-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "TFE • The Find Edit",
  description:
    "Discover, compare and shop curated finds across fashion, tech, home, lifestyle and more. Good finds. A better you.",
  other: {
    "impact-site-verification": "f7b5a514-93ec-4798-8dfa-5518560047ea",
    "mitgo-verification": "77b7ed6b-8e3d-41ad-aa0e-41fdf106c237",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <WishlistProvider>
          <ComparisonProvider>
            {children}
          </ComparisonProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
