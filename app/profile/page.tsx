"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Heart, DollarSign, ArrowLeft } from "lucide-react";

interface PlatformWallet {
  totalTips: number;
  totalDonations: number;
  lastUpdated: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [wallet, setWallet] = useState<PlatformWallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await fetch("/api/wallet");
      if (response.ok) {
        const data = await response.json();
        setWallet(data.wallet);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-semibold mb-4">My Profile</h3>
                <p className="text-muted-foreground mb-6">
                  Welcome to your profile! Here you can see your contribution to
                  the platform and track your impact.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        Platform Supporter
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Thank you for supporting Fundify!
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-lg font-medium text-foreground mb-3">
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View My Fundraisers
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Start New Fundraiser
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card rounded-lg shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Platform Wallet
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your contribution to Fundify
                      </p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">
                        Loading wallet...
                      </p>
                    </div>
                  ) : wallet ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Total Tips
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                            ${wallet.totalTips.toFixed(2)}
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Total Donations
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            ${wallet.totalDonations.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>Last updated</span>
                          <span>
                            {new Date(wallet.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No wallet data available yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Make your first donation with a tip to see your impact!
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-card rounded-lg shadow-sm p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Impact Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Causes Supported
                      </span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        People Helped
                      </span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Fundraisers Created
                      </span>
                      <span className="font-medium">0</span>
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
