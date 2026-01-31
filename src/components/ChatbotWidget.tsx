"use client";

import { useMemo, useState } from "react";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
};

const starterPrompts = [
  "What's your return policy?",
  "Help me find a running shoe",
  "Do you have size recommendations?",
];

function getBotReply(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("return") || normalized.includes("refund")) {
    return "We offer a 30-day money-back guarantee on all orders.";
  }
  if (normalized.includes("shipping") || normalized.includes("delivery")) {
    return "Free and fast delivery for orders over $140.";
  }
  if (normalized.includes("size") || normalized.includes("fit")) {
    return "Try the Size Fit Assistant on the product page for a quick recommendation.";
  }
  if (normalized.includes("running") || normalized.includes("sport")) {
    return "For performance, check our Sport collection and look for high-rated pairs.";
  }
  if (normalized.includes("men") || normalized.includes("women") || normalized.includes("kids")) {
    return "You can filter categories from the top navigation to see your collection.";
  }

  return "I can help with sizing, shipping, returns, and finding the right style.";
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hi! I’m the SHOELL assistant. How can I help today?",
    },
  ]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };
    const botMessage: Message = {
      id: crypto.randomUUID(),
      role: "bot",
      text: getBotReply(trimmed),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const promptButtons = useMemo(
    () =>
      starterPrompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => sendMessage(prompt)}
          className="rounded-full border border-black/10 px-3 py-1 text-[10px] font-semibold text-black/60 transition hover:border-black/20"
        >
          {prompt}
        </button>
      )),
    []
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[320px] rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,15,15,0.18)]">
          <div className="flex items-center justify-between rounded-t-2xl bg-[var(--pill-purple)] px-4 py-3 text-white">
            <div>
              <p className="text-xs font-semibold tracking-wide">AI Style Assistant</p>
              <p className="text-[10px] text-white/70">Quick help & recommendations</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-white/70"
            >
              Close
            </button>
          </div>
          <div className="max-h-[280px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-[var(--pill-purple)] text-white"
                    : "bg-[var(--card)] text-black/70"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="border-t border-black/5 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">{promptButtons}</div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage(input);
                  }
                }}
                placeholder="Ask about sizing, shipping..."
                className="flex-1 rounded-full border border-black/10 px-3 py-2 text-[11px] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                className="rounded-full bg-black px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-3 rounded-full bg-[var(--pill-purple)] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-white shadow-[0_10px_24px_rgba(74,76,120,0.45)] ring-2 ring-white/70 transition hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(74,76,120,0.55)]"
      >
        {isOpen ? "Hide Assistant" : "AI Chat"}
      </button>
    </div>
  );
}
