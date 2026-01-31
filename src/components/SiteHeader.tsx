"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const headerIcons = {
  logo: "/assets/100.svg",
  heart: "/assets/Vector-2.svg",
  cart: "/assets/Frame-1.svg",
  user: "/assets/Frame.svg",
};

type SiteHeaderProps = {
  navItems: string[];
};

export default function SiteHeader({ navItems }: SiteHeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (active) {
          setIsLoggedIn(Boolean(data?.user));
        }
      } catch (error) {
        console.error("Failed to load auth session", error);
      }
    };

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  const handleAccountClick = () => {
    setShowLogoutPrompt(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setShowLogoutPrompt(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className="relative">
      <div className="bg-[var(--topbar)] py-2 text-center text-[11px] font-medium tracking-wide text-white">
        New here? Save 20% with code: YR24
      </div>
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center text-[var(--accent-ink)]"
          >
            <Image
              src={headerIcons.logo}
              alt="Logo mark"
              width={24}
              height={24}
            />
          </Link>
          <nav className="hidden items-center gap-6 text-[11px] font-medium text-[var(--accent)] md:flex">
            {navItems.map((item, index) => (
              <Link
                key={`${item}-${index}`}
                href={`/?category=${encodeURIComponent(item)}`}
                className="transition hover:text-[var(--accent-ink)]"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[var(--accent)]">
          <Link href="/wishlist" aria-label="Wishlist">
            <Image
              src={headerIcons.heart}
              alt="Favorites"
              width={18}
              height={18}
            />
          </Link>
          <Link href="/cart" aria-label="Cart">
            <Image src={headerIcons.cart} alt="Cart" width={18} height={18} />
          </Link>
          {isLoggedIn ? (
            <button
              type="button"
              aria-label="Log out"
              onClick={handleAccountClick}
            >
              <Image
                src={headerIcons.user}
                alt="Account"
                width={18}
                height={18}
              />
            </button>
          ) : (
            <Link href="/login" aria-label="Account">
              <Image
                src={headerIcons.user}
                alt="Account"
                width={18}
                height={18}
              />
            </Link>
          )}
        </div>
      </div>
      {showLogoutPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6">
          <div className="w-full max-w-[360px] rounded-2xl bg-white p-6 text-center shadow-[0_12px_30px_rgba(15,15,15,0.18)]">
            <p className="text-sm font-semibold text-[var(--accent-ink)]">
              Log out of your account?
            </p>
            <p className="mt-2 text-xs text-black/50">
              You can always log back in from the account icon.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutPrompt(false)}
                className="rounded-full border border-black/10 px-4 py-2 text-[11px] font-semibold text-black/60 transition hover:border-black/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-[var(--pill-purple)] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_8px_18px_rgba(74,76,120,0.35)]"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
