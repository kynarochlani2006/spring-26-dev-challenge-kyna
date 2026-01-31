"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";

type WishlistItem = {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number | null;
    imageUrl: string;
  };
};

type WishlistResponse = {
  items: WishlistItem[];
};

export default function WishlistView() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadWishlist = async () => {
      const response = await fetch("/api/wishlist");
      const data = (await response.json()) as WishlistResponse;
      setItems(data.items ?? []);
    };

    void loadWishlist();
  }, []);

  const removeItem = (productId: string) => {
    startTransition(async () => {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
    });
  };

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12">
      <h1 className="text-xl font-semibold text-[var(--accent-ink)]">
        Wishlist
      </h1>
      <p className="mt-2 text-sm text-black/50">
        Your favorite picks in one place.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-8 text-center text-sm text-black/50 shadow-[0_8px_18px_rgba(15,15,15,0.05)]">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-4 shadow-[0_8px_18px_rgba(15,15,15,0.05)]"
            >
              <div className="relative h-32 w-full rounded-xl bg-[var(--card)]">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-[12px] font-semibold">
                  {item.product.name}
                </p>
                <p className="text-[12px] font-semibold text-red-500">
                  ${item.product.price}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  disabled={isPending}
                  className="text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
