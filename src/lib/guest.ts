"use client";

let cachedGuestId: string | null = null;

export function getGuestId() {
  if (typeof window === "undefined") {
    return null;
  }

  if (cachedGuestId) {
    return cachedGuestId;
  }

  const existing = (window as { __guestId?: string }).__guestId;
  if (existing) {
    cachedGuestId = existing;
    return existing;
  }

  const newId = crypto.randomUUID();
  (window as { __guestId?: string }).__guestId = newId;
  cachedGuestId = newId;
  return newId;
}

export function getGuestHeaders() {
  const guestId = getGuestId();
  return guestId ? { "x-guest-id": guestId } : {};
}
