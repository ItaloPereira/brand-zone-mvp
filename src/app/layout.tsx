import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
        <ClerkProvider appearance={{
          baseTheme: dark
        }}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
