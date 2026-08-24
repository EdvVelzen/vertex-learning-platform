import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar";
import { SearchResultsClient } from "@/components/search/search-results-client";
import { searchContent } from "@/lib/search";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const qParam = resolvedParams?.q || resolvedParams?.query;
  const query = typeof qParam === "string" ? qParam.trim() : "Search";

  return {
    title: `${query ? `Results for "${query}"` : "Search"} — Vertex`,
    description: `Intelligent search across courses, lessons, and video moments on Vertex.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const qParam = resolvedParams?.q || resolvedParams?.query;
  const query = typeof qParam === "string" && qParam.trim() ? qParam.trim() : "data fetching";
  const sortParam = resolvedParams?.sort;
  const sort = typeof sortParam === "string" ? sortParam : "relevant";

  const searchData = await searchContent(query, sort);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]/80 text-neutral-900 font-sans selection:bg-primary-100 selection:text-primary-500">
      {/* Top Navbar */}
      <Navbar activeHref="/courses" />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <SearchResultsClient
          initialQuery={query}
          initialSort={sort}
          initialResults={searchData.results}
          initialTotalCount={searchData.totalCount}
          initialCourseCount={searchData.courseCount}
        />
      </main>
    </div>
  );
}
