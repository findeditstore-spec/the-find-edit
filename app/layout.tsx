import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Find Edit",
  description:
    "The Find Edit helps South African shoppers discover affordable and interesting products across retailers through curated categories and collections.",
  other: {
    "impact-site-verification":
      "f7b5a514-93ec-4798-8dfa-5518560047ea",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
