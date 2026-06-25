import type { Metadata } from "next";
import { InfoPage } from "@/components/info/info-page";

export const metadata: Metadata = {
  title: "Garantia e Serviço",
  description:
    "Condições de garantia, assistência e suporte pós-venda da Eveul.",
};

export default function SupportPage() {
  return (
    <InfoPage
      eyebrow="GARANTIA & SERVIÇO"
      title="Suporte claro depois da compra."
      intro="A experiência Eveul não termina na entrega. Acompanhamos dúvidas de uso, assistência, garantia e cuidados para manter a peça em bom estado."
      image="/images/feature-2.webp"
      stats={[
        { label: "Garantia", value: "12 meses" },
        { label: "Entrega Luanda", value: "24-72h" },
        { label: "Canal", value: "WhatsApp / Email" },
      ]}
      sections={[
        {
          eyebrow: "COBERTURA",
          title: "O que a garantia cobre.",
          body: "A garantia cobre defeitos de fabrico identificados em condições normais de uso, dentro do período informado no momento da compra.",
          items: [
            {
              title: "Defeitos de fabrico",
              body: "Falhas internas ou de acabamento avaliadas pela equipa técnica dentro das condições de garantia.",
            },
            {
              title: "Comprovativo de compra",
              body: "Para activar suporte, mantenha a confirmação de compra e os dados do pedido.",
            },
          ],
        },
        {
          eyebrow: "LIMITES",
          title: "O que não é coberto.",
          body: "Danos por queda, impacto, água fora da resistência indicada, abertura não autorizada ou uso indevido não entram na garantia padrão.",
          items: [
            {
              title: "Uso inadequado",
              body: "Evite contacto com químicos, calor extremo, impactos fortes e exposição a água fora da especificação.",
            },
            {
              title: "Intervenção externa",
              body: "Reparações feitas por terceiros podem invalidar a cobertura da garantia.",
            },
          ],
        },
        {
          eyebrow: "ASSISTÊNCIA",
          title: "Como pedir suporte.",
          body: "O pedido começa por contacto directo. A equipa recolhe informação sobre a peça, imagens se necessário e orienta os próximos passos.",
          items: [
            {
              title: "Diagnóstico inicial",
              body: "Partilhe modelo, data de compra, descrição do problema e fotografias quando possível.",
            },
            {
              title: "Próximos passos",
              body: "Após análise, confirmamos se há garantia activa, manutenção recomendada ou reparação fora de garantia.",
            },
          ],
        },
        {
          eyebrow: "CUIDADOS",
          title: "Manter a peça em bom estado.",
          body: "Pequenos cuidados ajudam a preservar acabamento, correia e funcionamento do relógio por mais tempo.",
          items: [
            {
              title: "Limpeza",
              body: "Use pano macio e seco. Evite produtos abrasivos, perfumes e solventes sobre a peça.",
            },
            {
              title: "Armazenamento",
              body: "Guarde o relógio em local seco, protegido de calor intenso e humidade prolongada.",
            },
          ],
        },
      ]}
    />
  );
}
