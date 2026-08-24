"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SearchResult, VideoSearchResult, LessonSearchResult } from "@/sanity/lib/types";
import { LessonVideoCard } from "@/components/cards/lesson-video-card";
import { LessonCard } from "@/components/cards/lesson-card";
import { SearchBar } from "@/components/search/search-bar";
import { CantFindBanner } from "@/components/search/cant-find-banner";
import { ChevronDown, Sparkles } from "lucide-react";

export interface SearchResultsClientProps {
  initialQuery: string;
  initialSort?: string;
  initialResults: SearchResult[];
  initialTotalCount: number;
  initialCourseCount: number;
}

export function SearchResultsClient({
  initialQuery,
  initialSort = "relevant",
  initialResults,
  initialTotalCount,
  initialCourseCount,
}: SearchResultsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [courseCount, setCourseCount] = useState(initialCourseCount);
  const [isLoading, setIsLoading] = useState(false);

  // Re-sort results client-side or re-fetch if needed
  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const sorted = [...results];
    if (newSort === "duration-asc") {
      sorted.sort((a, b) => {
        const durA = (a as VideoSearchResult).startSeconds ?? 0;
        const durB = (b as VideoSearchResult).startSeconds ?? 0;
        return durA - durB;
      });
    } else if (newSort === "duration-desc") {
      sorted.sort((a, b) => {
        const durA = (a as VideoSearchResult).startSeconds ?? 0;
        const durB = (b as VideoSearchResult).startSeconds ?? 0;
        return durB - durA;
      });
    } else {
      sorted.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }
    setResults(sorted);
  };

  const handleSearch = async (newQuery: string) => {
    const trimmed = newQuery.trim();
    if (!trimmed) {
      router.push("/courses");
      return;
    }

    setQuery(trimmed);
    setIsLoading(true);

    try {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(trimmed)}&sort=${sort}`);
      });

      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&sort=${sort}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        setTotalCount(data.totalCount || 0);
        setCourseCount(data.courseCount || 0);
      }
    } catch (error) {
      console.error("Client search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Centered Search Header matching vertex-search.png */}
      <section className="text-center pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]/60 text-[#EA580C] text-[11px] font-bold tracking-widest uppercase mb-4 shadow-xs">
          <span>SEARCH RESULTS</span>
        </div>

        <h1 className="text-[36px] sm:text-[44px] lg:text-[48px] font-serif font-normal text-neutral-900 tracking-tight leading-tight max-w-4xl mx-auto px-4">
          Results for <span className="text-primary-500 font-medium font-serif">&ldquo;{query}&rdquo;</span>
        </h1>

        <p className="text-[15px] sm:text-[16px] text-neutral-500 font-sans mt-2.5">
          Found {totalCount} {totalCount === 1 ? "result" : "results"} across {courseCount} {courseCount === 1 ? "course" : "courses"}
        </p>

        {/* Centered Search Bar */}
        <div className="mt-7 sm:mt-8 px-4">
          <SearchBar
            initialQuery={query}
            onSearch={handleSearch}
            placeholder="Search lessons, topics, video moments..."
          />
        </div>
      </section>

      {/* Main Results Container */}
      <section className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 pb-20">
        {/* Results Controls Bar (Count + Sort) */}
        <div className="flex items-center justify-between gap-4 mb-6 pt-2">
          <div className="text-[15px] font-semibold text-neutral-900 font-sans">
            {totalCount} results
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white border border-neutral-200 hover:border-neutral-300 rounded-[10px] pl-3.5 pr-8 py-2 text-[13px] sm:text-[14px] font-medium text-neutral-700 hover:text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-100 cursor-pointer"
            >
              <option value="relevant">Most Relevant</option>
              <option value="duration-asc">Duration: Short to Long</option>
              <option value="duration-desc">Duration: Long to Short</option>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
          </div>
        </div>

        {/* Results List */}
        {isLoading || isPending ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200 rounded-[16px] p-6 shadow-sm flex flex-col md:flex-row gap-6 animate-pulse"
              >
                <div className="w-full md:w-[320px] aspect-video bg-neutral-100 rounded-[12px]" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 w-32 bg-neutral-100 rounded-sm" />
                  <div className="h-6 w-3/4 bg-neutral-100 rounded-sm" />
                  <div className="h-4 w-full bg-neutral-100 rounded-sm" />
                  <div className="h-4 w-1/2 bg-neutral-100 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4 sm:space-y-5">
            {results.map((item) => {
              if (item.type === "video") {
                const videoItem = item as VideoSearchResult;
                return (
                  <LessonVideoCard
                    key={videoItem.id}
                    title={videoItem.title}
                    summary={videoItem.summary}
                    lessonLabel={videoItem.lessonLabel}
                    moduleLabel={videoItem.moduleLabel}
                    timestamp={videoItem.timestamp}
                    startSeconds={videoItem.startSeconds}
                    thumbnail={videoItem.thumbnail}
                    course={videoItem.course}
                    lessonSlug={videoItem.lessonSlug}
                    courseSlug={videoItem.courseSlug}
                  />
                );
              } else {
                const lessonItem = item as LessonSearchResult;
                return (
                  <LessonCard
                    key={lessonItem.id}
                    title={lessonItem.title}
                    summary={lessonItem.summary}
                    moduleLabel={lessonItem.moduleLabel}
                    keyPoints={lessonItem.keyPoints}
                    course={lessonItem.course}
                    lessonSlug={lessonItem.lessonSlug}
                    courseSlug={lessonItem.courseSlug}
                  />
                );
              }
            })}
          </div>
        ) : (
          /* Empty State when no results found */
          <div className="bg-white border border-neutral-200 rounded-[16px] p-10 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-[20px] font-semibold text-neutral-900 font-sans tracking-tight">
              No matching results found
            </h3>
            <p className="text-[14px] text-neutral-500 font-sans max-w-md mx-auto mt-1.5 leading-relaxed">
              We couldn&apos;t find any lessons or video moments matching &ldquo;{query}&rdquo;. Try checking for typos or searching with different keywords.
            </p>
          </div>
        )}

        {/* Bottom Banner */}
        <CantFindBanner />
      </section>
    </div>
  );
}
