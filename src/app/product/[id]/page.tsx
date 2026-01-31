import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";
import ProductDetailView from "@/components/ProductDetailView";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const navItems = ["Women", "Men", "Kids", "Classics", "Sport", "Sale"];

const starIcons = {
  filled: "/assets/Vector-1.svg",
  empty: "/assets/Vector.svg",
};

type ProductPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams?.id;
  if (!productId) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  const recommendations = await prisma.product.findMany({
    where: { NOT: { id: product.id } },
    orderBy: { rating: "desc" },
    take: 4,
  });

  const displayRecommendations = recommendations.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    oldPrice: item.oldPrice ?? undefined,
    imageUrl: item.imageUrl,
    rating: item.rating,
    reviews: item.reviews,
    tag: item.tag ?? undefined,
  }));

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader navItems={navItems} />
      <main className="mx-auto max-w-[1120px] px-6">
        <ProductDetailView
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice ?? undefined,
            imageUrl: product.imageUrl,
            rating: product.rating,
            reviews: product.reviews,
            tag: product.tag ?? undefined,
          }}
          starIcons={starIcons}
        />
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-black/50">
              Recommended for you
            </h2>
          </div>
          <ProductGrid products={displayRecommendations} starIcons={starIcons} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
