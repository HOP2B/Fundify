"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Menu, X, Heart, User } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "@/lib/LanguageContext";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donateDropdownOpen, setDonateDropdownOpen] = useState(false);
  const [mobileDonateOpen, setMobileDonateOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left Navigation */}
          <nav className="flex-1 hidden md:flex items-center gap-1 justify-start">
            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              <Search className="w-4 h-4" />
              Хайх
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setDonateDropdownOpen(true)}
              onMouseLeave={() => setDonateDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
                Хандив өгөх
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {donateDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 transition-all duration-300 ease-out opacity-100 scale-100">
                  <div className="p-4 space-y-4">
                    <Link
                      href="/fundraisers"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:shadow-lg rounded-lg transition-all duration-200 border border-transparent hover:border-border"
                    >
                      <Search className="w-5 h-5 text-primary" />
                      <span className="font-medium">Discover fundraisers to support</span>
                    </Link>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/categories"
                        className="flex flex-col items-center gap-2 p-4 text-center text-sm text-foreground hover:shadow-lg rounded-none transition-all duration-200 border border-transparent hover:border-border group"
                      >
                        <Heart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-medium leading-tight">Categories<br /></span>
                      </Link>
                      <Link
                        href="/categories?type=crisis"
                        className="flex flex-col items-center gap-2 p-4 text-center text-sm text-foreground hover:shadow-lg rounded-none transition-all duration-200 border border-transparent hover:border-border group"
                      >
                        <Heart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-medium leading-tight">Crisis relief<br /></span>
                      </Link>
                      <Link
                        href="/social-impact-funds"
                        className="flex flex-col items-center gap-2 p-4 text-center text-sm text-foreground hover:shadow-lg rounded-none transition-all duration-200 border border-transparent hover:border-border group"
                      >
                        <Heart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-medium leading-tight">Social Impact Funds<br /></span>
                      </Link>
                      <Link
                        href="/supporter-space"
                        className="flex flex-col items-center gap-2 p-4 text-center text-sm text-foreground hover:shadow-lg rounded-none transition-all duration-200 border border-transparent hover:border-border group"
                      >
                        <User className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-medium leading-tight">Supporter Space<br /></span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
              <Link
              href="/fundraisers"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >

              Хандив цуглуулагчид
            </Link>
          </nav>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1">
            <span className="text-xl font-bold text-primary tracking-tight">
              Fundify
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
          <nav className="flex-1 hidden md:flex items-center gap-1 justify-end">
            
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
              Тухай
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <SignedOut>
              <Link
                href="/auth/sign-in"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                Нэвтрэх
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/profile"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                Профайл
              </Link>
              <UserButton />
            </SignedIn>
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
              <button
                onClick={() => setMobileDonateOpen(!mobileDonateOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-left"
              >
                Donate
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileDonateOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileDonateOpen && (
                <div className="ml-6 mt-2 space-y-2">
                  <Link
                    href="/fundraisers"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:shadow-md rounded-lg transition-all duration-200 border border-transparent hover:border-border"
                  >
                    <Search className="w-5 h-5 text-primary" />
                    <span className="font-medium">Discover fundraisers to support</span>
                  </Link>
                  <Link
                    href="/categories"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:shadow-md rounded-lg transition-all duration-200 border border-transparent hover:border-border group"
                  >
                    <Heart className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Categories – Browse fundraisers by category</span>
                  </Link>
                  <Link
                    href="/categories?type=crisis"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:shadow-md rounded-lg transition-all duration-200 border border-transparent hover:border-border group"
                  >
                    <Heart className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Crisis relief – Donate to verified relief</span>
                  </Link>
                  <Link
                    href="/social-impact-funds"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:shadow-md rounded-lg transition-all duration-200 border border-transparent hover:border-border group"
                  >
                    <Heart className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Social Impact Funds – Direct support for urgent needs</span>
                  </Link>
                  <Link
                    href="/supporter-space"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:shadow-md rounded-lg transition-all duration-200 border border-transparent hover:border-border group"
                  >
                    <User className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Supporter Space – Inspiration, FAQs, and where to give</span>
                  </Link>
                </div>
              )}
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-left">
                Fundraise
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-left">
                Тухай
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
                  <Link href="/donate" className="font-black">Start a Fundify</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
