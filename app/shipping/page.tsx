import type { Metadata } from "next";
import { InfoPage } from "@/components/info/info-page";

export const metadata: Metadata = {
  title: "Envios e Devoluções",
  description:
    "Informações sobre entregas, prazos, devoluções e trocas de relógios Eveul.",
};

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="ENVIOS & DEVOLUÇÕES"
      title="Entrega simples, informação clara."
      intro="Antes de confirmar uma compra, alinhamos stock, prazo, forma de pagamento e destino. O objectivo é evitar surpresas e manter o pedido acompanhado."
      image="/images/feature-4.jpg"
      stats={[
        { label: "Luanda", value: "24-72h" },
        { label: "Províncias", value: "Prazo confirmado" },
        { label: "Trocas", value: "Análise por estado" },
      ]}
      sections={[
        {
          eyebrow: "PRAZOS",
          title: "Entregas em Luanda.",
          body: "Após confirmação de stock e pagamento, entregas em Luanda são normalmente coordenadas em 24-72h.",
          items: [
            {
              title: "Confirmação prévia",
              body: "Antes da saída, confirmamos dados de contacto, morada e disponibilidade para recepção.",
            },
            {
              title: "Janelas de entrega",
              body: "A janela exacta depende da zona, agenda logística e confirmação do cliente.",
            },
          ],
        },
        {
          eyebrow: "DESTINOS",
          title: "Entregas para outras províncias.",
          body: "Para fora de Luanda, o prazo e operador são confirmados caso a caso antes da finalização.",
          items: [
            {
              title: "Coordenação",
              body: "A equipa informa opções disponíveis, custos aplicáveis e estimativa antes do envio.",
            },
            {
              title: "Acompanhamento",
              body: "Sempre que houver código ou actualização de envio, partilhamos pelo canal usado na compra.",
            },
          ],
        },
        {
          eyebrow: "TROCAS",
          title: "Trocas e devoluções.",
          body: "Pedidos de troca são analisados conforme estado da peça, embalagem, prazo e motivo apresentado.",
          items: [
            {
              title: "Estado original",
              body: "A peça deve estar sem sinais de uso indevido, dano, ajuste irreversível ou intervenção externa.",
            },
            {
              title: "Análise",
              body: "A aprovação depende de verificação da equipa e disponibilidade de stock para substituição.",
            },
          ],
        },
        {
          eyebrow: "PAGAMENTOS",
          title: "Confirmação antes do envio.",
          body: "O envio é preparado depois da confirmação do pedido e do método de pagamento acordado.",
          items: [
            {
              title: "Métodos",
              body: "As opções podem incluir AppyPay, referência, transferência ou TPA, conforme disponibilidade.",
            },
            {
              title: "Segurança",
              body: "Nunca envie dados sensíveis por canais não confirmados pela equipa Eveul.",
            },
          ],
        },
      ]}
    />
  );
}
