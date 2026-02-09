"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { ArrowLeft, Heart, Share2, Users, DollarSign, Calendar, TrendingUp, Target, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-white via-white to-white/80 shadow-lg border-b border-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-3 text-slate-600 hover:text-slate-900 mb-8 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 group-hover:shadow-md transition-all duration-200">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                </div>
                <span className="text-sm font-medium">Back to all fundraisers</span>
              </button>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column - Fundraiser Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Category and Status Badges */}
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <Target className="w-4 h-4 mr-2" />
                      {fundraiser.category}
                    </Badge>
                    <Badge 
                      variant={fundraiser.status === "active" ? "default" : "secondary"}
                      className={fundraiser.status === "completed" ? "bg-green-100 text-green-800" : ""}
                    >
                      {fundraiser.status === "active" && <Clock className="w-4 h-4 mr-2" />}
                      {fundraiser.status === "completed" && <CheckCircle className="w-4 h-4 mr-2" />}
                      {fundraiser.status === "pending" && <TrendingUp className="w-4 h-4 mr-2" />}
                      {fundraiser.status}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                    {fundraiser.title}
                  </h1>

                  {/* Organizer Info */}
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span className="text-sm">Organized by</span>
                    </div>
                    <span className="font-medium text-slate-900">
                      {fundraiser.forWhom === "myself" ? "Personal Cause" : "Supporting Someone"}
                    </span>
                  </div>
                </div>

                {/* Right Column - Donation Card */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="space-y-4">
                      <div className="text-center">
                        <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
                          ${fundraiser.raised.toLocaleString()}
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          raised of ${fundraiser.goal.toLocaleString()} goal
                        </CardDescription>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-3">
                        <Progress value={progressPercentage} className="h-3" />
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>{progressPercentage.toFixed(1)}% funded</span>
                          <span className="font-medium text-slate-900">
                            {Math.floor(
                              (Date.now() - new Date(fundraiser.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )} days active
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <Button
                        onClick={handleDonateClick}
                        disabled={fundraiser.status !== "active"}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        size="lg"
                      >
                        <Heart className="w-6 h-6 mr-3" />
                        {fundraiser.status === "active" ? "Donate Now" : "Completed"}
                      </Button>
                      
                      <div className="text-center text-sm text-slate-500">
                        Every contribution makes a difference
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  {fundraiser.image ? (
                    <img
                      src={fundraiser.image}
                      alt={fundraiser.title}
                      className="w-full h-[500px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=500&width=800";
                      }}
                    />
                  ) : (
                    <div className="w-full h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <div className="text-6xl mb-4">📸</div>
                        <p className="text-lg font-medium">No image available</p>
                      </div>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Story Section */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-slate-900">Our Story</CardTitle>
                    <CardDescription className="text-slate-600 text-lg">
                      Learn more about this cause and how your support can make a difference
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                        {fundraiser.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Organizer Section */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-slate-900">About the Organizer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Heart className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {fundraiser.forWhom === "myself" ? "Personal Cause" : "Supporting Someone"}
                        </h3>
                        <p className="text-slate-600 mt-1">Dedicated to making a positive impact</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">
                          ${fundraiser.raised.toLocaleString()}
                        </div>
                        <div className="text-slate-600">Raised</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">
                          {Math.floor(
                            (Date.now() - new Date(fundraiser.createdAt).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}
                        </div>
                        <div className="text-slate-600">Days Active</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">
                          {progressPercentage.toFixed(1)}%
                        </div>
                        <div className="text-slate-600">Goal Reached</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Share Section */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900">Share This Cause</CardTitle>
                    <CardDescription className="text-slate-600">
                      Help spread the word and make an even bigger impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full h-14 text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
                      size="lg"
                    >
                      <Share2 className="w-6 h-6 mr-3 text-slate-600" />
                      Share on Social Media
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900">Campaign Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <div>
                          <div className="font-semibold text-slate-900">Goal Amount</div>
                          <div className="text-sm text-slate-600">Target funding</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          ${fundraiser.goal.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-semibold text-slate-900">Progress</div>
                          <div className="text-sm text-slate-600">Campaign status</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {progressPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        <div>
                          <div className="font-semibold text-slate-900">Active Days</div>
                          <div className="text-sm text-slate-600">Since launch</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {Math.floor(
                            (Date.now() - new Date(fundraiser.createdAt).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Ready to Make a Difference?</CardTitle>
                    <CardDescription className="text-blue-100">
                      Your contribution can change lives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleDonateClick}
                      disabled={fundraiser.status !== "active"}
                      className="w-full h-14 text-lg font-semibold bg-white text-blue-600 hover:bg-slate-100 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      <Heart className="w-6 h-6 mr-3" />
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
