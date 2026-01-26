"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

import {
  Heart,
  GraduationCap,
  Stethoscope,
  Flame,
  PawPrint,
  TreePine,
  Briefcase,
  Users,
  Palette,
  Calendar,
  Church,
  Trophy,
  Plane,
  HandHeart,
  Star,
  Home,
  Car,
} from "lucide-react";

const categories = [
  { id: "medical", name: "Medical", icon: Stethoscope },
  { id: "memorial", name: "Memorial", icon: Heart },
  { id: "emergency", name: "Emergency", icon: Flame },
  { id: "nonprofit", name: "Nonprofit", icon: Users },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "animals", name: "Animal", icon: PawPrint },
  { id: "environment", name: "Environment", icon: TreePine },
  { id: "business", name: "Business", icon: Briefcase },
  { id: "community", name: "Community", icon: Users },
  { id: "creative", name: "Creative", icon: Palette },
  { id: "event", name: "Event", icon: Calendar },
  { id: "faith", name: "Faith", icon: Church },
  { id: "family", name: "Family", icon: Users },
  { id: "sports", name: "Sports", icon: Trophy },
  { id: "travel", name: "Travel", icon: Plane },
  { id: "volunteer", name: "Volunteer", icon: HandHeart },
  { id: "wishes", name: "Wishes", icon: Star },
  { id: "competition", name: "Competition", icon: Trophy },
];

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFundraisers(selectedCategory);
  }, [selectedCategory]);

  const fetchFundraisers = async (category: string) => {
    setLoading(true);
    try {
      const url =
        category === "all"
          ? "/api/fundraisers"
          : `/api/fundraisers?category=${category}`;
      const response = await fetch(url);
      const data = await response.json();
      setFundraisers(data.fundraisers || []);
    } catch (error) {
      console.error("Error fetching fundraisers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2">
                Browse Categories
              </h1>
              <p className="text-muted-foreground text-xl">
                Find causes that matter to you and make a difference
              </p>
            </div>
            <Link href="/donate">
              <Button size="lg" className="rounded-full px-8">
                Start GoFundMe
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-lg">
            Find causes that matter to you and make a difference
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground shadow-lg"
                      : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className={`p-4 rounded-full transition-colors ${
                        isSelected
                          ? "bg-primary-foreground/20"
                          : "bg-primary/10 group-hover:bg-primary/20"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          isSelected
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-lg font-semibold text-center ${
                        isSelected
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {category.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fundraisers Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading fundraisers...</p>
          </div>
        ) : fundraisers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">
              No fundraisers found in this category.
            </p>
            <Link href="/donate">
              <Button size="lg" className="rounded-full">
                Start Your Own Fundraiser
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fundraisers.map((fundraiser) => (
              <div
                key={fundraiser._id}
                className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-primary/20"
              >
                <div className="aspect-video bg-muted relative">
                  <img
                    src={fundraiser.image}
                    alt={fundraiser.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/placeholder.svg?height=300&width=400";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                    {fundraiser.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                    {fundraiser.description}
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Raised</p>
                      <p className="text-2xl font-bold text-primary">
                        ${fundraiser.raised.toLocaleString()} / $
                        {fundraiser.goal.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="text-sm font-medium capitalize text-foreground">
                        {fundraiser.category}
                      </p>
                    </div>
                  </div>
                  <Button className="w-full rounded-full" size="lg">
                    Donate Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
