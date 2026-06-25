import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  defaultHeroCarouselSlides,
  type HeroCarouselSlide,
} from "@/lib/hero-carousel";

type HeroCarouselSlideRow = {
  id: string;
  image_url: string | null;
  sort_order: number;
};

export async function getHeroCarouselSlides(): Promise<HeroCarouselSlide[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("hero_carousel_slides")
      .select("id,image_url,sort_order")
      .order("sort_order", { ascending: true })
      .returns<HeroCarouselSlideRow[]>();

    if (error) throw new Error(error.message);

    const imageBySlide = new Map(
      (data ?? [])
        .filter((slide) => slide.image_url)
        .map((slide) => [slide.id, slide.image_url as string]),
    );

    return defaultHeroCarouselSlides.map((slide) => ({
      ...slide,
      image: imageBySlide.get(slide.id) ?? slide.image,
    }));
  } catch {
    return defaultHeroCarouselSlides;
  }
}
