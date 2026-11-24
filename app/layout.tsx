import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";

// Texto corrido. Só os pesos usados, para manter o download pequeno em 3G/4G.
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-barlow",
});

// Títulos, botões, preços e badges (maiúsculas condensadas, como no Instagram).
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: {
    default: "Eveul | As horas não são as mesmas",
    template: "%s | Eveul",
  },
  description:
    "Relógios e óculos Eveul. Marca angolana com edições limitadas, apoio local e encomenda simples pelo WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#0d0c0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt"
      className={`dark ${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
