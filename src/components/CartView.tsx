"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { getGuestHeaders } from "@/lib/guest";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number | null;
    imageUrl: string;
  };
};

type CartResponse = {
  cart: {
    id: string;
    items: CartItem[];
  } | null;
};

export default function CartView() {
  const [cart, setCart] = useState<CartResponse["cart"]>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadCart = async () => {
      const response = await fetch("/api/cart", {
        headers: getGuestHeaders(),
      });
      const data = (await response.json()) as CartResponse;
      setCart(data.cart);
    };

    void loadCart();
  }, []);

  const removeItem = (productId: string) => {
    startTransition(async () => {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...getGuestHeaders() },
        body: JSON.stringify({ productId }),
      });
      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((item) => item.product.id !== productId),
            }
          : prev
      );
    });
  };

  const total =
    cart?.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) ?? 0;

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12">
      <h1 className="text-xl font-semibold text-[var(--accent-ink)]">Cart</h1>
      <p className="mt-2 text-sm text-black/50">
        Review your items and remove anything you don&apos;t need.
      </p>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-8 text-center text-sm text-black/50 shadow-[0_8px_18px_rgba(15,15,15,0.05)]">
          Your cart is empty.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 rounded-2xl bg-white p-4 shadow-[0_8px_18px_rgba(15,15,15,0.05)]"
            >
              <div className="relative h-20 w-24 rounded-xl bg-[var(--card)]">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-contain p-3"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.product.name}</p>
                <p className="text-xs text-black/50">Qty: {item.quantity}</p>
              </div>
              <div className="text-sm font-semibold text-red-500">
                ${item.product.price}
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.product.id)}
                disabled={isPending}
                className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 text-sm font-semibold shadow-[0_8px_18px_rgba(15,15,15,0.05)]">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
