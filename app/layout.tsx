import "./globals.css";
import { Cormorant_Garamond, Manrope } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={`dark ${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
