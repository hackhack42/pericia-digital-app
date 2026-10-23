import type { Metadata, Viewport } from "next";
import { Inter, Special_Elite, Caveat } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const elite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-elite" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-hand" });

export const metadata: Metadata = {
  title: "Perícia Digital · Delegacia de Homicídios",
  description:
    "Jogo de investigação criminal com extração forense em celulares: senhas, provas, IA interrogadora e mandados de prisão em 18 casos.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Perícia Digital",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${elite.variable} ${caveat.variable} antialiased`}>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
