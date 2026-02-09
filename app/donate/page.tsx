"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
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
  ArrowLeft,
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

interface FormData {
  forWhom: string;
  goal: number;
  title: string;
  description: string;
  category: string;
  image: string;
}

export default function StartFundmePage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    forWhom: "",
    goal: 0,
    title: "",
    description: "",
    category: "",
    image: "",
  });

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.category) {
        newErrors.category = "Please select a category";
      }
    } else if (step === 2) {
      if (!formData.forWhom) {
        newErrors.forWhom = "Please select who this fundraiser is for";
      }
    } else if (step === 3) {
      if (!formData.goal || formData.goal < 1) {
        newErrors.goal = "Goal must be at least $1";
      }
    } else if (step === 4) {
      // no validation for photo
    } else if (step === 5) {
      if (!formData.title || formData.title.length < 5) {
        newErrors.title = "Title must be at least 5 characters";
      }
      if (!formData.description || formData.description.length < 20) {
        newErrors.description = "Description must be at least 20 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/fundraisers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          creator: user?.id,
        }),
      });

      if (response.ok) {
        alert("Fundraiser created successfully!");
        router.push("/my-fundraisers");
      } else {
        alert("Failed to create fundraiser");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1:
        return "Choose Category";
      case 2:
        return "Who's it for?";
      case 3:
        return "Set Goal";
      case 4:
        return "Add Photo";
      case 5:
        return "Tell Your Story";
      case 6:
        return "Review & Create";
      default:
        return "Step";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Select a Category
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isSelected = formData.category === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleInputChange("category", category.id)}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 border-transparent text-white shadow-xl shadow-blue-500/30"
                        : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
                    )}
                    <div className="relative flex flex-col items-center gap-3">
                      <div
                        className={`p-3 rounded-full transition-all duration-300 ${
                          isSelected
                            ? "bg-white/20 scale-110"
                            : "bg-gradient-to-br from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 transition-colors duration-300 ${
                            isSelected
                              ? "text-white"
                              : "text-purple-600 group-hover:text-purple-700"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm font-semibold text-center transition-colors duration-300 ${
                          isSelected
                            ? "text-white"
                            : "text-gray-700 group-hover:text-purple-700"
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-destructive text-sm">{errors.category}</p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Who is this fundraiser for?
            </h2>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleInputChange("forWhom", "myself")}
                className={`group w-full p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  formData.forWhom === "myself"
                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg shadow-blue-500/20"
                    : "border-gray-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full transition-all duration-300 ${
                    formData.forWhom === "myself"
                      ? "bg-blue-500 text-white"
                      : "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                  }`}>
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <div className={`font-semibold text-lg transition-colors duration-300 ${
                      formData.forWhom === "myself" ? "text-blue-700" : "text-gray-800"
                    }`}>Myself</div>
                    <div className="text-sm text-muted-foreground">
                      I'm raising money for my own cause
                    </div>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("forWhom", "someone_else")}
                className={`group w-full p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  formData.forWhom === "someone_else"
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg shadow-purple-500/20"
                    : "border-gray-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full transition-all duration-300 ${
                    formData.forWhom === "someone_else"
                      ? "bg-purple-500 text-white"
                      : "bg-pink-100 text-pink-600 group-hover:bg-pink-200"
                  }`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className={`font-semibold text-lg transition-colors duration-300 ${
                      formData.forWhom === "someone_else" ? "text-purple-700" : "text-gray-800"
                    }`}>Someone else</div>
                    <div className="text-sm text-muted-foreground">
                      I'm raising money for someone else's cause
                    </div>
                  </div>
                </div>
              </button>
            </div>
            {errors.forWhom && (
              <p className="text-destructive text-sm">{errors.forWhom}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              How much do you need to raise?
            </h2>
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Goal Amount ($)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold text-lg">
                  $
                </div>
                <input
                  type="number"
                  value={formData.goal || ""}
                  onChange={(e) =>
                    handleInputChange("goal", parseFloat(e.target.value) || 0)
                  }
                  placeholder="5000"
                  className="w-full pl-8 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  min="1"
                />
              </div>
              {errors.goal && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  {errors.goal}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Add a picture for your fundraiser
            </h2>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(5)}
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              What's the reason for your fundraiser?
            </h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fundraiser Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Help me buy a new laptop for college"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Story
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Tell your story and why people should support you..."
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Review Your Fundraiser
            </h2>
            <div className="space-y-4">
              <p>
                <strong>Category:</strong> {formData.category}
              </p>
              <p>
                <strong>For:</strong>{" "}
                {formData.forWhom === "myself" ? "Myself" : "Someone else"}
              </p>
              <p>
                <strong>Goal:</strong> ${formData.goal}
              </p>
              <p>
                <strong>Title:</strong> {formData.title}
              </p>
              <p>
                <strong>Description:</strong> {formData.description}
              </p>
              {formData.image ? (
                <div>
                  <strong>Image:</strong>
                  <img
                    src={formData.image}
                    alt="Fundraiser"
                    className="max-w-full h-48 object-cover rounded-md mt-2"
                  />
                </div>
              ) : (
                <p>
                  <strong>Image:</strong> No image selected
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
          {/* Enhanced Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
              <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-300/5 to-purple-300/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Info */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8 lg:p-12">
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                      Start Your Fundraiser
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Create a fundraiser to support causes that matter to you.
                      Choose a category, set your goal, and share your story
                      with the world.
                    </p>
                  </div>

                  {/* Category Icons Grid */}
                  <div className="grid grid-cols-3 gap-6 mt-8">
                    {categories.slice(0, 6).map((category) => {
                      const Icon = category.icon;
                      return (
                        <div
                          key={category.id}
                          className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                        >
                          <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-8 h-8 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {category.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        $1B+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Raised
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        50M+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Donors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        100%
                      </div>
                      <div className="text-xs text-muted-foreground">Safe</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Form */}
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8 lg:p-12">
                <div className="space-y-8">
                  {/* Progress Indicator */}
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground font-medium mb-2">
                        Step {currentStep} of 6 • {getStepTitle(currentStep)}
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${(currentStep / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="space-y-6">{renderStep()}</div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-border/50">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="group hover:bg-primary/10 hover:border-primary transition-all duration-300"
                      >
                        <span className="group-hover:text-primary transition-colors">
                          ← Previous
                        </span>
                      </Button>
                    )}
                    {currentStep < 6 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="ml-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105"
                      >
                        Next →
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="ml-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Creating..." : "Create Fundraiser"}
                      </Button>
                    )}
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
