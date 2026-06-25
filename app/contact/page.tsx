import type { Metadata } from "next";
import { InfoPage } from "@/components/info/info-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contactos",
  description:
    "Contactos directos da Eveul para compras, stock, apoio e encomendas especiais.",
};

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="CONTACTOS"
      title="Fale com a Eveul."
      intro="Apoio directo para escolher modelos, confirmar stock, reservar peças e acompanhar pedidos. Comunicação clara antes, durante e depois da compra."
      image="/images/story-poster.webp"
      stats={[
        { label: "WhatsApp", value: siteConfig.whatsappDisplay },
        { label: "Email", value: siteConfig.supportEmail },
        { label: "Resposta", value: "Horário comercial" },
      ]}
      sections={[
        {
          eyebrow: "COMPRAS",
          title: "Ajuda antes da compra.",
          body: "Se estiver indeciso entre modelos, pode pedir recomendação por estilo, orçamento e ocasião.",
          items: [
            {
              title: "Confirmação de stock",
              body: "Validamos disponibilidade antes da reserva para evitar pedidos sem peça confirmada.",
            },
            {
              title: "Sugestão de modelos",
              body: "Apoiamos na escolha entre Signature, Limited e Classic com base no uso pretendido.",
            },
          ],
        },
        {
          eyebrow: "PEDIDOS",
          title: "Reservas e acompanhamento.",
          body: "Depois da reserva, o acompanhamento é feito por contacto directo, com informação sobre pagamento, entrega e garantia.",
          items: [
            {
              title: "Reservas",
              body: "A reserva é confirmada depois de validação de stock e dados de entrega.",
            },
            {
              title: "Encomendas especiais",
              body: "Para presentes, empresas ou lotes, a equipa confirma prazos e disponibilidade caso a caso.",
            },
          ],
        },
        {
          eyebrow: "SUPORTE",
          title: "Pós-venda sem ruído.",
          body: "O suporte cobre dúvidas de uso, garantia, manutenção e recomendações de cuidado com a peça.",
          items: [
            {
              title: "Garantia",
              body: "A garantia padrão é de 12 meses, conforme condições da peça e uso adequado.",
            },
            {
              title: "Manutenção",
              body: "Recomendamos cuidados simples de limpeza, armazenamento e revisão quando necessário.",
            },
          ],
        },
        {
          eyebrow: "LOCAL",
          title: "Atendimento em Angola.",
          body: "A Eveul foi pensada com suporte local, prazos claros e contacto simples para clientes em Luanda e outras províncias.",
          items: [
            {
              title: "Luanda",
              body: "Entregas em Luanda normalmente são coordenadas em 24-72h após confirmação.",
            },
            {
              title: "Outras províncias",
              body: "O prazo é confirmado antes do envio, de acordo com o destino e operador disponível.",
            },
          ],
        },
      ]}
      finalTitle="Prefere falar agora?"
      finalBody="Use WhatsApp para resposta directa ou email para assuntos com mais detalhe."
    />
  );
}
