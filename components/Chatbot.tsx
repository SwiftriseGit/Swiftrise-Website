"use client";

import { FormEvent, useState } from "react";
import { FaPaperPlane, FaRobot, FaTimes } from "react-icons/fa";

type ChatMessage = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const initialBotMessage: ChatMessage = {
  id: 1,
  sender: "bot",
  text: "Hi, I am Tech Assistant. Ask about services, pricing, timeline, or contact details.",
};

type ChatbotProps = {
  inline?: boolean;
  onClose?: () => void;
};

export default function Chatbot({ inline = false, onClose }: ChatbotProps) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const submitChat = async (e: FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    const userMessage: ChatMessage = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    const tempBotId = Date.now() + 1;
    const tempBotMessage: ChatMessage = { id: tempBotId, sender: "bot", text: "..." };
    setMessages((prev) => [...prev, tempBotMessage]);

    setIsLoading(true);
    try {
      const clientMessages = [...messages, userMessage].map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: clientMessages }),
      });

      const data = await res.json();
      const replyText = data?.reply || data?.error || "Sorry, something went wrong.";

      setMessages((prev) => prev.map((m) => (m.id === tempBotId ? { ...m, text: replyText } : m)));
    } catch (err) {
      setMessages((prev) => prev.map((m) => (m.id === tempBotId ? { ...m, text: "Error contacting assistant." } : m)));
    } finally {
      setIsLoading(false);
    }
  };

  const Header = (
    <div className="flex items-center justify-between rounded-t-2xl bg-[#12395c] px-5 py-3.5 text-white">
      <div className="flex items-center gap-2.5 text-base font-semibold">
        <FaRobot />
        Tech Assistant
      </div>
      <button
        type="button"
        onClick={() => {
          if (inline && onClose) return onClose();
          setIsOpen((s) => !s);
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="rounded-md p-1 transition hover:bg-white/15"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  );

  const Body = (
    <>
      <div className="max-h-80 space-y-3.5 overflow-y-auto px-4 py-4 text-base">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[88%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
              message.sender === "user" ? "ml-auto bg-[#12395c] text-white" : "bg-[#f1f5fb] text-[#1f3550]"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={submitChat} className="flex items-center gap-2.5 border-t border-[#dce5f4] px-4 py-4">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          className="h-11 flex-1 rounded-lg border border-[#c9d8ee] px-3.5 text-base text-[#1f3550] outline-hidden transition focus:border-[#12395c]"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={isLoading}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#12395c] text-white transition hover:bg-[#0f2f4d] disabled:opacity-60"
        >
          {isLoading ? <span className="text-sm">Sending...</span> : <FaPaperPlane className="text-sm" />}
        </button>
      </form>
    </>
  );

  const Panel = (
    <div className="rounded-2xl border border-[#12395c]/20 bg-white shadow-[0_20px_48px_rgba(18,57,92,0.24)]">
      {Header}
      {isOpen && Body}
    </div>
  );

  if (inline) return Panel;

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mx-auto w-[min(24rem,calc(100vw-6.5rem))]">{Panel}</div>
    </div>
  );
}
