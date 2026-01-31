"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { getGuestHeaders } from "@/lib/guest";

type ProductCard = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  tag?: string;
  showCart?: boolean;
};

type StarIcons = {
  filled: string;
  empty: string;
};

type ProductGridProps = {
  products: ProductCard[];
  starIcons: StarIcons;
};

export default function ProductGrid({ products, starIcons }: ProductGridProps) {
  const [isPending, startTransition] = useTransition();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [cartIds, setCartIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadState = async () => {
      const [wishlistRes, cartRes] = await Promise.all([
        fetch("/api/wishlist", { headers: getGuestHeaders() }),
        fetch("/api/cart", { headers: getGuestHeaders() }),
      ]);
      const wishlistData = await wishlistRes.json();
      const cartData = await cartRes.json();

      const wishlistSet = new Set<string>(
        wishlistData.items?.map((item: { productId: string }) => item.productId) ??
          []
      );
      const cartSet = new Set<string>(
        cartData.cart?.items?.map((item: { productId: string }) => item.productId) ??
          []
      );

      setWishlistIds(wishlistSet);
      setCartIds(cartSet);
    };

    void loadState();
  }, []);

  const addToCart = useCallback((productId: string) => {
    startTransition(async () => {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getGuestHeaders() },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setCartIds((prev) => new Set(prev).add(productId));
    });
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    startTransition(async () => {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getGuestHeaders() },
        body: JSON.stringify({ productId }),
      });
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });
    });
  }, []);

  const heartPath = useMemo(
    () =>
      "M8 5C5.7912 5 4 6.73964 4 8.88594C4 10.6185 4.7 14.7305 11.5904 18.8873C11.7138 18.961 11.8555 19 12 19C12.1445 19 12.2862 18.961 12.4096 18.8873C19.3 14.7305 20 10.6185 20 8.88594C20 6.73964 18.2088 5 16 5C13.7912 5 12 7.35511 12 7.35511C12 7.35511 10.2088 5 8 5Z",
    []
  );

  return (
    <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="group rounded-2xl bg-white p-4 shadow-[0_8px_18px_rgba(15,15,15,0.05)]"
        >
          <div className="relative rounded-xl bg-[var(--card)] p-5">
            {product.tag ? (
              <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-[10px] font-semibold text-white">
                {product.tag}
              </span>
            ) : null}
            <button
              type="button"
              aria-label="Add to wishlist"
              className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center"
              onClick={() => toggleWishlist(product.id)}
              disabled={isPending}
            >
              <svg
                aria-hidden
                width={14}
                height={14}
                viewBox="0 0 24 24"
                className="block"
              >
                <path
                  d={heartPath}
                  fill={wishlistIds.has(product.id) ? "#ef4444" : "none"}
                  stroke={wishlistIds.has(product.id) ? "#ef4444" : "rgba(0,0,0,0.4)"}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative h-32 w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <button
              type="button"
              onClick={() => addToCart(product.id)}
              disabled={isPending}
              className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-black py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100"
            >
              {cartIds.has(product.id) ? "Added To Cart" : "Add To Cart"}
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <Link href={`/product/${product.id}`}>
              <p className="text-[12px] font-semibold">{product.name}</p>
            </Link>
            <div className="flex items-center gap-2 text-[12px] font-semibold">
              <span className="text-red-500">${product.price}</span>
              {product.oldPrice ? (
                <span className="text-[10px] font-medium text-black/40 line-through">
                  ${product.oldPrice}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-black/50">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Image
                    key={`${product.id}-star-${starIndex}`}
                    src={
                      starIndex < Math.round(product.rating)
                        ? starIcons.filled
                        : starIcons.empty
                    }
                    alt="Star"
                    width={12}
                    height={12}
                  />
                ))}
              </span>
              <span>({product.reviews})</span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
