"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  GraduationCap,
  Stethoscope,
  Home,
  Flame,
  PawPrint,
  Car,
  Briefcase,
} from "lucide-react";

const categories = [
  { id: "all", label: "All", icon: Heart },
  { id: "medical", label: "Medical", icon: Stethoscope },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "emergency", label: "Emergency", icon: Flame },
  { id: "animals", label: "Animals", icon: PawPrint },
  { id: "housing", label: "Housing", icon: Home },
  { id: "travel", label: "Travel", icon: Car },
  { id: "business", label: "Business", icon: Briefcase },
];

interface CategoriesProps {
  onCategoryChange?: (category: string) => void;
}

export function Categories({ onCategoryChange }: CategoriesProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);

    // Navigate to categories page with selected category
    if (categoryId === "all") {
      router.push("/categories");
    } else {
      router.push(`/categories?category=${categoryId}`);
    }
  };

  return (
    <section className="py-8 border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
