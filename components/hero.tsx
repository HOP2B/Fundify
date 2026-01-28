"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const categories = [
  {
    label: "Your cause",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200&h=200&fit=crop&crop=center",
    className: "top-[12%] left-[8%] w-36 h-36 lg:w-44 lg:h-44",
  },
  {
    label: "Medical",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=center",
    className: "top-[48%] left-[1%] w-32 h-32 lg:w-40 lg:h-40",
  },
  {
    label: "Emergency",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=center",
    className: "top-[62%] left-[14%] w-36 h-36 lg:w-44 lg:h-44",
  },
  {
    label: "Education",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop&crop=center",
    className: "top-[8%] right-[6%] w-36 h-36 lg:w-44 lg:h-44",
  },
  {
    label: "Animal",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=200&h=200&fit=crop&crop=center",
    className: "top-[42%] right-[0%] w-28 h-28 lg:w-36 lg:h-36",
  },
  {
    label: "Business",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center",
    className: "top-[58%] right-[12%] w-32 h-32 lg:w-40 lg:h-40",
  },
];

function CategoryCircle({
  label,
  image,
  className,
}: {
  label: string;
  image: string;
  className: string;
}) {
  return (
    <div className={`absolute hidden lg:block ${className}`}>
      <div className="relative w-full h-full group cursor-pointer">
        {/* Green ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-primary transition-transform group-hover:scale-105" />
        {/* Image container */}
        <div className="absolute inset-[3px] rounded-full overflow-hidden">
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover"
          />
        </div>
        {/* Label */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-card px-3 py-1.5 rounded-md shadow-sm border border-border">
          <span className="text-xs font-medium text-foreground whitespace-nowrap">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-[580px] lg:min-h-[680px] overflow-hidden bg-background">
      {/* Decorative blur elements */}
      <div className="absolute top-32 left-[30%] w-20 h-20 bg-muted/50 rounded-full blur-2xl" />
      <div className="absolute top-48 right-[35%] w-16 h-16 bg-primary/5 rounded-full blur-xl" />
      <div className="absolute bottom-32 left-[40%] w-24 h-24 bg-muted/30 rounded-full blur-2xl" />

      {/* Category circles - only visible on large screens */}
      {categories.map((category) => (
        <CategoryCircle key={category.label} {...category} />
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-8">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-sm font-bold text-foreground tracking-wide mb-6">
            Монголын хамгийн эхний donate өгөх platform
          </p>
          <h1 className="font-serif text-[3.25rem] sm:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-10 text-balance">
            Амжилттай хандивын аян эндээс эхэлнэ
          </h1>
          <Button
            size="lg"
            className="rounded-full px-10 py-6 text-base font-black h-auto"
            onClick={() => router.push("/donate")}
          >
            Start a Fundify
          </Button>
        </div>
      </div>

      {/* Mobile category pills */}
      <div className="lg:hidden px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <span
              key={cat.label}
              className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground"
            >
              {cat.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
