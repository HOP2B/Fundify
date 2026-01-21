import { CampaignCard } from "./campaign-card"
import { Button } from "@/components/ui/button"

const campaigns = [
  {
    title: "Help Maria's Family with Medical Expenses",
    organizer: "Sarah Johnson",
    raised: 45250,
    goal: 60000,
    donors: 1234,
    location: "Los Angeles, CA",
    daysLeft: 12,
    imageColor: "bg-gradient-to-br from-rose-100 to-pink-200",
    verified: true,
  },
  {
    title: "Support Local Food Bank This Winter",
    organizer: "Community Care",
    raised: 28400,
    goal: 35000,
    donors: 892,
    location: "Chicago, IL",
    daysLeft: 8,
    imageColor: "bg-gradient-to-br from-amber-100 to-orange-200",
    verified: true,
  },
  {
    title: "College Tuition Fund for First-Generation Student",
    organizer: "David Chen",
    raised: 15800,
    goal: 25000,
    donors: 456,
    location: "New York, NY",
    daysLeft: 30,
    imageColor: "bg-gradient-to-br from-blue-100 to-indigo-200",
    verified: false,
  },
  {
    title: "Rebuild After Hurricane - Emergency Relief",
    organizer: "Relief Fund",
    raised: 89500,
    goal: 100000,
    donors: 2341,
    location: "Miami, FL",
    imageColor: "bg-gradient-to-br from-teal-100 to-emerald-200",
    verified: true,
  },
  {
    title: "Animal Shelter Renovation Project",
    organizer: "Paws & Love",
    raised: 12300,
    goal: 20000,
    donors: 567,
    location: "Austin, TX",
    daysLeft: 21,
    imageColor: "bg-gradient-to-br from-purple-100 to-violet-200",
    verified: true,
  },
  {
    title: "Support Small Business Recovery",
    organizer: "Local Heroes",
    raised: 34600,
    goal: 50000,
    donors: 789,
    location: "Seattle, WA",
    daysLeft: 15,
    imageColor: "bg-gradient-to-br from-green-100 to-lime-200",
    verified: false,
  },
  {
    title: "Memorial Fund for Beloved Teacher",
    organizer: "School Community",
    raised: 67800,
    goal: 75000,
    donors: 1567,
    location: "Boston, MA",
    imageColor: "bg-gradient-to-br from-sky-100 to-cyan-200",
    verified: true,
  },
  {
    title: "Youth Sports Equipment Drive",
    organizer: "Coach Williams",
    raised: 8900,
    goal: 15000,
    donors: 234,
    location: "Denver, CO",
    daysLeft: 45,
    imageColor: "bg-gradient-to-br from-red-100 to-rose-200",
    verified: false,
  },
]

export function CampaignsGrid() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Discover fundraisers</h2>
            <p className="text-muted-foreground mt-1">Find causes that matter to you</p>
          </div>
          <Button variant="outline" className="hidden sm:flex bg-transparent">
            View all
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaigns.map((campaign, index) => (
            <CampaignCard key={index} {...campaign} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" className="w-full bg-transparent">
            View all fundraisers
          </Button>
        </div>
      </div>
    </section>
  )
}
