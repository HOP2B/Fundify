import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface CampaignCardProps {
  title: string
  organizer: string
  raised: number
  goal: number
  donors: number
  location: string
  daysLeft?: number
  imageColor: string
  verified?: boolean
}

export function CampaignCard({
  title,
  organizer,
  raised,
  goal,
  donors,
  location,
  daysLeft,
  imageColor,
  verified = false,
}: CampaignCardProps) {
  const progress = Math.min((raised / goal) * 100, 100)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="group overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className={`aspect-[16/10] ${imageColor} relative`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <Heart className="w-16 h-16 text-foreground" />
        </div>
        {daysLeft && (
          <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded">
            {daysLeft} days left
          </div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
        </button>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{location}</p>
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-foreground">{formatCurrency(raised)} raised</span>
            <span className="text-sm text-muted-foreground">of {formatCurrency(goal)}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-xs font-medium text-secondary-foreground">
                  {organizer.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                by {organizer}
                {verified && (
                  <span className="ml-1 text-primary">✓</span>
                )}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{donors.toLocaleString()} donors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
