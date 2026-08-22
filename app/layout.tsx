import type { Metadata } from "next";
import { Montserrat, Geist } from "next/font/google";
import "./globals.css";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "ZC-EVENT",
  description: "Organize your events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className={`${montserrat.variable} font-sans`}>
        <NeonAuthUIProvider
          authClient={authClient}
          social={{
            providers: ["google", "github"],
          }}
        >
          <Navbar />
          <main className="mx-auto min-h-screen flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
            {children}
          </main>
          <Footer />
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
