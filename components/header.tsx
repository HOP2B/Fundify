"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              Donate
              <ChevronDown className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
              Fundraise
              <ChevronDown className="w-4 h-4" />
            </button>
          </nav>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-primary tracking-tight">
              gofundme
            </span>
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary -mt-2">
              <circle cx="12" cy="8" r="3" fill="currentColor" />
              <path
                d="M9 11 Q12 15 15 11"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          {/* Right Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
              About
              <ChevronDown className="w-4 h-4" />
            </button>
            <SignedOut>
              <Link
                href="/auth/sign-in"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                Sign in
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <Button
              asChild
              variant="outline"
              className="ml-2 rounded-full border-foreground text-foreground hover:bg-foreground hover:text-background font-medium bg-transparent"
            >
              <Link href="/start-fundme">Start a GoFundMe</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              <Link href="/search" className="px-3 py-2 text-sm font-medium">
                Search
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-left"
              >
                Donate
                <ChevronDown className="w-4 h-4" />
              </Link>
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-left">
                Fundraise
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-left">
                About
                <ChevronDown className="w-4 h-4" />
              </button>
              <SignedOut>
                <Link
                  href="/auth/sign-in"
                  className="px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="px-3 py-2">
                  <UserButton />
                </div>
              </SignedIn>
              <div className="px-3 pt-2">
                <Button asChild className="w-full rounded-full">
                  <Link href="/start-fundme">Start a GoFundMe</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
