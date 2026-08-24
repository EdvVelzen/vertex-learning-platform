"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/courses");
    }
  };

  return (
    <div className="w-full max-w-[640px] pt-6">
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center w-full bg-white border border-neutral-200 rounded-[14px] shadow-sm hover:border-neutral-300 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all duration-150"
      >
        <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none stroke-[2]" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ask anything about your learning..."
          className="w-full h-[52px] sm:h-[56px] pl-12 pr-16 bg-transparent text-neutral-900 text-[15px] placeholder:text-neutral-400 font-sans focus:outline-none"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="absolute right-3.5 flex items-center gap-0.5 px-2 py-1 rounded-[6px] border border-neutral-200 bg-neutral-100/70 text-neutral-500 text-[12px] font-medium select-none hover:bg-neutral-200/60 transition-colors"
        >
          ⌘ K
        </button>
      </form>
    </div>
  );
}
