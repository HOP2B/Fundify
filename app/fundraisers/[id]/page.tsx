"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Fundraiser {
  _id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  image: string;
  forWhom: string;
  creator: string;
  status: string;
  createdAt: string;
}

export default function FundraiserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchFundraiser();
    }
  }, [params.id]);

  const fetchFundraiser = async () => {
    try {
      const response = await fetch(`/api/fundraisers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFundraiser(data.fundraiser);
      } else {
        router.push("/404");
      }
    } catch (error) {
      console.error("Error fetching fundraiser:", error);
      router.push("/404");
    } finally {
      setLoading(false);
    }
  };

  const handleDonateClick = () => {
    router.push(`/donate/${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Fundraiser Not Found
          </h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    (fundraiser.raised / fundraiser.goal) * 100,
    100,
  );

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="bg-card shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    {fundraiser.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
                      {fundraiser.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        fundraiser.status === "active"
                          ? "bg-green-100 text-green-800"
                          : fundraiser.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {fundraiser.status}
                    </span>
                  </div>
                </div>
                <div className="lg:w-96">
                  <div className="bg-card rounded-xl shadow-sm border p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-primary mb-2">
                        ${fundraiser.raised.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground mb-4">
                        raised of ${fundraiser.goal.toLocaleString()} goal
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 mb-4">
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {progressPercentage.toFixed(1)}% funded
                      </div>
                    </div>

                    <Button
                      onClick={handleDonateClick}
                      disabled={fundraiser.status !== "active"}
                      className="w-full"
                      size="lg"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      {fundraiser.status === "active"
                        ? "Donate Now"
                        : fundraiser.status}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Image */}
                <div className="bg-muted rounded-xl overflow-hidden mb-8">
                  {fundraiser.image ? (
                    <img
                      src={fundraiser.image}
                      alt={fundraiser.title}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}
                </div>

                {/* Story */}
                <div className="bg-card rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Story
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {fundraiser.description}
                    </p>
                  </div>
                </div>

                {/* Organizer */}
                <div className="bg-card rounded-xl shadow-sm p-8 mt-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Organizer
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {fundraiser.forWhom === "myself"
                          ? "Personal Cause"
                          : "Supporting Someone"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Organizer
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Share */}
                <div className="bg-card rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Share this fundraiser
                  </h3>
                  <Button variant="outline" className="w-full" size="lg">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Stats */}
                <div className="bg-card rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Fundraiser Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Goal</span>
                      <span className="font-medium">
                        ${fundraiser.goal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Raised</span>
                      <span className="font-medium">
                        ${fundraiser.raised.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Days Active</span>
                      <span className="font-medium">
                        {Math.floor(
                          (Date.now() -
                            new Date(fundraiser.createdAt).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
