"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { ArrowLeft, Heart, CreditCard, Lock } from "lucide-react";

const PRESET_AMOUNTS = [50, 100, 200, 300, 500, 1000];

export default function DonatePage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const fundraiserId = params.id as string;

  const [fundraiser, setFundraiser] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFundraiser();
  }, [fundraiserId]);

  const fetchFundraiser = async () => {
    try {
      const response = await fetch(`/api/fundraisers/${fundraiserId}`);
      if (response.ok) {
        const data = await response.json();
        setFundraiser(data.fundraiser);
      }
    } catch (error) {
      console.error("Error fetching fundraiser:", error);
    }
  };

  const getDonationAmount = (): number => {
    if (selectedAmount) return selectedAmount;
    const custom = parseFloat(customAmount);
    return isNaN(custom) ? 0 : custom;
  };

  const getTipAmount = (): number => {
    const donation = getDonationAmount();
    return donation * (tipPercentage / 100);
  };

  const getTotalAmount = (): number => {
    return getDonationAmount() + getTipAmount();
  };

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setSelectedAmount(null);
    setCustomAmount(value);
  };

  const handleDonate = async () => {
    const donationAmount = getDonationAmount();
    if (donationAmount <= 0) {
      setError("Please enter a valid donation amount");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(`/api/fundraisers/${fundraiserId}/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: donationAmount,
          tip: getTipAmount(),
          donorId: user?.id,
          donorEmail: user?.emailAddresses[0]?.emailAddress,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Thank you for your donation!");
        router.push(`/fundraisers/${fundraiserId}`);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to process donation");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while processing your donation");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!fundraiser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute top-40 right-10 w-96 h-96 bg-primary/3 rounded-full blur-4xl" />
              <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary/2 rounded-full blur-3xl" />
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Donation Form */}
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Make a Donation
                    </h2>
                    <p className="text-muted-foreground">
                      Your support makes a difference
                    </p>
                  </div>

                  {/* Preset Amounts */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {PRESET_AMOUNTS.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handlePresetClick(amount)}
                          className={`p-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
                            selectedAmount === amount
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Or Enter Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) =>
                          handleCustomAmountChange(e.target.value)
                        }
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg font-semibold"
                      />
                    </div>
                  </div>

                  {/* Tip Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-foreground">
                        Add a tip for Fundify
                      </label>
                      <span className="text-sm font-bold text-primary">
                        {tipPercentage}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={tipPercentage}
                      onChange={(e) =>
                        setTipPercentage(parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>15%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Donation Amount
                      </span>
                      <span className="font-semibold">
                        ${getDonationAmount().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tip ({tipPercentage}%)
                      </span>
                      <span className="font-semibold">
                        ${getTipAmount().toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-foreground">Total</span>
                        <span className="font-bold text-xl text-primary">
                          ${getTotalAmount().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment via Credit Card</span>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Secure payment powered by Stripe</span>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  {/* Donate Button */}
                  <Button
                    onClick={handleDonate}
                    disabled={isProcessing || getDonationAmount() <= 0}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-2" />
                        Donate ${getTotalAmount().toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Right Panel - Fundraiser Info */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-4">
                      {fundraiser.title}
                    </h1>
                    <p className="text-muted-foreground leading-relaxed">
                      {fundraiser.description}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Raised</span>
                      <span className="font-bold text-primary">
                        ${fundraiser.raised?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/60 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((fundraiser.raised / fundraiser.goal) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Goal: ${fundraiser.goal.toLocaleString()}</span>
                      <span>
                        {Math.round(
                          (fundraiser.raised / fundraiser.goal) * 100,
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium capitalize">
                      {fundraiser.category}
                    </span>
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
