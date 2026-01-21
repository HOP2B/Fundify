"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const campaigns = [
  {
    id: 1,
    title: "Life Saving Treatment for Michelle!",
    donations: "2.9K",
    raised: "£52,148",
    progress: 85,
    image: "/placeholder.svg?height=600&width=600",
    featured: true,
  },
  {
    id: 2,
    title: "Survivors of the 11-01-26 Wigan Road Collision",
    donations: "2.2K",
    raised: "£48,321",
    progress: 72,
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
  },
  {
    id: 3,
    title: "Dona per Alessia",
    donations: "1K",
    raised: "€20,402",
    progress: 65,
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
  },
  {
    id: 4,
    title: "Avoir accès à un traitement contre le cancer qui fonctionne",
    donations: "1.3K",
    raised: "$126,086",
    progress: 45,
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
  },
  {
    id: 5,
    title: "Honoring Hudson: A Bright Light Taken Too Soon",
    donations: "956",
    raised: "$75,325",
    progress: 78,
    image: "/placeholder.svg?height=300&width=400",
    featured: false,
  },
]

function CampaignCard({ 
  title, 
  donations, 
  raised, 
  progress, 
  image, 
  featured = false 
}: {
  title: string
  donations: string
  raised: string
  progress: number
  image: string
  featured?: boolean
}) {
  return (
    <div className={`group cursor-pointer ${featured ? "row-span-2" : ""}`}>
      <div className={`relative overflow-hidden rounded-lg ${featured ? "h-full min-h-[420px]" : "aspect-[4/3]"}`}>
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3">
          <span className="bg-foreground/80 text-background text-xs font-medium px-2.5 py-1 rounded">
            {donations} donations
          </span>
        </div>
      </div>
      <div className="mt-3">
        <h3 className={`font-semibold text-foreground leading-snug line-clamp-2 group-hover:underline ${featured ? "text-lg" : "text-sm"}`}>
          {title}
        </h3>
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-semibold text-foreground">{raised}</span> raised
          </p>
        </div>
      </div>
    </div>
  )
}

export function DiscoverFundraisers() {
  const [filter, setFilter] = useState("Happening worldwide")
  const [isOpen, setIsOpen] = useState(false)

  const filters = ["Happening worldwide", "Near me", "United States", "Europe", "Asia"]

  const featuredCampaign = campaigns.find(c => c.featured)
  const gridCampaigns = campaigns.filter(c => !c.featured)

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Discover fundraisers inspired by what you care about
        </h2>

        <div className="flex items-center justify-between mb-8">
          {/* Dropdown Filter */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full bg-background hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium">{filter}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${filter === f ? "bg-muted font-medium" : ""}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 bg-transparent"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Large Card */}
          {featuredCampaign && (
            <div className="lg:col-span-5">
              <CampaignCard {...featuredCampaign} />
            </div>
          )}

          {/* 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {gridCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
