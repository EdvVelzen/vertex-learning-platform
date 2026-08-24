import React from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CantFindBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CantFindBanner({ className, ...props }: CantFindBannerProps) {
  return (
    <div
      className={cn(
        "w-full bg-[#FFF7ED]/70 border border-[#FED7AA]/60 rounded-[16px] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 mt-10 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-xs">
          <Search className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h4 className="text-[16px] font-semibold text-neutral-900 font-sans tracking-tight">
            Can&apos;t find what you&apos;re looking for?
          </h4>
          <p className="text-[14px] text-neutral-500 font-sans mt-0.5">
            Try different keywords or browse our full course catalog.
          </p>
        </div>
      </div>

      <Link
        href="/courses"
        className="shrink-0 inline-flex items-center gap-2 bg-white hover:bg-neutral-50/90 text-neutral-800 hover:text-neutral-900 border border-neutral-200/90 hover:border-neutral-300 font-sans text-[14px] font-medium px-5 py-2.5 rounded-[10px] shadow-xs transition-colors"
      >
        <span>Browse all courses</span>
        <ArrowRight className="w-4 h-4 text-primary-500 stroke-[2]" />
      </Link>
    </div>
  );
}
