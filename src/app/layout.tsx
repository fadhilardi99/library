// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import SyncUser from "@/components/SyncUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Perpustakaan Kampus - Sistem Manajemen Digital",
  description:
    "Sistem manajemen perpustakaan kampus untuk mahasiswa, dosen, dan admin",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary:
            "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
          card: "shadow-lg",
          headerTitle: "text-blue-900",
          headerSubtitle: "text-gray-600",
        },
      }}
    >
      <html lang="id">
        <body className={inter.className}>
          <SyncUser />
          <div className="min-h-screen bg-gray-50">{children}</div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
