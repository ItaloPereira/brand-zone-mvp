import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import { Toaster } from 'sonner';

import Header from "@/components/Header";

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
          <Header />
          {children}
        </ClerkProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
