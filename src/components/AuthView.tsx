"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

type AuthViewProps = {
  mode: "login" | "signup";
};

export default function AuthView({ mode }: AuthViewProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formState.email.trim(),
          password: formState.password,
          name: mode === "signup" ? formState.name : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setError(null);
      window.location.href = "/cart";
    });
  };

  return (
    <div className="mx-auto max-w-[520px] px-6 py-12">
      <h1 className="text-xl font-semibold text-[var(--accent-ink)]">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-black/50">
        {mode === "login"
          ? "Sign in to view your cart and wishlist."
          : "Save your favorites and build your cart."}
      </p>

      <form
        className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-[0_8px_18px_rgba(15,15,15,0.05)]"
        onSubmit={submit}
      >
        {mode === "signup" ? (
          <label className="block text-xs font-semibold text-black/60">
            Name
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm focus:outline-none"
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </label>
        ) : null}

        <label className="block text-xs font-semibold text-black/60">
          Email
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm focus:outline-none"
            value={formState.email}
            onChange={(event) => {
              setError(null);
              setFormState((prev) => ({ ...prev, email: event.target.value }));
            }}
          />
        </label>

        <label className="block text-xs font-semibold text-black/60">
          Password
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm focus:outline-none"
            value={formState.password}
            onChange={(event) => {
              setError(null);
              setFormState((prev) => ({
                ...prev,
                password: event.target.value,
              }));
            }}
          />
        </label>

        {error ? <p className="text-xs text-red-500">{error}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full border-2 border-[var(--pill-purple)] bg-[var(--pill-purple)] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(74,76,120,0.35)] transition hover:bg-transparent hover:text-[var(--pill-purple)]"
        >
          {mode === "login" ? "Login" : "Sign up"}
        </button>

        <p className="text-center text-xs text-black/50">
          {mode === "login" ? "No account?" : "Already have an account?"}{" "}
          <Link
            href={mode === "login" ? "/signup" : "/login"}
            className="font-semibold text-[var(--accent)]"
          >
            {mode === "login" ? "Sign up" : "Login"}
          </Link>
        </p>
      </form>
    </div>
  );
}
