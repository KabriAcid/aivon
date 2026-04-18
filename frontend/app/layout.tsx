import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aivon - AI Voice of Network",
  description:
    "Telecom call simulation demo for multilingual AI voice support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
