"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";

type ProductDetail = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  tag?: string;
};

type StarIcons = {
  filled: string;
  empty: string;
};

type ProductDetailViewProps = {
  product: ProductDetail;
  starIcons: StarIcons;
};

export default function ProductDetailView({
  product,
  starIcons,
}: ProductDetailViewProps) {
  const [isPending, startTransition] = useTransition();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [cartIds, setCartIds] = useState<Set<string>>(new Set());
  const [showFitAssistant, setShowFitAssistant] = useState(false);
  const [fitStep, setFitStep] = useState(0);
  const [fitAnswers, setFitAnswers] = useState({
    snug: "",
    activity: "",
    size: "",
  });
  const [fitResult, setFitResult] = useState<string | null>(null);

  useEffect(() => {
    const loadState = async () => {
      const [wishlistRes, cartRes] = await Promise.all([
        fetch("/api/wishlist"),
        fetch("/api/cart"),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setCartIds((prev) => new Set(prev).add(productId));
    });
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    startTransition(async () => {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const isWishlisted = wishlistIds.has(product.id);
  const isInCart = cartIds.has(product.id);
  const isFitComplete =
    fitAnswers.snug && fitAnswers.activity && fitAnswers.size;

  const openFitAssistant = () => {
    setShowFitAssistant(true);
    setFitStep(0);
    setFitResult(null);
  };

  const closeFitAssistant = () => {
    setShowFitAssistant(false);
    setFitStep(0);
    setFitResult(null);
  };

  const updateFitAnswer = (key: keyof typeof fitAnswers, value: string) => {
    setFitAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const computeFitResult = () => {
    const { snug, activity, size } = fitAnswers;
    let recommendation = size;
    if (snug === "snug") {
      recommendation = `${size} (snug fit)`;
    } else if (snug === "roomy") {
      recommendation = `${size} (roomier fit)`;
    }

    if (activity === "sport") {
      recommendation = `${size} (performance fit)`;
    }

    setFitResult(recommendation);
  };

  return (
    <section className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[32px] bg-[var(--card)] p-8 shadow-[0_10px_28px_rgba(15,15,15,0.08)]">
        {product.tag ? (
          <span className="inline-flex rounded-md bg-red-500 px-3 py-1 text-[10px] font-semibold text-white">
            {product.tag}
          </span>
        ) : null}
        <div className="relative mt-6 h-[320px] w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
      <div className="rounded-[32px] bg-white p-8 shadow-[0_10px_28px_rgba(15,15,15,0.08)]">
        <h1 className="text-2xl font-semibold text-[var(--accent-ink)]">
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Image
                key={`${product.id}-detail-star-${starIndex}`}
                src={
                  starIndex < Math.round(product.rating)
                    ? starIcons.filled
                    : starIcons.empty
                }
                alt="Star"
                width={14}
                height={14}
              />
            ))}
          </span>
          <span className="text-black/40">({product.reviews} reviews)</span>
        </div>
        <div className="mt-4 flex items-center gap-3 text-lg font-semibold">
          <span className="text-red-500">${product.price}</span>
          {product.oldPrice ? (
            <span className="text-sm font-medium text-black/40 line-through">
              ${product.oldPrice}
            </span>
          ) : null}
        </div>
        <p className="mt-4 text-sm text-black/60">
          Lightweight comfort with a soft pad, responsive cushioning, and all-day
          support. Built for everyday wear and effortless style.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            disabled={isPending}
            className="rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black/90"
          >
            {isInCart ? "Added To Cart" : "Add To Cart"}
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            disabled={isPending}
            className={`rounded-full border px-6 py-3 text-xs font-semibold uppercase tracking-wide transition ${
              isWishlisted
                ? "border-red-500 text-red-500"
                : "border-black/10 text-black/60 hover:border-black/20"
            }`}
          >
            {isWishlisted ? "Favorited" : "Add to Wishlist"}
          </button>
          <button
            type="button"
            onClick={openFitAssistant}
            className="rounded-full border border-black/10 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-black/60 transition hover:border-black/20"
          >
            Size Fit Assistant
          </button>
        </div>
      </div>
      {showFitAssistant ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(15,15,15,0.18)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--accent-ink)]">
                Size & Fit Assistant
              </p>
              <button
                type="button"
                onClick={closeFitAssistant}
                className="text-xs text-black/40"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-xs text-black/50">
              Quick questions to suggest the best fit for you.
            </p>

            {fitResult ? (
              <div className="mt-6 rounded-xl border border-black/10 bg-[var(--card)] p-4 text-center">
                <p className="text-xs text-black/50">Recommended size</p>
                <p className="mt-2 text-lg font-semibold text-[var(--accent-ink)]">
                  {fitResult}
                </p>
                <p className="mt-2 text-xs text-black/50">
                  Based on your fit preference and activity.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {fitStep === 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-black/60">
                      Do you prefer a snug or roomy fit?
                    </p>
                    <div className="flex gap-2">
                      {[
                        { label: "Snug", value: "snug" },
                        { label: "Roomy", value: "roomy" },
                        { label: "Regular", value: "regular" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateFitAnswer("snug", option.value)}
                          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                            fitAnswers.snug === option.value
                              ? "border-[var(--pill-purple)] bg-[var(--pill-purple)] text-white"
                              : "border-black/10 text-black/60 hover:border-black/20"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {fitStep === 1 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-black/60">
                      What will you use these shoes for most?
                    </p>
                    <div className="flex gap-2">
                      {[
                        { label: "Lifestyle", value: "lifestyle" },
                        { label: "Sport", value: "sport" },
                        { label: "Work", value: "work" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateFitAnswer("activity", option.value)}
                          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                            fitAnswers.activity === option.value
                              ? "border-[var(--pill-purple)] bg-[var(--pill-purple)] text-white"
                              : "border-black/10 text-black/60 hover:border-black/20"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {fitStep === 2 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-black/60">
                      What size do you usually wear?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"].map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateFitAnswer("size", option)}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                              fitAnswers.size === option
                                ? "border-[var(--pill-purple)] bg-[var(--pill-purple)] text-white"
                                : "border-black/10 text-black/60 hover:border-black/20"
                            }`}
                          >
                            {option}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFitStep((prev) => Math.max(0, prev - 1))}
                disabled={fitStep === 0 || Boolean(fitResult)}
                className="rounded-full border border-black/10 px-4 py-2 text-[11px] font-semibold text-black/60 transition hover:border-black/20 disabled:opacity-40"
              >
                Back
              </button>
              {fitResult ? (
                <button
                  type="button"
                  onClick={closeFitAssistant}
                  className="rounded-full bg-[var(--pill-purple)] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(74,76,120,0.35)]"
                >
                  Done
                </button>
              ) : fitStep < 2 ? (
                <button
                  type="button"
                  onClick={() => setFitStep((prev) => Math.min(2, prev + 1))}
                  className="rounded-full bg-black px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={computeFitResult}
                  disabled={!isFitComplete}
                  className="rounded-full bg-black px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-40"
                >
                  See Result
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
