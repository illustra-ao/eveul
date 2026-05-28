import type { Metadata } from "next";
import { InfoPage } from "@/components/info/info-page";

export const metadata: Metadata = {
  title: "Termos",
  description: "Termos de utilização e condições comerciais da Eveul.",
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="TERMOS"
      title="Termos de utilização."
      intro="Estes termos organizam a relação entre a Eveul e os clientes que navegam, reservam ou compram através dos nossos canais digitais."
      image="/images/feature-1.jpg"
      stats={[
        { label: "Aplicação", value: "Website e canais digitais" },
        { label: "Compras", value: "Após confirmação" },
        { label: "Actualização", value: "Sempre que necessário" },
      ]}
      sections={[
        {
          eyebrow: "UTILIZAÇÃO",
          title: "Uso do website.",
          body: "O website apresenta produtos, informações institucionais e canais de contacto. A navegação deve respeitar a integridade da plataforma e dos conteúdos.",
          items: [
            {
              title: "Conteúdo",
              body: "Textos, imagens, identidade visual e estrutura pertencem à Eveul ou são usados com autorização.",
            },
            {
              title: "Disponibilidade",
              body: "Podemos actualizar, suspender ou alterar páginas e funcionalidades para manutenção ou melhoria.",
            },
          ],
        },
        {
          eyebrow: "PRODUTOS",
          title: "Informação comercial.",
          body: "Preços, disponibilidade, imagens e descrições podem ser ajustados. A compra só é considerada confirmada após validação directa da equipa.",
          items: [
            {
              title: "Stock",
              body: "A disponibilidade apresentada no website é indicativa e pode depender de confirmação final.",
            },
            {
              title: "Reservas",
              body: "Reservas feitas por WhatsApp ou email ficam sujeitas a confirmação de stock e pagamento.",
            },
          ],
        },
        {
          eyebrow: "RESPONSABILIDADE",
          title: "Limites de responsabilidade.",
          body: "A Eveul procura manter informação correcta, mas não garante ausência total de erros tipográficos, indisponibilidades técnicas ou atrasos de terceiros.",
          items: [
            {
              title: "Serviços externos",
              body: "Pagamentos, entregas, email, hospedagem e serviços de base de dados podem depender de fornecedores externos.",
            },
            {
              title: "Uso indevido",
              body: "Não nos responsabilizamos por danos resultantes de uso indevido da peça ou comunicação fora dos canais oficiais.",
            },
          ],
        },
        {
          eyebrow: "CONTACTO",
          title: "Dúvidas sobre os termos.",
          body: "Qualquer dúvida sobre condições comerciais, garantia ou utilização do website pode ser enviada pelos canais oficiais.",
          items: [
            {
              title: "Canal principal",
              body: "WhatsApp é o canal mais rápido para assuntos comerciais e confirmação de pedidos.",
            },
            {
              title: "Email",
              body: "Para assuntos formais ou detalhados, recomendamos contacto por email.",
            },
          ],
        },
      ]}
    />
  );
}
