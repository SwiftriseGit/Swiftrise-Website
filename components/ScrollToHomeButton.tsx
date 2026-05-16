"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowUp, FaRobot, FaEnvelope } from "react-icons/fa";
import Chatbot from "./Chatbot";

// Chat moved to a dedicated page at /chat

export default function ScrollToHomeButton() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  

  const handleEmailClick = () => {
    // First try to scroll on current page
    const contactFormSection = document.getElementById("contact-form");
    if (contactFormSection) {
      contactFormSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // If not found, navigate to contact page
      router.push("/contact#contact-form");
    }
  };

  return (
    <div
      className={`fixed bottom-12 right-8 z-70 flex flex-col gap-3 transition-all duration-300 sm:bottom-16 sm:right-10 ${
        isVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="relative flex flex-col items-end gap-3">
        {isChatOpen && (
          <div className="absolute bottom-0 right-16 z-10 w-[min(24rem,calc(100vw-6.5rem))]">
            <Chatbot inline onClose={() => setIsChatOpen(false)} />
          </div>
        )}

        <button
          type="button"
          aria-label="Scroll to contact section"
          onClick={handleEmailClick}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[#12395c]/35 bg-white text-[#12395c] shadow-[0_10px_24px_rgba(18,57,92,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12395c]/60 hover:bg-[#e9f1fb]"
        >
          <FaEnvelope className="text-xl" />
        </button>

        <button
          type="button"
          aria-label="Open chat assistant"
          onClick={() => setIsChatOpen((p) => !p)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[#12395c]/35 bg-white text-[#12395c] shadow-[0_10px_24px_rgba(18,57,92,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12395c]/60 hover:bg-[#e9f1fb]"
        >
          <FaRobot className="text-xl" />
        </button>

        <button
          type="button"
          aria-label="Scroll to home section"
          onClick={handleClick}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[#12395c]/35 bg-[#12395c] text-[#ffffff] shadow-[0_10px_24px_rgba(18,57,92,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12395c]/55 hover:bg-linear-to-b hover:from-[#73bcfb] hover:to-[#12395c]"
        >
          <FaArrowUp className="text-xl" />
        </button>
      </div>
    </div>
  );
}
