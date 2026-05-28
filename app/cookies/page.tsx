import type { Metadata } from "next";
import { InfoPage } from "@/components/info/info-page";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Informação sobre cookies e tecnologias semelhantes na Eveul.",
};

export default function CookiesPage() {
  return (
    <InfoPage
      eyebrow="COOKIES"
      title="Tecnologia discreta para melhorar a experiência."
      intro="Cookies e tecnologias semelhantes podem ajudar o website a funcionar melhor, medir desempenho e manter uma experiência consistente."
      image="/images/eveul2.png"
      stats={[
        { label: "Essenciais", value: "Funcionamento" },
        { label: "Medição", value: "Desempenho" },
        { label: "Controlo", value: "No browser" },
      ]}
      sections={[
        {
          eyebrow: "ESSENCIAIS",
          title: "Cookies necessários.",
          body: "Alguns cookies ou mecanismos técnicos podem ser necessários para navegação, segurança e funcionamento básico do website.",
          items: [
            {
              title: "Sessão",
              body: "Podem ajudar a manter estados temporários de navegação e segurança.",
            },
            {
              title: "Admin",
              body: "A área administrativa pode depender de mecanismos de autenticação e protecção.",
            },
          ],
        },
        {
          eyebrow: "DESEMPENHO",
          title: "Medição e melhoria.",
          body: "Podemos usar dados técnicos agregados para perceber desempenho, erros e páginas mais visitadas.",
          items: [
            {
              title: "Sem identificação directa",
              body: "Sempre que possível, usamos informação agregada e limitada ao necessário.",
            },
            {
              title: "Experiência",
              body: "A medição ajuda a melhorar velocidade, navegação e conteúdo do catálogo.",
            },
          ],
        },
        {
          eyebrow: "TERCEIROS",
          title: "Serviços externos.",
          body: "Alguns fornecedores de hospedagem, base de dados, email ou pagamentos podem usar tecnologias próprias para operar os serviços.",
          items: [
            {
              title: "Hospedagem",
              body: "O website pode depender de serviços externos para entrega de páginas e imagens.",
            },
            {
              title: "Comunicação",
              body: "Links externos como WhatsApp e email são operados pelas respectivas plataformas.",
            },
          ],
        },
        {
          eyebrow: "CONTROLO",
          title: "Como gerir cookies.",
          body: "Pode bloquear, apagar ou limitar cookies nas definições do navegador. Algumas funcionalidades podem ficar menos consistentes.",
          items: [
            {
              title: "Browser",
              body: "Consulte as definições de privacidade do seu navegador para gerir permissões.",
            },
            {
              title: "Dúvidas",
              body: "Para questões sobre privacidade e cookies, contacte a Eveul pelos canais oficiais.",
            },
          ],
        },
      ]}
    />
  );
}
