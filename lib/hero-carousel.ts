export type HeroCarouselSlide = {
  id: string;
  badge: string;
  code: string;
  titleLines: string[];
  image: string;
  href: string;
  availableLabel?: string;
  collection?: string;
  specs?: string;
  nextLabel?: string;
};

export const defaultHeroCarouselSlides: HeroCarouselSlide[] = [
  {
    id: "jupiter",
    badge: "EDIÇÃO LIMITADA • 50 PEÇAS",
    code: "EV-2043-02",
    titleLines: ["SPACE", "TIMER", "JUPITER"],
    image: "/images/eveul3.png",
    href: "/watches/eveul-jupiter",
    availableLabel: "DISPONÍVEL",
    nextLabel: "SEGUINTE: EVEUL PARAÍBA",
    collection: "Signature",
    specs: "Open Gear • Caixa em titânio • Vidro de safira",
  },
  {
    id: "paraiba",
    badge: "EDIÇÃO LIMITADA • 15 PEÇAS",
    code: "EV-3123-PABL",
    titleLines: ["OPEN GEAR", "FLYING", "TOURBILLON", "PARAÍBA"],
    image: "/images/eveul2.png",
    href: "/watches/eveul-paraiba",
    availableLabel: "DISPONÍVEL",
    nextLabel: "SEGUINTE: EVEUL JUPITER",
    collection: "Limited Edition",
    specs: "Open Gear • Tourbillon • Vidro de safira",
  },
];
