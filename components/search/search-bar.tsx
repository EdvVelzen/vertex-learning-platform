"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  initialQuery = "",
  onSearch,
  placeholder = "Search lessons, topics, video moments...",
  className,
  ...props
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  if (initialQuery !== prevInitialQuery) {
    setPrevInitialQuery(initialQuery);
    setQuery(initialQuery);
  }

  // Focus on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (onSearch) {
      onSearch(trimmed);
    } else {
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/courses");
      }
    }
  };

  return (
    <div className={cn("w-full max-w-[720px] mx-auto", className)} {...props}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full bg-white border border-neutral-200/90 rounded-[14px] shadow-sm hover:border-neutral-300 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all duration-150"
      >
        <Search className="absolute left-4 sm:left-5 w-5 h-5 text-neutral-400 pointer-events-none stroke-[2]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[52px] sm:h-[56px] pl-12 sm:pl-13 pr-16 bg-transparent text-neutral-900 text-[15px] sm:text-[16px] placeholder:text-neutral-400 font-sans focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            inputRef.current?.focus();
            inputRef.current?.select();
          }}
          className="absolute right-3.5 flex items-center gap-0.5 px-2 py-1 rounded-[6px] border border-neutral-200 bg-neutral-100/80 text-neutral-500 text-[12px] font-medium select-none hover:bg-neutral-200/60 transition-colors"
        >
          ⌘ K
        </button>
      </form>
    </div>
  );
}
