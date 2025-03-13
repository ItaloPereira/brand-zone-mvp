import "./globals.css";

import type { Metadata } from "next";
import { Mulish } from "next/font/google";


const mulish = Mulish({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brand Zone - MVP",
  description: "Brand Zone - MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mulish.className} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
