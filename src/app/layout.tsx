import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Branded Fit - From Domain to Branded Drops in Minutes",
  description:
    "Launch custom branded apparel in minutes. See your brand in action with our mockup gallery, then start a Brand Drop pilot.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
