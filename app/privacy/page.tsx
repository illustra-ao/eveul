import type { Metadata } from "next";
import { InfoPage } from "@/components/info/info-page";

export const metadata: Metadata = {
  title: "Privacidade",
  description:
    "Política de privacidade da Eveul sobre recolha, uso e protecção de dados.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="PRIVACIDADE"
      title="Dados tratados com respeito."
      intro="Recolhemos apenas os dados necessários para responder a contactos, processar pedidos, gerir newsletter e prestar suporte."
      image="/images/feature-3.webp"
      stats={[
        { label: "Dados", value: "Mínimos necessários" },
        { label: "Newsletter", value: "Cancelável" },
        { label: "Contacto", value: "WhatsApp / Email" },
      ]}
      sections={[
        {
          eyebrow: "RECOLHA",
          title: "Que dados podemos recolher.",
          body: "Podemos recolher nome, email, telefone, morada de entrega, modelo de interesse e mensagens enviadas pelos canais oficiais.",
          items: [
            {
              title: "Newsletter",
              body: "Ao subscrever, guardamos o email para enviar novidades, reposições e lançamentos relevantes.",
            },
            {
              title: "Pedidos",
              body: "Para entregar ou acompanhar uma compra, podemos pedir dados necessários ao contacto e envio.",
            },
          ],
        },
        {
          eyebrow: "USO",
          title: "Como usamos esses dados.",
          body: "Usamos dados para responder, confirmar pedidos, prestar suporte, gerir entregas e comunicar novidades autorizadas.",
          items: [
            {
              title: "Comunicação",
              body: "Podemos contactar por WhatsApp, email ou telefone quando necessário para concluir o atendimento.",
            },
            {
              title: "Melhoria",
              body: "Dados agregados podem ajudar a perceber interesse por modelos e melhorar a experiência.",
            },
          ],
        },
        {
          eyebrow: "PARTILHA",
          title: "Quando dados podem ser partilhados.",
          body: "Dados podem ser partilhados apenas com serviços necessários para operar o website, processar pedidos, enviar comunicações ou entregar produtos.",
          items: [
            {
              title: "Fornecedores",
              body: "Podem incluir hospedagem, base de dados, email, pagamentos e operadores logísticos.",
            },
            {
              title: "Sem venda de dados",
              body: "A Eveul não vende dados pessoais de clientes ou subscritores.",
            },
          ],
        },
        {
          eyebrow: "DIREITOS",
          title: "Controlo sobre os dados.",
          body: "Pode pedir actualização, remoção ou esclarecimento sobre dados guardados pela Eveul através dos canais oficiais.",
          items: [
            {
              title: "Newsletter",
              body: "Pode pedir remoção da lista a qualquer momento.",
            },
            {
              title: "Pedidos formais",
              body: "Para solicitações detalhadas, use email para manter registo claro do pedido.",
            },
          ],
        },
      ]}
    />
  );
}
