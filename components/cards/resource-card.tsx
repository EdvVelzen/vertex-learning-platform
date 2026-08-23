import React from "react";
import { cn } from "@/lib/utils";
import { FileText, ExternalLink } from "lucide-react";

export interface ResourceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  summary?: string;
  fileType?: string;
  fileSize?: string;
  onOpen?: () => void;
}

export function ResourceCard({
  title = "Caching and Revalidation Guide",
  summary = "Deep dive into Next.js caching strategies.",
  fileType = "PDF",
  fileSize = "1.2 MB",
  onOpen,
  className,
  ...props
}: ResourceCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-neutral-200 rounded-[16px] p-6 shadow-sm flex flex-col justify-between transition-shadow duration-200 hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-[10px] bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
          <FileText className="w-5 h-5 stroke-[2]" />
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 text-[16px] leading-[22px] font-sans tracking-tight">
            {title}
          </h3>
          <p className="text-neutral-500 text-[13px] leading-[18px] font-sans line-clamp-2">
            {summary}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[13px] font-sans">
        <div className="text-neutral-500 font-medium">
          <span>{fileType}</span>
          <span className="mx-2">•</span>
          <span>{fileSize}</span>
        </div>

        <div
          onClick={(e) => {
            if (onOpen) {
              e.stopPropagation();
              onOpen();
            }
          }}
          className="text-primary-500 hover:text-[#EA580C] transition-colors"
        >
          <ExternalLink className="w-4 h-4 stroke-[2]" />
        </div>
      </div>
    </div>
  );
}
