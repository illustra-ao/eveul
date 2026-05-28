import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Eveul | Relogios premium em Angola",
    template: "%s | Eveul",
  },
  description:
    "Relogios Eveul com acabamento premium, edicoes limitadas, suporte local e compra simples em Angola.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
