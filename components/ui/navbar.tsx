import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  activeHref?: string;
  items?: NavItem[];
  showActions?: boolean;
}

export function Navbar({
  activeHref,
  items = [
    { label: "Courses", href: "/courses" },
    { label: "My Learning", href: "/my-learning" },
  ],
  showActions = true,
  className,
  ...props
}: NavbarProps) {
  return (
    <header
      className={cn(
        "w-full bg-transparent border-b border-neutral-200/80",
        className
      )}
      {...props}
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 focus:outline-none">
            <Logo size="md" />
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            {items.map((item) => {
              const isActive = item.active ?? (activeHref === item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-[15px] font-sans transition-colors",
                    isActive
                      ? "text-primary-500 font-semibold"
                      : "text-neutral-700 hover:text-neutral-900 font-medium"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {showActions && (
          <div className="flex items-center gap-3 sm:gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="tertiary" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <button
                type="button"
                aria-label="Notifications"
                className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <Bell className="w-5 h-5 stroke-[2]" />
              </button>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9",
                  },
                }}
              />
            </Show>
          </div>
        )}
      </div>
    </header>
  );
}
