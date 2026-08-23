import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage = 1,
  totalPages = 8,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const pages: (number | string)[] = [1, 2, 3, "...", 8];

  return (
    <nav
      aria-label="Pagination"
      className={cn("inline-flex items-center gap-1.5 select-none", className)}
      {...props}
    >
      <button
        onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="w-9 h-9 rounded-[8px] flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 stroke-[2]" />
      </button>

      {pages.map((page, index) => {
        if (typeof page === "string") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="w-9 h-9 flex items-center justify-center text-neutral-400 text-[14px]"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange && onPageChange(page)}
            className={cn(
              "w-9 h-9 rounded-[8px] flex items-center justify-center text-[14px] font-medium font-sans transition-colors",
              isActive
                ? "border border-primary-500 text-primary-500 bg-white shadow-xs font-semibold"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 rounded-[8px] flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 stroke-[2]" />
      </button>
    </nav>
  );
}
