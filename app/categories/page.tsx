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

const categories = [
  { id: "medical", name: "Medical", icon: "🏥" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "emergency", name: "Emergency", icon: "🚨" },
  { id: "animals", name: "Animals", icon: "🐾" },
  { id: "environment", name: "Environment", icon: "🌱" },
  { id: "community", name: "Community", icon: "🤝" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "other", name: "Other", icon: "💝" },
];

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Browse Categories
          </h1>
          <p className="text-gray-600">
            Find causes that matter to you and make a difference
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Fundraisers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fundraisers...</p>
          </div>
        ) : fundraisers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No fundraisers found in this category.
            </p>
            <Link href="/start-fundme">
              <Button>Start Your Own Fundraiser</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundraisers.map((fundraiser) => (
              <div
                key={fundraiser._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gray-200 relative">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {fundraiser.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {fundraiser.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Raised</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${fundraiser.raised} / ${fundraiser.goal}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="text-sm font-medium capitalize">
                        {fundraiser.category}
                      </p>
                    </div>
                  </div>
                  <Button className="w-full">Donate Now</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
