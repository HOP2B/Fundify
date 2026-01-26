"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import Link from "next/link";
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

export default function SearchPage() {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFundraisers();
  }, []);

  const fetchFundraisers = async () => {
    try {
      const response = await fetch("/api/fundraisers");
      const data = await response.json();
      setFundraisers(data.fundraisers || []);
    } catch (error) {
      console.error("Error fetching fundraisers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFundraisers = fundraisers.filter(
    (fundraiser) =>
      fundraiser.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fundraiser.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Combined Header and Search */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Fundraisers
            </h1>
            <p className="text-gray-600 mb-6">
              Find fundraisers by person's name, location, title, or keyword
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Search fundraisers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button asChild className="w-full sm:w-auto">
              <Link href="/donate">Start a GoFundMe</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Fundraisers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2  mx-auto"></div>
            <p className="mt-4 ">Loading fundraisers...</p>
          </div>
        ) : filteredFundraisers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "No fundraisers match your search."
                : "No fundraisers available yet."}
            </p>
            <Link href="/donate">
              <Button>Start Your Own Fundraiser</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFundraisers.map((fundraiser) => (
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
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                      {fundraiser.title}
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2 capitalize">
                      {fundraiser.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {fundraiser.description}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Raised</span>
                      <span>
                        ${fundraiser.raised} / ${fundraiser.goal}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((fundraiser.raised / fundraiser.goal) * 100, 100)}%`,
                        }}
                      ></div>
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
