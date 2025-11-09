import type { Metadata } from "next";
import "./globals.css";
import { tiamatFont } from "./ui/fonts";


export const metadata: Metadata = {
  title: "DnD Maker",
  description: "Page dedicated to create characters and campaigns for role playing games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${tiamatFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
