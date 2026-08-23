import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  activeHref?: string;
  items?: NavItem[];
}

export function Navbar({
  activeHref = "/courses",
  items = [
    { label: "Courses", href: "/courses", active: true },
    { label: "My Learning", href: "/my-learning", active: false },
  ],
  className,
  ...props
}: NavbarProps) {
  return (
    <header
      className={cn(
        "w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        <nav className="flex items-center gap-6">
          {items.map((item) => {
            const isActive = item.active ?? (item.href === activeHref);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[15px] font-sans font-medium transition-colors",
                  isActive
                    ? "text-primary-500 font-semibold"
                    : "text-neutral-700 hover:text-neutral-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
