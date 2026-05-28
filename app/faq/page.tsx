import type { Metadata } from "next";
import { InfoPage } from "@/components/info/info-page";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Perguntas frequentes sobre relógios Eveul, compras, envios, garantia e stock.",
};

export default function FaqPage() {
  return (
    <InfoPage
      eyebrow="FAQ"
      title="Perguntas frequentes."
      intro="As respostas essenciais sobre stock, reservas, garantia, entrega e cuidados com os relógios Eveul."
      image="/images/eveul1.png"
      stats={[
        { label: "Stock", value: "Limitado por modelo" },
        { label: "Garantia", value: "12 meses" },
        { label: "Reserva", value: "Via WhatsApp" },
      ]}
      sections={[
        {
          eyebrow: "COMPRA",
          title: "Como faço uma reserva?",
          body: "Escolha o modelo no catálogo e use o botão de reserva. A equipa confirma disponibilidade, dados e próximos passos.",
          items: [
            {
              title: "A reserva é automática?",
              body: "Não. Primeiro confirmamos stock e condições do pedido para evitar reservas sem peça disponível.",
            },
            {
              title: "Posso pedir recomendação?",
              body: "Sim. Pode indicar orçamento, estilo e ocasião para receber uma sugestão mais adequada.",
            },
          ],
        },
        {
          eyebrow: "STOCK",
          title: "Os modelos são sempre limitados?",
          body: "A Eveul trabalha com referências seleccionadas e disponibilidade variável. Alguns modelos podem ter reposição, outros são edições mais restritas.",
          items: [
            {
              title: "Como sei se há stock?",
              body: "O catálogo mostra modelos activos, mas a confirmação final é feita no contacto antes da compra.",
            },
            {
              title: "E se esgotar?",
              body: "Pode subscrever a newsletter ou falar connosco para ser avisado sobre reposição ou alternativas.",
            },
          ],
        },
        {
          eyebrow: "GARANTIA",
          title: "A garantia cobre tudo?",
          body: "A garantia cobre defeitos de fabrico em condições normais de uso, mas não cobre impactos, mau uso ou intervenção externa.",
          items: [
            {
              title: "Quanto tempo dura?",
              body: "A garantia padrão é de 12 meses a partir da compra confirmada.",
            },
            {
              title: "Como activo suporte?",
              body: "Contacte a equipa com modelo, data da compra, descrição do problema e imagens se necessário.",
            },
          ],
        },
        {
          eyebrow: "ENTREGA",
          title: "Quanto tempo demora a entrega?",
          body: "Em Luanda, o prazo normal é 24-72h após confirmação. Para outras províncias, confirmamos caso a caso.",
          items: [
            {
              title: "Posso enviar como presente?",
              body: "Sim. Informe a equipa antes da confirmação para alinharmos apresentação, destino e contacto.",
            },
            {
              title: "Há acompanhamento?",
              body: "Sim. O pedido é acompanhado pelo canal usado na reserva.",
            },
          ],
        },
      ]}
    />
  );
}
