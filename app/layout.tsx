import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BluePipe Plumbing Ops",
  description: "Private operations dashboard for plumbing business"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
