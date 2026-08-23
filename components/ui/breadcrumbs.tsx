import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: (string | BreadcrumbItem)[];
}

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-[14px] font-sans", className)}
      {...props}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const label = typeof item === "string" ? item : item.label;
          const href = typeof item === "string" ? undefined : item.href;

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 stroke-[2]" />
              )}
              {isLast ? (
                <span className="text-neutral-900 font-medium">{label}</span>
              ) : href ? (
                <a
                  href={href}
                  className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  {label}
                </a>
              ) : (
                <span className="text-neutral-500">{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
