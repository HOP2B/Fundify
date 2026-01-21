"use client";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import { Inter, Roboto_Mono } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--inter" });
export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--roboto-mono",
});

export const A = {
  title: "Fundify",
  description: "Donation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${robotoMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
