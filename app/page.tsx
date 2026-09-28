import { AmazonHomeGrid } from "@/components/home/amazon-home-grid";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { getAllProducts } from "@/lib/products";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <div className="bg-[color:var(--store-bg)]">
      <HeroCarousel />
      <div className="relative z-10 mt-4 sm:mt-5">
        <AmazonHomeGrid products={products} />
      </div>
    </div>
  );
}
