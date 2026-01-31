import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const navItems = ["Women", "Men", "Kids", "Classics", "Sport", "Sale"];

type FallbackProduct = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  tag?: string;
  showCart?: boolean;
  category?: string;
};

const fallbackProducts: FallbackProduct[] = [
  {
    id: "fallback-1",
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    image: "/assets/air-zoom-pegasus-37-9a8c07ab-fb12-40ab-ad5c-ed21ce63aaf9.png",
    rating: 4.8,
    reviews: 88,
    category: "Women",
  },
  {
    id: "fallback-2",
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    image: "/assets/Maroon-d96f3d53-140d-4bf1-93ac-f867bffda2a1.png",
    rating: 4.8,
    reviews: 88,
    category: "Men",
  },
  {
    id: "fallback-3",
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    image: "/assets/air-max-90-flyease-31be8905-ecb7-4de5-a555-2a761100071d.png",
    rating: 4.7,
    reviews: 88,
    category: "Kids",
  },
  {
    id: "fallback-4",
    name: "HAVIT HV-G92 Gamepad",
    price: 960,
    oldPrice: 1160,
    image: "/assets/cosmic-unity-d03f394b-428f-4790-bceb-eeaa3c3a7f42.png",
    rating: 4.8,
    reviews: 75,
    tag: "-35%",
    category: "Classics",
  },
  {
    id: "fallback-5",
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    image: "/assets/air-max-90-flyease-31be8905-ecb7-4de5-a555-2a761100071d.png",
    rating: 4.6,
    reviews: 88,
    category: "Sport",
  },
  {
    id: "fallback-6",
    name: "HAVIT HV-G92 Gamepad",
    price: 960,
    oldPrice: 1160,
    image: "/assets/cosmic-unity-d03f394b-428f-4790-bceb-eeaa3c3a7f42.png",
    rating: 4.8,
    reviews: 75,
    tag: "-35%",
    showCart: true,
    category: "Sale",
  },
  {
    id: "fallback-7",
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    image: "/assets/Maroon-d96f3d53-140d-4bf1-93ac-f867bffda2a1.png",
    rating: 4.8,
    reviews: 88,
    category: "Women",
  },
  {
    id: "fallback-8",
    name: "HAVIT HV-G92 Gamepad",
    price: 960,
    oldPrice: 1160,
    image: "/assets/air-zoom-pegasus-37-9a8c07ab-fb12-40ab-ad5c-ed21ce63aaf9.png",
    rating: 4.8,
    reviews: 75,
    tag: "-35%",
    category: "Men",
  },
];

const features = [
  {
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140",
  },
  {
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support",
  },
  {
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days",
  },
];

const heroImage =
  "/assets/Sport_Shoes-ef8d40f5-7a20-429d-a208-e1b9235dfdff.png";

const featureIcons = [
  "/assets/icon-delivery.svg",
  "/assets/Icon-Customer%20service.svg",
  "/assets/Icon-secure.svg",
];

const starIcons = {
  filled: "/assets/Vector-1.svg",
  empty: "/assets/Vector.svg",
};

type HomeProps = {
  searchParams?: { category?: string } | Promise<{ category?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams?.category ?? "All";
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });
  const hasExternalImages = products.some(
    (product) => typeof product.imageUrl === "string" && product.imageUrl.startsWith("http")
  );
  const productSource =
    products.length && !hasExternalImages ? products : fallbackProducts;

  const displayProducts = productSource.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice ?? undefined,
    imageUrl: "imageUrl" in product ? product.imageUrl : product.image,
    rating: product.rating,
    reviews: product.reviews,
    tag: product.tag ?? undefined,
    showCart: "showCart" in product ? product.showCart : undefined,
    category: "category" in product ? product.category : undefined,
  }));

  const filteredProducts =
    activeCategory === "All"
      ? displayProducts
      : displayProducts.filter((product) => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader navItems={navItems} />

      <main className="mx-auto max-w-[1120px] px-6">
        <section className="relative mt-8 overflow-hidden rounded-[36px] bg-[#ededee] py-12">
          <div className="absolute left-1/2 top-10 -translate-x-1/2 text-[11px] font-semibold tracking-[0.6em] text-black/40">
            ADJUSTABLE
          </div>
          <div className="absolute left-1/2 top-20 -translate-x-1/2 text-[clamp(4rem,12vw,9rem)] font-semibold tracking-[0.3em] text-black/10">
            SHOELL
          </div>
          <div className="relative z-10 flex flex-col items-center gap-6 px-8 md:flex-row md:justify-center md:gap-8">
            <div className="relative h-[250px] w-full max-w-[560px] md:h-[300px]">
              <Image
                src={heroImage}
                alt="Navy runner"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden text-[10px] font-semibold tracking-[0.5em] text-black/50 md:block md:translate-y-16 md:-translate-x-2">
              SOFT PAD
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-wrap gap-4">
          <button className="rounded-full border-2 border-[var(--pill-purple)] bg-[var(--pill-purple)] px-6 py-2 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(74,76,120,0.35)] transition hover:bg-transparent hover:text-[var(--pill-purple)]">
            New Arrivals
          </button>
          <button className="rounded-full border-2 border-[var(--accent-olive)] bg-[var(--accent-olive)] px-6 py-2 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(120,130,100,0.35)] transition hover:bg-transparent hover:text-[var(--accent-olive)]">
            What&apos;s Trending
          </button>
        </section>

        <ProductGrid products={filteredProducts} starIcons={starIcons} />

        <section className="mt-16 border-t border-black/10 pt-10">
          <div className="grid gap-6 text-center md:grid-cols-3">
            {features.map((feature, featureIndex) => (
              <div key={feature.title} className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                  <Image
                    src={featureIcons[featureIndex]}
                    alt={feature.title}
                    width={22}
                    height={22}
                  />
                </div>
                <p className="text-[12px] font-semibold">{feature.title}</p>
                <p className="text-[11px] text-black/50">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
