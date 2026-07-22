import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "SuperTour.uz | Travel packages from Tashkent",
  description: "SuperTour.uz uchun zamonaviy tur paketlari, yo'nalishlar va online maslahat platformasi.",
  icons: {
    icon: "/supertour-logo.jpg",
    shortcut: "/supertour-logo.jpg",
    apple: "/supertour-logo.jpg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>
        <Header />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
