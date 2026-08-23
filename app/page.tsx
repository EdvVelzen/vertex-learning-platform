"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/cards/course-card";
import { Search, ArrowRight, Star } from "lucide-react";

export default function HomePage() {
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
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-neutral-900 font-sans selection:bg-primary-100 selection:text-primary-500">
      {/* Top Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-12">
          {/* Hero Section */}
          <section className="text-center flex flex-col items-center max-w-3xl mx-auto space-y-5">
            {/* Intelligent Learning Pill */}
            <div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-[8px] bg-[#FFEEE5] border border-primary-200/80 text-[#EA580C] text-[11px] font-bold tracking-widest uppercase font-sans">
                INTELLIGENT LEARNING
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-[44px] sm:text-[56px] md:text-[64px] leading-[1.08] font-bold text-neutral-900 tracking-tight">
              Search your learning
              <br />
              in plain English.
            </h1>

            {/* Subtitle */}
            <p className="text-neutral-500 text-[15px] sm:text-[17px] leading-[26px] max-w-[540px] pt-1">
              Vertex understands what you want to learn and
              <br className="hidden sm:inline" /> finds the exact lessons across
              all your courses.
            </p>

            {/* Primary CTA Button */}
            <div className="pt-3">
              <Link href="/courses">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-[46px] px-6 text-[15px] rounded-[12px] font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.2]" />
                </Button>
              </Link>
            </div>

            {/* Search Input Bar */}
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
          </section>

          {/* All Courses Section */}
          <section className="mt-20 pt-8 border-t border-neutral-200/80">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-[24px] sm:text-[28px] font-bold text-neutral-900">
                All Courses
              </h2>
              <Link
                href="/courses"
                className="text-primary-500 hover:text-[#EA580C] text-[14px] font-medium flex items-center gap-1.5 transition-colors group"
              >
                <span>View all courses</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2]" />
              </Link>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Next.js for Production */}
              <Link href="/courses/nextjs-for-production" className="block">
                <CourseCard
                  orientation="vertical"
                  title="Next.js for Production"
                  summary="Build scalable, high-performance web applications with Next.js."
                  level="Intermediate"
                  duration="18h 24m"
                  moduleCount="12 modules"
                  icon={
                    <div className="w-14 h-14 bg-black rounded-[14px] flex items-center justify-center text-white font-serif font-bold text-3xl shadow-sm select-none">
                      N
                    </div>
                  }
                />
              </Link>

              {/* Card 2: Docker Essentials */}
              <Link href="/courses/docker-essentials" className="block">
                <CourseCard
                  orientation="vertical"
                  title="Docker Essentials"
                  summary="Containerize applications and streamline your development workflow."
                  level="Beginner"
                  duration="10h 12m"
                  moduleCount="8 modules"
                  icon={
                    <div className="w-14 h-14 bg-[#E0F2FE] rounded-[14px] flex items-center justify-center shadow-sm select-none">
                      <svg
                        className="w-10 h-10"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Containers */}
                        <rect
                          x="11"
                          y="18"
                          width="4"
                          height="3.6"
                          rx="0.5"
                          fill="#0284C7"
                        />
                        <rect
                          x="16"
                          y="18"
                          width="4"
                          height="3.6"
                          rx="0.5"
                          fill="#0284C7"
                        />
                        <rect
                          x="21"
                          y="18"
                          width="4"
                          height="3.6"
                          rx="0.5"
                          fill="#0284C7"
                        />
                        <rect
                          x="16"
                          y="13.5"
                          width="4"
                          height="3.6"
                          rx="0.5"
                          fill="#0284C7"
                        />
                        <rect
                          x="21"
                          y="13.5"
                          width="4"
                          height="3.6"
                          rx="0.5"
                          fill="#0284C7"
                        />
                        <rect
                          x="21"
                          y="9"
                          width="4"
                          height="3.6"
                          rx="0.5"
                          fill="#0284C7"
                        />
                        {/* Whale Body */}
                        <path
                          d="M5 27C6.5 23.5 10 22.5 14 22.5H28C35 22.5 39 26 40.5 29C41.7 31.2 41 34 38.5 35C36 36 33 36 28 36C17 36 8 35 5 27Z"
                          fill="#38BDF8"
                          stroke="#0284C7"
                          strokeWidth="1.5"
                        />
                        {/* Whale Tail */}
                        <path
                          d="M40 29C43 27.5 45 25 45.5 23C44.3 24.4 42 25.6 39.6 26.4"
                          stroke="#0284C7"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        {/* Whale Eye */}
                        <circle cx="34.5" cy="28" r="1.2" fill="#0F172A" />
                        {/* Water Spout */}
                        <path
                          d="M30 21C30.4 19 32 18.4 33 18.8"
                          stroke="#0284C7"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  }
                />
              </Link>

              {/* Card 3: TypeScript Deep Dive */}
              <Link href="/courses/typescript-deep-dive" className="block">
                <CourseCard
                  orientation="vertical"
                  title="TypeScript Deep Dive"
                  summary="Go beyond the basics and write safer, more expressive code."
                  level="Intermediate"
                  duration="14h 36m"
                  moduleCount="10 modules"
                  icon={
                    <div className="w-14 h-14 bg-[#3178C6] rounded-[14px] flex items-center justify-center text-white font-sans font-bold text-2xl tracking-tight shadow-sm select-none">
                      TS
                    </div>
                  }
                />
              </Link>
            </div>
          </section>

          {/* Weekly Updates Divider Notice */}
          <div className="mt-20 mb-12 flex items-center justify-center max-w-2xl mx-auto px-4">
            <div className="flex-1 h-px bg-neutral-200/90" />
            <div className="flex items-center gap-2.5 px-4 text-neutral-600 text-[14px] font-sans shrink-0">
              <Star className="w-4 h-4 text-primary-500 stroke-[1.8] fill-transparent" />
              <span>New courses and lessons added every week.</span>
            </div>
            <div className="flex-1 h-px bg-neutral-200/90" />
          </div>
        </div>

        {/* Warm Atmosphere Bottom Graphic (Equalizer Bars) */}
        <div className="w-full mt-auto relative overflow-hidden pointer-events-none flex items-end justify-center">
          <div className="w-full h-36 sm:h-44 md:h-52 flex items-end justify-center gap-2 sm:gap-3 px-4 max-w-[1440px]">
            {[
              "h-12 opacity-30",
              "h-20 opacity-40",
              "h-32 opacity-60",
              "h-24 opacity-50",
              "h-16 opacity-35",
              "h-28 opacity-55",
              "h-40 opacity-75",
              "h-48 opacity-90",
              "h-36 opacity-70",
              "h-20 opacity-45",
              "h-14 opacity-30",
              "h-24 opacity-50",
              "h-44 opacity-85",
              "h-52 opacity-100",
              "h-36 opacity-70",
              "h-20 opacity-40",
              "h-28 opacity-55",
              "h-44 opacity-80",
              "h-32 opacity-60",
              "h-16 opacity-35",
            ].map((barStyle, idx) => (
              <div
                key={idx}
                className={`flex-1 max-w-[56px] rounded-t-[8px] bg-gradient-to-t from-[#FB923C]/50 via-[#FED7AA]/30 to-transparent transition-all duration-300 ${barStyle}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}