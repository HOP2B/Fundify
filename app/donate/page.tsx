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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Select a Category
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = formData.category === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleInputChange("category", category.id)}
                    className={`group p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`p-2 rounded-full transition-colors ${
                          isSelected
                            ? "bg-primary-foreground/20"
                            : "bg-primary/10 group-hover:bg-primary/20"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            isSelected
                              ? "text-primary-foreground"
                              : "text-primary"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium text-center ${
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
                className={`w-full p-4 border-2 rounded-lg text-left ${
                  formData.forWhom === "myself"
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                <div className="font-medium">Myself</div>
                <div className="text-sm text-muted-foreground">
                  I'm raising money for my own cause
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("forWhom", "someone_else")}
                className={`w-full p-4 border-2 rounded-lg text-left ${
                  formData.forWhom === "someone_else"
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                <div className="font-medium">Someone else</div>
                <div className="text-sm text-muted-foreground">
                  I'm raising money for someone else's cause
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Goal Amount ($)
              </label>
              <input
                type="number"
                value={formData.goal || ""}
                onChange={(e) =>
                  handleInputChange("goal", parseFloat(e.target.value) || 0)
                }
                placeholder="5000"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
              {errors.goal && (
                <p className="text-destructive text-sm mt-1">{errors.goal}</p>
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
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-semibold mb-4">
                  Start Your Fundraiser
                </h3>
                <p className="text-muted-foreground mb-6">
                  Create a fundraiser to support causes that matter to you.
                  Choose a category, set your goal, and share your story.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-2">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm text-center">Medical</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-2">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm text-center">Education</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-2">
                      <PawPrint className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm text-center">Animals</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-2">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm text-center">Business</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-2">
                      <Flame className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm text-center">Emergency</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-2">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm text-center">Your Cause</span>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg shadow-sm p-8">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    {[1, 2, 3, 4, 5, 6].map((step) => (
                      <div
                        key={step}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step <= currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    Step {currentStep} of 6
                  </div>
                </div>

                {renderStep()}

                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                  )}
                  {currentStep < 6 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="ml-auto"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="ml-auto"
                    >
                      {isSubmitting ? "Creating..." : "Create Fundraiser"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
