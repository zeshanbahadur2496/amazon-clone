import { AmazonHomeGrid } from "@/components/home/amazon-home-grid";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { getAllProducts } from "@/lib/products";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <div className="bg-[#eaeded] dark:bg-slate-950">
      <HeroCarousel />
      <div className="relative z-10 -mt-[120px] sm:-mt-[140px] lg:-mt-[180px]">
        <AmazonHomeGrid products={products} />
      </div>
    </div>
  );
}
