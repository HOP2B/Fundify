"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Fundraiser {
  _id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  image: string;
  createdAt: string;
}

function CampaignCard({
  fundraiser,
  featured = false,
}: {
  fundraiser: Fundraiser;
  featured?: boolean;
}) {
  const progress = Math.min((fundraiser.raised / fundraiser.goal) * 100, 100);
  return (
    <div className={`group cursor-pointer ${featured ? "row-span-2" : ""}`}>
      <div
        className={`relative overflow-hidden rounded-lg ${featured ? "h-full min-h-[420px]" : "aspect-[4/3]"}`}
      >
        <Image
          src={fundraiser.image || "/placeholder.svg"}
          alt={fundraiser.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3">
          <span className="bg-foreground/80 text-background text-xs font-medium px-2.5 py-1 rounded capitalize">
            {fundraiser.category}
          </span>
        </div>
      </div>
      <div className="mt-3">
        <h3
          className={`font-semibold text-foreground leading-snug line-clamp-2 group-hover:underline ${featured ? "text-lg" : "text-sm"}`}
        >
          {fundraiser.title}
        </h3>
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-semibold text-foreground">
              ${fundraiser.raised.toLocaleString()}
            </span>{" "}
            raised of ${fundraiser.goal.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DiscoverFundraisers() {
  const [filter, setFilter] = useState("Happening worldwide");
  const [isOpen, setIsOpen] = useState(false);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    "Happening worldwide",
    "Near me",
    "United States",
    "Europe",
    "Asia",
  ];

  useEffect(() => {
    fetchFundraisers();
  }, []);

  const fetchFundraisers = async () => {
    try {
      const response = await fetch("/api/fundraisers?limit=5");
      const data = await response.json();
      setFundraisers(data.fundraisers || []);
    } catch (error) {
      console.error("Error fetching fundraisers:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredFundraiser = fundraisers[0];
  const gridFundraisers = fundraisers.slice(1);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Discover fundraisers inspired by what you care about
        </h2>

        <div className="flex items-center justify-between mb-8">
          {/* Dropdown Filter */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full bg-background hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium">{filter}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${filter === f ? "bg-muted font-medium" : ""}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 bg-transparent"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>

        {/* Campaign Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading fundraisers...</p>
          </div>
        ) : fundraisers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No fundraisers available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Featured Large Card */}
            {featuredFundraiser && (
              <div className="lg:col-span-5">
                <CampaignCard fundraiser={featuredFundraiser} featured={true} />
              </div>
            )}

            {/* 2x2 Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {gridFundraisers.map((fundraiser) => (
                <CampaignCard key={fundraiser._id} fundraiser={fundraiser} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
